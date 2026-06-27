
# Smart Portfolio Builder — Implementation Plan

This upgrades the current Portfolio Pro design from a static marketing site into a real product where users sign up, build a portfolio with AI help, publish it at `/<username>`, and track views.

I'll build it in 4 phases so each phase is testable on its own. I'll only ask one question up front (below), then execute the rest.

---

## Phase 1 — Backend foundation (Lovable Cloud)

Enable Lovable Cloud, then create:

**Database tables (all with RLS + grants):**
- `profiles` — `id (uuid → auth.users)`, `username (unique)`, `display_name`, `title`, `bio`, `avatar_url`, `theme ('dark'|'light')`, `published bool`, `created_at`
- `projects` — `id`, `user_id`, `title`, `description`, `image_url`, `link_url`, `tags text[]`, `order int`
- `skills` — `id`, `user_id`, `name`, `level int`, `category`
- `experience` — `id`, `user_id`, `role`, `company`, `start_date`, `end_date`, `description`
- `achievements` — `id`, `user_id`, `title`, `description`, `date`
- `social_links` — `id`, `user_id`, `platform`, `url`
- `portfolio_views` — `id`, `profile_id`, `viewed_at`, `referrer`, `country` (for analytics)
- `portfolio_likes` — `id`, `profile_id`, `visitor_hash` (anon likes)

**RLS:** owners full access on their own rows; `anon` SELECT only when `profiles.published = true` (and for child tables joined to a published profile). `portfolio_views` insert open to `anon` so visits count.

**Storage bucket:** `portfolio-assets` (public) for avatars + project images.

**Auth:** email/password with email verification + Google + GitHub OAuth (Google/GitHub configured via `configure_social_auth`).

**Trigger:** on `auth.users` insert → create `profiles` row with auto-generated username from email.

---

## Phase 2 — Auth + Dashboard wiring

- Replace the mock `/auth` page with a real Supabase email/password + Google + GitHub flow, email verification screen, and `/reset-password` route.
- Add `_authenticated/` layout (integration-managed) so `/dashboard/*` requires login.
- Rewrite dashboard stats (Projects/Views/Likes) to read live counts from Cloud — all 0 for new users.
- Add a Sign Out that properly tears down session + cache.

---

## Phase 3 — Portfolio builder + AI

- New route `/dashboard/builder` — guided multi-step form (Profile → Skills → Projects → Experience → Achievements → Socials).
- Each step saves to Cloud immediately (autosave).
- **AI Polish** button on each text field + a global "Auto-organize my portfolio" action — calls a `createServerFn` that hits Lovable AI Gateway (`google/gemini-3-flash-preview`) to rewrite bio/project descriptions into clean professional copy.
- Live preview pane on the right that renders the public portfolio in real time.
- Theme toggle (dark/light) stored on `profiles.theme`.

---

## Phase 4 — Public portfolios + sharing + analytics + PDF

- New public route `/$username` (SSR-friendly, head() with OG tags from profile) that renders the user's portfolio — premium dark/light layout, animated sections, projects grid, skills bars, timeline, contact.
- Records a `portfolio_views` row on each visit (server fn).
- Share button: copy link + native share sheet + auto-generated OG image URL.
- Like button for anonymous visitors (one per `visitor_hash`).
- **Download PDF**: client-side via `html2canvas` + `jspdf` against the rendered portfolio.
- `/dashboard/analytics` shows real view/like counts + 30-day chart from `portfolio_views`.

---

## Technical notes
- Stack stays TanStack Start + Tailwind v4 + shadcn — no framework changes.
- AI calls go through Lovable AI Gateway in a `createServerFn` (server-only key).
- All existing premium UI (sound system, MouseGlow, glass panels, brand gradient, Zyad Abdou credit) is preserved.
- New deps: `html2canvas`, `jspdf` (PDF), `date-fns` (already likely present).

---

## One question before I start

**Email verification** — do you want me to keep it ON (users must click a link in their inbox before they can sign in)? It's more secure but adds friction. The alternative is to turn it OFF so signup → straight into the dashboard.

If you say "yes, keep verification on" or just "go", I'll proceed with verification ON. If you say "off", I'll disable it. Then I'll execute Phases 1–4 end-to-end.
