# Dogs Paradise 2 Project Memory

## Snapshot

- Workspace root: `D:\Dogs Paradise 2\dogs-paradice`
- Stack: Next.js 16.2.2 App Router, React 19.2.4, TypeScript, Tailwind v4, Supabase, Sentry, Groq, Resend, Zustand
- Domain: Dog sales / breed showcase site with CMS-style admin and dynamic homepage sections
- Supabase project ref: `eysndjacdnenldnihalh`
- Public site URL env: `https://dogsparadisebangalore.com`

## Architecture

- Public website routes live under `app/(website)`.
- Admin routes live under `app/admin`, with a `(protected)` group.
- API routes live under `app/api`.
- Server actions primarily live under `app/actions`.
- Shared business logic is in `lib`.
- Client-side editor/admin state uses Zustand stores in `store`.
- Supabase SQL migrations live in `supabase/migrations`.

## Core Data Model

- `projects` table is the main dogs inventory table despite the legacy name.
- `blog_posts` powers the blog and scheduled publishing flow.
- `website_sections` powers the homepage/page-builder-style CMS.
- `pages` stores custom CMS pages with sanitized HTML content.
- `contact_messages` stores leads from the contact form, plus AI-generated lead score/summary.
- `admin_users` acts as the DB admin whitelist.
- `ai_settings` stores AI chatbot/admin AI knowledge settings.

## Important Domain Mapping

- Legacy naming remains from an older "Morning Star Web" codebase.
- Many places still call dogs "projects".
- `getDogs()` in `lib/supabase/dogs-mapper.ts` converts `projects` rows into the `Dog` UI model.
- New dog-commerce fields were added in migration `014_add_images_array_to_projects.sql`.

## Public Site Behavior

- Homepage in `app/(website)/page.tsx` renders dynamic `website_sections` from Supabase.
- In `preview=true` mode it uses `LivePreviewWrapper`.
- Block rendering is driven by `components/blocks/registry` and section `block_type`.
- Header/footer are treated as fixed section types.
- Breed detail pages are driven by mapped project/dog records.

## Admin and Editing

- Admin dashboard is in `app/admin/(protected)/page.tsx`.
- Dogs management currently lives in `app/admin/(protected)/dogs/page.tsx`.
- Theme/page editing exists under `app/admin/theme-editor/page.tsx`.
- Sections editing is backed by `app/actions/sections.ts`.
- Pages editing is backed by `app/actions/pages.ts`.
- Dogs/projects CRUD is backed by `app/actions/projects.ts`.
- Responsive editor contract: desktop changes sync down to mobile until a mobile-specific override exists; mobile-only edits do not sync back to desktop.
- The responsive sync helpers now live in the split `lib/responsive-content-*` modules and should stay the only source of truth for that rule.

## Security and Risk Notes

- Admin auth is intentionally disabled for now.
- Root `proxy.ts` is a no-op pass-through and does not gate requests.
- Root legacy actions `actions/sections.ts` and `actions/templates.ts` revalidate the live website without enforcing admin access.
- `app/actions/projects.ts` currently allows direct save/delete without auth.
- `app/auth/callback/route.ts` is now just a safe redirect helper and does not exchange auth sessions.
- Live Supabase RLS currently exposes permissive public write policies on `projects`, `website_sections`, and `page_templates`.
- Live `admin_users` table is currently irrelevant to runtime access because admin allowlisting is disabled.

## Live DB Verification

- Verified against Supabase project `eysndjacdnenldnihalh`.
- Current public tables in the live DB are only:
- `admin_users`
- `page_templates`
- `projects`
- `website_sections`
- `page_templates` exists in the live DB but has no matching local migration, so schema drift already exists.
- `website_sections` has 12 live rows including `header`, `footer`, and `global_settings`.
- `page_templates` has 7 live rows for `about`, `blog`, `blog-post`, `breeds`, `contact`, `home`, and `product`.

## Verified Mismatches

- Admin blog code expects `blog_posts`, but that table is not present in the verified live DB.
- Admin messages/dashboard expect `contact_messages`, but that table is not present in the verified live DB.
- Media metadata cleanup expects `media_files`, but that table is not present in the verified live DB.
- The public contact page currently opens WhatsApp directly and does not submit to `/api/contact`.
- `GlobalSettingsCard` and `GlobalSettingsProvider` exist, but no live usage was found in the app tree.
- Theme editor includes a `blog-post` template editor, but only the `product` template is consumed by the live website code.

