-- Copyright (C) 2026 Omariooo
-- SPDX-License-Identifier: GPL-3.0-or-later
--
-- This file is part of Enjaz, free software released under the GNU General
-- Public License v3.0 or later. See the LICENSE file for details.

-- Enjaz — setup check. Read-only: run it in the Supabase SQL Editor and
-- every row should say OK. Anything else tells you what is missing.

select '1. table task_comments' as "check",
       case when to_regclass('public.task_comments') is not null then 'OK' else 'MISSING — run schema.sql' end as result
union all
select '2. table activity_log',
       case when to_regclass('public.activity_log') is not null then 'OK' else 'MISSING — run schema.sql' end
union all
select '3. column tasks.subtasks',
       case when exists (select 1 from information_schema.columns
                         where table_schema = 'public' and table_name = 'tasks' and column_name = 'subtasks')
            then 'OK' else 'MISSING — run schema.sql' end
union all
select '4. function join_project',
       case when to_regprocedure('public.join_project(text,text,text,text,text,text)') is not null
            then 'OK' else 'MISSING — run schema.sql' end
union all
select '5. comment policies',
       case when (select count(*) from pg_policies where schemaname = 'public' and tablename = 'task_comments') >= 4
            then 'OK' else 'MISSING — run schema.sql' end
union all
select '6. RLS enabled on task_comments',
       case when coalesce((select relrowsecurity from pg_class where oid = to_regclass('public.task_comments')), false)
            then 'OK' else 'OFF — run schema.sql' end
union all
select '7. activity triggers',
       case when (select count(*) from pg_trigger
                  where tgname in ('tasks_activity', 'comments_activity', 'members_activity') and not tgisinternal) = 3
            then 'OK' else 'MISSING — run schema.sql' end
union all
select '8. API can use task_comments',
       case when to_regclass('public.task_comments') is null then 'MISSING — run schema.sql'
            when has_table_privilege('authenticated', 'public.task_comments', 'INSERT')
             and has_table_privilege('authenticated', 'public.task_comments', 'SELECT')
            then 'OK' else 'NO GRANT — run: grant select, insert, update, delete on public.task_comments to authenticated;' end
union all
select '9. realtime publishes comments',
       case when exists (select 1 from pg_publication_tables
                         where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'task_comments')
              or exists (select 1 from pg_publication where pubname = 'supabase_realtime' and puballtables)
            then 'OK' else 'MISSING — run schema.sql' end
union all
select '10. members without a real account (old guests)',
       (select count(*) from public.project_members m
         where coalesce(m.provider, '') <> 'manual'
           and not exists (select 1 from auth.users u where u.id::text = m.user_id))::text
       || ' (these people must re-join with the project code)';
