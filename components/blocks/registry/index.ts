import { SchemaField } from "@/types/schema.types";

// Types
export { type BlockDefinition } from './types';

// Design schema utilities
export { designSchemaFields, buildSchema, buildSchemaWithoutSectionTextColor } from './design-schema';

// All block schemas
export {
    heroBlocks,
    statsCounterBlocks,
    faqBlocks,
    whyChooseBlocks,
    trustBadgeBlocks,
    adoptionProcessBlocks,
    featuredBreedBlocks,
    breedExplorerCardBlocks,
    happyStoryBlocks,
    aboutActionBlocks,
    imageHotspotBlocks,
    puppyCareBlocks,
    instagramGalleryBlocks,
    blogCardBlocks,
    newsletterIconBlocks,
    ctaButtonBlocks,
    headerBlocks,
} from './blocks/index';

// Section schemas
export { headerSchemaFields, footerSchemaFields } from './schema/index';

// Components
export {
    HeroBanner,
    FeaturedDogs,
    BreedExplorer,
    HappyStories,
    AboutPreview,
    ImageHotspot,
    StatsCounter,
    WhyChooseUs,
    AdoptionProcess,
    PuppyCareTips,
    TrustBadges,
    InstagramFeed,
    BlogPreview,
    FAQSection,
    NewsletterCTA,
    CallToAction,
    NullBlockComponent,
} from './components';

// Import for building the registry
import { BlockDefinition } from './types';
import { buildSchema, buildSchemaWithoutSectionTextColor } from './design-schema';
import {
    heroBlocks,
    statsCounterBlocks,
    faqBlocks,
    whyChooseBlocks,
    trustBadgeBlocks,
    adoptionProcessBlocks,
    featuredBreedBlocks,
    breedExplorerCardBlocks,
    happyStoryBlocks,
    aboutActionBlocks,
    imageHotspotBlocks,
    puppyCareBlocks,
    instagramGalleryBlocks,
    blogCardBlocks,
    newsletterIconBlocks,
    ctaButtonBlocks,
    headerBlocks,
} from './blocks/index';
import { headerSchemaFields, footerSchemaFields } from './schema/index';
import {
    HeroBanner,
    FeaturedDogs,
    BreedExplorer,
    HappyStories,
    AboutPreview,
    ImageHotspot,
    StatsCounter,
    WhyChooseUs,
    AdoptionProcess,
    PuppyCareTips,
    TrustBadges,
    InstagramFeed,
    BlogPreview,
    FAQSection,
    NewsletterCTA,
    CallToAction,
    NullBlockComponent,
} from './components';

// ═══════════════════════════════════════════════════════════════════════
// BLOCK REGISTRY
// ═══════════════════════════════════════════════════════════════════════

