import { HelpCircle, Plus, Trash2 } from 'lucide-react';
import { CollapsibleSection } from './CollapsibleSection';
import type { DogFormSetter, DogFormState } from './dogs-constants';

type DogFaqSectionProps = {
  form: DogFormState;
  setForm: DogFormSetter;
};

export function DogFaqSection({ form, setForm }: DogFaqSectionProps) {
  const faqs = form.faqs || [];

  const addFaq = () => {
    setForm((current) => ({
      ...current,
      faqs: [...(current.faqs || []), { question: '', answer: '' }],
    }));
  };

  const removeFaq = (index: number) => {
    setForm((current) => ({
      ...current,
      faqs: (current.faqs || []).filter((_, i) => i !== index),
    }));
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    setForm((current) => ({
      ...current,
      faqs: (current.faqs || []).map((faq, i) => 
        i === index ? { ...faq, [field]: value } : faq
      ),
    }));
  };

  return (
    <CollapsibleSection title="Frequently Asked Questions" icon={HelpCircle}>
      <div className="space-y-6">
        {faqs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
            <HelpCircle className="mx-auto mb-3 text-muted-foreground/50" size={32} />
            <p className="text-sm text-muted-foreground">No FAQs added yet for this dog.</p>
            <button
              type="button"
              onClick={addFaq}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-blue-700 active:scale-95 shadow-md"
            >
              <Plus size={16} />
              Add First FAQ
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="group relative rounded-2xl border border-border bg-muted/30 p-4 transition-all hover:bg-muted/50">
                <button
                  onClick={() => removeFaq(index)}
                  className="absolute -right-2 -top-2 hidden h-8 w-8 items-center justify-center rounded-full bg-destructive text-white shadow-sm transition-all hover:scale-110 group-hover:flex active:scale-90"
                >
                  <Trash2 size={14} />
                </button>
                
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Question {index + 1}</label>
                    <input
                      value={faq.question}
                      onChange={(e) => updateFaq(index, 'question', e.target.value)}
                      className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="e.g. Is this dog hypoallergenic?"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Answer</label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                      className="min-h-[80px] w-full resize-y rounded-xl border border-border bg-background/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="e.g. Yes, Toy Poodles have a curly, low-shedding coat..."
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addFaq}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-4 text-sm font-bold text-muted-foreground transition-all hover:border-blue-600 hover:text-blue-600 active:scale-[0.99]"
            >
              <Plus size={18} />
              Add Another FAQ
            </button>
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
}
