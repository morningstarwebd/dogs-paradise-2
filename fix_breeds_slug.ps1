
$content = Get-Content "app\breeds\[slug]\page.tsx" -Raw;

$importStr = "import { dogs } from `@/data/dogs`;";
$newImportStr = @"
import { dogs as fallbackDogs } from `@/data/dogs`;
import { getDogs, getDogBySlug } from `@/lib/supabase/dogs-mapper`;
"@

$content = $content.Replace($importStr, $newImportStr);

$staticStr = @"
export async function generateStaticParams() {
  return dogs.map((dog) => ({
    slug: dog.slug,
  }));
}
"@
$newStaticStr = @"
export async function generateStaticParams() {
  return fallbackDogs.map((dog) => ({
    slug: dog.slug,
  }));
}
"@

$content = $content.Replace($staticStr, $newStaticStr);

$funcStr = @"
export default async function BreedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dog = dogs.find((d) => d.slug === slug);
"@
$newFuncStr = @"
export default async function BreedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dog = await getDogBySlug(slug);
"@

$content = $content.Replace($funcStr, $newFuncStr);

Set-Content "app\breeds\[slug]\page.tsx" $content -Encoding UTF8;

