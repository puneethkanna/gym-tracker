'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { defaultPalettes, darkPalettes, type Palette, type DarkPalette } from '@/lib/db';

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function isDarkMode(themeMode: 'light' | 'dark' | 'system'): boolean {
  if (typeof window === 'undefined') return false;
  if (themeMode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return themeMode === 'dark';
}

function getPaletteNameMapping(lightName: string): string {
  const mapping: Record<string, string> = {
    'Ocean': 'Ocean Night',
    'Sunset': 'Ember Night',
    'Forest': 'Forest Night',
    'Lavender': 'Violet Night',
    'Midnight': 'Midnight Dark',
    'Rose': 'Rose Night',
    'System': 'System Dark',
  };
  return mapping[lightName] || 'Slate Night';
}

function generateMd3Scheme(palette: Palette | DarkPalette, isDark: boolean = false) {
  const primary = hexToRgb(palette.primary);
  const secondary = hexToRgb(palette.secondary);
  const tertiary = hexToRgb(palette.accent);
  const error = { r: 179, g: 38, b: 30 };
  
  if (isDark) {
    const background = hexToRgb(palette.background);
    const onBackground = hexToRgb(palette.muted);
    const surfaceVariant = { r: 51, g: 65, b: 85 };
    const outline = { r: 100, g: 116, b: 139 };
    
    const onPrimaryBg = background.r < 128 ? '#1e1b4b' : '#1e1b4b';
    
    return {
      primary: rgbToHex(primary.r, primary.g, primary.b),
      onPrimary: onPrimaryBg,
      primaryContainer: rgbToHex(Math.round(primary.r * 0.4 + 30 * 0.6), Math.round(primary.g * 0.4 + 30 * 0.6), Math.round(primary.b * 0.4 + 75 * 0.6)),
      onPrimaryContainer: '#e0e7ff',
      secondary: rgbToHex(secondary.r, secondary.g, secondary.b),
      onSecondary: '#1e293b',
      secondaryContainer: rgbToHex(Math.round(secondary.r * 0.5 + 30 * 0.5), Math.round(secondary.g * 0.5 + 30 * 0.5), Math.round(secondary.b * 0.5 + 75 * 0.5)),
      onSecondaryContainer: '#e0e7ff',
      tertiary: rgbToHex(tertiary.r, tertiary.g, tertiary.b),
      onTertiary: '#312e81',
      tertiaryContainer: rgbToHex(Math.round(tertiary.r * 0.5 + 30 * 0.5), Math.round(tertiary.g * 0.5 + 30 * 0.5), Math.round(tertiary.b * 0.5 + 75 * 0.5)),
      onTertiaryContainer: '#e0e7ff',
      error: '#fca5a5',
      onError: '#7f1d1d',
      errorContainer: '#991b1b',
      onErrorContainer: '#fee2e2',
      background: rgbToHex(background.r, background.g, background.b),
      onBackground: rgbToHex(onBackground.r, onBackground.g, onBackground.b),
      surface: rgbToHex(background.r, background.g, background.b),
      onSurface: rgbToHex(onBackground.r, onBackground.g, onBackground.b),
      surfaceVariant: rgbToHex(surfaceVariant.r, surfaceVariant.g, surfaceVariant.b),
      onSurfaceVariant: rgbToHex(onBackground.r, onBackground.g, onBackground.b),
      surfaceContainer: palette.cardBg,
      surfaceContainerLow: rgbToHex(Math.max(0, background.r - 20), Math.max(0, background.g - 20), Math.max(0, background.b - 20)),
      surfaceContainerHigh: palette.cardBg,
      surfaceContainerHighest: rgbToHex(Math.min(255, background.r + 30), Math.min(255, background.g + 30), Math.min(255, background.b + 30)),
      surfaceDim: rgbToHex(background.r, background.g, background.b),
      surfaceBright: rgbToHex(Math.min(255, background.r + 40), Math.min(255, background.g + 40), Math.min(255, background.b + 40)),
      outline: rgbToHex(outline.r, outline.g, outline.b),
      outlineVariant: palette.cardBorder,
      inverseSurface: onBackground.r < 128 ? '#e2e8f0' : '#1e293b',
      inverseOnSurface: background.r < 128 ? '#1e293b' : '#e2e8f0',
      inversePrimary: rgbToHex(primary.r, primary.g, primary.b),
      shadow: '#000000',
      scrim: '#000000',
      cardBg: palette.cardBg,
      cardBorder: palette.cardBorder,
      muted: palette.muted,
    };
  }
  
  const surface = { r: 255, g: 251, b: 250 };
  const onSurface = { r: 15, g: 23, b: 42 };
  const surfaceVariant = { r: 241, g: 245, b: 249 };
  const outline = { r: 148, g: 163, b: 184 };
  
  return {
    primary: rgbToHex(primary.r, primary.g, primary.b),
    onPrimary: '#ffffff',
    primaryContainer: rgbToHex(Math.round(primary.r * 0.9 + 227 * 0.1), Math.round(primary.g * 0.9 + 234 * 0.1), Math.round(primary.b * 0.9 + 255 * 0.1)),
    onPrimaryContainer: '#21005e',
    secondary: rgbToHex(secondary.r, secondary.g, secondary.b),
    onSecondary: '#ffffff',
    secondaryContainer: 'rgb(221, 214, 254)',
    onSecondaryContainer: '#1e1b4f',
    tertiary: rgbToHex(tertiary.r, tertiary.g, tertiary.b),
    onTertiary: '#ffffff',
    tertiaryContainer: 'rgb(255, 217, 227)',
    onTertiaryContainer: '#3b151c',
    error: '#b91c1c',
    onError: '#ffffff',
    errorContainer: '#fef2f2',
    onErrorContainer: '#7f1d1d',
    background: rgbToHex(surface.r, surface.g, surface.b),
    onBackground: rgbToHex(onSurface.r, onSurface.g, onSurface.b),
    surface: rgbToHex(surface.r, surface.g, surface.b),
    onSurface: rgbToHex(onSurface.r, onSurface.g, onSurface.b),
    surfaceVariant: rgbToHex(surfaceVariant.r, surfaceVariant.g, surfaceVariant.b),
    onSurfaceVariant: '#475569',
    surfaceContainer: '#f8fafc',
    surfaceContainerLow: 'rgb(248, 250, 251)',
    surfaceContainerHigh: 'rgb(241, 245, 249)',
    surfaceContainerHighest: 'rgb(226, 232, 240)',
    surfaceDim: '#f1f5f9',
    surfaceBright: '#ffffff',
    outline: rgbToHex(outline.r, outline.g, outline.b),
    outlineVariant: '#e2e8f0',
    inverseSurface: '#1e293b',
    inverseOnSurface: '#f1f5f9',
    inversePrimary: rgbToHex(primary.r, primary.g, primary.b),
    shadow: '#000000',
    scrim: '#000000',
    cardBg: palette.cardBg,
    cardBorder: palette.cardBorder,
    muted: palette.muted,
  };
}

export function PaletteProvider() {
  const { currentPalette, themeMode } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const applyTheme = () => {
    if (!mounted || typeof window === 'undefined') return;
    
    const dark = isDarkMode(themeMode);
    
    let activePalette: Palette | DarkPalette;
    
    if (dark) {
      // In dark mode, use darkPalettes
      const darkPaletteName = getPaletteNameMapping(currentPalette);
      const foundDark = darkPalettes.find(p => p.name === darkPaletteName);
      activePalette = foundDark || darkPalettes[0];
    } else {
      // In light mode, use regular palettes
      const found = defaultPalettes.find(p => p.name === currentPalette);
      activePalette = found || defaultPalettes[0];
    }

    const scheme = generateMd3Scheme(activePalette, dark);

    const root = document.documentElement;
    
    root.style.setProperty('--md-sys-color-primary', scheme.primary);
    root.style.setProperty('--md-sys-color-on-primary', scheme.onPrimary);
    root.style.setProperty('--md-sys-color-primary-container', scheme.primaryContainer);
    root.style.setProperty('--md-sys-color-on-primary-container', scheme.onPrimaryContainer);
    root.style.setProperty('--md-sys-color-secondary', scheme.secondary);
    root.style.setProperty('--md-sys-color-on-secondary', scheme.onSecondary);
    root.style.setProperty('--md-sys-color-secondary-container', scheme.secondaryContainer);
    root.style.setProperty('--md-sys-color-on-secondary-container', scheme.onSecondaryContainer);
    root.style.setProperty('--md-sys-color-tertiary', scheme.tertiary);
    root.style.setProperty('--md-sys-color-on-tertiary', scheme.onTertiary);
    root.style.setProperty('--md-sys-color-tertiary-container', scheme.tertiaryContainer);
    root.style.setProperty('--md-sys-color-on-tertiary-container', scheme.onTertiaryContainer);
    root.style.setProperty('--md-sys-color-error', scheme.error);
    root.style.setProperty('--md-sys-color-on-error', scheme.onError);
    root.style.setProperty('--md-sys-color-error-container', scheme.errorContainer);
    root.style.setProperty('--md-sys-color-on-error-container', scheme.onErrorContainer);
    root.style.setProperty('--md-sys-color-background', scheme.background);
    root.style.setProperty('--md-sys-color-on-background', scheme.onBackground);
    root.style.setProperty('--md-sys-color-surface', scheme.surface);
    root.style.setProperty('--md-sys-color-on-surface', scheme.onSurface);
    root.style.setProperty('--md-sys-color-surface-variant', scheme.surfaceVariant);
    root.style.setProperty('--md-sys-color-on-surface-variant', scheme.onSurfaceVariant);
    root.style.setProperty('--md-sys-color-surface-container', scheme.surfaceContainer);
    root.style.setProperty('--md-sys-color-surface-container-low', scheme.surfaceContainerLow);
    root.style.setProperty('--md-sys-color-surface-container-high', scheme.surfaceContainerHigh);
    root.style.setProperty('--md-sys-color-surface-container-highest', scheme.surfaceContainerHighest);
    root.style.setProperty('--md-sys-color-surface-dim', scheme.surfaceDim);
    root.style.setProperty('--md-sys-color-surface-bright', scheme.surfaceBright);
    root.style.setProperty('--md-sys-color-outline', scheme.outline);
    root.style.setProperty('--md-sys-color-outline-variant', scheme.outlineVariant);
    root.style.setProperty('--md-sys-color-inverse-surface', scheme.inverseSurface);
    root.style.setProperty('--md-sys-color-inverse-on-surface', scheme.inverseOnSurface);
    root.style.setProperty('--md-sys-color-inverse-primary', scheme.inversePrimary);
    root.style.setProperty('--md-sys-color-shadow', scheme.shadow);
    root.style.setProperty('--md-sys-color-scrim', scheme.scrim);

    root.style.setProperty('--primary', scheme.primary);
    root.style.setProperty('--primary-hover', scheme.primaryContainer);
    root.style.setProperty('--primary-light', scheme.secondaryContainer);
    root.style.setProperty('--secondary', scheme.secondary);
    root.style.setProperty('--accent', scheme.tertiary);
    root.style.setProperty('--background', scheme.background);
    root.style.setProperty('--foreground', scheme.onBackground);
    root.style.setProperty('--card-bg', scheme.cardBg);
    root.style.setProperty('--card-border', scheme.cardBorder);
    root.style.setProperty('--muted', scheme.muted);
    root.style.setProperty('--muted-light', scheme.outline);
    root.style.setProperty('--danger', scheme.error);
    root.style.setProperty('--glass-bg', dark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)');
    root.style.setProperty('--glass-border', dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)');
    root.style.setProperty('--surface', scheme.surface);
    root.style.setProperty('--surface-variant', scheme.surfaceVariant);
    root.style.setProperty('--surface-container', scheme.surfaceContainer);
    root.style.setProperty('--surface-container-high', scheme.surfaceContainerHigh);
    root.style.setProperty('--outline', scheme.outline);
    root.style.setProperty('--outline-variant', scheme.outlineVariant);
    
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (mounted) {
      applyTheme();
    }
  }, [currentPalette, themeMode, mounted]);

  useEffect(() => {
    if (!mounted || themeMode !== 'system' || typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      applyTheme();
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [currentPalette, themeMode, mounted]);

  return null;
}