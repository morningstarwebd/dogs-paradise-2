import { cn } from '@/lib/utils';
import type { DogStatus } from '@/types';

interface BadgeProps {
  status: DogStatus;
  className?: string;
}

const statusLabels: Record<DogStatus, string> = {
  available: 'Available',
  sold: 'Sold',
  coming_soon: 'Coming Soon',
  reserved: 'Reserved',
};

export default function Badge({ status, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'label-badge inline-flex items-center px-2.5 py-1 rounded-full',
        `badge-${status}`,
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