export const BlockRegistry: Record<string, BlockDefinition> = {
    'hero': {
        id: 'hero',
        label: 'Hero Banner',
        schema: buildSchemaWithoutSectionTextColor([
            { key: 'badge_text', label: 'Badge Text', type: 'text', placeholder: 'Trusted by 2000+ Families' },
            { key: 'badge_text_color', label: 'Badge Text Color', type: 'color', default: '#ea728c' },
            { key: 'badge_text_size_px', label: 'Badge Text Size (px)', type: 'range', default: 14, min: 10, max: 32, step: 1 },
            { key: 'badge_bg_color', label: 'Badge Background', type: 'color', default: '#ffffff' },
            { key: 'show_badge_stars', label: 'Show Badge Stars', type: 'toggle', default: false },
            { key: 'badge_star_count', label: 'Badge Star Count', type: 'range', default: 5, min: 0, max: 10, step: 1 },
            { key: 'badge_star_color', label: 'Badge Star Color', type: 'color', default: '#ea728c' },
            { key: 'heading_line1', label: 'Heading Line 1', type: 'text', placeholder: 'Find Your' },
            { key: 'heading_line1_color', label: 'Heading Line 1 Color', type: 'color', default: '#FFF0D9' },
            { key: 'heading_highlight', label: 'Heading Highlight', type: 'text', placeholder: 'Perfect Puppy' },
            { key: 'accent_color', label: 'Heading Highlight Color', type: 'color', default: '#ea728c' },
            { key: 'heading_line2', label: 'Heading Line 2', type: 'text', placeholder: 'Companion' },
            { key: 'heading_line2_color', label: 'Heading Line 2 Color', type: 'color', default: '#FFF0D9' },
            { key: 'heading_text_size_px', label: 'Heading Text Size (px)', type: 'range', default: 56, min: 24, max: 96, step: 1 },
            { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Healthy, home-raised puppies with 12+ years of experience...' },
            { key: 'description_text_color', label: 'Description Text Color', type: 'color', default: '#FFF0D9' },
            { key: 'description_text_size_px', label: 'Description Text Size (px)', type: 'range', default: 20, min: 12, max: 36, step: 1 },
            { key: 'slideshow_speed', label: 'Slideshow Speed (ms)', type: 'number', placeholder: '4000', default: 4000 },
            { key: 'hero_image_size', label: 'Hero Image Size', type: 'select', options: ['large', 'medium', 'small'], default: 'medium' },
            { key: 'hero_image_frame_bg_color', label: 'Hero Image Frame Background', type: 'color', default: '#ffffff' },
            { key: 'show_floating_card', label: 'Show Location Card', type: 'toggle', default: true },
            { key: 'location_map_link', label: 'Location Map Link', type: 'text', placeholder: 'https://maps.google.com/?q=Your+Location' },
            { key: 'location_title_text', label: 'Location Title Text', type: 'text', default: 'Dogs Paradise Bangalore' },
            { key: 'location_subtext', label: 'Location Subtext', type: 'text', default: 'Benson Town' },
            { key: 'location_mobile_cta_text', label: 'Location Mobile CTA Text', type: 'text', default: 'Visit Us' },
            { key: 'location_map_icon_color', label: 'Location Map Icon Color', type: 'color', default: '#ea728c' },
            { key: 'location_card_bg_color', label: 'Location Card Background', type: 'color', default: '#ffffff' },
            { key: 'location_text_color', label: 'Location Text Color', type: 'color', default: '#374151' },
            { key: 'location_text_size_px', label: 'Location Text Size (px)', type: 'range', default: 12, min: 10, max: 24, step: 1 },
            { key: 'show_trust_stats', label: 'Show Trust Stats', type: 'toggle', default: true },
            { key: 'show_phone_icon', label: 'Show Phone Icon', type: 'toggle', default: true },
            { key: 'phone_number', label: 'Phone Number', type: 'text', placeholder: '+91 98765 43210' },
            { key: 'phone_icon_color', label: 'Phone Icon Color', type: 'color', default: '#ea728c' },
            { key: 'phone_icon_bg_color', label: 'Phone Icon Background', type: 'color', default: '#ffffff' },
            { key: 'phone_icon_size_px', label: 'Phone Icon Size (px)', type: 'range', default: 16, min: 12, max: 30, step: 1 },
            { key: 'phone_icon_button_size_px', label: 'Phone Button Size (px)', type: 'range', default: 44, min: 36, max: 72, step: 1 },
            { key: 'mobile_trust_value_text_size_px', label: 'Mobile Trust Value Text Size (px)', type: 'range', default: 14, min: 10, max: 24, step: 1 },
            { key: 'mobile_trust_label_text_size_px', label: 'Mobile Trust Subtext Size (px)', type: 'range', default: 8, min: 7, max: 16, step: 1 },
        ]),
        blocks: heroBlocks,
        Component: HeroBanner
    },
    'featured-dogs': {
        id: 'featured-dogs',
        label: 'Featured Dogs',
        schema: buildSchema([
            { key: 'badge_text', label: 'Badge Text', type: 'text', default: 'Find Your Best Friend' },
            { key: 'show_badge_text', label: 'Show Badge Text', type: 'toggle', default: true },
            { key: 'show_badge_line', label: 'Show Badge Line', type: 'toggle', default: true },
            { key: 'badge_text_color', label: 'Badge Text Color', type: 'color', default: '#ea728c' },
            { key: 'badge_text_size_px', label: 'Badge Text Size (px)', type: 'range', default: 14, min: 10, max: 32, step: 1 },
            { key: 'heading', label: 'Section Heading', type: 'text', default: 'Premium Selection' },
            { key: 'heading_highlight', label: 'Heading Highlight', type: 'text', default: 'Available Dogs' },
            { key: 'accent_color', label: 'Section Accent Color', type: 'color', default: '#ea728c' },
            { key: 'accent_background_color', label: 'Accent Background Color', type: 'color', default: '#ea728c' },
            { key: 'accent_hover_color', label: 'Accent Hover Color', type: 'color', default: '' },
            { key: 'heading_text_color', label: 'Heading Text Color', type: 'color', default: '#FFF0D9' },
            { key: 'heading_highlight_color', label: 'Heading Highlight Color', type: 'color', default: '#ea728c' },
            { key: 'heading_text_size_px', label: 'Heading Text Size (px)', type: 'range', default: 56, min: 24, max: 96, step: 1 },
            { key: 'subheading', label: 'Subheading', type: 'textarea', default: 'Healthy, home-raised puppies from champion bloodlines.' },
            { key: 'subheading_text_color', label: 'Subheading Text Color', type: 'color', default: '#FFF0D9' },
            { key: 'description_text_size_px', label: 'Description Text Size (px)', type: 'range', default: 16, min: 12, max: 36, step: 1 },
            { key: 'show_all_btn_text', label: 'View All Button', type: 'text', default: 'View All Available Dogs' },
            { key: 'show_all_btn_url', label: 'View All Button URL', type: 'text', default: '/breeds' },
            { key: 'show_all_btn_color', label: 'View All Button Color', type: 'color', default: '#ea728c' },
            { key: 'default_breed_card_accent_color', label: 'Default Breed Card Accent', type: 'color', default: '#ea728c' },
            { key: 'all_tile_outer_bg_color', label: 'ALL Card Outer Background', type: 'color', default: '#dcfce7' },
            { key: 'all_tile_inner_bg_color', label: 'ALL Card Inner Background', type: 'color', default: '#ffedd5' },
            { key: 'all_tile_inner_border_color', label: 'ALL Card Inner Border', type: 'color', default: '#fed7aa' },
            { key: 'all_tile_inner_text_color', label: 'ALL Card Inner Text', type: 'color', default: '#ea580c' },
            { key: 'priority_badge_bg_color', label: 'Priority Badge Background', type: 'color', default: '#ea728c' },
            { key: 'priority_badge_text_color', label: 'Priority Badge Text Color', type: 'color', default: '#ffffff' },
            { key: 'priority_badge_text_size_px', label: 'Priority Badge Text Size (px)', type: 'range', default: 9, min: 8, max: 24, step: 1 },
            { key: 'breed_title_text_size_px', label: 'Breed Title Text Size (px)', type: 'range', default: 14, min: 10, max: 28, step: 1 },
            { key: 'breed_title_text_color', label: 'Breed Title Text Color', type: 'color', default: '#FFF0D9' },
            { key: 'breed_image_size_px', label: 'Breed Image Size (px)', type: 'range', default: 96, min: 64, max: 180, step: 1 },
            { key: 'breed_card_bg_color', label: 'Breed Card Background', type: 'color', default: '#ffffff' }
        ]),
        blocks: featuredBreedBlocks,
        Component: FeaturedDogs
    },
    'breed-explorer': {
        id: 'breed-explorer',
        label: 'Breed Explorer',
        schema: buildSchema([
            { key: 'badge_text', label: 'Badge Text', type: 'text', default: 'Explore Breeds' },
            { key: 'badge_text_size_px', label: 'Badge Text Size (px)', type: 'range', default: 14, min: 10, max: 32, step: 1 },
            { key: 'heading', label: 'Section Heading', type: 'text', default: 'Popular' },
            { key: 'heading_highlight', label: 'Heading Highlight', type: 'text', default: 'Breeds' },
            { key: 'accent_color', label: 'Accent Color', type: 'color', default: '#ea728c' },
            { key: 'accent_background_color', label: 'Accent Background Color', type: 'color', default: '#ea728c' },
            { key: 'accent_hover_color', label: 'Accent Hover Color', type: 'color', default: '' },
            { key: 'card_border_color', label: 'Card Border Color Setting', type: 'color', default: '#ffffff', group: 'Design' },
            { key: 'heading_text_size_px', label: 'Heading Text Size (px)', type: 'range', default: 56, min: 24, max: 96, step: 1 },
            { key: 'subheading', label: 'Subheading', type: 'textarea', default: 'Discover the perfect breed for your lifestyle.' },
            { key: 'description_text_size_px', label: 'Description Text Size (px)', type: 'range', default: 16, min: 12, max: 36, step: 1 }
        ]),
        blocks: breedExplorerCardBlocks,
        Component: BreedExplorer
    },
    'happy-stories': {
        id: 'happy-stories',
        label: 'Happy Stories',
        schema: buildSchema([
            { key: 'badge_text', label: 'Badge Text', type: 'text', default: 'Real Customer Reviews' },
            { key: 'badge_text_size_px', label: 'Badge Text Size (px)', type: 'range', default: 14, min: 10, max: 32, step: 1 },
            { key: 'heading', label: 'Section Heading', type: 'text', default: 'Our Happy Families' },
            { key: 'heading_highlight', label: 'Heading Highlight', type: 'text', default: 'Success Stories' },
            { key: 'accent_color', label: 'Accent Color Setting', type: 'color', default: '#ea728c', group: 'Design' },
            { key: 'card_border_color', label: 'Card Border Color Setting', type: 'color', default: '#ffffff', group: 'Design' },
            { key: 'heading_text_size_px', label: 'Heading Text Size (px)', type: 'range', default: 56, min: 24, max: 96, step: 1 },
            { key: 'subheading', label: 'Subheading', type: 'textarea', default: 'Real stories from our beloved pet parents.' },
            { key: 'description_text_size_px', label: 'Description Text Size (px)', type: 'range', default: 16, min: 12, max: 36, step: 1 }
        ]),
        blocks: happyStoryBlocks,
        Component: HappyStories
    },
    'about-preview': {
        id: 'about-preview',
        label: 'About Preview',
        schema: buildSchema([
            { key: 'badge_text', label: 'Badge Text', type: 'text', default: '12+ Years Experience' },
            { key: 'badge_text_size_px', label: 'Badge Text Size (px)', type: 'range', default: 14, min: 10, max: 32, step: 1 },
            { key: 'badge_text_color', label: 'Badge Text Color', type: 'color', default: '#ea728c' },
            { key: 'heading_line1', label: 'Heading Line 1', type: 'text', default: 'Meet Your Trusted' },
            { key: 'heading_highlight', label: 'Heading Highlight', type: 'text', default: 'Dog Specialist' },
            { key: 'heading_text_size_px', label: 'Heading Text Size (px)', type: 'range', default: 56, min: 24, max: 96, step: 1 },
            { key: 'heading_text_color', label: 'Heading Text Color', type: 'color', default: '#FFF0D9' },
            { key: 'heading_highlight_color', label: 'Heading Highlight Color', type: 'color', default: '#ea728c' },
            { key: 'description', label: 'Description', type: 'textarea', default: "Hi, I'm Morning Star..." },
            { key: 'description_text_size_px', label: 'Description Text Size (px)', type: 'range', default: 16, min: 12, max: 36, step: 1 },
            { key: 'description_text_color', label: 'Description Text Color', type: 'color', default: '#FFF0D9' },
            { key: 'author_name', label: 'Owner Name', type: 'text', default: 'Morning Star' },
            { key: 'quote_text', label: 'Founder Quote', type: 'textarea', default: 'For me, every puppy deserves a good home...' },
            { key: 'quote_accent_color', label: 'Quote Accent Color', type: 'color', default: '#ea728c' },
            { key: 'owner_image', label: 'Owner Image', type: 'image' },
            { key: 'owner_image_border_color', label: 'Owner Image Border Color', type: 'color', default: '#ffffff' },
            { key: 'owner_image_frame_bg_color', label: 'Owner Image Frame Background', type: 'color', default: '#ffffff' },
            { key: 'owner_card_backdrop_color', label: 'Owner Card Backdrop Color', type: 'color', default: '#ea728c' },
            { key: 'founding_year', label: 'Founding Year', type: 'text', default: '2017' },
        ]),
        blocks: aboutActionBlocks,
        Component: AboutPreview
    },
    'stats-counter': {
        id: 'stats-counter',
        label: 'Stats Counter',
        schema: buildSchema([]),
        blocks: statsCounterBlocks,
        Component: StatsCounter
    },
    'adoption-process': {
        id: 'adoption-process',
        label: 'Adoption Process',
        schema: buildSchema([
            { key: 'heading', label: 'Heading', type: 'text', default: 'Simple Adoption Process' },
            { key: 'subheading', label: 'Subheading', type: 'textarea', default: 'Your journey to getting a perfect puppy.' }
        ]),
        blocks: adoptionProcessBlocks,
        Component: AdoptionProcess
    },
    'call-to-action': {
        id: 'call-to-action',
        label: 'Final Call to Action',
        schema: buildSchema([
            { key: 'badge_text', label: 'Badge Text', type: 'text', default: 'Ready for a new friend?' },
            { key: 'badge_text_size_px', label: 'Badge Text Size (px)', type: 'range', default: 14, min: 10, max: 32, step: 1 },
            { key: 'heading_line1', label: 'Heading Line 1', type: 'text', default: 'Find your perfect' },
            { key: 'heading_highlight', label: 'Heading Highlight', type: 'text', default: 'companion today' },
            { key: 'heading_text_size_px', label: 'Heading Text Size (px)', type: 'range', default: 56, min: 24, max: 96, step: 1 },
            { key: 'description', label: 'Description', type: 'textarea', default: 'Contact us on WhatsApp to speak with our experts directly.' },
            { key: 'description_text_size_px', label: 'Description Text Size (px)', type: 'range', default: 20, min: 12, max: 36, step: 1 },
            { key: 'btn_text', label: 'Primary Button Text (Legacy)', type: 'text', default: 'Chat on WhatsApp' },
            { key: 'secondary_btn_text', label: 'Secondary Button Text', type: 'text', default: 'Browse All Breeds' },
        ]),
        blocks: ctaButtonBlocks,
        Component: CallToAction
    },
    'image-hotspot': {
        id: 'image-hotspot',
        label: 'Image Hotspot',
        schema: buildSchema([
            { key: 'badge_text', label: 'Badge Text', type: 'text', default: 'Veterinary Health Guarantee' },
            { key: 'badge_text_size_px', label: 'Badge Text Size (px)', type: 'range', default: 14, min: 10, max: 32, step: 1 },
            { key: 'heading', label: 'Heading', type: 'text', default: 'Health' },
            { key: 'heading_highlight', label: 'Heading Highlight', type: 'text', default: 'Inspection' },
            { key: 'heading_suffix', label: 'Heading Suffix', type: 'text', default: 'Points' },
            { key: 'heading_text_size_px', label: 'Heading Text Size (px)', type: 'range', default: 56, min: 24, max: 96, step: 1 },
            { key: 'subheading', label: 'Subheading', type: 'textarea', default: 'Tap any checkpoint on our furry friend to learn exactly what our vet team examines before a puppy gets their clean bill of health.' },
            { key: 'description_text_size_px', label: 'Description Text Size (px)', type: 'range', default: 16, min: 12, max: 36, step: 1 },
            { key: 'base_image', label: 'Base Image', type: 'image' },
        ]),
        blocks: imageHotspotBlocks,
        Component: ImageHotspot
    },
    'newsletter-cta': {
        id: 'newsletter-cta',
        label: 'Newsletter CTA',
        schema: buildSchema([
            { key: 'heading', label: 'Heading', type: 'text', default: 'Join the VIP Updates List' },
            { key: 'subheading', label: 'Subheading', type: 'textarea', default: 'Be the first to know when new puppies arrive. Get exclusive early access alerts and expert care tips directly on your WhatsApp.' },
            { key: 'button_text', label: 'Button Text', type: 'text', default: 'Get Alerts' },
            { key: 'input_placeholder', label: 'Input Placeholder', type: 'text', default: 'WhatsApp Number' },
            { key: 'footer_note', label: 'Footer Note', type: 'text', default: 'No spam policy. Unsubscribe anytime by messaging "STOP".' },
        ]),
        blocks: newsletterIconBlocks,
        Component: NewsletterCTA
    },
    'blog-preview': {
        id: 'blog-preview',
        label: 'Blog Preview',
        schema: buildSchema([
            { key: 'heading', label: 'Heading', type: 'text', default: 'From Our Blog' },
            { key: 'subheading', label: 'Subheading', type: 'textarea', default: 'Expert guides, breed comparisons, and puppy care tips from the Dogs Paradise Bangalore team.' },
            { key: 'view_all_text', label: 'View All Button', type: 'text', default: 'View All Articles' },
        ]),
        blocks: blogCardBlocks,
        Component: BlogPreview
    },
    'faq-section': {
        id: 'faq-section',
        label: 'FAQ Section',
        schema: buildSchema([
            { key: 'heading', label: 'Heading', type: 'text', default: 'Frequently Asked Questions' },
            { key: 'subheading', label: 'Subheading', type: 'textarea', default: 'Everything pet parents ask before adoption.' },
        ]),
        blocks: faqBlocks,
        Component: FAQSection
    },
    'why-choose-us': {
        id: 'why-choose-us',
        label: 'Why Choose Us',
        schema: buildSchema([
            { key: 'heading', label: 'Heading', type: 'text', default: 'Why Families Choose Dogs Paradise' },
            { key: 'subheading', label: 'Subheading', type: 'textarea', default: 'Trusted care, ethical practices, and lifelong support.' },
        ]),
        blocks: whyChooseBlocks,
        Component: WhyChooseUs
    },
    'puppy-care-tips': {
        id: 'puppy-care-tips',
        label: 'Puppy Care Tips',
        schema: buildSchema([
            { key: 'heading', label: 'Heading', type: 'text', default: 'Puppy Care Guide' },
            { key: 'subheading', label: 'Subheading', type: 'textarea', default: 'Expert tips from our team to help you raise a happy, healthy puppy.' },
        ]),
        blocks: puppyCareBlocks,
        Component: PuppyCareTips
    },
    'trust-badges': {
        id: 'trust-badges',
        label: 'Trust Badges',
        schema: buildSchema([
            { key: 'heading', label: 'Heading', type: 'text', default: 'Built on Trust & Transparency' },
            { key: 'subheading', label: 'Subheading', type: 'textarea', default: 'Proof points that matter for responsible adoption.' },
        ]),
        blocks: trustBadgeBlocks,
        Component: TrustBadges
    },
    'instagram-feed': {
        id: 'instagram-feed',
        label: 'Instagram Feed',
        schema: buildSchema([
            { key: 'heading', label: 'Heading', type: 'text', default: 'Adorable Moments' },
            { key: 'subheading', label: 'Subheading', type: 'textarea', default: 'A glimpse into the daily lives of our happy puppy families. Follow our journey on Instagram for a daily dose of cuteness.' },
            { key: 'handle', label: 'Instagram Handle', type: 'text', default: '@dogsparadice' }
        ]),
        blocks: instagramGalleryBlocks,
        Component: InstagramFeed
    },
    'header': {
        id: 'header',
        label: 'Header',
        schema: headerSchemaFields,
        blocks: headerBlocks,
        Component: NullBlockComponent,
    },
    'footer': {
        id: 'footer',
        label: 'Footer',
        schema: footerSchemaFields,
        Component: NullBlockComponent,
    }
};

export function getSchemaWithLiquidBg(blockKey: string): SchemaField[] {
    const block = BlockRegistry[blockKey];
    if (!block?.schema) return [];
    return block.schema;
}
