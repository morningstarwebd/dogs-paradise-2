import Image from 'next/image';
import { Dog, Pencil, Star, Trash2 } from 'lucide-react';
import type { Project } from '@/store/admin-data-store';
import { formatStatusLabel, getStatusBadgeClassName } from './dogs-helpers';

type DogsGridProps = {
  onDelete: (id: string) => void;
  onEdit: (project: Project) => void;
  projects: Project[];
};

export function DogsGrid({ onDelete, onEdit, projects }: DogsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg"
        >
          <div className="relative aspect-[4/3] bg-muted">
            {project.cover_image || (project.images && project.images[0]) ? (
              <Image
                src={project.cover_image || project.images![0]}
                alt={project.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Dog className="h-12 w-12 text-muted-foreground/30" />
              </div>
            )}

            {project.status ? (
              <div
                className={`absolute left-3 top-3 rounded-lg px-2.5 py-1 text-xs font-bold ${getStatusBadgeClassName(project.status)}`}
              >
                {formatStatusLabel(project.status)}
              </div>
            ) : null}

            {project.featured ? (
              <div className="absolute right-3 top-3 rounded-lg bg-amber-400 p-1.5">
                <Star size={14} className="text-black" fill="currentColor" />
              </div>
            ) : null}
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold">{project.title}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">/{project.slug}</p>
            {project.category ? (
              <span className="mt-2 inline-block rounded-md bg-muted px-2 py-1 text-xs font-medium">
                {project.category}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2 px-4 pb-4">
            <button
              onClick={() => onEdit(project)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-muted py-2 text-sm font-medium transition-colors hover:bg-muted/80"
            >
              <Pencil size={14} />
              Edit
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
