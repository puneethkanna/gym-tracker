import type { Workout } from './db';

export function exportToCSV(workouts: Workout[]): string {
  const headers = ['Exercise', 'Set', 'Reps', 'Weight (kg)', 'Date', 'Gym Tag', 'Session', 'Duration (min)'];
  const rows: any[][] = [];
  workouts.forEach(w => {
    const dateStr = new Date(w.date).toLocaleDateString();
    w.setDetails.forEach((set, idx) => {
      rows.push([
        w.exercise,
        idx + 1,
        set.reps,
        set.weight,
        dateStr,
        w.gymTag || '',
        w.session,
        w.duration,
      ]);
    });
  });
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function exportToJSON(workouts: Workout[]): string {
  return JSON.stringify(workouts, null, 2);
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}