## AI and Automation

- Public chat route: `app/api/ai/chat/route.ts`
- Contact form route: `app/api/contact/route.ts`
- Groq powers chat and lead-scoring.
- Resend powers outbound contact email notifications.
- Scheduled blog publishing route: `app/api/cron/publish-scheduled/route.ts`
- Chat and contact use durable Supabase RPC-based rate limiting.

## Supabase Notes

- Images are allowed from `eysndjacdnenldnihalh.supabase.co` in `next.config.ts`.
- Public site uses `NEXT_PUBLIC_SUPABASE_URL` and anon key.
- Sensitive server flows require `SUPABASE_SERVICE_ROLE_KEY`, which is not present in `.env.local`.
- Current local `.env.local` only contains site URL, public Supabase creds, and `SUPER_ADMIN_EMAILS`.
- Because `.env.local` has no service role key, first-admin bootstrap cannot be fully exercised locally.
- `uploadToSupabase()` writes directly to Supabase Storage, not to the repo filesystem.
- Files admin now tolerates the live absence of `media_files` metadata and `All Files` aggregates one level of bucket folders.

## Current Working Tree Notes

- Repo is already dirty with in-progress local changes.
- Notable modified or new files include:
- `app/actions/projects.ts`
- `app/admin/(protected)/dogs/page.tsx`
- `app/admin/theme-editor/page.tsx`
- `lib/supabase/dogs-mapper.ts`
- `store/admin-data-store.ts`
- `actions/templates.ts`
- `components/admin/MultiImageUpload.tsx`
- `components/admin/TemplatePreviewReloader.tsx`
- `supabase/migrations/014_add_images_array_to_projects.sql`
- `types/page-template.ts`
- Future edits should avoid overwriting unrelated user changes.

## Maintainability Refactor Status

- Navbar was split into smaller files under `components/layout/navbar`.
- Footer was split into smaller files under `components/layout/footer`.
- Dogs admin page was split into focused editor/list modules under `components/admin/dogs`.
- Theme editor was split into focused hooks and inspector/sidebar/preview modules.
- Blog admin was split into hooks, dialogs, tables, and drawer components under `app/admin/(protected)/blog`.
- AI search, multi-image upload, link picker, live block editor, and cached-data were split into smaller modules.
- Messages admin page was reduced to an orchestration shell with split table/drawer/modal components.
- Chat widget was split into content, button, panel, and message-rendering modules under `components/layout/chat-widget`.
- FAQ section was split into content/types/item modules in `components/home`.
- Image hotspot was split into content/types/style/map/details modules in `components/home`.
- Hero banner was reworked into a smaller section surface using `hero-banner-model`, `hero-banner-derived`, `hero-banner-layout`, and reusable `components/home/shared` primitives instead of a hero-only helper family.
- Targeted lint passes clean for the current refactor slices, including navbar, footer, dogs admin, theme editor, blog admin, messages admin, responsive-content, and the refactored admin helper modules.
- Targeted lint now also passes for the refactored homepage `HeroBanner`, `FAQSection`, and `ImageHotspot` slices.
- Current maintainability rules are documented in `docs/maintainability-guidelines.md`.
- Remaining oversized refactor targets are tracked in `docs/refactor-backlog.md`.

## Production Readiness Status

- `npm run build` now passes successfully after the latest production hardening pass.
- Admin auth is currently disabled by product decision, so `/admin` is open in the local app and `/admin/login` now redirects straight back to `/admin`.
- Admin chrome no longer shows sign-out actions while auth is disabled.
- Admin routes are now marked `noindex`, and `next-sitemap` excludes `/admin*` and `/auth*` paths from generated sitemap and robots output.
- Theme-editor section saves now invalidate `website-content`, so uploaded section images can propagate to the public site instead of staying stuck behind stale cache.
- Live Supabase security policies are still permissive in the production project and should be tightened only together with a code deploy, because the live project currently has zero `auth.users` and zero `admin_users`.

## Working Conventions For Future Tasks

- Treat `projects` as dogs inventory unless explicitly refactoring schema names.
- Check both legacy branding and dog-branding before making content changes.
- Watch for Next 16 specifics and existing `@ts-expect-error` cache invalidation workarounds.
- Preserve live-preview and responsive-content flows when editing sections.
- Prefer scanning Supabase migrations before schema-dependent work.
- Re-check admin auth assumptions before changing protected routes or server actions.
