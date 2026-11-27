# Enjaz (إنجاز)

Bilingual (Arabic / English) real-time team project manager: Kanban, list and
team views, live sync through Supabase, and an AI assistant powered by Puter.js.

- `index.html` — landing / portfolio page
- `enjaz.html` — the app
- `js/` — app modules, loaded as plain scripts in the order listed in `enjaz.html`
- `supabase/schema.sql` — database tables, row-level security and functions
- `js/features.js` — comments, checklist, activity feed, calendar, daily
  summary, notifications, undo, offline mode
- `sw.js`, `manifest.webmanifest` — installable app (PWA) and offline cache

## Features

- **Views:** Kanban, table, calendar (drag tasks between days), activity feed, team
- **Task checklist** with progress on cards; the AI can break a task into steps
- **Comments** on tasks with `@mentions` and autocomplete
- **Activity feed:** every task change, comment and new member, live
- **Notifications:** in-app, plus browser notifications (bell icon) when the
  tab is in the background, for tasks assigned to you, mentions and comments
  on your tasks
- **Daily summary** card with today's, overdue and recently finished tasks,
  plus an optional AI-written brief
- **Instant updates:** changes show at once and roll back if saving fails;
  deleted tasks can be restored from the toast for 5 seconds
- **Installable and offline:** install from the sidebar button; the last
  loaded data stays browsable without internet (read-only)

No build step: serve the folder with any static server (e.g. GitHub Pages, or
`npx serve .` locally). OAuth sign-in does not work from `file://`.

## Supabase setup

1. In **Authentication → Sign In / Providers**, enable:
   - **Allow anonymous sign-ins** (guests get an anonymous session, which is
     how the database knows who they are)
   - **Allow manual linking** (a guest who later signs in with Google /
     Discord / GitHub keeps their projects)
   - Any OAuth providers you want (Google, Discord, GitHub)
2. Open the **SQL Editor** and run all of `supabase/schema.sql`. It is safe to
   run again after updates — run it again whenever this file changes (it
   adds the comments and activity tables).
3. Put your project URL and publishable key in `js/state.js`.

### Security model

All access rules are enforced in the database, not in the browser:

- Users can only read and change projects they are members of, plus those
  projects' tasks and members.
- Joining a project happens only through the `join_project` function. The
  project code (e.g. `PRJ-7KQ2-MX9D-4HTA`) is the invitation, so share it
  only with your team.
- Only the project owner can delete a project. Its tasks and members are
  removed automatically.
- Members can edit only their own member entry. The owner can remove anyone.

**Upgrading an existing database:** guests from before this change were
identified only by the browser, so their old memberships no longer match an
account. They need to re-join their projects with the project code.
