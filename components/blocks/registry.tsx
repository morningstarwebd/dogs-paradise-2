import dynamic from "next/dynamic";
import { SchemaField, BlockTypeSchema } from "@/types/schema.types";

export interface BlockDefinition {
    id: string; // matches section_id in db
    label: string;
    icon?: string;
    schema: SchemaField[];
    mobileSchema?: SchemaField[];
    blocks?: BlockTypeSchema[]; // Shopify-style sub-blocks
    Component: React.ComponentType<Record<string, unknown>>;
}

// Dynamically import the existing Dogs Paradise components
const HeroBanner = dynamic(() => import("@/components/home/HeroBanner"), { ssr: true });
const FeaturedDogs = dynamic(() => import("@/components/home/FeaturedDogs").then(m => m.default), { ssr: true });
const BreedExplorer = dynamic(() => import("@/components/home/BreedExplorer"), { ssr: true });
const HappyStories = dynamic(() => import("@/components/home/HappyStories"), { ssr: true });
const AboutPreview = dynamic(() => import("@/components/home/AboutPreview"), { ssr: true });
const ImageHotspot = dynamic(() => import("@/components/home/ImageHotspot"), { ssr: true });
const StatsCounter = dynamic(() => import("@/components/home/StatsCounter"), { ssr: true });
const WhyChooseUs = dynamic(() => import("@/components/home/WhyChooseUs"), { ssr: true });
const AdoptionProcess = dynamic(() => import("@/components/home/AdoptionProcess"), { ssr: true });
const PuppyCareTips = dynamic(() => import("@/components/home/PuppyCareTips"), { ssr: true });
const TrustBadges = dynamic(() => import("@/components/home/TrustBadges"), { ssr: true });
const InstagramFeed = dynamic(() => import("@/components/home/InstagramFeed"), { ssr: true });
const BlogPreview = dynamic(() => import("@/components/home/BlogPreview"), { ssr: true });
const FAQSection = dynamic(() => import("@/components/home/FAQSection"), { ssr: true });
const NewsletterCTA = dynamic(() => import("@/components/home/NewsletterCTA"), { ssr: true });
const CallToAction = dynamic(() => import("@/components/home/CallToAction"), { ssr: true });

// ─── Design Schema (shared across sections) ──────────────────────────
const designSchemaFields: SchemaField[] = [
    {
        key: 'section_use_custom_bg_color',
        label: 'Use Custom Background For This Section',
        type: 'toggle',
        group: 'Design',
        default: false,
    },
    {
        key: 'section_bg_color',
        label: 'Custom Background Color / Gradient',
        type: 'color',
        group: 'Design',
        placeholder: 'e.g. #302b63 or linear-gradient(...)',
    },
    { key: 'section_text_color', label: 'Text Color', type: 'color', group: 'Design' },
    { key: 'decorative_blob_enabled', label: 'Show Pink Decorative Shape', type: 'toggle', group: 'Design', default: true },
    {
        key: 'decorative_blob_color',
        label: 'Pink Shape Color / Gradient',
        type: 'color',
        group: 'Design',
        default: '#ea728c',
        placeholder: 'e.g. gold-glitter, white-glitter, #D4AF37, or linear-gradient(...)',
    },
    { key: 'decorative_blob_size_scale', label: 'Pink Shape Size Scale', type: 'range', group: 'Design', default: 1, min: 0.5, max: 2.5, step: 0.05 },
    { key: 'decorative_shape_top_offset_x', label: 'Top Shape Set X Offset (Pink + Yellow)', type: 'range', group: 'Design', default: 0, min: -120, max: 120, step: 1 },
    { key: 'decorative_shape_top_offset_y', label: 'Top Shape Set Y Offset (Pink + Yellow)', type: 'range', group: 'Design', default: 0, min: -120, max: 120, step: 1 },
    { key: 'decorative_shape_bottom_offset_x', label: 'Bottom Shape Set X Offset (Pink + Yellow)', type: 'range', group: 'Design', default: 0, min: -120, max: 120, step: 1 },
    { key: 'decorative_shape_bottom_offset_y', label: 'Bottom Shape Set Y Offset (Pink + Yellow)', type: 'range', group: 'Design', default: 0, min: -120, max: 120, step: 1 },
    { key: 'decorative_outline_enabled', label: 'Show Yellow Decorative Shape', type: 'toggle', group: 'Design', default: true },
    { key: 'decorative_outline_color', label: 'Yellow Shape Color', type: 'color', group: 'Design', default: '#f5c842' },
    { key: 'decorative_outline_size_scale', label: 'Yellow Shape Size Scale', type: 'range', group: 'Design', default: 1, min: 0.5, max: 2.5, step: 0.05 },
    { key: 'section_padding_top', label: 'Padding Top (rem/px)', type: 'text', group: 'Design', placeholder: 'e.g. 4rem' },
    { key: 'section_padding_bottom', label: 'Padding Bottom (rem/px)', type: 'text', group: 'Design', placeholder: 'e.g. 4rem' },
    { key: 'section_margin_top', label: 'Margin Top (rem/px)', type: 'text', group: 'Design', placeholder: 'e.g. 2rem' },
    { key: 'section_margin_bottom', label: 'Margin Bottom (rem/px)', type: 'text', group: 'Design', placeholder: 'e.g. 2rem' },
];

