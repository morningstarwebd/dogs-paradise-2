import { getDogs } from '@/lib/supabase/dogs-mapper';
import { createClient } from '@/lib/supabase/server';
import { SectionData, isFixedWebsiteSection } from '@/types/schema.types';
import { LivePreviewWrapper } from '@/components/admin/live-preview-wrapper';
import { BlockRegistry } from '@/components/blocks/registry';
import { getSectionBlockType } from '@/types/schema.types';
import { headers } from 'next/headers';
import { EditorViewport, getViewportContent } from '@/lib/responsive-content';
import { getHeaderThemeSettings, getWebsiteBodyStyle, withGlobalSectionBackground } from '@/lib/header-theme';

export const revalidate = 60; // Cache invalidation

export default async function HomePage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const dogs = await getDogs();
    const supabase = await createClient();

    // The Preview flag allows drafts to be seen if preview=true
    const sp = await searchParams;
    const isPreview = sp.preview === 'true';

    // Fetch dynamic sections
    let query = supabase
        .from('website_sections')
        .select('*')
        .order('sort_order', { ascending: true });

    // If not in preview mode, only fetch visible and published sections
    if (!isPreview) {
        query = query.eq('is_visible', true).eq('status', 'published');
    }

    const { data: dbSections } = await query;
    const sections = (dbSections || []) as SectionData[];
    const headerSection = sections.find((section) => getSectionBlockType(section) === 'header');
    const headerStore = await headers();
    const userAgent = headerStore.get('user-agent') || '';
    const renderViewport: EditorViewport = /Mobile|Android|iP(hone|od|ad)|IEMobile|BlackBerry|Opera Mini/i.test(userAgent)
        ? 'mobile'
        : 'desktop';
    const headerViewportContent = getViewportContent(
        (headerSection?.content || {}) as Record<string, unknown>,
        renderViewport
    );
    const headerThemeSettings = getHeaderThemeSettings(headerViewportContent);
    const bodyStyle = getWebsiteBodyStyle(headerThemeSettings, '#302b63');

    return (
        <main className="overflow-x-hidden" style={bodyStyle}>
            {/* 
                If we are in preview mode, use the interactive wrapper. 
                If we are live, render cleanly on the server to save client JS and preserve pure SSR.
            */}
            {isPreview ? (
                <LivePreviewWrapper initialSections={sections} dogs={dogs} initialViewport={renderViewport} />
            ) : (
                <div className="flex flex-col min-h-screen">
                    {sections.filter((section) => !isFixedWebsiteSection(section)).map(section => {
                        const blockType = getSectionBlockType(section);
                        const blockDef = BlockRegistry[blockType];
                        const resolvedContent = getViewportContent(
                            (section.content || {}) as Record<string, unknown>,
                            renderViewport
                        );
                        const themedContent = withGlobalSectionBackground(
                            resolvedContent,
                            headerThemeSettings
                        );

                        if (!blockDef) {
                            return null; // Gracefully omit unknown blocks in production
                        }

                        const Component = blockDef.Component;

                        return (
                            <div key={section.id} id={`section-${section.id}`}>
                                <Component 
                                    dogs={blockType === 'featured-dogs' || blockType === 'breed-explorer' ? dogs : undefined}
                                    {...themedContent} 
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}
