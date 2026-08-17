import { create } from 'zustand';

export const useCurrencyStore = create((set) => ({
  ghanaNairaRate: 900,
  setGhanaNairaRate: (rate) => set({ ghanaNairaRate: rate }),
}));
