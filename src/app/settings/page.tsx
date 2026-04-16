'use client';

import { BottomNav } from '@/components/BottomNav';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import { useAppStore } from '@/lib/store';
import { usePalettes } from '@/hooks/usePalettes';
import { defaultPalettes as defaultPaletteList } from '@/lib/db';

export default function SettingsPage() {
  const { currentPalette, setCurrentPalette } = useAppStore();
  const { palettes, isLoading } = usePalettes();

  const paletteList = isLoading ? defaultPaletteList : palettes;
  const activePalette = paletteList.find(p => p.name === currentPalette) || paletteList[0];
  const headerBg = activePalette?.background ? `${activePalette.background}cc` : '#ffffffcc';

  return (
    <div className="min-h-screen pb-20">
      <ServiceWorkerRegistration />
      
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/10" style={{ backgroundColor: headerBg }}>
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="font-condensed text-xl font-bold text-foreground tracking-wide">SETTINGS</h1>
          <p className="text-xs text-muted">Customize your app</p>
        </div>
      </header>

      <main className="pt-16 px-4 pb-4 max-w-md mx-auto space-y-4">
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
          <h2 className="font-condensed text-sm font-semibold text-muted uppercase tracking-wider mb-4">Theme</h2>
          <div className="flex gap-3 flex-wrap">
            {paletteList.map((palette) => (
              <button
                key={palette.name}
                onClick={() => setCurrentPalette(palette.name)}
                className={`flex-shrink-0 w-14 h-14 rounded-xl transition-all cursor-pointer ${
                  currentPalette === palette.name 
                    ? 'ring-2 ring-offset-2 ring-primary scale-105' 
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: palette.background }}
                title={palette.name}
              >
                <div className="flex gap-1 justify-center pt-4">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: palette.primary }} 
                  />
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: palette.secondary }} 
                  />
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: palette.accent }} 
                  />
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-muted mt-3">
            {paletteList.find(p => p.name === currentPalette)?.name || 'Default'} theme active
          </p>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
          <h2 className="font-condensed text-sm font-semibold text-muted uppercase tracking-wider mb-4">About</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-foreground">App Name</span>
              <span className="text-sm text-muted">Gym Tracker</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-foreground">Version</span>
              <span className="text-sm text-muted">1.0.0</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-foreground">Storage</span>
              <span className="text-sm text-muted">Local (IndexedDB)</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
          <h2 className="font-condensed text-sm font-semibold text-muted uppercase tracking-wider mb-4">Data</h2>
          
          <p className="text-sm text-muted mb-4">
            Your workout data is stored locally on your device. No cloud sync currently available.
          </p>
          
          <button
            className="w-full py-3 px-4 font-condensed text-sm font-semibold text-red-500 border border-red-200 dark:border-red-800 rounded-xl transition-all hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
            onClick={() => {
              if (confirm('Are you sure you want to clear all workout data? This cannot be undone.')) {
                indexedDB.deleteDatabase('GymTrackerDB');
                window.location.reload();
              }
            }}
          >
            Clear All Data
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}