import type { DogFormSetter, DogFormState } from './dogs-constants';
import { CHARACTERISTIC_TOGGLES } from './dogs-constants';

type DogCharacteristicTogglesProps = {
  form: DogFormState;
  setForm: DogFormSetter;
};

export function DogCharacteristicToggles({
  form,
  setForm,
}: DogCharacteristicTogglesProps) {
  return (
    <div className="grid grid-cols-2 gap-3 pt-2 md:grid-cols-3">
      {CHARACTERISTIC_TOGGLES.map((toggle) => (
        <button
          key={toggle.key}
          type="button"
          onClick={() =>
            setForm((current) => ({
              ...current,
              characteristics: {
                ...current.characteristics,
                [toggle.key]:
                  !current.characteristics?.[
                    toggle.key as keyof NonNullable<DogFormState['characteristics']>
                  ],
              },
            }))
          }
          className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
            form.characteristics?.[toggle.key as keyof NonNullable<DogFormState['characteristics']>]
              ? 'border-green-400 bg-green-100 text-green-700 dark:border-green-600 dark:bg-green-900/30 dark:text-green-400'
              : 'border-border bg-muted/30 hover:bg-muted/50'
          }`}
        >
          {toggle.label}
        </button>
      ))}
    </div>
  );
}
