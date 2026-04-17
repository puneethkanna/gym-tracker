'use client';

import { useWorkouts } from '@/hooks/useWorkouts';
import { exportToCSV, exportToJSON, downloadFile } from '@/lib/export';

export function ExportButton() {
  const { workouts } = useWorkouts();

  const handleExportCSV = () => {
    const csv = exportToCSV(workouts);
    downloadFile(csv, `workouts-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  };

  const handleExportJSON = () => {
    const json = exportToJSON(workouts);
    downloadFile(json, `workouts-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
  };

  if (workouts.length === 0) {
    return (
      <p className="text-sm" style={{ color: 'var(--muted)' }}>No workouts to export</p>
    );
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleExportCSV}
        className="flex-1 py-3 px-4 text-sm font-medium rounded-2xl transition-colors cursor-pointer flex items-center justify-center gap-2"
        style={{ color: 'var(--foreground)', border: '1px solid var(--outline-variant)', backgroundColor: 'transparent' }}
      >
        <svg className="w-5 h-5" style={{ color: 'var(--muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        CSV
      </button>
      <button
        onClick={handleExportJSON}
        className="flex-1 py-3 px-4 text-sm font-medium rounded-2xl transition-colors cursor-pointer flex items-center justify-center gap-2"
        style={{ color: 'var(--foreground)', border: '1px solid var(--outline-variant)', backgroundColor: 'transparent' }}
      >
        <svg className="w-5 h-5" style={{ color: 'var(--muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        JSON
      </button>
    </div>
  );
}