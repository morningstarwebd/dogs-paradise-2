import HeroBanner from '@/components/home/HeroBanner';
import StatsCounter from '@/components/home/StatsCounter';
import MarqueeBanner from '@/components/home/MarqueeBanner';
import FeaturedDogs from '@/components/home/FeaturedDogs';
import FlipCardGallery from '@/components/home/FlipCardGallery';
import BreedExplorer from '@/components/home/BreedExplorer';
import BreedComparison from '@/components/home/BreedComparison';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import ImageHotspot from '@/components/home/ImageHotspot';
import AdoptionProcess from '@/components/home/AdoptionProcess';
import TrustBadges from '@/components/home/TrustBadges';
import PuppyCareTips from '@/components/home/PuppyCareTips';
import Testimonials from '@/components/home/Testimonials';
import InstagramFeed from '@/components/home/InstagramFeed';
import BlogPreview from '@/components/home/BlogPreview';
import FAQSection from '@/components/home/FAQSection';
import NewsletterCTA from '@/components/home/NewsletterCTA';
import CallToAction from '@/components/home/CallToAction';

export default function HomePage() {
  return (
    <>
      {/* 1. Hero — Full-screen slider */}
      <HeroBanner />

      {/* 2. Stats Counter — Animated numbers */}
      <StatsCounter />

      {/* 3. Marquee Banner — Scrolling trust strip */}
      <MarqueeBanner />

      {/* 4. Featured Dogs — Category filter + dog cards */}
      <FeaturedDogs />

      {/* 5. Flip Card Gallery — Book-page flip breed cards */}
      <FlipCardGallery />

      {/* 6. Breed Explorer — Tab-based category exploration */}
      <BreedExplorer />

      {/* 7. Breed Comparison — Side-by-side with tabs */}
      <BreedComparison />

      {/* 8. Why Choose Us — Trust features grid */}
      <WhyChooseUs />

      {/* 9. Health Hotspot — Interactive 6-point inspection */}
      <ImageHotspot />

      {/* 10. Adoption Process — 6-step how-it-works */}
      <AdoptionProcess />

      {/* 11. Trust Badges — Credentials strip */}
      <TrustBadges />

      {/* 12. Puppy Care Tips — 5-tab care guide */}
      <PuppyCareTips />

      {/* 13. Testimonials — Carousel */}
      <Testimonials />

      {/* 14. Instagram Gallery — Parallax photo rows */}
      <InstagramFeed />

      {/* 15. Blog Preview — Featured articles */}
      <BlogPreview />

      {/* 16. FAQ — Accordion */}
      <FAQSection />

      {/* 17. Newsletter — WhatsApp subscribe */}
      <NewsletterCTA />

      {/* 18. Final CTA — WhatsApp + Browse */}
      <CallToAction />
    </>
  );
}
