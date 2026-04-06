
(Get-Content "components\home\BreedExplorer.tsx") -replace "import \{ dogs \} from `@/data/dogs`\;", "import type { Dog } from `"@/types`";" | Set-Content "components\home\BreedExplorer.tsx"

