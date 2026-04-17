import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark' | 'system';

interface AppState {
  currentPalette: string;
  themeMode: ThemeMode;
  setCurrentPalette: (palette: string) => void;
  setThemeMode: (mode: ThemeMode) => void;
  weatherData: { temp: number; condition: string } | null;
  setWeatherData: (data: { temp: number; condition: string }) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentPalette: 'Sunset',
      themeMode: 'system',
      setCurrentPalette: (palette) => set({ currentPalette: palette }),
      setThemeMode: (mode) => set({ themeMode: mode }),
      weatherData: null,
      setWeatherData: (data) => set({ weatherData: data }),
    }),
    {
      name: 'gym-tracker-storage',
    }
  )
);