
$content = Get-Content "app\breeds\page.tsx" -Raw;

$importStr = @"
import BreedsClient from `./BreedsClient`;
"@
$newImportStr = @"
import BreedsClient from `./BreedsClient`;
import { getDogs } from `@/lib/supabase/dogs-mapper`;
"@

$funcStr = @"
export default function BreedsPage() {
  return <BreedsClient />;
}
"@
$newFuncStr = @"
export default async function BreedsPage() {
  const dogs = await getDogs();
  return <BreedsClient dogs={dogs} />;
}
"@

$content = $content.Replace($importStr, $newImportStr);
$content = $content.Replace($funcStr, $newFuncStr);

Set-Content "app\breeds\page.tsx" $content -Encoding UTF8;

$clientContent = Get-Content "app\breeds\BreedsClient.tsx" -Raw;

$clientContent = $clientContent.Replace("import { dogs } from `@/data/dogs`;", "");
$clientContent = $clientContent.Replace("export default function BreedsClient() {", "export default function BreedsClient({ dogs }: { dogs: Dog[] }) {");

Set-Content "app\breeds\BreedsClient.tsx" $clientContent -Encoding UTF8;

