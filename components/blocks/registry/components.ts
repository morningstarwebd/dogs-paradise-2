import dynamic from "next/dynamic";

// Dynamically import the existing Dogs Paradise components
export const HeroBanner = dynamic(() => import("@/components/home/HeroBanner"), { ssr: true });
export const FeaturedDogs = dynamic(() => import("@/components/home/FeaturedDogs").then(m => m.default), { ssr: true });
export const BreedExplorer = dynamic(() => import("@/components/home/BreedExplorer"), { ssr: true });
export const HappyStories = dynamic(() => import("@/components/home/HappyStories"), { ssr: true });
export const AboutPreview = dynamic(() => import("@/components/home/AboutPreview"), { ssr: true });
export const ImageHotspot = dynamic(() => import("@/components/home/ImageHotspot"), { ssr: true });
export const StatsCounter = dynamic(() => import("@/components/home/StatsCounter"), { ssr: true });
export const WhyChooseUs = dynamic(() => import("@/components/home/WhyChooseUs"), { ssr: true });
export const AdoptionProcess = dynamic(() => import("@/components/home/AdoptionProcess"), { ssr: true });
export const PuppyCareTips = dynamic(() => import("@/components/home/PuppyCareTips"), { ssr: true });
export const TrustBadges = dynamic(() => import("@/components/home/TrustBadges"), { ssr: true });
export const CredibilityStrip = dynamic(() => import("@/components/home/CredibilityStrip"), { ssr: true });
export const InstagramFeed = dynamic(() => import("@/components/home/InstagramFeed"), { ssr: true });
export const BlogPreview = dynamic(() => import("@/components/home/BlogPreview"), { ssr: true });
export const FAQSection = dynamic(() => import("@/components/home/FAQSection"), { ssr: true });
export const NewsletterCTA = dynamic(() => import("@/components/home/NewsletterCTA"), { ssr: true });
export const CallToAction = dynamic(() => import("@/components/home/CallToAction"), { ssr: true });

// Null component for header/footer (rendered separately)
export const NullBlockComponent = () => null;
