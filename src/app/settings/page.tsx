'use client';

import { BottomNav } from '@/components/BottomNav';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import { ExportButton } from '@/components/ExportButton';
import { useAppStore } from '@/lib/store';
import { usePalettes } from '@/hooks/usePalettes';
import { defaultPalettes as defaultPaletteList } from '@/lib/db';

type ThemeMode = 'light' | 'dark' | 'system';

export default function SettingsPage() {
  const { currentPalette, setCurrentPalette, themeMode, setThemeMode } = useAppStore();
  const { palettes, isLoading } = usePalettes();

  const paletteList = isLoading ? defaultPaletteList : palettes;
  const activePalette = paletteList.find(p => p.name === currentPalette) || paletteList[0];
  const headerBg = activePalette?.background ? `${activePalette.background}cc` : '#ffffffcc';

  const themeModeLabels: Record<ThemeMode, string> = {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  };

  return (
    <div className="min-h-screen pb-20">
      <ServiceWorkerRegistration />
      
      <header className="fixed top-0 left-0 right-0 z-40 glass h-16" style={{ backgroundColor: headerBg, borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
        <div className="max-w-md mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-xl font-bold tracking-wide" style={{ color: 'var(--foreground)', fontFamily: 'var(--md-sys-typescale-title-large-font)' }}>SETTINGS</h1>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Customize your app</p>
        </div>
      </header>

      <main className="pt-16 px-4 pb-4 max-w-md mx-auto space-y-4">
        <div className="p-4 rounded-3xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--outline-variant)' }}>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>Theme Mode</h2>
          <div className="flex gap-2">
            {(['light', 'dark', 'system'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setThemeMode(mode)}
                className="flex-1 py-3 px-4 text-sm font-medium rounded-2xl transition-all cursor-pointer"
                style={{ 
                  backgroundColor: themeMode === mode ? 'var(--primary)' : 'var(--surface-container-high)',
                  color: themeMode === mode ? 'var(--on-primary)' : 'var(--foreground)',
                  border: '1px solid var(--outline-variant)'
                }}
              >
                {themeModeLabels[mode]}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-3xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--outline-variant)' }}>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>Palette</h2>
          <div className="flex gap-3 flex-wrap">
            {paletteList.map((palette) => (
              <button
                key={palette.name}
                onClick={() => setCurrentPalette(palette.name)}
                className="flex-shrink-0 w-14 h-14 rounded-2xl transition-all cursor-pointer"
                style={{ 
                  backgroundColor: palette.background,
                  border: currentPalette === palette.name ? '2px solid var(--primary)' : '2px solid transparent'
                }}
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
          <p className="text-xs mt-3" style={{ color: 'var(--muted)' }}>
            {paletteList.find(p => p.name === currentPalette)?.name || 'Default'} palette active
          </p>
        </div>

        <div className="p-4 rounded-3xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--outline-variant)' }}>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>Export</h2>
          <ExportButton />
        </div>

        <div className="p-4 rounded-3xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--outline-variant)' }}>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>About</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid var(--outline-variant)' }}>
              <span className="text-sm" style={{ color: 'var(--foreground)' }}>App Name</span>
              <span className="text-sm" style={{ color: 'var(--muted)' }}>Gym Tracker</span>
            </div>
            <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid var(--outline-variant)' }}>
              <span className="text-sm" style={{ color: 'var(--foreground)' }}>Version</span>
              <span className="text-sm" style={{ color: 'var(--muted)' }}>1.0.0</span>
            </div>
            <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid var(--outline-variant)' }}>
              <span className="text-sm" style={{ color: 'var(--foreground)' }}>Storage</span>
              <span className="text-sm" style={{ color: 'var(--muted)' }}>Local (IndexedDB)</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-3xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--outline-variant)' }}>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>Data</h2>
          
          <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
            Your workout data is stored locally on your device. No cloud sync currently available.
          </p>
          
          <button
            className="w-full py-3 px-4 text-sm font-semibold rounded-2xl transition-all cursor-pointer"
            style={{ 
              color: 'var(--error)',
              border: '1px solid var(--error)',
              backgroundColor: 'transparent'
            }}
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