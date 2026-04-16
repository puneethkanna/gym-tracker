'use client';

import { usePalettes } from '@/hooks/usePalettes';
import { useAppStore } from '@/lib/store';
import { defaultPalettes as defaultPaletteList } from '@/lib/db';

export function PaletteSelector() {
  const { palettes, isLoading } = usePalettes();
  const { currentPalette, setCurrentPalette } = useAppStore();

  const paletteList = isLoading ? defaultPaletteList : palettes;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Theme</h2>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {paletteList.map((palette) => (
          <button
            key={palette.name}
            onClick={() => setCurrentPalette(palette.name)}
            className={`flex-shrink-0 w-12 h-12 rounded-xl transition-all ${
              currentPalette === palette.name 
                ? 'ring-2 ring-offset-2 ring-primary scale-110' 
                : 'hover:scale-105'
            }`}
            style={{ backgroundColor: palette.background }}
            title={palette.name}
          >
            <div className="flex gap-0.5 justify-center pt-3">
              <div 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: palette.primary }} 
              />
              <div 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: palette.secondary }} 
              />
              <div 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: palette.accent }} 
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function usePaletteColors() {
  const { currentPalette } = useAppStore();
  const { palettes, isLoading } = usePalettes();
  
  const paletteList = isLoading ? defaultPaletteList : palettes;
  const activePalette = paletteList.find((p) => p.name === currentPalette) || paletteList[0];

  return {
    primary: activePalette.primary,
    secondary: activePalette.secondary,
    accent: activePalette.accent,
    background: activePalette.background,
  };
}