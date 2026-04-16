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
    return null;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Export</h2>
      <div className="flex gap-2">
        <button
          onClick={handleExportCSV}
          className="flex-1 py-2 px-3 text-sm font-medium border rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          CSV
        </button>
        <button
          onClick={handleExportJSON}
          className="flex-1 py-2 px-3 text-sm font-medium border rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          JSON
        </button>
      </div>
    </div>
  );
}