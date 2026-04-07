import { createClient } from '@/lib/supabase/client';
import type { Project } from '@/store/admin-data-store';
import type { ProjectPayload } from '@/app/actions/projects';
import type { DogFormState } from './dogs-constants';

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function resolveUniqueSlug(
  supabase: ReturnType<typeof createClient>,
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  let query = supabase.from('projects').select('slug').or(`slug.eq.${baseSlug},slug.like.${baseSlug}-%`);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data } = await query;
  if (!data || data.length === 0) return baseSlug;

  const existing = new Set(data.map((item: { slug: string }) => item.slug));
  if (!existing.has(baseSlug)) return baseSlug;

  let suffix = 1;
  while (existing.has(`${baseSlug}-${suffix}`)) {
    suffix += 1;
  }

  return `${baseSlug}-${suffix}`;
}

export function buildFormFromProject(project: Project, emptyDogForm: DogFormState): DogFormState {
  return {
    title: project.title,
    slug: project.slug,
    description: project.description || '',
    long_description: project.long_description || '',
    category: project.category || 'Working Group',
    tags: project.tags || [],
    cover_image: project.cover_image || '',
    images: project.images || [],
    live_url: project.live_url || '',
    github_url: project.github_url || '',
    featured: project.featured || false,
    sort_order: project.sort_order || 0,
    price: project.price,
    status: project.status || 'available',
    gender: project.gender,
    age: project.age || '',
    characteristics: project.characteristics || emptyDogForm.characteristics,
    health_info: project.health_info || emptyDogForm.health_info,
    faqs: project.faqs || [],
  };
}

export function getPrimaryImageIndex(project: Project): number {
  const primaryIndex = project.images?.findIndex((image) => image === project.cover_image) ?? 0;
  return primaryIndex >= 0 ? primaryIndex : 0;
}

export function buildProjectPayload(
  form: DogFormState,
  tagsInput: string,
  primaryImageIndex: number
): ProjectPayload {
  const coverImage =
    form.images && form.images.length > 0 ? form.images[primaryImageIndex] || form.images[0] : form.cover_image;

  return {
    title: form.title,
    slug: form.slug,
    description: form.description || null,
    long_description: form.long_description || null,
    category: form.category || null,
    tags: tagsInput.split(',').map((tag) => tag.trim()).filter(Boolean),
    cover_image: coverImage || null,
    images: form.images || [],
    live_url: form.live_url || null,
    github_url: form.github_url || null,
    featured: form.featured || false,
    sort_order: form.sort_order || 0,
    price: form.price,
    status: form.status || 'available',
    gender: form.gender || null,
    age: form.age || null,
    characteristics: form.characteristics || null,
    health_info: form.health_info || null,
    faqs: form.faqs || [],
  };
}

export function formatStatusLabel(status: Project['status']) {
  if (!status) return '';
  return status === 'coming_soon'
    ? 'Coming Soon'
    : status.charAt(0).toUpperCase() + status.slice(1);
}

export function getStatusBadgeClassName(status: Project['status']) {
  switch (status) {
    case 'available':
      return 'bg-green-500 text-white';
    case 'reserved':
      return 'bg-amber-500 text-white';
    case 'coming_soon':
      return 'bg-blue-500 text-white';
    default:
      return 'bg-red-500 text-white';
  }
}
