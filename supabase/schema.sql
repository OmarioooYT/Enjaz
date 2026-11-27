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

-- =====================================================================
-- v2: subtasks, comments, activity log
-- =====================================================================

alter table public.tasks add column if not exists subtasks jsonb default '[]'::jsonb;

create table if not exists public.task_comments (
  id          text primary key,
  task_id     text not null references public.tasks(id) on delete cascade,
  project_id  text not null references public.projects(id) on delete cascade,
  user_id     text not null default auth.uid()::text,
  author_name text not null default '',
  body        text not null check (char_length(body) between 1 and 4000),
  mentions    text[] default '{}',
  created_at  bigint default (extract(epoch from now()) * 1000)::bigint
);
create index if not exists task_comments_task_id_idx    on public.task_comments(task_id);
create index if not exists task_comments_project_id_idx on public.task_comments(project_id);

create table if not exists public.activity_log (
  id          bigint generated always as identity primary key,
  project_id  text not null references public.projects(id) on delete cascade,
  task_id     text,
  task_title  text default '',
  user_id     text default auth.uid()::text,
  actor_name  text default '',
  action      text not null,
  details     jsonb default '{}'::jsonb,
  created_at  bigint default (extract(epoch from now()) * 1000)::bigint
);
create index if not exists activity_log_project_created_idx on public.activity_log(project_id, created_at desc);

alter table public.task_comments enable row level security;
alter table public.activity_log  enable row level security;

drop policy if exists comments_select on public.task_comments;
drop policy if exists comments_insert on public.task_comments;
drop policy if exists comments_update on public.task_comments;
drop policy if exists comments_delete on public.task_comments;
drop policy if exists activity_select on public.activity_log;

create policy comments_select on public.task_comments
  for select to authenticated
  using (public.is_project_member(project_id));

create policy comments_insert on public.task_comments
  for insert to authenticated
  with check (
    user_id = auth.uid()::text
    and public.is_project_member(project_id)
    and exists (select 1 from public.tasks t where t.id = task_id and t.project_id = task_comments.project_id)
  );

create policy comments_update on public.task_comments
  for update to authenticated
  using (user_id = auth.uid()::text)
  with check (user_id = auth.uid()::text);

create policy comments_delete on public.task_comments
  for delete to authenticated
  using (user_id = auth.uid()::text or public.is_project_owner(project_id));

-- Activity is read-only for clients; rows are written by the triggers below.
create policy activity_select on public.activity_log
  for select to authenticated
  using (public.is_project_member(project_id));

-- Writes one activity row, using the actor's display name in that project.
create or replace function public.log_activity(
  p_project_id text, p_task_id text, p_task_title text, p_action text, p_details jsonb
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
begin
  -- Skip when the project itself is being deleted (cascade).
  if not exists (select 1 from public.projects where id = p_project_id) then
    return;
  end if;
  select m.name into v_name from public.project_members m
   where m.project_id = p_project_id and m.user_id = auth.uid()::text
   limit 1;
  insert into public.activity_log (project_id, task_id, task_title, user_id, actor_name, action, details)
  values (p_project_id, p_task_id, coalesce(p_task_title, ''), auth.uid()::text, coalesce(v_name, ''), p_action, coalesce(p_details, '{}'::jsonb));
end;
$$;

revoke all on function public.log_activity(text, text, text, text, jsonb) from public, anon, authenticated;

create or replace function public.tasks_activity_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    perform public.log_activity(new.project_id, new.id, new.title, 'task_created',
      jsonb_build_object('assignee', coalesce(new.assignee, ''), 'status', coalesce(new.status, 'todo')));
    if coalesce(new.assignee, '') <> '' then
      perform public.log_activity(new.project_id, new.id, new.title, 'task_assigned',
        jsonb_build_object('assignee', new.assignee));
    end if;
    return new;
  elsif tg_op = 'UPDATE' then
    if coalesce(new.status, '') is distinct from coalesce(old.status, '') then
      perform public.log_activity(new.project_id, new.id, new.title, 'task_status',
        jsonb_build_object('from', old.status, 'to', new.status));
    end if;
    if coalesce(new.assignee, '') <> '' and coalesce(new.assignee, '') is distinct from coalesce(old.assignee, '') then
      perform public.log_activity(new.project_id, new.id, new.title, 'task_assigned',
        jsonb_build_object('assignee', new.assignee));
    end if;
    if new.due_date is distinct from old.due_date then
      perform public.log_activity(new.project_id, new.id, new.title, 'task_due_changed',
        jsonb_build_object('from', old.due_date, 'to', new.due_date));
    end if;
    return new;
  else
    perform public.log_activity(old.project_id, old.id, old.title, 'task_deleted', '{}'::jsonb);
    return old;
  end if;
end;
$$;

drop trigger if exists tasks_activity on public.tasks;
create trigger tasks_activity
  after insert or update or delete on public.tasks
  for each row execute function public.tasks_activity_trigger();

create or replace function public.comments_activity_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_title text;
begin
  select title into v_title from public.tasks where id = new.task_id;
  perform public.log_activity(new.project_id, new.task_id, v_title, 'comment_added',
    jsonb_build_object('excerpt', left(new.body, 140), 'mentions', to_jsonb(coalesce(new.mentions, '{}'))));
  return new;
end;
$$;

drop trigger if exists comments_activity on public.task_comments;
create trigger comments_activity
  after insert on public.task_comments
  for each row execute function public.comments_activity_trigger();

create or replace function public.members_activity_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.provider is distinct from 'manual' then
    insert into public.activity_log (project_id, user_id, actor_name, action, details)
    values (new.project_id, new.user_id, new.name, 'member_joined', jsonb_build_object('role', new.role));
  end if;
  return new;
end;
$$;

drop trigger if exists members_activity on public.project_members;
create trigger members_activity
  after insert on public.project_members
  for each row execute function public.members_activity_trigger();

-- ---------- Realtime ---------------------------------------------------
-- Realtime respects the policies above, so clients only receive changes
-- for projects they belong to. Make sure the tables are published:
do $$
declare t text;
begin
  foreach t in array array['projects', 'tasks', 'project_members', 'task_comments', 'activity_log'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;

-- ---------- API access ------------------------------------------------
-- Newer Supabase projects do not expose tables created in SQL to the API
-- automatically, so grant access explicitly. Row-level security above still
-- decides which rows each user can touch. Every visitor (guests included)
-- uses the "authenticated" role.
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.projects, public.tasks,
  public.project_members, public.task_comments to authenticated;
grant select on public.activity_log to authenticated;

-- Make the API pick up new tables, columns and functions immediately.
notify pgrst, 'reload schema';
