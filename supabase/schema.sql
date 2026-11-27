-- =====================================================================
-- Enjaz — Supabase schema, row-level security and helper functions
-- =====================================================================
-- Run this whole file in the Supabase SQL Editor. It is idempotent:
-- safe on a fresh project and on an existing Enjaz database.
--
-- BEFORE running, in the Supabase dashboard:
--   Authentication → Sign In / Providers → enable "Allow anonymous sign-ins"
--   Authentication → Sign In / Providers → enable "Allow manual linking"
--     (lets a guest keep their projects when they later sign in with
--      Google / Discord / GitHub)
--
-- What this enforces (server-side, regardless of what the browser does):
--   * You can only read/write projects, tasks and members of projects
--     you are a member of.
--   * You join a project only through join_project(code) — knowing the
--     code is the invitation.
--   * Only the project owner can delete a project; tasks and members are
--     removed automatically (ON DELETE CASCADE).
--   * You can edit only your own member row; "manual" placeholder members
--     can be added/removed by any project member.
--
-- MIGRATION NOTE for existing data: memberships created by the old
-- localStorage-only guests (user_id = 'guest_...') no longer map to a real
-- account. Those users must re-join their projects with the project code.
-- Projects with no owner_id can be deleted by any member whose role is
-- 'Owner'.
-- =====================================================================

-- ---------- Tables (created only if missing) --------------------------

create table if not exists public.projects (
  id          text primary key,
  name        text not null,
  description text default '',
  icon        text default 'svg:rocket',
  status      text default 'in_progress',
  owner_id    uuid default auth.uid(),
  created_at  bigint
);

create table if not exists public.tasks (
  id           text primary key,
  project_id   text not null,
  title        text not null,
  notes        text default '',
  status       text default 'todo',
  priority     text default 'medium',
  assignee     text default '',
  category     text default '',
  due_date     date,
  done         boolean default false,
  completed_by text default '',
  completed_at bigint,
  created_by   text default '',
  created_at   bigint
);

create table if not exists public.project_members (
  id         text primary key,
  project_id text not null,
  user_id    text not null,
  name       text not null default '',
  email      text default '',
  avatar_url text default '',
  provider   text default '',
  role       text default 'Member',
  joined_at  bigint
);

-- ---------- Columns added in later versions ---------------------------

alter table public.projects add column if not exists status   text default 'in_progress';
alter table public.projects add column if not exists owner_id uuid default auth.uid();
alter table public.projects alter column owner_id set default auth.uid();
alter table public.tasks    add column if not exists notes    text default '';
alter table public.tasks    add column if not exists status   text default 'todo';
alter table public.tasks    add column if not exists due_date date;

-- ---------- Cascading deletes -----------------------------------------
-- NOT VALID: existing orphan rows (if any) are left alone instead of
-- failing the migration; the constraint and cascade apply to all new
-- writes and deletes.

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'tasks_project_id_fkey') then
    alter table public.tasks
      add constraint tasks_project_id_fkey foreign key (project_id)
      references public.projects(id) on delete cascade not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'project_members_project_id_fkey') then
    alter table public.project_members
      add constraint project_members_project_id_fkey foreign key (project_id)
      references public.projects(id) on delete cascade not valid;
  end if;
end $$;

create index if not exists tasks_project_id_idx           on public.tasks(project_id);
create index if not exists project_members_project_id_idx on public.project_members(project_id);
create index if not exists project_members_user_id_idx    on public.project_members(user_id);

-- ---------- Helper functions ------------------------------------------

-- security definer so policies on project_members can call it without
-- recursing into their own RLS checks.
create or replace function public.is_project_member(p_project_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.project_members
    where project_id = p_project_id
      and user_id = auth.uid()::text
  );
$$;

create or replace function public.is_project_owner(p_project_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.projects p
    where p.id = p_project_id
      and (
        p.owner_id = auth.uid()
        or (p.owner_id is null and exists (
              select 1 from public.project_members m
              where m.project_id = p.id
                and m.user_id = auth.uid()::text
                and m.role = 'Owner'))
      )
  );
