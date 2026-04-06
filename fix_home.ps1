
$content = Get-Content "app\page.tsx" -Raw;

$importStr = @"
import AboutPreview from `@/components/home/AboutPreview`;
"@
$newImportStr = @"
import AboutPreview from `@/components/home/AboutPreview`;
import { getDogs } from `@/lib/supabase/dogs-mapper`;
"@

$content = $content.Replace($importStr, $newImportStr);

$funcStr = @"
export default function HomePage() {
  return (
"@
$newFuncStr = @"
export default async function HomePage() {
  const dogs = await getDogs();

  return (
"@

$content = $content.Replace($funcStr, $newFuncStr);

$content = $content.Replace("<FeaturedDogs />", "<FeaturedDogs dogs={dogs} />");
$content = $content.Replace("<BreedExplorer />", "<BreedExplorer dogs={dogs} />");

Set-Content "app\page.tsx" $content -Encoding UTF8;

