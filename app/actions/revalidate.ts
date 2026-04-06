'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export async function revalidateSitemap() {
    revalidatePath('/sitemap.xml', 'page')
}

export async function revalidateEntity(tag: string) {
    // @ts-expect-error Next.js 16.1 canary types issue where it expects a 2nd argument "profile"
    revalidateTag(tag)
    revalidatePath('/sitemap.xml', 'page')
}
