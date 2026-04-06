import { create } from 'zustand'


export interface ProjectCharacteristics {
    size?: 'toy' | 'small' | 'medium' | 'large' | 'giant'
    energy_level?: 'low' | 'moderate' | 'high' | 'very_high'
    coat_length?: 'short' | 'medium' | 'long' | 'double' | 'wire'
    good_with_kids?: boolean
    good_with_pets?: boolean
    apartment_friendly?: boolean
    training_difficulty?: 'easy' | 'moderate' | 'hard'
    grooming?: 'low' | 'moderate' | 'high'
    lifespan?: string
    weight?: string
    height?: string
}

export interface ProjectHealthInfo {
    vaccinated?: boolean
    dewormed?: boolean
    vet_checked?: boolean
    microchipped?: boolean
    kci_registered?: boolean
    parents_certified?: boolean
}

export interface Project {
    id: string
    title: string
    slug: string
    description: string | null
    long_description: string | null
    category: string | null
    tags: string[] | null
    cover_image: string | null
    images: string[] | null
    live_url: string | null
    github_url: string | null
    featured: boolean | null
    sort_order: number | null
    price: number | null
    status: 'available' | 'sold' | 'coming_soon' | 'reserved' | null
    gender: 'male' | 'female' | null
    age: string | null
    characteristics: ProjectCharacteristics | null
    health_info: ProjectHealthInfo | null
    created_at: string | null
}

export interface ContactMessage {
    id: string
    name: string
    email: string
    service: string | null
    budget: string | null
    message: string
    read: boolean | null
    created_at: string | null
    lead_score: number | null
    lead_summary: string | null
}

export interface AdminUser {
    id: string
    email: string
    name: string
    avatar: string
    role: string | null
    last_sign_in: string | null
    created_at: string | null
}

export interface PageEntry {
    id: string
    title: string
    slug: string
    content: string | null
    sections: Record<string, unknown>[] | null
    published: boolean | null
    created_at: string | null
    updated_at: string | null
}

export interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt: string | null
    content: string | null
    category: string | null
    tags: string[] | null
    reading_time: number | null
    created_at: string | null
    updated_at: string | null
    cover_image: string | null
    published: boolean | null
    scheduled_at: string | null
}

interface AdminDataState {
    blogPosts: BlogPost[] | null
    projects: Project[] | null
    contactMessages: ContactMessage[] | null
    adminUsers: AdminUser[] | null
    pages: PageEntry[] | null
    setBlogPosts: (posts: BlogPost[]) => void
    setProjects: (projects: Project[]) => void
    setContactMessages: (messages: ContactMessage[]) => void
    setAdminUsers: (users: AdminUser[]) => void
    setPages: (pages: PageEntry[]) => void
}

export const useAdminDataStore = create<AdminDataState>((set) => ({
    blogPosts: null,
    projects: null,
    contactMessages: null,
    adminUsers: null,
    pages: null,
    setBlogPosts: (posts) => set({ blogPosts: posts }),
    setProjects: (projects) => set({ projects: projects }),
    setContactMessages: (messages) => set({ contactMessages: messages }),
    setAdminUsers: (users) => set({ adminUsers: users }),
    setPages: (pages) => set({ pages: pages }),
}))
