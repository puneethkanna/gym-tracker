import type { Workout } from './db';

export function exportToCSV(workouts: Workout[]): string {
  const headers = ['Exercise', 'Sets', 'Reps', 'Duration (min)', 'Weight (kg)', 'Date', 'Gym Tag'];
  const rows = workouts.map((w) => [
    w.exercise,
    w.sets,
    w.reps,
    w.duration,
    w.weight,
    new Date(w.date).toLocaleDateString(),
    w.gymTag || '',
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
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