// src/store/cart.store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      count: 0,

      setCart: (items, total) =>
        set({
          items,
          total,
          count: items.reduce((sum, i) => sum + i.quantity, 0),
        }),

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          );
          if (existing) {
            const updated = state.items.map((i) =>
              i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i
            );
            return { items: updated, count: state.count + item.quantity };
          }
          return { items: [...state.items, item], count: state.count + item.quantity };
        });
      },

      removeItem: (itemId) => {
        set((state) => {
          const item = state.items.find((i) => i.id === itemId);
          return {
            items: state.items.filter((i) => i.id !== itemId),
            count: state.count - (item?.quantity || 0),
          };
        });
      },

      clearCart: () => set({ items: [], total: 0, count: 0 }),
    }),
    {
      name: 'ese-cart',
    }
  )
);

// src/store/ui.store.js
import { create as createUi } from 'zustand';

export const useUiStore = createUi((set) => ({
  cartOpen: false,
  searchOpen: false,
  mobileMenuOpen: false,
  setCartOpen: (v) => set({ cartOpen: v }),
  setSearchOpen: (v) => set({ searchOpen: v }),
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),
}));
