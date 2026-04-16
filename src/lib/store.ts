import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  currentPalette: string;
  setCurrentPalette: (palette: string) => void;
  weatherData: { temp: number; condition: string } | null;
  setWeatherData: (data: { temp: number; condition: string } | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentPalette: 'Ocean',
      setCurrentPalette: (palette) => set({ currentPalette: palette }),
      weatherData: null,
      setWeatherData: (data) => set({ weatherData: data }),
    }),
    {
      name: 'gym-tracker-storage',
    }
  )
);