$$;

-- Join a project by its code. Idempotent: if already a member, only
-- returns the project. Returns no row when the code does not exist.
create or replace function public.join_project(
  p_code       text,
  p_name       text default '',
  p_email      text default '',
  p_avatar_url text default '',
  p_provider   text default '',
  p_role       text default 'Member'
)
returns table (id text, name text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid  text := auth.uid()::text;
  v_proj public.projects%rowtype;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select * into v_proj from public.projects p where upper(p.id) = upper(trim(p_code)) limit 1;
  if not found then
    return;
  end if;

  insert into public.project_members (id, project_id, user_id, name, email, avatar_url, provider, role, joined_at)
  values (
    v_proj.id || '_' || v_uid,
    v_proj.id,
    v_uid,
    coalesce(nullif(trim(p_name), ''), 'Member'),
    coalesce(p_email, ''),
    coalesce(p_avatar_url, ''),
    coalesce(p_provider, ''),
    coalesce(nullif(trim(p_role), ''), 'Member'),
    (extract(epoch from now()) * 1000)::bigint
  )
  on conflict on constraint project_members_pkey do nothing;

  id := v_proj.id;
  name := v_proj.name;
  return next;
end;
$$;

revoke all on function public.join_project(text, text, text, text, text, text) from public, anon;
grant execute on function public.join_project(text, text, text, text, text, text) to authenticated;
grant execute on function public.is_project_member(text) to authenticated;
grant execute on function public.is_project_owner(text)  to authenticated;

-- ---------- Row-level security ----------------------------------------

alter table public.projects        enable row level security;
alter table public.tasks           enable row level security;
alter table public.project_members enable row level security;

-- Drop any earlier permissive policies with these names before recreating.
drop policy if exists projects_select on public.projects;
drop policy if exists projects_insert on public.projects;
drop policy if exists projects_update on public.projects;
drop policy if exists projects_delete on public.projects;
drop policy if exists tasks_all       on public.tasks;
drop policy if exists members_select  on public.project_members;
drop policy if exists members_insert  on public.project_members;
drop policy if exists members_update  on public.project_members;
drop policy if exists members_delete  on public.project_members;

-- projects
create policy projects_select on public.projects
  for select to authenticated
  using (public.is_project_member(id));

create policy projects_insert on public.projects
  for insert to authenticated
  with check (owner_id = auth.uid());

create policy projects_update on public.projects
  for update to authenticated
  using (public.is_project_member(id))
  with check (public.is_project_member(id));

create policy projects_delete on public.projects
  for delete to authenticated
  using (public.is_project_owner(id));

-- tasks
create policy tasks_all on public.tasks
  for all to authenticated
  using (public.is_project_member(project_id))
  with check (public.is_project_member(project_id));

-- project_members
create policy members_select on public.project_members
  for select to authenticated
  using (public.is_project_member(project_id));

-- Real users join via join_project(); direct inserts are only for
-- "manual" placeholder members added by an existing member.
create policy members_insert on public.project_members
  for insert to authenticated
  with check (
    provider = 'manual'
    and user_id like 'manual\_%'
    and public.is_project_member(project_id)
  );

create policy members_update on public.project_members
  for update to authenticated
  using (user_id = auth.uid()::text)
  with check (user_id = auth.uid()::text);

create policy members_delete on public.project_members
  for delete to authenticated
  using (
    user_id = auth.uid()::text                                   -- leave a project
    or (provider = 'manual' and public.is_project_member(project_id))
    or public.is_project_owner(project_id)                       -- owner removes anyone
  );

-- ---------- Realtime ---------------------------------------------------
-- Realtime respects the policies above, so clients only receive changes
-- for projects they belong to. Make sure the tables are published:
do $$
declare t text;
begin
  foreach t in array array['projects', 'tasks', 'project_members'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;
