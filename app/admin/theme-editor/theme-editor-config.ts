import type React from 'react';
import {
  Home,
  Package,
  BookOpen,
  FileText,
  Users,
  Phone,
  Settings,
  Palette,
  Layout,
  Image as ImageIcon,
  ListChecks,
} from 'lucide-react';

export const DESKTOP_ONLY_FIELD_KEYS = new Set([
  'decorative_blob_enabled',
  'decorative_blob_color',
  'decorative_blob_size_scale',
  'decorative_shape_top_offset_x',
  'decorative_shape_top_offset_y',
  'decorative_shape_bottom_offset_x',
  'decorative_shape_bottom_offset_y',
  'decorative_outline_enabled',
  'decorative_outline_color',
  'decorative_outline_size_scale',
]);

export const YELLOW_DECORATIVE_FIELD_KEYS = new Set([
  'decorative_shape_top_offset_x',
  'decorative_shape_top_offset_y',
  'decorative_shape_bottom_offset_x',
  'decorative_shape_bottom_offset_y',
  'decorative_outline_enabled',
  'decorative_outline_color',
  'decorative_outline_size_scale',
]);

export const BOTTOM_DECORATIVE_FIELD_KEYS = new Set([
  'decorative_shape_bottom_offset_x',
  'decorative_shape_bottom_offset_y',
]);

export const YELLOW_DECORATIVE_SECTION_TYPES = new Set(['hero', 'breed-explorer', 'happy-stories', 'image-hotspot']);
export const BOTTOM_DECORATIVE_SECTION_TYPES = new Set(['breed-explorer', 'happy-stories', 'image-hotspot']);
export const GOLD_DUST_VISUAL_PRESETS = new Set(['black-gold-dust-soft', 'black-gold-dust-rich']);
export const TEMPLATE_PAGE_IDS = new Set(['product', 'blog-post']);

export type TemplateEditorTabId = 'sections' | 'layout' | 'styling' | 'gallery' | 'characteristics';

export type TemplateEditorTab = {
  id: TemplateEditorTabId;
  title: string;
  description: string;
  icon: React.ElementType;
};

export type ThemeEditorPageConfig = {
  id: string;
  label: string;
  icon: React.ElementType;
  previewUrl: string;
  editable: boolean;
  isTemplate?: boolean;
};

export const TEMPLATE_EDITOR_TABS: TemplateEditorTab[] = [
  { id: 'sections', title: 'Page Sections', description: 'Toggle template components', icon: Layout },
  { id: 'layout', title: 'Layout', description: 'Structure and placement', icon: Settings },
  { id: 'styling', title: 'Styling', description: 'Colors and visual style', icon: Palette },
  { id: 'gallery', title: 'Gallery', description: 'Image gallery behavior', icon: ImageIcon },
  { id: 'characteristics', title: 'Characteristics', description: 'Grid content settings', icon: ListChecks },
];

export const THEME_EDITOR_PAGES: ThemeEditorPageConfig[] = [
  { id: 'home', label: 'Home Page', icon: Home, previewUrl: '/?preview=true', editable: true },
  { id: 'product', label: 'Product Template', icon: Package, previewUrl: '/breeds/french-bulldog?preview=true', editable: true, isTemplate: true },
  { id: 'breeds', label: 'All Breeds', icon: Package, previewUrl: '/breeds?preview=true', editable: false },
  { id: 'blog', label: 'Blog Page', icon: BookOpen, previewUrl: '/blog?preview=true', editable: false },
  { id: 'blog-post', label: 'Blog Post Template', icon: FileText, previewUrl: '/blog?preview=true', editable: false, isTemplate: true },
  { id: 'about', label: 'About Page', icon: Users, previewUrl: '/about?preview=true', editable: false },
  { id: 'contact', label: 'Contact Page', icon: Phone, previewUrl: '/contact?preview=true', editable: false },
];

export function isTemplatePage(pageId: string): boolean {
  return TEMPLATE_PAGE_IDS.has(pageId);
}

export function shouldShowTemplateBadge(label: string, isTemplate?: boolean): boolean {
  return Boolean(isTemplate) && !label.toLowerCase().includes('template');
}
