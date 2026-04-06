
$content = [System.IO.File]::ReadAllText("d:\Dogs Paradise 2\dogs-paradice\app\breeds\[slug]\page.tsx");

$content = $content.Replace("import { dogs } from `@/data/dogs`;", "import { dogs as fallbackDogs } from `@/data/dogs`;`nimport { getDogs, getDogBySlug } from `@/lib/supabase/dogs-mapper`;");
$content = $content.Replace("return dogs.map", "return fallbackDogs.map");
$content = $content.Replace("const dog = dogs.find((d) => d.slug === slug);", "const dog = await getDogBySlug(slug);");

[System.IO.File]::WriteAllText("d:\Dogs Paradise 2\dogs-paradice\app\breeds\[slug]\page.tsx", $content);

