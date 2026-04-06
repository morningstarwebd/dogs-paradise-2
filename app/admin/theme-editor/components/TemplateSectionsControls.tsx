import type { PageTemplateSettings } from '@/types/page-template';
import { TemplateToggle } from './TemplateToggle';

type TemplateSectionsControlsProps = {
  settings: PageTemplateSettings;
  updateTemplateField: (category: 'layout' | 'sections' | 'styling', key: string, subKey: string | null, value: unknown) => void;
};

export function TemplateSectionsControls({ settings, updateTemplateField }: TemplateSectionsControlsProps) {
  return (
    <div className="space-y-2 rounded-lg border border-[#ea728c]/20 bg-[#1b1836] p-3">
      <TemplateToggle label="Back Button" checked={settings.sections?.back_button?.visible ?? true} onChange={(value) => updateTemplateField('sections', 'back_button', 'visible', value)} />
      <TemplateToggle label="Image Gallery" checked={settings.sections?.image_gallery?.visible ?? true} onChange={(value) => updateTemplateField('sections', 'image_gallery', 'visible', value)} />
      <TemplateToggle label="Details Card" checked={settings.sections?.details_card?.visible ?? true} onChange={(value) => updateTemplateField('sections', 'details_card', 'visible', value)} />
      <TemplateToggle label="About Section" checked={settings.sections?.about_section?.visible ?? true} onChange={(value) => updateTemplateField('sections', 'about_section', 'visible', value)} />
      <TemplateToggle label="Characteristics" checked={settings.sections?.characteristics?.visible ?? true} onChange={(value) => updateTemplateField('sections', 'characteristics', 'visible', value)} />
      <TemplateToggle label="Health Info" checked={settings.sections?.health_info?.visible ?? true} onChange={(value) => updateTemplateField('sections', 'health_info', 'visible', value)} />
      <TemplateToggle label="FAQ Section" checked={settings.sections?.faq_section?.visible ?? true} onChange={(value) => updateTemplateField('sections', 'faq_section', 'visible', value)} />
    </div>
  );
}
