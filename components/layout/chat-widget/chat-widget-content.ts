import { dogs } from '@/data/dogs'
import { siteConfig } from '@/data/site-config'
import type { Message } from './chat-widget-types'

export function getTime() {
    return new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    })
}

function formatBusinessHours() {
    return siteConfig.businessHours.map((item) => `${item.days}: ${item.hours}`).join('\n')
}

export function createInitialMessage(): Message {
    return {
        id: 'welcome',
        role: 'bot',
        text: [
            `Welcome to ${siteConfig.brandName}.`,
            '',
            'I can help you with:',
            '- available breeds and puppy types',
            '- pricing and availability',
            '- health records and paperwork questions',
            '- delivery, visits, and support',
            '',
            'How can I help you today?',
        ].join('\n'),
        time: getTime(),
    }
}

export function generateResponse(input: string): string {
    const query = input.toLowerCase().trim()

    if (/^(hi|hello|hey|namaste|namaskar|assalamu|salam)/i.test(query)) {
        return `Hello and welcome to ${siteConfig.brandName}. Ask me about breeds, pricing, health details, visits, or WhatsApp support.`
    }

    if (/contact|phone|number|whatsapp|call|reach|talk/i.test(query)) {
        return [
            `You can reach us directly at **${siteConfig.phone}**.`,
            '',
            `[Chat on WhatsApp](https://wa.me/${siteConfig.whatsappNumber})`,
            '',
            `Email: ${siteConfig.email}`,
            `Address: ${siteConfig.address}, ${siteConfig.city}, ${siteConfig.state}`,
        ].join('\n')
    }

    if (/price|cost|rate|budget|charge|expensive|cheap|afford/i.test(query)) {
        return [
            'Pricing depends on breed, age, quality, and availability.',
            '',
            'Our team shares custom details after understanding what kind of puppy you want.',
            '',
            'Health records are discussed clearly, and registration paperwork is confirmed only where applicable.',
            '',
            `For a quick quote, WhatsApp us at ${siteConfig.phone}.`,
        ].join('\n')
    }

    if (/available|stock|which breed|what breed|have any/i.test(query)) {
        const available = dogs.filter((dog) => dog.status === 'available')
        const breedList = [...new Set(available.map((dog) => dog.breedName))]
        return [
            'Currently available breeds:',
            '',
            ...breedList.map((breed) => `- **${breed}**`),
            '',
            `There are ${available.length} available puppy listings right now.`,
            '',
            'You can also browse our [Breeds page](/breeds).',
        ].join('\n')
    }

    if (/golden retriever/i.test(query)) return getBreedResponse('golden', 'Golden Retriever', '- gentle family companion', '- high energy and regular grooming', '- very good with families and children')
    if (/labrador|lab /i.test(query)) return getBreedResponse('labrador', 'Labrador Retriever', '- playful and adaptable', '- easy to train', '- great for active homes')
    if (/husky|siberian/i.test(query)) return getBreedResponse('husky', 'Siberian Husky', '- striking appearance and very high energy', '- needs careful climate management in India', '- best for families ready for grooming and exercise')
    if (/german shepherd|gsd|alsatian/i.test(query)) return getBreedResponse('german shepherd', 'German Shepherd', '- loyal and highly trainable', '- strong guardian instincts', '- needs structure and regular activity')

    if (/vaccin|deworm|health|vet|medical|checkup|guarantee/i.test(query)) {
        return [
            '**Health and vaccination details**',
            '',
            '- age-appropriate vaccination updates',
            '- deworming records',
            '- vet health checks',
            '- feeding and care guidance',
            '',
            'Paperwork varies by puppy. We always explain what is included before booking.',
        ].join('\n')
    }

    if (/kci|registration|pedigree|papers|document|certificate/i.test(query)) {
        return [
            '**Registration and paperwork**',
            '',
            siteConfig.registrationNote,
            '',
            'If a puppy is paperwork-eligible, we confirm the exact details during the enquiry.',
            `For fast confirmation, WhatsApp us at ${siteConfig.phone}.`,
        ].join('\n')
    }

    if (/deliver|shipping|transport|send|location|outside|pan india|city/i.test(query)) {
        return [
            '**Delivery support**',
            '',
            '- pickup from our Bengaluru location',
            '- Bangalore delivery support',
            '- outstation travel guidance depending on route and conditions',
            '',
            `Location: ${siteConfig.address}, ${siteConfig.city}`,
            `WhatsApp ${siteConfig.phone} to check delivery options for your city.`,
        ].join('\n')
    }

    if (/payment|pay|advance|booking|reserve|upi|gpay|bank/i.test(query)) {
        return [
            '**Booking process**',
            '',
            '- first confirm the puppy and details with our team',
            '- booking is handled after the discussion',
            '- balance is completed before pickup or delivery',
            '',
            `For the latest booking steps, message us at ${siteConfig.phone}.`,
        ].join('\n')
    }

    if (/visit|come|see|facility|farm|kennel|address|where/i.test(query)) {
        return [
            '**Visit information**',
            '',
            `Address: ${siteConfig.address}, ${siteConfig.city}, ${siteConfig.state}`,
            '',
            'Business hours:',
            formatBusinessHours(),
            '',
            `Please WhatsApp ${siteConfig.phone} before visiting.`,
            `[Open in Google Maps](${siteConfig.googleMapsUrl})`,
        ].join('\n')
    }

    if (/train|potty|command|behavior|obedien|bite|bark/i.test(query)) {
        return [
            '**After-pickup support**',
            '',
            '- settling-in guidance',
            '- feeding basics',
            '- routine and early training tips',
            '- help for first-time pet parents',
            '',
            'You can also message us anytime after pickup for support.',
        ].join('\n')
    }

    if (/food|diet|feed|eat|nutrition|kibble/i.test(query)) {
        return [
            '**Feeding guidance**',
            '',
            'We share a basic food plan, transition advice, and age-based feeding guidance when you enquire or book.',
            '',
            'If you already have a puppy in mind, message us and we will guide you based on the breed and age.',
        ].join('\n')
    }

    if (/thank|thanks|dhanyabaad|dhonnobad/i.test(query)) {
        return `You are welcome. If you need anything else, just message here or contact us on WhatsApp at ${siteConfig.phone}.`
    }

    if (/bye|goodbye|see you|tata/i.test(query)) {
        return `Thank you for visiting ${siteConfig.brandName}. We are always available on WhatsApp at ${siteConfig.phone}.`
    }

    return [
        'I can help with breed options, pricing, health details, paperwork questions, visits, and delivery support.',
        '',
        `For the fastest response, contact us on WhatsApp: **${siteConfig.phone}**`,
        `[Chat on WhatsApp](https://wa.me/${siteConfig.whatsappNumber})`,
    ].join('\n')
}

function getBreedResponse(
    breedMatch: string,
    breedName: string,
    pointOne: string,
    pointTwo: string,
    pointThree: string,
) {
    const matches = dogs.filter((dog) => dog.breedName.toLowerCase().includes(breedMatch))
    return [
        `**${breedName}**`,
        pointOne,
        pointTwo,
        pointThree,
        '',
        `We currently have ${matches.length} ${breedName} listing(s).`,
        `WhatsApp us at ${siteConfig.phone} for live photos and current details.`,
    ].join('\n')
}
