import { ViewTransitions } from 'next-view-transitions';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SmoothScroll from '@/components/layout/SmoothScroll';
import ChatWidget from '@/components/layout/ChatWidget';
import InitialLoader from '@/components/layout/InitialLoader';
import GoldDustOverlay from '@/components/layout/GoldDustOverlay';
import { getCachedWebsiteSections } from '@/lib/cached-data';
import { getSectionBlockType, type SectionData } from '@/types/schema.types';
import { headers } from 'next/headers';
import { EditorViewport, getViewportContent } from '@/lib/responsive-content';
import { getHeaderThemeSettings, getWebsiteBodyStyle } from '@/lib/header-theme';

export default async function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sections = (await getCachedWebsiteSections()) as SectionData[];
  const headerSection = sections.find((section) => getSectionBlockType(section) === 'header');
  const footerSection = sections.find((section) => getSectionBlockType(section) === 'footer');
  const headerStore = await headers();
  const userAgent = headerStore.get('user-agent') || '';
  const renderViewport: EditorViewport = /Mobile|Android|iP(hone|od|ad)|IEMobile|BlackBerry|Opera Mini/i.test(userAgent)
    ? 'mobile'
    : 'desktop';
  const headerViewportContent = getViewportContent(
    (headerSection?.content as Record<string, unknown>) || {},
    renderViewport
  );
  const headerThemeSettings = getHeaderThemeSettings(headerViewportContent);
  const websiteBodyStyle = getWebsiteBodyStyle(headerThemeSettings, '#302b63');

  return (
    <>
      <InitialLoader />
      <ViewTransitions>
        <div className="website-shell" style={websiteBodyStyle}>
          <GoldDustOverlay
            enabled={headerThemeSettings.enableGoldDustOverlay}
            density={headerThemeSettings.goldDustDensity}
            speed={headerThemeSettings.goldDustSpeed}
            size={headerThemeSettings.goldDustSize}
            opacity={headerThemeSettings.goldDustOpacity}
            color={headerThemeSettings.goldDustColor}
            hideInIframe
          />
          <SmoothScroll>
            <Navbar
              initialContent={(headerSection?.content as Record<string, unknown>) || {}}
              initialViewport={renderViewport}
            />
            <main className="flex-1">{children}</main>
            <Footer
              initialContent={(footerSection?.content as Record<string, unknown>) || {}}
              initialViewport={renderViewport}
            />
          </SmoothScroll>
          <ChatWidget />
        </div>
      </ViewTransitions>
    </>
  );
}
