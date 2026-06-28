## Scope reality check

You picked all four priority groups plus the security uplift. That's roughly 4-6 turns of focused work to do well. Doing it all in one turn would mean shallow, half-broken features across the board. I'll deliver one group per turn, fully working, then move to the next.

## Phased plan

### Turn 1 (this turn) — i18n + RTL + language switcher
- Install `i18next`, `react-i18next`, `i18next-browser-languagedetector`.
- Translation JSON files for: English, Arabic, Spanish, French, German, Portuguese. Arabic strings written manually in Modern Standard Arabic (no machine translation).
- Coverage: nav, footer, home, auth, dashboard shell, dashboard pages (overview/projects/analytics/settings), builder, demo, about, contact, templates.
- Language switcher in `SiteNav` and dashboard sidebar: flag emoji + language name dropdown.
- Persist choice in `localStorage`; apply `<html dir="rtl" lang="ar">` when Arabic; add `:dir(rtl)` CSS adjustments for the existing layout (margins, icons, chevrons, glow position).

### Turn 2 — AI Builder overhaul
- Modal entry: "AI from scratch" vs "Upload CV + photo".
- AI-from-scratch: short questionnaire → generates 3 variations.
- CV upload: PDF/DOCX parsing (server function with `pdf-parse`/`mammoth`) → AI fills the builder.
- True bio variation engine (random style/tone seeds; never repeats).
- 8 in-app example portfolios across different professions (logo placeholders only — no faces).

### Turn 3 — Ratings & reviews + Trending
- New tables: `portfolio_ratings` (stars + comment + helpful counts), `portfolio_rating_replies`, profanity filter.
- Public rating widget on `/$username`; reviews list with helpful votes; owner reply.
- "Top rated" badge ≥ 4.5; dashboard reviews tab.
- Homepage "Trending portfolios" rail (top rated this week).

### Turn 4 — Polish pass + Country onboarding + Security uplift
- Country selector modal post-signup (search + flag emoji, home/current toggle), saved to profile.
- Skills 0-100 with progress bar, color coding, "Expert" badge.
- Logo-only placeholders across templates (SVG monograms/geometrics).
- `security_logs` table (login/logout/failed attempt events), active sessions list + revoke in Settings, hCaptcha after 3 failed logins.
- Confetti on first publish, share button (copy/WhatsApp/LinkedIn/Twitter), completion bar in dashboard, count-up skill bars, Cmd+S / Cmd+P shortcuts in builder, notification bell.
- Bug sweep: broken routes, validation, mobile layout, hydration warnings, templates page previews.

## Technical notes

- GitHub OAuth dropped (not supported by Lovable Cloud managed auth).
- "Full custom JWT 15-min rotation + httpOnly refresh cookies" cannot ship on Supabase managed auth without replacing the auth layer entirely — your "Standard + CAPTCHA + logs + sessions" pick is what I'll deliver in Turn 4.
- Existing premium design language, sound system, mouse glow, and current Supabase schema are preserved.
- Each turn ends with a clean typecheck and a quick smoke check of the affected pages.

Reply "go" to start Turn 1 (i18n + RTL), or tell me which turn to tackle first if you want a different order.