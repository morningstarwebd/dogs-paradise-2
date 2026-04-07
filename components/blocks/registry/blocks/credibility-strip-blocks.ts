import { BlockTypeSchema } from "@/types/schema.types";

export const credibilityStripBlocks: BlockTypeSchema[] = [
  {
    type: 'credibility_item',
    label: 'Credibility Item',
    icon: 'ShieldCheck',
    limit: 6,
    titleField: 'title',
    schema: [
      { key: 'metric', label: 'Metric', type: 'text', placeholder: '10k+' },
      { key: 'title', label: 'Title', type: 'text', placeholder: 'Happy Owners' },
      { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Divine Community' },
      {
        key: 'icon',
        label: 'Icon',
        type: 'select',
        options: ['Users', 'Star', 'ShieldCheck', 'BadgeCheck', 'Award', 'CheckCircle2', 'HeartHandshake', 'Sparkles'],
      },
      { key: 'icon_image', label: 'Icon Image (Optional)', type: 'image' },
      { key: 'icon_alt', label: 'Icon Alt Text', type: 'text', placeholder: 'Brand icon' },
      { key: 'badge_text', label: 'Badge Text (Optional)', type: 'text', placeholder: 'UKC' },
      { key: 'show_badge', label: 'Show Badge', type: 'toggle', default: true },
      { key: 'metric_color', label: 'Metric Color (Optional)', type: 'color', default: '' },
      { key: 'title_color', label: 'Title Color (Optional)', type: 'color', default: '' },
      { key: 'subtitle_color', label: 'Subtitle Color (Optional)', type: 'color', default: '' },
      { key: 'badge_bg_color', label: 'Badge Background (Optional)', type: 'color', default: '' },
      { key: 'badge_text_color', label: 'Badge Text Color (Optional)', type: 'color', default: '' },
      { key: 'icon_bg_color', label: 'Icon Chip Background (Optional)', type: 'color', default: '' },
      { key: 'icon_color', label: 'Icon Color (Optional)', type: 'color', default: '' },
    ],
  },
];
