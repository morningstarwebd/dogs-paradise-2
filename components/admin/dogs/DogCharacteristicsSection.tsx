import { Activity } from 'lucide-react';
import { CollapsibleSection } from './CollapsibleSection';
import { DogCharacteristicToggles } from './DogCharacteristicToggles';
import {
  COAT_LENGTHS,
  ENERGY_LEVELS,
  SIZES,
  type CoatValue,
  type DogFormSetter,
  type DogFormState,
  type EnergyValue,
  type SizeValue,
} from './dogs-constants';

type DogCharacteristicsSectionProps = {
  form: DogFormState;
  setForm: DogFormSetter;
};

export function DogCharacteristicsSection({ form, setForm }: DogCharacteristicsSectionProps) {
  return (
    <CollapsibleSection title="Characteristics" icon={Activity} defaultOpen={false}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Size</label>
            <select
              value={form.characteristics?.size || 'medium'}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  characteristics: { ...current.characteristics, size: event.target.value as SizeValue },
                }))
              }
              className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {SIZES.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Energy Level</label>
            <select
              value={form.characteristics?.energy_level || 'moderate'}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  characteristics: {
                    ...current.characteristics,
                    energy_level: event.target.value as EnergyValue,
                  },
                }))
              }
              className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {ENERGY_LEVELS.map((energyLevel) => (
                <option key={energyLevel.value} value={energyLevel.value}>
                  {energyLevel.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Coat Length</label>
            <select
              value={form.characteristics?.coat_length || 'medium'}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  characteristics: {
                    ...current.characteristics,
                    coat_length: event.target.value as CoatValue,
                  },
                }))
              }
              className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {COAT_LENGTHS.map((coatLength) => (
                <option key={coatLength.value} value={coatLength.value}>
                  {coatLength.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Training</label>
            <select
              value={form.characteristics?.training_difficulty || 'moderate'}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  characteristics: {
                    ...current.characteristics,
                    training_difficulty: event.target.value as 'easy' | 'moderate' | 'hard',
                  },
                }))
              }
              className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Grooming</label>
            <select
              value={form.characteristics?.grooming || 'moderate'}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  characteristics: {
                    ...current.characteristics,
                    grooming: event.target.value as 'low' | 'moderate' | 'high',
                  },
                }))
              }
              className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lifespan</label>
            <input
              value={form.characteristics?.lifespan || ''}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  characteristics: { ...current.characteristics, lifespan: event.target.value },
                }))
              }
              className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="10-12 years"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Weight</label>
            <input
              value={form.characteristics?.weight || ''}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  characteristics: { ...current.characteristics, weight: event.target.value },
                }))
              }
              className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="25-34 kg"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Height</label>
            <input
              value={form.characteristics?.height || ''}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  characteristics: { ...current.characteristics, height: event.target.value },
                }))
              }
              className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="55-61 cm"
            />
          </div>
        </div>
        <DogCharacteristicToggles form={form} setForm={setForm} />
      </div>
    </CollapsibleSection>
  );
}
