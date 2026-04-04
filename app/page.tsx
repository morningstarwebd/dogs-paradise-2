// Homepage sections

// 17 Sections from components/home (MarqueeBanner and CategoryStrip were previously deleted)
import HeroBanner from '@/components/home/HeroBanner';
import FeaturedDogs from '@/components/home/FeaturedDogs';
import BreedExplorer from '@/components/home/BreedExplorer';
import ImageHotspot from '@/components/home/ImageHotspot';
import StatsCounter from '@/components/home/StatsCounter';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import AdoptionProcess from '@/components/home/AdoptionProcess';
import PuppyCareTips from '@/components/home/PuppyCareTips';
import TrustBadges from '@/components/home/TrustBadges';
import InstagramFeed from '@/components/home/InstagramFeed';
import BlogPreview from '@/components/home/BlogPreview';
import FAQSection from '@/components/home/FAQSection';
import NewsletterCTA from '@/components/home/NewsletterCTA';
import CallToAction from '@/components/home/CallToAction';

// Premium sections
import HappyStories from '@/components/home/HappyStories';
import AboutPreview from '@/components/home/AboutPreview';

export default function HomePage() {
  return (
    <main className="overflow-x-hidden bg-[#302b63]">
      {/* 1. Hero — The visual hook */}
      <HeroBanner />

      {/* 2. Featured Dogs — Lifestyle categories (Formerly 'Our Collection' / 'Explore Breeds') */}
      <FeaturedDogs />

      {/* 3. Breed Explorer — The centerpiece selection */}
      <BreedExplorer />

      {/* 4. Happy Stories — Premium customer reviews with photos */}
      <HappyStories />

      {/* About Preview — Owner intro right below testimonials */}
      <AboutPreview />

      {/* 5. Image Hotspot — Interactive anatomy/features */}
      <ImageHotspot />

      {/* 6. Stats Counter — Social proof numbers */}
      <StatsCounter />

      {/* 7. Why Dogs Paradise Bangalore? — Competitive advantage */}
      <WhyChooseUs />



      {/* 10. Adoption Process — The path to ownership */}
      <AdoptionProcess />

      {/* 11. Puppy Care Tips — Educational value */}
      <PuppyCareTips />

      {/* 12. Trust Badges — Detailed certifications */}
      <TrustBadges />

      {/* 13. Instagram Feed — Social presence */}
      <InstagramFeed />

      {/* 15. Blog Preview — Thought leadership and SEO */}
      <BlogPreview />

      {/* 16. FAQ Section — Overcoming objections */}
      <FAQSection />

      {/* 17. Newsletter CTA — Lead nurture */}
      <NewsletterCTA />

      {/* 18. Final Call to Action — Conversion focus */}
      <CallToAction />
    </main>
  );
}
