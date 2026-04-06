'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { saveProject, deleteProject as deleteProjectAction } from '@/app/actions/projects';
import { DogEditorView } from '@/components/admin/dogs/DogEditorView';
import { DogsListView } from '@/components/admin/dogs/DogsListView';
import { emptyDogForm } from '@/components/admin/dogs/dogs-constants';
import { buildFormFromProject, buildProjectPayload, getPrimaryImageIndex, resolveUniqueSlug, slugify } from '@/components/admin/dogs/dogs-helpers';
import { createClient } from '@/lib/supabase/client';
import { useAdminDataStore, type Project } from '@/store/admin-data-store';

export default function AdminProjectsPage() {
  const { projects: cachedProjects, setProjects: setCachedProjects } = useAdminDataStore();
  const [supabase] = useState(() => createClient());
  const [projects, setProjects] = useState<Project[]>(cachedProjects || []);
  const [loading, setLoading] = useState(!cachedProjects);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [form, setForm] = useState(emptyDogForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const refreshProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('sort_order', { ascending: true });

    if (data) {
      setProjects(data);
      setCachedProjects(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    async function hydrateProjects() {
      const { data } = await supabase.from('projects').select('*').order('sort_order', { ascending: true });

      if (!isMounted) {
        return;
      }

      if (data) {
        setProjects(data);
        setCachedProjects(data);
      }

      setLoading(false);
    }

    void hydrateProjects();

    return () => {
      isMounted = false;
    };
  }, [setCachedProjects, supabase]);

  const openNewEditor = () => {
    setEditingProject(null);
    setForm(emptyDogForm);
    setTagsInput('');
    setPrimaryImageIndex(0);
    setIsEditorOpen(true);
  };

  const openEditEditor = (project: Project) => {
    setEditingProject(project);
    setForm(buildFormFromProject(project, emptyDogForm));
    setTagsInput((project.tags || []).join(', '));
    setPrimaryImageIndex(getPrimaryImageIndex(project));
    setIsEditorOpen(true);
  };

  const handleTitleChange = (title: string) => {
    setForm((current) => ({
      ...current,
      title,
      slug: editingProject ? current.slug : slugify(title),
    }));
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      return;
    }

    setSaving(true);
    const payload = buildProjectPayload(form, tagsInput, primaryImageIndex);
    const uniqueSlug = await resolveUniqueSlug(supabase, slugify(payload.slug), editingProject?.id);
    const result = await saveProject({ ...payload, slug: uniqueSlug }, editingProject?.id);

    if (!result.success) {
      showToast(`Error: ${result.error}`);
    } else {
      showToast(editingProject ? 'Dog updated successfully!' : 'Dog created successfully!');
      setIsEditorOpen(false);
    }

    setSaving(false);
    refreshProjects();
  };

  const handleDelete = async () => {
    if (!deleteId) {
      return;
    }

    const result = await deleteProjectAction(deleteId);
    showToast(result.success ? 'Dog deleted successfully!' : `Error: ${result.error}`);
    setDeleteId(null);
    refreshProjects();
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  return isEditorOpen ? (
    <DogEditorView
      editingProject={editingProject}
      form={form}
      onClose={() => setIsEditorOpen(false)}
      onSave={handleSave}
      onTitleChange={handleTitleChange}
      primaryImageIndex={primaryImageIndex}
      saving={saving}
      setForm={setForm}
      setPrimaryImageIndex={setPrimaryImageIndex}
      setTagsInput={setTagsInput}
      tagsInput={tagsInput}
      toast={toast}
    />
  ) : (
    <DogsListView
      deleteId={deleteId}
      onConfirmDelete={handleDelete}
      onDismissDelete={() => setDeleteId(null)}
      onEdit={openEditEditor}
      onNewDog={openNewEditor}
      onSelectDelete={setDeleteId}
      projects={projects}
      toast={toast}
    />
  );
}
