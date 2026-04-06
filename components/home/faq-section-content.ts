import type { FAQItem, RawBlock } from './faq-section-types'

const fallbackFaqs = [
    {
        q: 'Are all of your puppies KCI registered?',
        a: 'No. KCI registration is available only for select puppies and litters. We clearly confirm the paperwork status for the exact puppy before you book.',
    },
    {
        q: 'What vaccinations do your puppies receive?',
        a: 'Puppies leave with age-appropriate vaccination updates, deworming records, and vet health notes. We also guide you on the next due dates after pickup.',
    },
    {
        q: 'Do you deliver puppies outside Bangalore?',
        a: 'Yes. We help coordinate safe travel across India depending on the puppy, destination, and weather conditions. We explain the process in detail before confirming delivery.',
    },
    {
        q: 'Can I visit before choosing a puppy?',
        a: 'Yes. We encourage visits and video calls so you can understand the puppy, ask questions, and review health details before making a decision.',
    },
    {
        q: 'What documents do you share at handover?',
        a: 'We share the health records, vaccination details, feeding guidance, and any paperwork applicable to that puppy. Registration papers are included only where available.',
    },
    {
        q: 'How do I reserve a puppy?',
        a: 'Message us on WhatsApp to confirm availability. Once we discuss the puppy and answer your questions, we will guide you through the booking process.',
    },
    {
        q: 'Do you support first-time pet parents?',
        a: 'Yes. We help with food guidance, settling-in tips, grooming basics, vaccination reminders, and general after-pickup support.',
    },
    {
        q: 'What is the difference between a companion puppy and a paperwork-eligible puppy?',
        a: 'Companion puppies are matched for healthy family homes, while some puppies may also be available with specific registration or lineage paperwork. We explain the difference case by case so expectations stay clear.',
    },
]

function toText(value: unknown, fallback: string) {
    return typeof value === 'string' && value.trim() ? value : fallback
}

function buildFaqItems(blocks: RawBlock[]): FAQItem[] {
    return blocks
        .filter((block) => block?.type === 'faq_item' && block.settings)
        .map((block, index) => {
            const settings = block.settings as Record<string, unknown>
            return {
                id: block.id || `faq_item_${index}`,
                question: toText(settings.question, `Question ${index + 1}`),
                answer: toText(settings.answer, 'Add your answer here.'),
                blockId: block.id,
                questionKey: 'question',
                answerKey: 'answer',
            }
        })
}

export function getFaqItems(blocks: RawBlock[]) {
    const blockItems = buildFaqItems(blocks)
    if (blockItems.length > 0) return blockItems

    return fallbackFaqs.map((faq, index) => ({
        id: `legacy_faq_${index}`,
        question: faq.q,
        answer: faq.a,
        questionKey: `faq_${index}_question`,
        answerKey: `faq_${index}_answer`,
    }))
}
