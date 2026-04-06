# Refactor Backlog

## Next Priority Files

- `components/blocks/registry.tsx`
- `components/home/HappyStories.tsx`
- `components/home/BreedExplorer.tsx`
- `components/home/FeaturedDogs.tsx`
- `components/happy/HappyCustomersBook.tsx`
- `app/(website)/breeds/[slug]/DogDetailClient.tsx`
- `components/home/AboutPreview.tsx`
- `components/home/AdoptionProcess.tsx`
- `components/home/TrustBadges.tsx`

## Suggested Order

1. Split homepage section components by:
- shared home primitives first
- content/model helpers second
- section-specific layout last

2. Split `components/blocks/registry.tsx` by:
- registry lookups
- lazy block wrappers
- shared block typing

3. Split breed detail and remaining public feature UIs by:
- data/state hooks
- presentational sections
- action handlers

## Recently Completed

- `components/home/FAQSection.tsx`
- `components/home/ImageHotspot.tsx`
- `components/home/HeroBanner.tsx`

## Guardrails

- Preserve current live preview contracts and `postMessage` event names.
- Keep existing DB table names and route URLs unchanged during structure-only refactors.
- Do not fold security fixes into structure-only passes unless explicitly requested.
- Preserve the desktop-to-mobile sync contract: desktop edits may hydrate mobile defaults, but mobile overrides must stay isolated from desktop values.
- Run focused lint on each slice before moving to the next oversized file.
