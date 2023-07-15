import { GetUser } from 'types';
import { create } from 'zustand';

interface DiscoverProfilesStore {
  profiles: GetUser[];
  isMaxedOut: boolean;
  setProfiles: (profiles: GetUser[], shouldAppend: boolean) => void;
  setIsMaxedOut: (val: boolean) => void;
}

export const useDiscoverProfilesStore = create<DiscoverProfilesStore>()(
  (set) => ({
    profiles: [],
    isMaxedOut: false,
    setProfiles: (profiles, shouldAppend) =>
      set((state) => ({
        profiles: shouldAppend ? [...state.profiles, ...profiles] : profiles,
      })),
    setIsMaxedOut: (val) => set(() => ({ isMaxedOut: val })),
  })
);
