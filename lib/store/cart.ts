import { create } from 'zustand';
import type { CartState, CartItem } from '@/types';

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item: CartItem) => {
    const existing = get().items.find((i) => i.dogId === item.dogId);
    if (!existing) {
      set((state) => ({ items: [...state.items, item] }));
    }
  },

  removeItem: (dogId: string) => {
    set((state) => ({ items: state.items.filter((i) => i.dogId !== dogId) }));
  },

  clearCart: () => set({ items: [] }),

  get itemCount() {
    return get().items.length;
  },
}));
