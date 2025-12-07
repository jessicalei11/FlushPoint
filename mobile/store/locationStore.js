import { create } from 'zustand';

export const useLocationStore = create((set) => ({
  locations: [],

  addLocation: (newLocation) => 
    set((state) => ({
      locations: [...state.locations, newLocation],
    })),

  setLocations: (locationsArray) => set({ locations: locationsArray }),
}));