import type { DiscoverFilters, GetUser } from 'types';
import { create } from 'zustand';

interface DiscoverProfilesStore {
  profiles: GetUser[];
  isMaxedOut: boolean;
  filters: DiscoverFilters;
  setProfiles: (profiles: GetUser[]) => void;
  addProfiles: (profiles: GetUser[]) => void;
  setIsMaxedOut: (val: boolean) => void;
  setFilters: (filters: DiscoverFilters) => void;
}

export const useDiscoverProfilesStore = create<DiscoverProfilesStore>()(
  (set) => ({
    profiles: [],
    isMaxedOut: false,
    filters: {},
    setProfiles: (profiles) =>
      set(() => ({
        profiles,
      })),
    addProfiles: (profiles) =>
      set((state) => ({
        profiles: [...state.profiles, ...profiles],
      })),
    setIsMaxedOut: (val) => set(() => ({ isMaxedOut: val })),
    setFilters: (filters) =>
      set((state) => ({ filters: { ...state.filters, ...filters } })),
  })
);
