import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Workout } from '@/lib/db';

export function useWorkouts() {
  const workouts = useLiveQuery(() => db.workouts.orderBy('date').reverse().toArray());

  async function addWorkout(workout: Omit<Workout, 'id'>): Promise<number> {
    const id = await db.workouts.add(workout as Workout);
    return id ?? 0;
  }

  async function updateWorkout(id: number, updates: Partial<Workout>): Promise<void> {
    await db.workouts.update(id, updates);
  }

  async function deleteWorkout(id: number): Promise<void> {
    await db.workouts.delete(id);
  }

  return {
    workouts: workouts ?? [],
    addWorkout,
    updateWorkout,
    deleteWorkout,
    isLoading: workouts === undefined,
  };
}