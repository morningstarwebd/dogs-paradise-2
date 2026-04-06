
(Get-Content "components\home\BreedExplorer.tsx") -replace "import \{ dogs \} from `@/data/dogs`\;", "import type { Dog } from `"@/types`";" | Set-Content "components\home\BreedExplorer.tsx";
$content = Get-Content "components\home\BreedExplorer.tsx" -Raw;

$old = @"
const allSortedDogs = [...dogs].sort((a, b) => {
  const aIdx = priorityBreedNames.indexOf(a.breedName);
  const bIdx = priorityBreedNames.indexOf(b.breedName);
  if (aIdx > -1 && bIdx > -1) return aIdx - bIdx;
  if (aIdx > -1) return -1;
  if (bIdx > -1) return 1;
  return 0;
});
"@

$new = @"
"@

$content = $content.Replace($old, $new);

$old2 = @"
export default function BreedExplorer() {
  const scrollRef = useRef<HTMLDivElement>(null);
"@

$new2 = @"
export default function BreedExplorer({ dogs }: { dogs: Dog[] }) {
  const allSortedDogs = [...dogs].sort((a, b) => {
    const aIdx = priorityBreedNames.indexOf(a.breedName);
    const bIdx = priorityBreedNames.indexOf(b.breedName);
    if (aIdx > -1 && bIdx > -1) return aIdx - bIdx;
    if (aIdx > -1) return -1;
    if (bIdx > -1) return 1;
    return 0;
  });

  const scrollRef = useRef<HTMLDivElement>(null);
"@

$content = $content.Replace($old2, $new2);

$old3 = @"
function BreedCard({ dog, index }: { dog: typeof dogs[number]; index: number }) {
"@

$new3 = @"
function BreedCard({ dog, index }: { dog: Dog; index: number }) {
"@

$content = $content.Replace($old3, $new3);

Set-Content "components\home\BreedExplorer.tsx" $content -Encoding UTF8;

