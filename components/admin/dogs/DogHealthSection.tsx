import { Shield } from 'lucide-react';
import { CollapsibleSection } from './CollapsibleSection';
import { HEALTH_TOGGLES, type DogFormSetter, type DogFormState } from './dogs-constants';

type DogHealthSectionProps = {
  form: DogFormState;
  setForm: DogFormSetter;
};

export function DogHealthSection({ form, setForm }: DogHealthSectionProps) {
  return (
    <CollapsibleSection title="Health Information" icon={Shield} defaultOpen={false}>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {HEALTH_TOGGLES.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() =>
              setForm((current) => ({
                ...current,
                health_info: {
                  ...current.health_info,
                  [item.key]:
                    !current.health_info?.[item.key as keyof NonNullable<DogFormState['health_info']>],
                },
              }))
            }
            className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
              form.health_info?.[item.key as keyof NonNullable<DogFormState['health_info']>]
                ? 'border-green-400 bg-green-100 text-green-700 dark:border-green-600 dark:bg-green-900/30 dark:text-green-400'
                : 'border-border bg-muted/30 hover:bg-muted/50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </CollapsibleSection>
  );
}
