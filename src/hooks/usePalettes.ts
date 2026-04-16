'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db, defaultPalettes, type Palette } from '@/lib/db';

async function initializePalettes() {
  const existing = await db.palettes.count();
  if (existing === 0) {
    await db.palettes.bulkAdd(defaultPalettes);
  }
}

if (typeof window !== 'undefined') {
  initializePalettes();
}

export function usePalettes() {
  const palettes = useLiveQuery(() => db.palettes.toArray());

  async function getPaletteByName(name: string): Promise<Palette | undefined> {
    return db.palettes.where('name').equals(name).first();
  }

  return {
    palettes: palettes ?? defaultPalettes,
    getPaletteByName,
    isLoading: palettes === undefined,
  };
}