function buildSchema(contentFields: SchemaField[]): SchemaField[] {
    const withGroup = contentFields.map(f => ({ ...f, group: f.group || 'Content' }));
    return [...withGroup, ...designSchemaFields];
}

function buildSchemaWithoutSectionTextColor(contentFields: SchemaField[]): SchemaField[] {
    const withGroup = contentFields.map(f => ({ ...f, group: f.group || 'Content' }));
    const designFieldsWithoutGlobalText = designSchemaFields.filter((field) => field.key !== 'section_text_color');
    return [...withGroup, ...designFieldsWithoutGlobalText];
}

// ═══════════════════════════════════════════════════════════════════════
// HERO — Shopify-style with Section Settings + Blocks
// ═══════════════════════════════════════════════════════════════════════

const heroBlocks: BlockTypeSchema[] = [
    {
        type: 'hero_slide',
        label: 'Hero Slide',
        icon: 'Image',
        limit: 5,
        titleField: 'alt_text',
        previewImageField: 'image',
        schema: [
            { key: 'image', label: 'Slide Image', type: 'image', placeholder: 'Upload or paste image URL' },
            { key: 'alt_text', label: 'Alt Text', type: 'text', placeholder: 'Describe the image for accessibility' },
        ]
    },
    {
        type: 'hero_button',
        label: 'CTA Button',
        icon: 'MousePointerClick',
        limit: 3,
        titleField: 'text',
        schema: [
            { key: 'text', label: 'Button Text', type: 'text', placeholder: '🐾 Browse Breeds' },
            { key: 'text_size', label: 'Text Size', type: 'select', options: ['small', 'medium', 'large'], default: 'medium' },
            { key: 'url', label: 'Link URL', type: 'text', placeholder: '/breeds' },
            { key: 'color', label: 'Button Color', type: 'color', default: '#ea728c' },
            { key: 'text_color', label: 'Button Text Color', type: 'color', default: '#ffffff' },
            { key: 'button_size_scale', label: 'Button Size Scale', type: 'range', default: 1, min: 0.7, max: 1.6, step: 0.05 },
            { key: 'style', label: 'Button Style', type: 'select', options: ['filled', 'outline'] },
            { key: 'open_new_tab', label: 'Open in New Tab', type: 'toggle', default: false },
        ]
    },
    {
        type: 'hero_stat',
        label: 'Trust Stat',
        icon: 'BarChart3',
        limit: 6,
        titleField: 'label',
        schema: [
            { key: 'value', label: 'Stat Value', type: 'text', placeholder: '2000+' },
            { key: 'label', label: 'Stat Label', type: 'text', placeholder: 'Happy Families' },
            { key: 'icon', label: 'Icon', type: 'select', options: ['Users', 'Dog', 'Award', 'Heart', 'Star', 'Shield', 'MapPin', 'Phone'] },
            { key: 'color', label: 'Icon Color', type: 'color', default: '#16a34a' },
            { key: 'card_bg_color', label: 'Card Background', type: 'color', default: '#ffffff' },
            { key: 'value_text_color', label: 'Value Text Color', type: 'color', default: '#1f2937' },
            { key: 'label_text_color', label: 'Subtext Color', type: 'color', default: '#6b7280' },
        ]
    }
];

