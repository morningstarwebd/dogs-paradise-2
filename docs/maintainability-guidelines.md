# Maintainability Guidelines

## Goal

Keep feature behavior stable while making the codebase easier to scan, onboard into, and extend.

## File Size Rule

- Target each application file to stay at or below 200 lines.
- If a file grows past 180 lines, split it before adding more feature logic.
- Prefer splitting by responsibility, not by arbitrary line chunks.

## Split Strategy

- Route files should orchestrate data flow and compose smaller UI modules.
- Shared data shaping should live in `helpers`, `content`, or `lib` files.
- Repeated preview/editor behavior should move into hooks before it is copied.
- Homepage sections should prefer shared primitives under `components/home/shared` over section-specific helper families.
- Do not create 4-6 micro-files that only exist for a single section unless the logic is truly unique and cannot be reused.
- Admin editor screens should separate:
- page shell
- data fetching and save handlers
- individual form sections
- list/grid cards
- modal/dialog components

## Naming Rules

- Use `Dog*` names in the UI layer when the code is about dogs, even if the DB table is still `projects`.
- Keep Supabase table names isolated in actions, mappers, or helpers.
- Prefer `ViewModel`, `Content`, `Helpers`, and `Section` suffixes for split files.

## Data Boundaries

- Do not place raw Supabase queries inside large client UI sections.
- Route/page files may fetch or call actions, but leaf components should receive typed props.
- Use helper functions to translate between legacy DB shapes and UI shapes.

## Admin Editor Rules

- Keep one section or panel per file when forms become long.
- Shared collapsible cards, preview hooks, and toggle lists should be reusable.
- Avoid mixing preview messaging logic with presentational JSX when the component starts growing.

## Responsive Setting Rules

- Desktop is the source of truth until a mobile-specific override is introduced.
- Desktop edits should keep syncing down to mobile values until the mobile field or block is edited separately.
- Mobile-only edits must never flow back into desktop values.
- Keep this contract inside `lib/responsive-content.ts` and its split helper files so admin panels do not re-implement the sync rules ad hoc.

## Verification Rules

- After each split, run focused lint on the changed files before moving on.
- When a file is split, re-count lines to confirm it stays under the cap.
- Keep no-behavior-change refactors isolated from product logic changes.

## Current Refactor Baseline

- `components/layout/Navbar.tsx` is now a thin shell with split navbar modules.
- `components/layout/Footer.tsx` is now a thin shell with split footer modules.
- `app/admin/(protected)/dogs/page.tsx` is now orchestration-only, with editor/list UI split into `components/admin/dogs`.
- `app/admin/theme-editor/page.tsx` is now split into hooks and sidebar/inspector/preview modules.
- `app/admin/(protected)/blog/page.tsx` is now orchestration-only with split blog admin modules.
- `components/admin/AiSearchBar.tsx`, `MultiImageUpload.tsx`, `LinkPicker.tsx`, `LiveBlockEditor.tsx`, and `lib/cached-data.ts` are now thin shells over smaller modules.
- Homepage shared primitives now live under `components/home/shared` for reusable action buttons, stat cards, and slideshow media.
