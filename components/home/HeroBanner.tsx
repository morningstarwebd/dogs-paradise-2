'use client';

import { useRef, useState, useEffect, useMemo, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { Star, Heart, Shield, Award, Users, Dog, MapPin, Phone } from 'lucide-react';
import { siteConfig } from '@/data/site-config';
import { BlockInstance } from '@/types/schema.types';
import { getDecorativeBlobStyle, normalizeDecorativeColorValue } from '@/lib/decorative-color';
import { buildSectionStyle, resolveBackgroundStyle, resolveColorToken } from '@/lib/gradient-style';

import { InlineEditable } from '@/components/admin/InlineEditable';

type HeroBannerProps = {
  sectionId?: string;
  isEditorMode?: boolean;
  badge_text?: string;
  badge_bg_color?: string;
  badge_text_color?: string;
  show_badge_stars?: boolean;
  badge_star_count?: number | string;
  badge_star_color?: string;
  badge_text_size_px?: number | string;
  heading_line1?: string;
  heading_line1_color?: string;
  heading_highlight?: string;
  accent_color?: string;
  heading_line2?: string;
  heading_line2_color?: string;
  heading_text_size_px?: number | string;
  description?: string;
  description_text_color?: string;
  description_text_size_px?: number | string;
  slideshow_speed?: number | string;
  show_floating_card?: boolean;
  show_trust_stats?: boolean;
  show_phone_icon?: boolean;
  phone_number?: string;
  phone_icon_color?: string;
  phone_icon_bg_color?: string;
  phone_icon_size_px?: number | string;
  phone_icon_button_size_px?: number | string;
  trust_value_text_color?: string;
  trust_value_text_size_px?: number | string;
  mobile_trust_value_text_size_px?: number | string;
  trust_label_text_color?: string;
  trust_label_text_size_px?: number | string;
  mobile_trust_label_text_size_px?: number | string;
  hero_image_size?: string;
  hero_image_frame_bg_color?: string;
  location_map_link?: string;
  location_title_text?: string;
  location_subtext?: string;
  location_mobile_cta_text?: string;
  location_map_icon_color?: string;
  location_card_bg_color?: string;
  location_text_color?: string;
  location_text_size_px?: number | string;
  blocks?: BlockInstance[];
  hero_image?: string;
  primary_btn_text?: string;
  primary_btn_color?: string;
  secondary_btn_text?: string;
  secondary_btn_color?: string;
  section_bg_color?: string;
  section_text_color?: string;
  decorative_blob_enabled?: boolean;
  decorative_blob_color?: string;
  decorative_blob_size_scale?: number | string;
  decorative_shape_top_offset_x?: number | string;
  decorative_shape_top_offset_y?: number | string;
  decorative_shape_offset_x?: number | string;
  decorative_shape_offset_y?: number | string;
  decorative_outline_enabled?: boolean;
  decorative_outline_color?: string;
  decorative_outline_size_scale?: number | string;
  section_padding_top?: string;
  section_padding_bottom?: string;
  section_margin_top?: string;
  section_margin_bottom?: string;
};

// Icon lookup for stats
const iconMap: Record<string, React.ReactNode> = {
  Users: <Users size={18} />,
  Dog: <Dog size={18} />,
  Award: <Award size={18} />,
  Heart: <Heart size={18} />,
  Star: <Star size={18} />,
  Shield: <Shield size={18} />,
  MapPin: <MapPin size={18} />,
  Phone: <Phone size={18} />,
};

// ─── Default blocks (fallback for legacy content or empty sections) ───
const defaultSlides: BlockInstance[] = [
  { id: 'default-slide-1', type: 'hero_slide', settings: { image: '/images/breeds/golden-retriever.jpg', alt_text: 'Golden Retriever' } },
  { id: 'default-slide-2', type: 'hero_slide', settings: { image: '/images/breeds/toy-poodle.jpg', alt_text: 'Toy Poodle' } },
  { id: 'default-slide-3', type: 'hero_slide', settings: { image: '/images/breeds/shih-tzu.jpg', alt_text: 'Shih Tzu' } },
  { id: 'default-slide-4', type: 'hero_slide', settings: { image: '/images/breeds/husky.jpg', alt_text: 'Husky' } },
  { id: 'default-slide-5', type: 'hero_slide', settings: { image: '/images/breeds/maltipoo.jpg', alt_text: 'Maltipoo' } },
];

const defaultButtons: BlockInstance[] = [
  { id: 'default-btn-1', type: 'hero_button', settings: { text: '🐾 Browse Breeds', url: '/breeds', color: '#ea728c', text_color: '#ffffff', button_size_scale: 1, style: 'filled', open_new_tab: false } },
  { id: 'default-btn-2', type: 'hero_button', settings: { text: '💬 WhatsApp Us', url: `https://wa.me/${siteConfig.whatsappNumber}`, color: 'transparent', text_color: '#ffffff', button_size_scale: 1, style: 'outline', open_new_tab: true } },
];

const defaultStats: BlockInstance[] = [
  { id: 'default-stat-1', type: 'hero_stat', settings: { icon: 'Users', value: '2000+', label: 'Happy Families', color: '#16a34a' } },
  { id: 'default-stat-2', type: 'hero_stat', settings: { icon: 'Dog', value: '25+', label: 'Breeds', color: '#9333ea' } },
  { id: 'default-stat-3', type: 'hero_stat', settings: { icon: 'Award', value: '12+', label: 'Years', color: '#d97706' } },
  { id: 'default-stat-4', type: 'hero_stat', settings: { icon: 'Heart', value: '1500+', label: 'Puppies', color: '#dc2626' } },
];


export default function HeroBanner({
  sectionId,
  isEditorMode,
  // Section-level settings
  badge_text = 'Trusted by 2000+ Families',
  badge_bg_color = '#ffffff',
  badge_text_color = '#ea728c',
  show_badge_stars = false,
  badge_star_count = 5,
  badge_star_color = '#ea728c',
  badge_text_size_px = 14,
  heading_line1 = 'Find Your',
  heading_line1_color,
  heading_highlight = 'Perfect Puppy',
  accent_color = '#ea728c',
  heading_line2 = 'Companion',
  heading_line2_color,
  heading_text_size_px = 56,
  description = 'Healthy, home-raised puppies in Bangalore with 12+ years of trusted experience. Transparent health details, genuine breeder guidance.',
  description_text_color,
  description_text_size_px = 20,
  slideshow_speed = 4000,
  hero_image_size = 'medium',
  hero_image_frame_bg_color = '#ffffff',
  show_floating_card = true,
  location_map_link,
  location_title_text = 'Dogs Paradise Bangalore',
  location_subtext = 'Benson Town',
  location_mobile_cta_text = 'Visit Us',
  location_map_icon_color,
  location_card_bg_color = '#ffffff',
  location_text_color = '#374151',
  location_text_size_px = 12,
  show_trust_stats = true,
  show_phone_icon = true,
  phone_number,
  phone_icon_color,
  phone_icon_bg_color = '#ffffff',
  phone_icon_size_px = 16,
  phone_icon_button_size_px = 44,
  trust_value_text_color,
  trust_value_text_size_px = 20,
  mobile_trust_value_text_size_px,
  trust_label_text_color,
  trust_label_text_size_px = 12,
  mobile_trust_label_text_size_px,
  // Blocks array (Shopify-style)
  blocks,
  // Legacy props fallback
  hero_image,
  primary_btn_text,
  primary_btn_color,
  secondary_btn_text,
  secondary_btn_color,
  section_bg_color,
  section_text_color,
  decorative_blob_enabled = true,
  decorative_blob_color = '#ea728c',
  decorative_blob_size_scale = 1,
  decorative_shape_top_offset_x = 0,
  decorative_shape_top_offset_y = 0,
  decorative_shape_offset_x = 0,
  decorative_shape_offset_y = 0,
  decorative_outline_enabled = true,
  decorative_outline_color = '#f5c842',
  decorative_outline_size_scale = 1,
  section_padding_top,
  section_padding_bottom,
  section_margin_top,
  section_margin_bottom,
}: HeroBannerProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [currentSlide, setCurrentSlide] = useState(0);

  // ─── Parse blocks array (with legacy fallback) ────────────────────
  const allBlocks: BlockInstance[] = useMemo(() => {
    if (Array.isArray(blocks) && blocks.length > 0) return blocks;
    return [];
  }, [blocks]);

  // Extract typed blocks
  const slides = useMemo(() => {
    const fromBlocks = allBlocks.filter(b => b.type === 'hero_slide');
    if (fromBlocks.length > 0) return fromBlocks;
    // Legacy: if hero_image is set, use it as a single slide
    if (hero_image) return [{ id: 'legacy-img', type: 'hero_slide', settings: { image: hero_image, alt_text: 'Dogs Paradise' } }] as BlockInstance[];
    return defaultSlides;
  }, [allBlocks, hero_image]);

  const buttons = useMemo(() => {
    const fromBlocks = allBlocks.filter(b => b.type === 'hero_button');
    if (fromBlocks.length > 0) return fromBlocks;
    // Legacy fallback
    if (primary_btn_text || secondary_btn_text) {
      const legacy: BlockInstance[] = [];
      if (primary_btn_text) legacy.push({ id: 'legacy-btn-1', type: 'hero_button', settings: { text: primary_btn_text, url: '/breeds', color: primary_btn_color || '#ea728c', text_color: '#ffffff', button_size_scale: 1, style: 'filled' } });
      if (secondary_btn_text) legacy.push({ id: 'legacy-btn-2', type: 'hero_button', settings: { text: secondary_btn_text, url: `https://wa.me/${siteConfig.whatsappNumber}`, color: secondary_btn_color || 'transparent', text_color: '#ffffff', button_size_scale: 1, style: 'outline', open_new_tab: true } });
      return legacy;
    }
    return defaultButtons;
  }, [allBlocks, primary_btn_text, primary_btn_color, secondary_btn_text, secondary_btn_color]);

  const stats = useMemo(() => {
    const fromBlocks = allBlocks.filter(b => b.type === 'hero_stat');
    if (fromBlocks.length > 0) return fromBlocks;
    return defaultStats;
  }, [allBlocks]);

  // ─── Slideshow timer ──────────────────────────────────────────────
  const speed = Number(slideshow_speed) || 4000;
  
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, speed);
    return () => clearInterval(timer);
  }, [slides.length, speed]);

  // Current active image
  const activeImage = (slides[currentSlide]?.settings?.image as string) || '/images/breeds/golden-retriever.jpg';
  const activeAlt = (slides[currentSlide]?.settings?.alt_text as string) || 'Dogs Paradise Puppy';

  const sectionStyle: CSSProperties = buildSectionStyle({
    background: section_bg_color,
    text: section_text_color,
    paddingTop: section_padding_top,
    paddingBottom: section_padding_bottom,
    marginTop: section_margin_top,
    marginBottom: section_margin_bottom,
  });
  const sectionTextColor = resolveColorToken(section_text_color, '#FFF0D9') || '#FFF0D9';
  const normalizedHeadingLine1Color = normalizeDecorativeColorValue(heading_line1_color, sectionTextColor);
  const headingLine1Color = resolveColorToken(normalizedHeadingLine1Color, sectionTextColor) || sectionTextColor;
  const normalizedAccentColor = normalizeDecorativeColorValue(accent_color, '#ea728c');
  const accentColor = resolveColorToken(normalizedAccentColor, '#ea728c') || '#ea728c';
  const normalizedHeadingLine2Color = normalizeDecorativeColorValue(heading_line2_color, headingLine1Color);
  const headingLine2Color = resolveColorToken(normalizedHeadingLine2Color, headingLine1Color) || headingLine1Color;
  const normalizedDescriptionTextColor = normalizeDecorativeColorValue(description_text_color, sectionTextColor);
  const descriptionTextColor = resolveColorToken(normalizedDescriptionTextColor, sectionTextColor) || sectionTextColor;
  const normalizedTrustValueTextColor = normalizeDecorativeColorValue(trust_value_text_color, '#1f2937');
  const trustValueTextColor = resolveColorToken(normalizedTrustValueTextColor, '#1f2937') || '#1f2937';
  const normalizedTrustLabelTextColor = normalizeDecorativeColorValue(trust_label_text_color, '#6b7280');
  const trustLabelTextColor = resolveColorToken(normalizedTrustLabelTextColor, '#6b7280') || '#6b7280';
  const normalizedPhoneIconColor = normalizeDecorativeColorValue(phone_icon_color, accentColor);
  const phoneIconColor = resolveColorToken(normalizedPhoneIconColor, accentColor) || accentColor;
  const normalizedLocationMapIconColor = normalizeDecorativeColorValue(location_map_icon_color, accentColor);
  const locationMapIconColor =
    resolveColorToken(normalizedLocationMapIconColor, accentColor) || accentColor;
  const resolvedLocationMapLink =
    typeof location_map_link === 'string' && location_map_link.trim().length > 0
      ? location_map_link.trim()
      : siteConfig.googleMapsUrl;
  const locationTitleText =
    typeof location_title_text === 'string' ? location_title_text.trim() : '';
  const locationSubtext =
    typeof location_subtext === 'string' ? location_subtext.trim() : '';
  const locationMobileCtaText =
    typeof location_mobile_cta_text === 'string' ? location_mobile_cta_text.trim() : '';
  const normalizedLocationCardBackground = normalizeDecorativeColorValue(location_card_bg_color, '#ffffff');
  const resolvedLocationCardBackground =
    resolveColorToken(normalizedLocationCardBackground, '#ffffff') || '#ffffff';
  const locationCardBackgroundStyle: CSSProperties = {
    ...resolveBackgroundStyle(normalizedLocationCardBackground, resolvedLocationCardBackground),
    borderColor: resolvedLocationCardBackground,
  };
  const normalizedLocationTextColor = normalizeDecorativeColorValue(location_text_color, '#374151');
  const locationTextColor = resolveColorToken(normalizedLocationTextColor, '#374151') || '#374151';
  const parsedLocationTextSize =
    typeof location_text_size_px === 'number' ? location_text_size_px : Number(location_text_size_px);
  const locationTextSize = Math.min(24, Math.max(10, Number.isFinite(parsedLocationTextSize) ? parsedLocationTextSize : 12));
  const locationTitleTextSize = locationTextSize;
  const normalizedPhoneIconBackground = normalizeDecorativeColorValue(phone_icon_bg_color, '#ffffff');
  const phoneIconBackgroundStyle = resolveBackgroundStyle(normalizedPhoneIconBackground, '#ffffff');
  const effectivePhoneNumber = typeof phone_number === 'string' && phone_number.trim().length > 0
    ? phone_number
    : siteConfig.phone;
  const sanitizedPhoneNumber = effectivePhoneNumber.replace(/[^\d+]/g, '');
  const shouldShowPhoneIcon = show_phone_icon !== false && sanitizedPhoneNumber.length > 0;
  const normalizedBadgeBackground = normalizeDecorativeColorValue(badge_bg_color, '#ffffff');
  const badgeBackgroundStyle = resolveBackgroundStyle(normalizedBadgeBackground, '#ffffff');
  const normalizedBadgeTextColor = normalizeDecorativeColorValue(badge_text_color, accentColor);
  const badgeTextColor = resolveColorToken(normalizedBadgeTextColor, accentColor) || accentColor;
  const normalizedBadgeStarColor = normalizeDecorativeColorValue(badge_star_color, accentColor);
  const badgeStarColor = resolveColorToken(normalizedBadgeStarColor, accentColor) || accentColor;
  const normalizedDecorativeOutlineColor = normalizeDecorativeColorValue(decorative_outline_color, '#f5c842');
  const decorativeOutlineColor = resolveColorToken(normalizedDecorativeOutlineColor, '#f5c842') || '#f5c842';

  const parsedBlobScale =
    typeof decorative_blob_size_scale === 'number'
      ? decorative_blob_size_scale
      : Number(decorative_blob_size_scale);
  const blobScaleRaw = Number.isFinite(parsedBlobScale) && parsedBlobScale > 0 ? parsedBlobScale : 1;
  const blobScale = Math.min(2.5, Math.max(0.5, blobScaleRaw));

  const parsedTopShapeOffsetX =
    typeof decorative_shape_top_offset_x === 'number'
      ? decorative_shape_top_offset_x
      : Number(decorative_shape_top_offset_x);
  const parsedTopShapeOffsetY =
    typeof decorative_shape_top_offset_y === 'number'
      ? decorative_shape_top_offset_y
      : Number(decorative_shape_top_offset_y);
  const parsedLegacyShapeOffsetX =
    typeof decorative_shape_offset_x === 'number'
      ? decorative_shape_offset_x
      : Number(decorative_shape_offset_x);
  const parsedLegacyShapeOffsetY =
    typeof decorative_shape_offset_y === 'number'
      ? decorative_shape_offset_y
      : Number(decorative_shape_offset_y);
  const topShapeOffsetXRaw = Number.isFinite(parsedTopShapeOffsetX)
    ? parsedTopShapeOffsetX
    : Number.isFinite(parsedLegacyShapeOffsetX)
      ? parsedLegacyShapeOffsetX
      : 0;
  const topShapeOffsetYRaw = Number.isFinite(parsedTopShapeOffsetY)
    ? parsedTopShapeOffsetY
    : Number.isFinite(parsedLegacyShapeOffsetY)
      ? parsedLegacyShapeOffsetY
      : 0;
  const topShapeOffsetX = Math.min(200, Math.max(-200, topShapeOffsetXRaw));
  const topShapeOffsetY = Math.min(200, Math.max(-200, topShapeOffsetYRaw));

  const parsedOutlineScale =
    typeof decorative_outline_size_scale === 'number'
      ? decorative_outline_size_scale
      : Number(decorative_outline_size_scale);
  const outlineScaleRaw = Number.isFinite(parsedOutlineScale) && parsedOutlineScale > 0 ? parsedOutlineScale : 1;
  const outlineScale = Math.min(2.5, Math.max(0.5, outlineScaleRaw));

  const parsedBadgeTextSize =
    typeof badge_text_size_px === 'number'
      ? badge_text_size_px
      : Number(badge_text_size_px);
  const badgeTextSizeDesktop = Math.min(32, Math.max(10, Number.isFinite(parsedBadgeTextSize) ? parsedBadgeTextSize : 14));
  const badgeTextSizeMobile = Math.min(24, Math.max(10, Math.round(badgeTextSizeDesktop * 0.8)));
  const parsedBadgeStarCount =
    typeof badge_star_count === 'number'
      ? badge_star_count
      : Number(badge_star_count);
  const badgeStarCount = Math.min(10, Math.max(0, Number.isFinite(parsedBadgeStarCount) ? Math.round(parsedBadgeStarCount) : 5));
  const shouldShowBadgeStars = show_badge_stars !== false && badgeStarCount > 0;
  const badgeStars = Array.from({ length: badgeStarCount });

  const parsedHeadingTextSize =
    typeof heading_text_size_px === 'number'
      ? heading_text_size_px
      : Number(heading_text_size_px);
  const headingTextSizeDesktop = Math.min(96, Math.max(24, Number.isFinite(parsedHeadingTextSize) ? parsedHeadingTextSize : 56));
  const headingTextSizeMobile = Math.min(64, Math.max(24, Math.round(headingTextSizeDesktop * 0.62)));

  const parsedDescriptionTextSize =
    typeof description_text_size_px === 'number'
      ? description_text_size_px
      : Number(description_text_size_px);
  const descriptionTextSizeDesktop = Math.min(36, Math.max(12, Number.isFinite(parsedDescriptionTextSize) ? parsedDescriptionTextSize : 20));
  const descriptionTextSizeMobile = Math.min(24, Math.max(12, Math.round(descriptionTextSizeDesktop * 0.75)));

  const parsedTrustValueTextSize =
    typeof trust_value_text_size_px === 'number'
      ? trust_value_text_size_px
      : Number(trust_value_text_size_px);
  const trustValueTextSizeDesktop = Math.min(36, Math.max(12, Number.isFinite(parsedTrustValueTextSize) ? parsedTrustValueTextSize : 20));
  const parsedMobileTrustValueTextSize =
    typeof mobile_trust_value_text_size_px === 'number'
      ? mobile_trust_value_text_size_px
      : Number(mobile_trust_value_text_size_px);
  const trustValueTextSizeMobile = Math.min(
    24,
    Math.max(
      10,
      Number.isFinite(parsedMobileTrustValueTextSize)
        ? parsedMobileTrustValueTextSize
        : Math.round(trustValueTextSizeDesktop * 0.7),
    ),
  );

  const parsedTrustLabelTextSize =
    typeof trust_label_text_size_px === 'number'
      ? trust_label_text_size_px
      : Number(trust_label_text_size_px);
  const trustLabelTextSizeDesktop = Math.min(24, Math.max(8, Number.isFinite(parsedTrustLabelTextSize) ? parsedTrustLabelTextSize : 12));
  const parsedMobileTrustLabelTextSize =
    typeof mobile_trust_label_text_size_px === 'number'
      ? mobile_trust_label_text_size_px
      : Number(mobile_trust_label_text_size_px);
  const trustLabelTextSizeMobile = Math.min(
    16,
    Math.max(
      7,
      Number.isFinite(parsedMobileTrustLabelTextSize)
        ? parsedMobileTrustLabelTextSize
        : Math.round(trustLabelTextSizeDesktop * 0.67),
    ),
  );
  const parsedPhoneIconSize =
    typeof phone_icon_size_px === 'number'
      ? phone_icon_size_px
      : Number(phone_icon_size_px);
  const phoneIconSize = Math.min(30, Math.max(12, Number.isFinite(parsedPhoneIconSize) ? parsedPhoneIconSize : 16));
  const parsedPhoneIconButtonSize =
    typeof phone_icon_button_size_px === 'number'
      ? phone_icon_button_size_px
      : Number(phone_icon_button_size_px);
  const phoneIconButtonSize = Math.min(72, Math.max(36, Number.isFinite(parsedPhoneIconButtonSize) ? parsedPhoneIconButtonSize : 44));

  const getTrustStatConfig = (stat: BlockInstance | undefined) => {
    const settings = (stat?.settings || {}) as Record<string, unknown>;

    const rawCardBackground = typeof settings.card_bg_color === 'string' ? settings.card_bg_color.trim() : '';
    const normalizedCardBackground = normalizeDecorativeColorValue(rawCardBackground, '#ffffff');
    const cardBackgroundStyle = resolveBackgroundStyle(normalizedCardBackground, '#ffffff');

    const valueTextSizeDesktop = trustValueTextSizeDesktop;
    const valueTextSizeMobile = trustValueTextSizeMobile;
    const labelTextSizeDesktop = trustLabelTextSizeDesktop;
    const labelTextSizeMobile = trustLabelTextSizeMobile;

    const rawValueTextColor = typeof settings.value_text_color === 'string' ? settings.value_text_color.trim() : '';
    const normalizedValueTextColor = normalizeDecorativeColorValue(rawValueTextColor, trustValueTextColor);
    const valueTextColor = resolveColorToken(normalizedValueTextColor, trustValueTextColor) || trustValueTextColor;

    const rawLabelTextColor = typeof settings.label_text_color === 'string' ? settings.label_text_color.trim() : '';
    const normalizedLabelTextColor = normalizeDecorativeColorValue(rawLabelTextColor, trustLabelTextColor);
    const labelTextColor = resolveColorToken(normalizedLabelTextColor, trustLabelTextColor) || trustLabelTextColor;

    return {
      cardBackgroundStyle,
      valueTextSizeDesktop,
      valueTextSizeMobile,
      labelTextSizeDesktop,
      labelTextSizeMobile,
      valueTextColor,
      labelTextColor,
    };
  };

  const mobileTopStat = stats[0];
  const mobileRightStat = stats[1];
  const mobileBottomStat = stats[2];
  const mobileTopStatConfig = getTrustStatConfig(mobileTopStat);
  const mobileRightStatConfig = getTrustStatConfig(mobileRightStat);
  const mobileBottomStatConfig = getTrustStatConfig(mobileBottomStat);

  const normalizedHeroImageSize =
    typeof hero_image_size === 'string' ? hero_image_size.toLowerCase().trim() : 'medium';
  const heroImageSize: 'large' | 'medium' | 'small' =
    normalizedHeroImageSize === 'large' || normalizedHeroImageSize === 'small'
      ? normalizedHeroImageSize
      : 'medium';
  const rawHeroImageFrameColor =
    typeof hero_image_frame_bg_color === 'string' ? hero_image_frame_bg_color.trim() : '';
  const normalizedHeroImageFrameColor = normalizeDecorativeColorValue(rawHeroImageFrameColor, '#ffffff');
  const resolvedHeroImageFrameColor =
    resolveColorToken(normalizedHeroImageFrameColor, '#ffffff') || '#ffffff';
  const heroImageFrameStyle: CSSProperties = {
    ...resolveBackgroundStyle(normalizedHeroImageFrameColor, resolvedHeroImageFrameColor),
    borderColor: resolvedHeroImageFrameColor,
  };
  const desktopImageSizeClass =
    heroImageSize === 'large'
      ? 'w-full max-w-[620px] h-[620px] xl:h-[700px]'
      : heroImageSize === 'small'
        ? 'w-[380px] h-[470px] xl:w-[420px] xl:h-[520px]'
        : 'w-[450px] h-[550px] xl:w-[500px] xl:h-[600px]';
  const mobileImageWrapperClass =
    heroImageSize === 'large'
      ? 'w-full max-w-[360px]'
      : heroImageSize === 'small'
        ? 'w-[62vw] max-w-[220px]'
        : 'w-[74vw] max-w-[270px]';
  const mobileImageFrameClass = 'w-full aspect-[4/5]';
  const mobileTopLeftStatClass =
    heroImageSize === 'large'
      ? 'absolute left-2 top-5 sm:left-4 sm:top-7 bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-lg flex items-center gap-1.5 border border-white z-20 animate-[float_6s_ease-in-out_infinite] max-w-[116px]'
      : heroImageSize === 'small'
        ? 'absolute left-1 top-5 sm:left-2 sm:top-6 bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-lg flex items-center gap-1.5 border border-white z-20 animate-[float_6s_ease-in-out_infinite] max-w-[116px]'
        : 'absolute left-1 top-7 sm:left-3 sm:top-8 bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-lg flex items-center gap-1.5 border border-white z-20 animate-[float_6s_ease-in-out_infinite] max-w-[116px]';
  const mobileRightStatClass =
    heroImageSize === 'large'
      ? 'absolute right-2 top-[36%] sm:right-4 sm:top-[35%] bg-white/95 backdrop-blur-sm rounded-2xl h-12 min-w-[56px] max-w-[86px] px-2 shadow-lg flex flex-col items-center justify-center border border-white z-20 animate-[float_8s_ease-in-out_infinite_reverse] overflow-hidden'
      : heroImageSize === 'small'
        ? 'absolute right-1 top-[34%] sm:right-2 sm:top-[35%] bg-white/95 backdrop-blur-sm rounded-2xl h-12 min-w-[56px] max-w-[86px] px-2 shadow-lg flex flex-col items-center justify-center border border-white z-20 animate-[float_8s_ease-in-out_infinite_reverse] overflow-hidden'
        : 'absolute right-1 top-[35%] sm:right-3 sm:top-[35%] bg-white/95 backdrop-blur-sm rounded-2xl h-12 min-w-[56px] max-w-[86px] px-2 shadow-lg flex flex-col items-center justify-center border border-white z-20 animate-[float_8s_ease-in-out_infinite_reverse] overflow-hidden';
  const mobileBottomLeftStatClass =
    heroImageSize === 'large'
      ? 'absolute left-2 bottom-6 sm:left-4 sm:bottom-8 bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-lg flex items-center gap-1.5 border border-white z-20 animate-[float_7s_ease-in-out_infinite] max-w-[116px]'
      : heroImageSize === 'small'
        ? 'absolute left-1 bottom-5 sm:left-2 sm:bottom-6 bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-lg flex items-center gap-1.5 border border-white z-20 animate-[float_7s_ease-in-out_infinite] max-w-[116px]'
        : 'absolute left-1 bottom-7 sm:left-3 sm:bottom-8 bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-lg flex items-center gap-1.5 border border-white z-20 animate-[float_7s_ease-in-out_infinite] max-w-[116px]';
  const mobileVisitUsClass =
    heroImageSize === 'large'
      ? 'absolute bottom-2 right-2 sm:bottom-3 sm:right-4 bg-white rounded-2xl px-4 py-2 flex items-center gap-1.5 shadow-xl border border-gray-100 z-20 active:scale-95 transition-transform'
      : 'absolute bottom-1 right-1 sm:bottom-2 sm:right-3 bg-white rounded-2xl px-4 py-2 flex items-center gap-1.5 shadow-xl border border-gray-100 z-20 active:scale-95 transition-transform';

  return (
    <section ref={ref} className="relative overflow-hidden" aria-label="Hero Section" style={sectionStyle}>
      {/* Background Decorative Blobs */}
      {(decorative_blob_enabled || decorative_outline_enabled) && (
        <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
          {decorative_blob_enabled && (
            <div
              className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-[500px] md:h-[500px] rounded-full rounded-bl-[80px] sm:rounded-bl-[100px] md:rounded-bl-[200px]"
              style={{
                ...getDecorativeBlobStyle(decorative_blob_color, '#ea728c'),
                transform: `translate(${topShapeOffsetX}px, ${topShapeOffsetY}px) scale(${blobScale})`,
                transformOrigin: 'top right',
              }}
            />
          )}

          {decorative_outline_enabled && (
            <div
              className="absolute -top-8 -right-8 sm:-top-[16px] sm:-right-[16px] md:-top-[25px] md:-right-[25px] w-[208px] h-[208px] sm:w-[288px] sm:h-[288px] md:w-[550px] md:h-[550px] border-[3px] sm:border-[4px] rounded-full rounded-bl-[80px] sm:rounded-bl-[100px] md:rounded-bl-[200px] opacity-80"
              style={{
                borderColor: decorativeOutlineColor,
                transform: `translate(${topShapeOffsetX}px, ${topShapeOffsetY}px) scale(${outlineScale})`,
                transformOrigin: 'top right',
              }}
            />
          )}
        </div>
      )}

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ━━━ Desktop Layout ━━━ */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center py-16 xl:py-20">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 mb-6 shadow-sm border border-white"
              style={badgeBackgroundStyle}
            >
              {shouldShowBadgeStars && (
                <div className="flex">
                  {badgeStars.map((_, i) => (
                    <Star key={i} size={16} fill={badgeStarColor} color={badgeStarColor} />
                  ))}
                </div>
              )}
              <InlineEditable 
                isEditorMode={isEditorMode} sectionId={sectionId} propKey="badge_text" value={badge_text}
                className="font-bold"
                style={{ color: badgeTextColor, fontSize: `${badgeTextSizeDesktop}px`, lineHeight: 1.2, opacity: 0.9 }}
              >
                {badge_text}
              </InlineEditable>
            </motion.div>

            <h1 
              className="font-display font-bold leading-tight mb-6"
              style={{ fontSize: `${headingTextSizeDesktop}px`, lineHeight: 1.1 }}
            >
              <InlineEditable
                isEditorMode={isEditorMode}
                sectionId={sectionId}
                propKey="heading_line1"
                value={heading_line1}
                style={{ color: headingLine1Color }}
              >
                {heading_line1}
              </InlineEditable>{' '}
              <InlineEditable 
                isEditorMode={isEditorMode} sectionId={sectionId} propKey="heading_highlight" value={heading_highlight}
                style={{ color: accentColor }}
              >
                {heading_highlight}
              </InlineEditable>
              {' '}
              <InlineEditable
                isEditorMode={isEditorMode}
                sectionId={sectionId}
                propKey="heading_line2"
                value={heading_line2}
                style={{ color: headingLine2Color }}
              >
                {heading_line2}
              </InlineEditable>
            </h1>

            <InlineEditable 
              isEditorMode={isEditorMode} sectionId={sectionId} propKey="description" value={description} editType="textarea"
              as="p"
              className="leading-relaxed mb-8 max-w-lg font-medium"
              style={{ color: descriptionTextColor, opacity: 0.9, fontSize: `${descriptionTextSizeDesktop}px` }}
            >
              {description}
            </InlineEditable>

            {/* CTA Buttons — driven by blocks */}
            <div className="flex flex-wrap gap-4 mb-12">
              {buttons.map((btn, idx) => {
                const s = btn.settings;
                const rawColor = typeof s.color === 'string' ? s.color.trim() : '';
                const color = rawColor || '#ea728c';
                const isOutline = s.style === 'outline' || color.toLowerCase() === 'transparent';
                const normalizedButtonColor = normalizeDecorativeColorValue(color, '#ea728c');
                const resolvedButtonColor = resolveColorToken(normalizedButtonColor, '#ea728c') || '#ea728c';
                const buttonBackgroundStyle = isOutline
                  ? { backgroundColor: 'transparent' as const }
                  : resolveBackgroundStyle(normalizedButtonColor, resolvedButtonColor);
                const url = (s.url as string) || '#';
                const text = (s.text as string) || 'Click';
                const newTab = s.open_new_tab;
                const normalizedTextSize = typeof s.text_size === 'string' ? s.text_size.toLowerCase().trim() : 'medium';
                const desktopTextSizeClass =
                  normalizedTextSize === 'large'
                    ? 'text-lg'
                    : normalizedTextSize === 'small'
                      ? 'text-sm'
                      : 'text-base';
                const rawTextColor = typeof s.text_color === 'string' ? s.text_color.trim() : '';
                const normalizedButtonTextColor = normalizeDecorativeColorValue(rawTextColor, '#ffffff');
                const resolvedButtonTextColor = resolveColorToken(normalizedButtonTextColor, '#ffffff') || '#ffffff';
                const parsedButtonSizeScale =
                  typeof s.button_size_scale === 'number'
                    ? s.button_size_scale
                    : Number(s.button_size_scale);
                const buttonSizeScale = Math.min(1.6, Math.max(0.7, Number.isFinite(parsedButtonSizeScale) ? parsedButtonSizeScale : 1));
                const desktopPaddingX = `${Math.round(32 * buttonSizeScale)}px`;
                const desktopPaddingY = `${Math.round(16 * buttonSizeScale)}px`;

                const btnEl = (
                  <InlineEditable
                    key={btn.id}
                    isEditorMode={isEditorMode}
                    editType="button"
                    sectionId={sectionId}
                    propKey={`block:${btn.id}:text`}
                    blockId={btn.id}
                    blockIndex={idx}
                    value={text}
                  >
                    {text}
                  </InlineEditable>
                );

                if (newTab || url.startsWith('http')) {
                  return (
                    <a
                      key={btn.id}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        ...buttonBackgroundStyle,
                        borderColor: isOutline ? 'rgba(255,255,255,0.4)' : resolvedButtonColor,
                        color: resolvedButtonTextColor,
                        paddingInline: desktopPaddingX,
                        paddingBlock: desktopPaddingY,
                      }}
                      className={`inline-flex items-center gap-2 ${desktopTextSizeClass} font-bold rounded-2xl transition-transform duration-300 hover:-translate-y-1 ${isOutline ? 'border-2 backdrop-blur hover:bg-white/10' : ''}`}
                    >
                      {btnEl}
                    </a>
                  );
                }

                return (
                  <Link
                    key={btn.id}
                    href={url}
                    style={{
                      ...buttonBackgroundStyle,
                      borderColor: isOutline ? 'rgba(255,255,255,0.4)' : resolvedButtonColor,
                      color: resolvedButtonTextColor,
                      paddingInline: desktopPaddingX,
                      paddingBlock: desktopPaddingY,
                    }}
                    className={`inline-flex items-center gap-2 ${desktopTextSizeClass} font-bold rounded-2xl transition-transform duration-300 hover:-translate-y-1 ${isOutline ? 'border-2 backdrop-blur hover:bg-white/10' : ''}`}
                  >
                    {btnEl}
                  </Link>
                );
              })}
              {shouldShowPhoneIcon && (
                <a
                  href={`tel:${sanitizedPhoneNumber}`}
                  className="inline-flex shrink-0 items-center justify-center rounded-2xl shadow-sm border border-gray-100 transition-transform duration-300 hover:-translate-y-1"
                  style={{
                    ...phoneIconBackgroundStyle,
                    color: phoneIconColor,
                    width: `${phoneIconButtonSize}px`,
                    height: `${phoneIconButtonSize}px`,
                  }}
                  aria-label="Call"
                >
                  <Phone size={phoneIconSize} />
                </a>
              )}
            </div>

            {/* Inline Stats — driven by blocks */}
            {show_trust_stats !== false && stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className={`grid gap-4 auto-rows-fr items-stretch`}
                style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, minmax(0, 1fr))` }}
              >
                {stats.map((stat, idx) => {
                  const s = stat.settings;
                  const rawColor = typeof s.color === 'string' ? s.color.trim() : '';
                  const normalizedStatColor = normalizeDecorativeColorValue(rawColor, '#16a34a');
                  const color = resolveColorToken(normalizedStatColor, '#16a34a') || '#16a34a';
                  const icon = iconMap[(s.icon as string)] || <Users size={18} />;
                  const value = (s.value as string) || '—';
                  const label = (s.label as string) || 'Stat';
                  const statConfig = getTrustStatConfig(stat);

                  return (
                    <InlineEditable
                      key={stat.id}
                      isEditorMode={isEditorMode}
                      sectionId={sectionId}
                      propKey={`block:${stat.id}:value`}
                      blockId={stat.id}
                      blockIndex={idx}
                      value={value}
                      as="div"
                      className="h-full w-full"
                      containerMode
                    >
                      <div
                        className="flex h-[132px] w-full min-w-0 flex-col items-center justify-center overflow-hidden rounded-2xl border border-white bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
                        style={statConfig.cardBackgroundStyle}
                      >
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-2" style={{ backgroundColor: `${color}15`, color }}>
                          {icon}
                        </div>
                        <span className="block w-full max-w-full truncate whitespace-nowrap text-center font-bold text-gray-800" style={{ color: statConfig.valueTextColor, fontSize: `${statConfig.valueTextSizeDesktop}px`, lineHeight: 1.1 }}>{value}</span>
                        <span className="block w-full max-w-full truncate whitespace-nowrap text-center font-bold uppercase tracking-wider text-gray-600" style={{ color: statConfig.labelTextColor, fontSize: `${statConfig.labelTextSizeDesktop}px`, lineHeight: 1.1 }}>{label}</span>
                      </div>
                    </InlineEditable>
                  );
                })}
              </motion.div>
            )}
          </motion.div>

          {/* Right: Hero Image(s) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="relative flex justify-center items-center"
          >
            {/* Soft Square Wrapper */}
            <motion.div
              className={`relative rounded-3xl ${desktopImageSizeClass} overflow-hidden shadow-2xl border-8`}
              style={heroImageFrameStyle}
            >
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  <InlineEditable 
                     isEditorMode={isEditorMode} 
                     editType="image" 
                     sectionId={sectionId} 
                     propKey={`block:${slides[currentSlide]?.id}:image`}
                     blockId={slides[currentSlide]?.id}
                     blockIndex={currentSlide}
                     value={activeImage}
                     className="w-full h-full"
                  >
                     <Image
                       src={activeImage}
                       alt={activeAlt}
                       fill
                       className="object-cover"
                       priority={true}
                       sizes="(max-width: 1024px) 100vw, 50vw"
                       quality={90}
                     />
                  </InlineEditable>
                </motion.div>
              </AnimatePresence>

              {/* Slide indicators */}
              {slides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'scale-125' : 'bg-black/60 hover:bg-black/80'}`}
                      style={idx === currentSlide ? { backgroundColor: accentColor } : undefined}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Floating info card */}
            {show_floating_card !== false && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -bottom-6 left-12 bg-white rounded-2xl p-4 shadow-xl border border-white z-20 hover:-translate-y-1 transition-transform cursor-pointer"
                style={locationCardBackgroundStyle}
              >
                <a href={resolvedLocationMapLink} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-1">
                  {locationTitleText && (
                    <h3 className="font-bold" style={{ color: locationTextColor, fontSize: `${locationTitleTextSize}px`, lineHeight: 1.1 }}>{locationTitleText}</h3>
                  )}
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} style={{ color: locationMapIconColor }} />
                    {locationSubtext && (
                      <span className="font-semibold" style={{ color: locationTextColor, fontSize: `${locationTextSize}px`, lineHeight: 1.1, opacity: 0.9 }}>{locationSubtext}</span>
                    )}
                  </div>
                </a>
              </motion.div>
            )}

          </motion.div>
        </div>

        {/* ━━━ Mobile Layout ━━━ */}
        <div className="lg:hidden pt-4 pb-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="flex justify-center mb-4"
          >
            <div
              className="inline-flex items-center gap-1.5 rounded-2xl px-3 py-1.5 shadow-sm border border-white/50"
              style={badgeBackgroundStyle}
            >
              {shouldShowBadgeStars && (
                <div className="flex">
                  {badgeStars.map((_, i) => (
                    <Star key={i} size={11} fill={badgeStarColor} color={badgeStarColor} />
                  ))}
                </div>
              )}
              <span
                className="font-bold"
                style={{ color: badgeTextColor, fontSize: `${badgeTextSizeMobile}px`, lineHeight: 1.2 }}
              >
                {badge_text}
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="font-display font-bold leading-[1.15] text-center mb-2"
            style={{ fontSize: `${headingTextSizeMobile}px` }}
          >
            <span style={{ color: headingLine1Color }}>{heading_line1}</span>{' '}
            <span style={{ color: accentColor }}>{heading_highlight}</span>
            {heading_line2 ? (
              <>
                {' '}
                <span style={{ color: headingLine2Color }}>{heading_line2}</span>
              </>
            ) : null}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="leading-relaxed font-medium text-center mb-5 max-w-[260px] mx-auto"
            style={{ color: descriptionTextColor, opacity: 0.8, fontSize: `${descriptionTextSizeMobile}px` }}
          >
            {description}
          </motion.p>

          {/* Mobile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            className={`relative mx-auto ${mobileImageWrapperClass} mb-8 mt-6`}
          >
            <motion.div
              className={`relative rounded-3xl ${mobileImageFrameClass} mx-auto overflow-hidden shadow-2xl border-[5px]`}
              style={heroImageFrameStyle}
            >
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeImage}
                    alt={activeAlt}
                    fill
                    className="object-cover"
                    priority={true}
                    sizes="(max-width: 768px) 80vw, 50vw"
                    quality={85}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Floating Stats on mobile (first 3) */}
            {show_trust_stats !== false && stats.length > 0 && (
              <>
                {/* Top Left */}
                {mobileTopStat && (
                  <div className={mobileTopLeftStatClass} style={mobileTopStatConfig.cardBackgroundStyle}>
                    <div
                      className="scale-75"
                      style={{
                        color:
                          resolveColorToken(
                            normalizeDecorativeColorValue(
                              typeof mobileTopStat.settings?.color === 'string' ? mobileTopStat.settings?.color : undefined,
                              '#16a34a',
                            ),
                            '#16a34a',
                          ) || '#16a34a',
                      }}
                    >
                      {iconMap[(mobileTopStat.settings?.icon as string)] || <Users size={18} />}
                    </div>
                    <span className="font-black text-gray-800 pr-1 max-w-[72px] truncate" style={{ color: mobileTopStatConfig.valueTextColor, fontSize: `${mobileTopStatConfig.valueTextSizeMobile}px`, lineHeight: 1.1 }}>{(mobileTopStat.settings?.value as string) || '2000+'}</span>
                  </div>
                )}

                {/* Right Middle */}
                {mobileRightStat && (
                  <div className={mobileRightStatClass} style={mobileRightStatConfig.cardBackgroundStyle}>
                    <span
                      className="font-black leading-none max-w-full truncate text-center"
                      style={{
                        color: mobileRightStatConfig.valueTextColor,
                        fontSize: `${mobileRightStatConfig.valueTextSizeMobile}px`,
                      }}
                    >
                      {(mobileRightStat.settings?.value as string) || '25+'}
                    </span>
                    <span className="font-bold text-gray-500 uppercase leading-none mt-0.5 max-w-full truncate text-center" style={{ color: mobileRightStatConfig.labelTextColor, fontSize: `${mobileRightStatConfig.labelTextSizeMobile}px` }}>{(mobileRightStat.settings?.label as string) || 'Breeds'}</span>
                  </div>
                )}

                {/* Bottom Left */}
                {mobileBottomStat && (
                  <div className={mobileBottomLeftStatClass} style={mobileBottomStatConfig.cardBackgroundStyle}>
                    <div
                      className="scale-75"
                      style={{
                        color:
                          resolveColorToken(
                            normalizeDecorativeColorValue(
                              typeof mobileBottomStat.settings?.color === 'string' ? mobileBottomStat.settings?.color : undefined,
                              '#d97706',
                            ),
                            '#d97706',
                          ) || '#d97706',
                      }}
                    >
                      {iconMap[(mobileBottomStat.settings?.icon as string)] || <Award size={18} />}
                    </div>
                    <span className="font-black text-gray-800 pr-1 max-w-[72px] truncate" style={{ color: mobileBottomStatConfig.valueTextColor, fontSize: `${mobileBottomStatConfig.valueTextSizeMobile}px`, lineHeight: 1.1 }}>{(mobileBottomStat.settings?.value as string) || '12+'}</span>
                  </div>
                )}
              </>
            )}

            {show_floating_card !== false && (
              <a
                href={resolvedLocationMapLink}
                target="_blank"
                rel="noopener noreferrer"
                className={mobileVisitUsClass}
                style={locationCardBackgroundStyle}
              >
                <MapPin size={13} style={{ color: locationMapIconColor }} />
                {locationMobileCtaText && (
                  <span className="font-bold" style={{ color: locationTextColor, fontSize: `${locationTextSize}px`, lineHeight: 1.1 }}>{locationMobileCtaText}</span>
                )}
              </a>
            )}
          </motion.div>

          {/* Mobile CTA Buttons — driven by blocks */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="flex flex-wrap gap-2 justify-center mb-4 px-2 max-w-[350px] mx-auto"
          >
            {buttons.map((btn) => {
              const s = btn.settings;
              const rawColor = typeof s.color === 'string' ? s.color.trim() : '';
              const color = rawColor || '#ea728c';
              const isOutline = s.style === 'outline' || color.toLowerCase() === 'transparent';
              const normalizedButtonColor = normalizeDecorativeColorValue(color, '#ea728c');
              const resolvedButtonColor = resolveColorToken(normalizedButtonColor, '#ea728c') || '#ea728c';
              const buttonBackgroundStyle = isOutline
                ? { backgroundColor: 'transparent' as const }
                : resolveBackgroundStyle(normalizedButtonColor, resolvedButtonColor);
              const url = (s.url as string) || '#';
              const text = (s.text as string) || 'Click';
              const newTab = s.open_new_tab;
              const normalizedTextSize = typeof s.text_size === 'string' ? s.text_size.toLowerCase().trim() : 'medium';
              const mobileTextSizeClass =
                normalizedTextSize === 'large'
                  ? 'text-[13px]'
                  : normalizedTextSize === 'small'
                    ? 'text-[11px]'
                    : 'text-[12px]';
              const rawTextColor = typeof s.text_color === 'string' ? s.text_color.trim() : '';
              const normalizedButtonTextColor = normalizeDecorativeColorValue(rawTextColor, '#ffffff');
              const resolvedButtonTextColor = resolveColorToken(normalizedButtonTextColor, '#ffffff') || '#ffffff';
              const parsedButtonSizeScale =
                typeof s.button_size_scale === 'number'
                  ? s.button_size_scale
                  : Number(s.button_size_scale);
              const buttonSizeScale = Math.min(1.6, Math.max(0.7, Number.isFinite(parsedButtonSizeScale) ? parsedButtonSizeScale : 1));
              const mobilePaddingX = `${Math.round(10 * buttonSizeScale)}px`;
              const mobilePaddingY = `${Math.round(12 * buttonSizeScale)}px`;

              const commonClass = `flex-1 inline-flex items-center justify-center gap-1.5 ${mobileTextSizeClass} whitespace-nowrap font-bold rounded-2xl active:scale-95 transition-all shadow-sm ${isOutline ? 'border-2 backdrop-blur' : ''}`;

              if (newTab || url.startsWith('http')) {
                return (
                  <a
                    key={btn.id}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      ...buttonBackgroundStyle,
                      borderColor: isOutline ? 'rgba(255,255,255,0.4)' : resolvedButtonColor,
                      color: resolvedButtonTextColor,
                      paddingInline: mobilePaddingX,
                      paddingBlock: mobilePaddingY,
                    }}
                    className={commonClass}
                  >
                    {text}
                  </a>
                );
              }

              return (
                <Link
                  key={btn.id}
                  href={url}
                  style={{
                    ...buttonBackgroundStyle,
                    borderColor: isOutline ? 'rgba(255,255,255,0.4)' : resolvedButtonColor,
                    color: resolvedButtonTextColor,
                    paddingInline: mobilePaddingX,
                    paddingBlock: mobilePaddingY,
                  }}
                  className={commonClass}
                >
                  {text}
                </Link>
              );
            })}
            {shouldShowPhoneIcon && (
              <a
                href={`tel:${sanitizedPhoneNumber}`}
                className="inline-flex shrink-0 items-center justify-center rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-all"
                style={{
                  ...phoneIconBackgroundStyle,
                  color: phoneIconColor,
                  width: `${phoneIconButtonSize}px`,
                  height: `${phoneIconButtonSize}px`,
                }}
                aria-label="Call"
              >
                <Phone size={phoneIconSize} />
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