const statsCounterBlocks: BlockTypeSchema[] = [
    {
        type: 'stat_item',
        label: 'Stat Item',
        icon: 'BarChart3',
        limit: 12,
        titleField: 'label',
        schema: [
            { key: 'value', label: 'Value', type: 'text', placeholder: '12+' },
            { key: 'label', label: 'Label', type: 'text', placeholder: 'Years Experience' },
            { key: 'icon', label: 'Icon', type: 'select', options: ['Award', 'Users', 'Dog', 'Heart', 'Star', 'ShieldCheck'] },
            { key: 'color', label: 'Icon Color', type: 'color', default: '#ea728c' },
        ],
    },
]

const faqBlocks: BlockTypeSchema[] = [
    {
        type: 'faq_item',
        label: 'FAQ Item',
        icon: 'CircleHelp',
        limit: 24,
        titleField: 'question',
        schema: [
            { key: 'question', label: 'Question', type: 'text', placeholder: 'What vaccines are included?' },
            { key: 'answer', label: 'Answer', type: 'textarea', placeholder: 'All puppies are vaccinated, dewormed, and vet-checked.' },
        ],
    },
]

const whyChooseBlocks: BlockTypeSchema[] = [
    {
        type: 'benefit_item',
        label: 'Benefit Item',
        icon: 'ShieldCheck',
        limit: 12,
        titleField: 'title',
        schema: [
            { key: 'title', label: 'Title', type: 'text', placeholder: 'Health First Promise' },
            { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Every pup gets complete health checks before adoption.' },
            { key: 'icon', label: 'Icon', type: 'select', options: ['ShieldCheck', 'Stethoscope', 'Award', 'Home', 'Heart', 'MessageCircle'] },
            { key: 'color', label: 'Icon Color', type: 'color', default: '#ea728c' },
        ],
    },
]

const trustBadgeBlocks: BlockTypeSchema[] = [
    {
        type: 'trust_badge',
        label: 'Trust Badge',
        icon: 'ShieldCheck',
        limit: 12,
        titleField: 'title',
        schema: [
            { key: 'title', label: 'Title', type: 'text', placeholder: 'KCI Guidance' },
            { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Breeding best practices' },
            { key: 'icon', label: 'Icon', type: 'select', options: ['ShieldCheck', 'Stethoscope', 'FileCheck', 'Award', 'BadgeCheck', 'Star'] },
            { key: 'color', label: 'Icon Color', type: 'color', default: '#ea728c' },
        ],
    },
]

const adoptionProcessBlocks: BlockTypeSchema[] = [
    {
        type: 'process_step',
        label: 'Process Step',
        icon: 'ListChecks',
        limit: 10,
        titleField: 'title',
        schema: [
            { key: 'step_number', label: 'Step Number', type: 'number', default: 1 },
            { key: 'title', label: 'Title', type: 'text', placeholder: 'Pick Your Breed' },
            { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Explore available breeds and talk to our team.' },
            { key: 'icon', label: 'Icon', type: 'select', options: ['Search', 'MessageCircle', 'Phone', 'Heart', 'Truck', 'Home'] },
            { key: 'color', label: 'Icon Color', type: 'color', default: '#ea728c' },
        ],
    },
]

const featuredBreedBlocks: BlockTypeSchema[] = [
    {
        type: 'featured_breed',
        label: 'Featured Breed',
        icon: 'Image',
        limit: 24,
        titleField: 'title',
        previewImageField: 'image',
        schema: [
            { key: 'title', label: 'Breed Title', type: 'text', placeholder: 'Toy Poodle' },
            { key: 'url', label: 'Breed URL', type: 'text', placeholder: '/breeds/toy-poodle' },
            { key: 'image', label: 'Breed Image', type: 'image' },
            { key: 'accent_color', label: 'Accent Color', type: 'color', default: '#ea728c' },
            { key: 'show_badge', label: 'Show Priority Badge', type: 'toggle', default: false },
            { key: 'badge_text', label: 'Badge Text', type: 'text', placeholder: 'Best Seller' },
        ],
    },
]

const breedExplorerCardBlocks: BlockTypeSchema[] = [
    {
        type: 'breed_card',
        label: 'Breed Card',
        icon: 'Image',
        limit: 24,
        titleField: 'title',
        previewImageField: 'image',
        schema: [
            { key: 'title', label: 'Breed Name', type: 'text', placeholder: 'Golden Retriever' },
            { key: 'url', label: 'Card URL', type: 'text', placeholder: '/breeds/golden-retriever' },
            { key: 'image', label: 'Card Image', type: 'image' },
            { key: 'gender', label: 'Gender', type: 'select', options: ['male', 'female'] },
            { key: 'is_best_seller', label: 'Best Seller Badge', type: 'toggle', default: false },
            { key: 'badge_text', label: 'Badge Text', type: 'text', placeholder: 'Best Seller' },
        ],
    },
]

const happyStoryBlocks: BlockTypeSchema[] = [
    {
        type: 'story_item',
        label: 'Story Item',
        icon: 'Image',
        limit: 24,
        titleField: 'author_name',
        previewImageField: 'image',
        schema: [
            { key: 'author_name', label: 'Author Name', type: 'text', placeholder: 'Rahul S.' },
            { key: 'location', label: 'Location', type: 'text', placeholder: 'Bangalore' },
            { key: 'breed', label: 'Breed', type: 'text', placeholder: 'Toy Poodle' },
            { key: 'rating', label: 'Rating', type: 'number', default: 5 },
            { key: 'text', label: 'Story Text', type: 'textarea', placeholder: 'Our puppy arrived healthy and happy...' },
            { key: 'image', label: 'Avatar Image', type: 'image' },
        ],
    },
]

const aboutActionBlocks: BlockTypeSchema[] = [
    {
        type: 'about_action',
        label: 'About CTA',
        icon: 'MousePointerClick',
        limit: 3,
        titleField: 'text',
        schema: [
            { key: 'text', label: 'Button Text', type: 'text', placeholder: 'Read My Full Story' },
            { key: 'url', label: 'Button URL', type: 'text', placeholder: '/about' },
            { key: 'style', label: 'Button Style', type: 'select', options: ['filled', 'outline'] },
            { key: 'color', label: 'Button Color', type: 'color', default: '#ea728c' },
            { key: 'open_new_tab', label: 'Open in New Tab', type: 'toggle', default: false },
        ],
    },
]

const imageHotspotBlocks: BlockTypeSchema[] = [
    {
        type: 'health_hotspot',
        label: 'Health Hotspot',
        icon: 'ShieldCheck',
        limit: 16,
        titleField: 'title',
        schema: [
            { key: 'title', label: 'Hotspot Title', type: 'text', placeholder: 'Eye Check' },
            { key: 'short_desc', label: 'Short Description', type: 'textarea', placeholder: 'Complete ophthalmologic examination.' },
            { key: 'full_desc', label: 'Full Description', type: 'textarea', placeholder: 'Detailed medical explanation...' },
            { key: 'icon', label: 'Icon', type: 'select', options: ['Eye', 'Ear', 'Bone', 'Heart', 'Activity', 'Shield'] },
            { key: 'color', label: 'Color', type: 'color', default: '#3b82f6' },
            { key: 'x', label: 'X Position (%)', type: 'number', default: 50 },
            { key: 'y', label: 'Y Position (%)', type: 'number', default: 50 },
        ],
    },
    {
        type: 'health_trust_item',
        label: 'Trust Strip Item',
        icon: 'ShieldCheck',
        limit: 6,
        titleField: 'label',
        schema: [
            { key: 'label', label: 'Label', type: 'text', placeholder: 'Registered Vets' },
            { key: 'icon', label: 'Icon', type: 'select', options: ['Shield', 'BadgeCheck', 'Heart'] },
        ],
    },
]

const puppyCareBlocks: BlockTypeSchema[] = [
    {
        type: 'care_tab',
        label: 'Care Tab',
        icon: 'ListChecks',
        limit: 12,
        titleField: 'label',
        schema: [
            { key: 'tab_id', label: 'Tab ID', type: 'text', placeholder: 'feeding' },
            { key: 'label', label: 'Tab Label', type: 'text', placeholder: 'Feeding' },
            { key: 'title', label: 'Tab Title', type: 'text', placeholder: 'Nutrition & Feeding Guide' },
            { key: 'icon', label: 'Icon', type: 'select', options: ['Utensils', 'Dumbbell', 'Scissors', 'Syringe', 'Brain'] },
            { key: 'color', label: 'Tab Color', type: 'color', default: '#f59e0b' },
        ],
    },
    {
        type: 'care_tip',
        label: 'Care Tip',
        icon: 'CircleHelp',
        limit: 72,
        titleField: 'heading',
        schema: [
            { key: 'tab_id', label: 'Tab ID', type: 'text', placeholder: 'feeding' },
            { key: 'heading', label: 'Tip Heading', type: 'text', placeholder: 'Puppy Diet (2-6 months)' },
            { key: 'text', label: 'Tip Description', type: 'textarea', placeholder: 'Feed 3-4 times daily with premium puppy food.' },
        ],
    },
]

const instagramGalleryBlocks: BlockTypeSchema[] = [
    {
        type: 'gallery_image',
        label: 'Gallery Image',
        icon: 'Image',
        limit: 40,
        titleField: 'alt_text',
        previewImageField: 'image',
        schema: [
            { key: 'image', label: 'Image', type: 'image' },
            { key: 'alt_text', label: 'Alt Text', type: 'text', placeholder: 'Puppy playtime moment' },
            { key: 'row', label: 'Row', type: 'select', options: ['top', 'bottom'] },
            { key: 'url', label: 'Optional Link', type: 'text', placeholder: 'https://instagram.com/...' },
        ],
    },
]

const blogCardBlocks: BlockTypeSchema[] = [
    {
        type: 'blog_card',
        label: 'Blog Card',
        icon: 'Image',
        limit: 12,
        titleField: 'title',
        previewImageField: 'image',
        schema: [
            { key: 'title', label: 'Title', type: 'text', placeholder: 'How to choose the right puppy' },
            { key: 'excerpt', label: 'Excerpt', type: 'textarea', placeholder: 'A practical guide for first-time pet parents.' },
            { key: 'category', label: 'Category', type: 'text', placeholder: 'Care Guide' },
            { key: 'reading_time', label: 'Reading Time', type: 'text', placeholder: '5 min read' },
            { key: 'published_at', label: 'Published At', type: 'text', placeholder: 'Mar 12, 2026' },
            { key: 'url', label: 'Post URL', type: 'text', placeholder: '/blog/how-to-choose-right-puppy' },
            { key: 'image', label: 'Cover Image', type: 'image' },
            { key: 'featured', label: 'Featured Large Card', type: 'toggle', default: false },
        ],
    },
]

const newsletterIconBlocks: BlockTypeSchema[] = [
    {
        type: 'newsletter_icon',
        label: 'Newsletter Icon',
        icon: 'ShieldCheck',
        limit: 6,
        titleField: 'icon',
        schema: [
            { key: 'icon', label: 'Icon', type: 'select', options: ['Bell', 'Gift', 'Send'] },
            { key: 'bg_color', label: 'Background Color', type: 'color', default: '#f3e8ff' },
            { key: 'icon_color', label: 'Icon Color', type: 'color', default: '#7c3aed' },
            { key: 'is_featured', label: 'Featured Icon', type: 'toggle', default: false },
        ],
    },
]

const ctaButtonBlocks: BlockTypeSchema[] = [
    {
        type: 'cta_button',
        label: 'CTA Button',
        icon: 'MousePointerClick',
        limit: 4,
        titleField: 'text',
        schema: [
            { key: 'text', label: 'Text', type: 'text', placeholder: 'Chat on WhatsApp' },
            { key: 'url', label: 'URL', type: 'text', placeholder: 'https://wa.me/...' },
            { key: 'color', label: 'Button Color', type: 'color', default: '#25d366' },
            { key: 'style', label: 'Style', type: 'select', options: ['filled', 'outline'] },
            { key: 'icon', label: 'Icon (emoji/text)', type: 'text', placeholder: '💬' },
            { key: 'open_new_tab', label: 'Open in New Tab', type: 'toggle', default: false },
        ],
    },
]

const headerBlocks: BlockTypeSchema[] = [
    {
        type: 'header_brand',
        label: 'Logo / Brand',
        icon: 'Image',
        limit: 1,
        titleField: 'logo_text',
        schema: [
            { key: 'logo_image', label: 'Logo Image', type: 'image' },
            { key: 'logo_text', label: 'Brand Name (Text Fallback)', type: 'text', placeholder: 'Brand Name' },
        ],
    },
    {
        type: 'header_nav_link',
        label: 'Navigation Link',
        icon: 'MousePointerClick',
        titleField: 'label',
        schema: [
            { key: 'label', label: 'Label', type: 'text', placeholder: 'Menu Label', default: 'Home' },
            { key: 'url', label: 'URL', type: 'text', placeholder: '/path', default: '/' },
        ],
    },
]

const NullBlockComponent = () => null

const headerSchemaFields: SchemaField[] = [
    { key: 'mobile_menu_title', label: 'Mobile Menu Title', type: 'text', group: 'Content', default: 'Menu' },
    { key: 'sticky_header', label: 'Sticky Header', type: 'toggle', group: 'Design', default: true },
    { key: 'header_shadow_enabled', label: 'Show Header Shadow', type: 'toggle', group: 'Design', default: true },
    { key: 'header_bg_color', label: 'Header Background', type: 'color', group: 'Design' },
    { key: 'header_border_color', label: 'Header Border Color', type: 'color', group: 'Design' },
    { key: 'header_text_color', label: 'Header Text Color', type: 'color', group: 'Design' },
    {
        key: 'enable_global_section_bg',
        label: 'Use One Background For All Homepage Sections',
        type: 'toggle',
        group: 'Content',
        default: false,
    },
    {
        key: 'global_section_bg_color',
        label: 'Global Sections Background (Color / Gradient)',
        type: 'color',
        group: 'Content',
        placeholder: 'e.g. #302b63 or linear-gradient(...)',
    },
    {
        key: 'body_bg_color',
        label: 'Website Body Background (Color / Gradient)',
        type: 'color',
        group: 'Content',
        placeholder: 'e.g. #302b63 or linear-gradient(...)',
    },
    {
        key: 'global_visual_preset',
        label: 'Website Visual Preset',
        type: 'select',
        options: ['custom', 'black-gold-dust-soft', 'black-gold-dust-rich'],
        group: 'Content',
        default: 'custom',
    },
    {
        key: 'enable_gold_dust_overlay',
        label: 'Show Rising Golden Dust Overlay',
        type: 'toggle',
        group: 'Content',
        default: false,
    },
    {
        key: 'gold_dust_density',
        label: 'Golden Dust Density',
        type: 'range',
        group: 'Content',
        default: 0.45,
        min: 0.1,
        max: 1,
        step: 0.05,
    },
    {
        key: 'gold_dust_speed',
        label: 'Golden Dust Speed',
        type: 'range',
        group: 'Content',
        default: 1,
        min: 0.6,
        max: 2,
        step: 0.05,
    },
    {
        key: 'gold_dust_size',
        label: 'Golden Dust Size',
        type: 'range',
        group: 'Content',
        default: 1,
        min: 0.6,
        max: 1.8,
        step: 0.05,
    },
    {
        key: 'gold_dust_opacity',
        label: 'Golden Dust Opacity',
        type: 'range',
        group: 'Content',
        default: 0.45,
        min: 0.1,
        max: 1,
        step: 0.05,
    },
    {
        key: 'gold_dust_color',
        label: 'Golden Dust Color',
        type: 'color',
        group: 'Content',
        default: '#d4af37',
        placeholder: 'e.g. #d4af37',
    },
    { key: 'logo_size', label: 'Logo Size (px)', type: 'range', group: 'Design', default: 40, min: 24, max: 64, step: 1 },
    { key: 'brand_text_size', label: 'Brand Text Size (px)', type: 'range', group: 'Design', default: 24, min: 14, max: 42, step: 1 },
    { key: 'brand_font_weight', label: 'Brand Font Weight', type: 'select', options: ['normal', 'medium', 'semibold', 'bold'], group: 'Design', default: 'bold' },
    { key: 'nav_text_size', label: 'Navigation Text Size (px)', type: 'range', group: 'Design', default: 15, min: 12, max: 24, step: 1 },
    { key: 'nav_alignment', label: 'Navigation Alignment', type: 'select', options: ['left', 'center', 'right'], group: 'Design', default: 'right' },
    { key: 'nav_weight', label: 'Navigation Font Weight', type: 'select', options: ['normal', 'medium', 'semibold', 'bold'], group: 'Design', default: 'medium' },
    { key: 'nav_text_transform', label: 'Navigation Text Transform', type: 'select', options: ['none', 'uppercase', 'capitalize'], group: 'Design', default: 'none' },
    { key: 'nav_letter_spacing', label: 'Navigation Letter Spacing (em)', type: 'range', group: 'Design', default: 0, min: -0.05, max: 0.2, step: 0.01 },
    { key: 'desktop_padding_y', label: 'Desktop Vertical Padding', type: 'select', options: ['compact', 'default', 'spacious'], group: 'Design', default: 'default' },
    { key: 'mobile_padding_y', label: 'Mobile Vertical Padding', type: 'select', options: ['compact', 'default', 'spacious'], group: 'Design', default: 'default' },
    { key: 'mobile_menu_icon', label: 'Mobile Menu Icon', type: 'select', options: ['hamburger', 'three-dot'], group: 'Content', default: 'three-dot' },
    { key: 'mobile_menu_mode', label: 'Mobile Menu Open Style', type: 'select', options: ['dropdown', 'left-drawer', 'right-drawer', 'front-panel'], group: 'Content', default: 'right-drawer' },
    { key: 'mobile_menu_width', label: 'Mobile Menu Width (px)', type: 'range', group: 'Design', default: 300, min: 220, max: 420, step: 2 },
    { key: 'mobile_menu_radius', label: 'Mobile Menu Radius (px)', type: 'range', group: 'Design', default: 20, min: 0, max: 36, step: 1 },
    { key: 'mobile_menu_bg_color', label: 'Mobile Menu Background', type: 'color', group: 'Design' },
    { key: 'mobile_menu_text_color', label: 'Mobile Menu Text Color', type: 'color', group: 'Design' },
    { key: 'mobile_menu_backdrop_enabled', label: 'Show Mobile Menu Backdrop', type: 'toggle', group: 'Design', default: true },
    { key: 'mobile_menu_backdrop_color', label: 'Mobile Backdrop Color', type: 'color', group: 'Design', default: '#0f172a' },
    { key: 'mobile_menu_backdrop_opacity', label: 'Mobile Backdrop Opacity', type: 'range', group: 'Design', default: 0.45, min: 0, max: 0.9, step: 0.05 },
]

const footerSchemaFields: SchemaField[] = [
    { key: 'footer_brand_badge_text', label: 'Brand Badge Text', type: 'text', default: 'P' },
    { key: 'footer_brand_name', label: 'Brand Name', type: 'text', default: 'Dogs Paradise' },
    { key: 'footer_tagline', label: 'Footer Tagline', type: 'textarea', default: 'Health details are shared clearly for every puppy, with breeder support before and after pickup.' },
    { key: 'footer_phone', label: 'Footer Phone', type: 'text', default: '+91 98765 43210' },
    { key: 'footer_email', label: 'Footer Email', type: 'text', default: 'hello@dogsparadise.in' },
    { key: 'footer_address', label: 'Footer Address', type: 'text', default: 'Main Road, Whitefield' },
    { key: 'footer_city', label: 'Footer City', type: 'text', default: 'Bangalore' },

    { key: 'quick_link_1_label', label: 'Quick Link 1 Label', type: 'text', default: 'All Breeds' },
    { key: 'quick_link_1_url', label: 'Quick Link 1 URL', type: 'text', default: '/breeds' },
    { key: 'quick_link_2_label', label: 'Quick Link 2 Label', type: 'text', default: 'Available Puppies' },
    { key: 'quick_link_2_url', label: 'Quick Link 2 URL', type: 'text', default: '/breeds?status=available' },
    { key: 'quick_link_3_label', label: 'Quick Link 3 Label', type: 'text', default: 'Happy Customers' },
    { key: 'quick_link_3_url', label: 'Quick Link 3 URL', type: 'text', default: '/happy-customers' },
    { key: 'quick_link_4_label', label: 'Quick Link 4 Label', type: 'text', default: 'About Us' },
    { key: 'quick_link_4_url', label: 'Quick Link 4 URL', type: 'text', default: '/about' },
    { key: 'quick_link_5_label', label: 'Quick Link 5 Label', type: 'text', default: 'Blog' },
    { key: 'quick_link_5_url', label: 'Quick Link 5 URL', type: 'text', default: '/blog' },
    { key: 'quick_link_6_label', label: 'Quick Link 6 Label', type: 'text', default: 'Contact' },
    { key: 'quick_link_6_url', label: 'Quick Link 6 URL', type: 'text', default: '/contact' },

    { key: 'breed_link_1_label', label: 'Breed Link 1 Label', type: 'text', default: 'Golden Retriever' },
    { key: 'breed_link_1_url', label: 'Breed Link 1 URL', type: 'text', default: '/breeds/golden-retriever' },
    { key: 'breed_link_2_label', label: 'Breed Link 2 Label', type: 'text', default: 'Labrador Retriever' },
    { key: 'breed_link_2_url', label: 'Breed Link 2 URL', type: 'text', default: '/breeds/labrador-retriever' },
    { key: 'breed_link_3_label', label: 'Breed Link 3 Label', type: 'text', default: 'German Shepherd' },
    { key: 'breed_link_3_url', label: 'Breed Link 3 URL', type: 'text', default: '/breeds/german-shepherd' },
    { key: 'breed_link_4_label', label: 'Breed Link 4 Label', type: 'text', default: 'Siberian Husky' },
    { key: 'breed_link_4_url', label: 'Breed Link 4 URL', type: 'text', default: '/breeds/siberian-husky' },
    { key: 'breed_link_5_label', label: 'Breed Link 5 Label', type: 'text', default: 'French Bulldog' },
    { key: 'breed_link_5_url', label: 'Breed Link 5 URL', type: 'text', default: '/breeds/french-bulldog' },
    { key: 'breed_link_6_label', label: 'Breed Link 6 Label', type: 'text', default: 'Rottweiler' },
    { key: 'breed_link_6_url', label: 'Breed Link 6 URL', type: 'text', default: '/breeds/rottweiler' },

    { key: 'promise_item_1', label: 'Promise Item 1', type: 'text', default: 'Select KCI Registration Options' },
    { key: 'promise_item_2', label: 'Promise Item 2', type: 'text', default: 'Age-Appropriate Vaccination' },
    { key: 'promise_item_3', label: 'Promise Item 3', type: 'text', default: 'Vet Health Checks' },
    { key: 'promise_item_4', label: 'Promise Item 4', type: 'text', default: 'Home-Raised Puppies' },
    { key: 'promise_item_5', label: 'Promise Item 5', type: 'text', default: 'Lifetime Breeder Support' },
    { key: 'promise_item_6', label: 'Promise Item 6', type: 'text', default: 'Clear Health Guidance' },

    { key: 'footer_copyright_text', label: 'Copyright Text', type: 'text', default: '© 2026 Dogs Paradise. All rights reserved.' },
    { key: 'footer_made_with_text', label: 'Made With Text', type: 'text', default: 'Made with love in Bangalore' },
    { key: 'footer_bg_color', label: 'Footer Background', type: 'color', default: '#ffffff' },
    { key: 'footer_border_color', label: 'Footer Border Color', type: 'color', default: '#e5e7eb' },
]

export const BlockRegistry: Record<string, BlockDefinition> = {
    'hero': {
        id: 'hero',
        label: 'Hero Banner',
        schema: buildSchemaWithoutSectionTextColor([
            // Section-level settings (the top-level content fields)
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
            { key: 'heading_line1', label: 'Heading Line 1', type: 'text', default: 'Meet Your Trusted' },
            { key: 'heading_highlight', label: 'Heading Highlight', type: 'text', default: 'Dog Specialist' },
            { key: 'heading_text_size_px', label: 'Heading Text Size (px)', type: 'range', default: 56, min: 24, max: 96, step: 1 },
            { key: 'description', label: 'Description', type: 'textarea', default: "Hi, I'm Morning Star..." },
            { key: 'description_text_size_px', label: 'Description Text Size (px)', type: 'range', default: 16, min: 12, max: 36, step: 1 },
            { key: 'author_name', label: 'Owner Name', type: 'text', default: 'Morning Star' },
            { key: 'quote_text', label: 'Founder Quote', type: 'textarea', default: 'For me, every puppy deserves a good home...' },
            { key: 'owner_image', label: 'Owner Image', type: 'image' },
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
