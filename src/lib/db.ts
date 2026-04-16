import Dexie, { type EntityTable } from 'dexie';

export type MuscleGroup = 
  | 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' 
  | 'forearms' | 'core' | 'quadriceps' | 'hamstrings' 
  | 'glutes' | 'calves' | 'fullbody' | 'cardio';

export interface Exercise {
  name: string;
  muscleGroups: MuscleGroup[];
  equipment: string[];
}

export const exerciseLibrary: Exercise[] = [
  { name: 'Bench Press', muscleGroups: ['chest', 'triceps', 'shoulders'], equipment: ['barbell'] },
  { name: 'Incline Bench Press', muscleGroups: ['chest', 'triceps', 'shoulders'], equipment: ['barbell'] },
  { name: 'Decline Bench Press', muscleGroups: ['chest', 'triceps'], equipment: ['barbell'] },
  { name: 'Dumbbell Press', muscleGroups: ['chest', 'triceps', 'shoulders'], equipment: ['dumbbell'] },
  { name: 'Incline Dumbbell Press', muscleGroups: ['chest', 'triceps', 'shoulders'], equipment: ['dumbbell'] },
  { name: 'Dumbbell Fly', muscleGroups: ['chest'], equipment: ['dumbbell'] },
  { name: 'Cable Crossover', muscleGroups: ['chest'], equipment: ['cable'] },
  { name: 'Push-ups', muscleGroups: ['chest', 'triceps', 'core'], equipment: ['bodyweight'] },
  { name: 'Chest Dips', muscleGroups: ['chest', 'triceps', 'shoulders'], equipment: ['bodyweight'] },
  { name: 'Squat', muscleGroups: ['quadriceps', 'glutes', 'core'], equipment: ['barbell'] },
  { name: 'Front Squat', muscleGroups: ['quadriceps', 'core', 'glutes'], equipment: ['barbell'] },
  { name: 'Leg Press', muscleGroups: ['quadriceps', 'glutes', 'hamstrings'], equipment: ['machine'] },
  { name: 'Lunges', muscleGroups: ['quadriceps', 'glutes', 'hamstrings'], equipment: ['dumbbell'] },
  { name: 'Leg Extension', muscleGroups: ['quadriceps'], equipment: ['machine'] },
  { name: 'Leg Curl', muscleGroups: ['hamstrings'], equipment: ['machine'] },
  { name: 'Romanian Deadlift', muscleGroups: ['hamstrings', 'glutes', 'back'], equipment: ['barbell'] },
  { name: 'Deadlift', muscleGroups: ['back', 'quadriceps', 'glutes', 'core'], equipment: ['barbell'] },
  { name: 'Hip Thrust', muscleGroups: ['glutes', 'hamstrings'], equipment: ['barbell'] },
  { name: 'Calf Raises', muscleGroups: ['calves'], equipment: ['machine'] },
  { name: 'Pull-ups', muscleGroups: ['back', 'biceps'], equipment: ['bodyweight'] },
  { name: 'Chin-ups', muscleGroups: ['back', 'biceps'], equipment: ['bodyweight'] },
  { name: 'Lat Pulldown', muscleGroups: ['back', 'biceps'], equipment: ['cable'] },
  { name: 'Seated Cable Row', muscleGroups: ['back', 'biceps'], equipment: ['cable'] },
  { name: 'Bent Over Row', muscleGroups: ['back', 'biceps'], equipment: ['barbell'] },
  { name: 'T-Bar Row', muscleGroups: ['back', 'biceps'], equipment: ['barbell'] },
  { name: 'Dumbbell Row', muscleGroups: ['back', 'biceps'], equipment: ['dumbbell'] },
  { name: 'Face Pull', muscleGroups: ['shoulders', 'back'], equipment: ['cable'] },
  { name: 'Overhead Press', muscleGroups: ['shoulders', 'triceps'], equipment: ['barbell'] },
  { name: 'Dumbbell Shoulder Press', muscleGroups: ['shoulders', 'triceps'], equipment: ['dumbbell'] },
  { name: 'Lateral Raise', muscleGroups: ['shoulders'], equipment: ['dumbbell'] },
  { name: 'Front Raise', muscleGroups: ['shoulders'], equipment: ['dumbbell'] },
  { name: 'Rear Delt Fly', muscleGroups: ['shoulders', 'back'], equipment: ['dumbbell'] },
  { name: 'Shrugs', muscleGroups: ['shoulders'], equipment: ['dumbbell'] },
  { name: 'Barbell Curl', muscleGroups: ['biceps'], equipment: ['barbell'] },
  { name: 'Dumbbell Curl', muscleGroups: ['biceps'], equipment: ['dumbbell'] },
  { name: 'Hammer Curl', muscleGroups: ['biceps', 'forearms'], equipment: ['dumbbell'] },
  { name: 'Preacher Curl', muscleGroups: ['biceps'], equipment: ['barbell'] },
  { name: 'Concentration Curl', muscleGroups: ['biceps'], equipment: ['dumbbell'] },
  { name: 'Tricep Pushdown', muscleGroups: ['triceps'], equipment: ['cable'] },
  { name: 'Tricep Dips', muscleGroups: ['triceps', 'chest'], equipment: ['bodyweight'] },
  { name: 'Skull Crushers', muscleGroups: ['triceps'], equipment: ['barbell'] },
  { name: 'Overhead Tricep Extension', muscleGroups: ['triceps'], equipment: ['dumbbell'] },
  { name: 'Close Grip Bench Press', muscleGroups: ['triceps', 'chest'], equipment: ['barbell'] },
  { name: 'Wrist Curls', muscleGroups: ['forearms'], equipment: ['dumbbell'] },
  { name: 'Reverse Wrist Curls', muscleGroups: ['forearms'], equipment: ['dumbbell'] },
  { name: 'Plank', muscleGroups: ['core'], equipment: ['bodyweight'] },
  { name: 'Crunches', muscleGroups: ['core'], equipment: ['bodyweight'] },
  { name: 'Leg Raises', muscleGroups: ['core'], equipment: ['bodyweight'] },
  { name: 'Cable Woodchop', muscleGroups: ['core'], equipment: ['cable'] },
  { name: 'Ab Wheel Rollout', muscleGroups: ['core'], equipment: ['other'] },
  { name: 'Running', muscleGroups: ['cardio', 'quadriceps', 'calves'], equipment: ['treadmill'] },
  { name: 'Cycling', muscleGroups: ['cardio', 'quadriceps', 'calves'], equipment: ['bike'] },
  { name: 'Rowing', muscleGroups: ['cardio', 'back', 'biceps'], equipment: ['machine'] },
  { name: 'Jump Rope', muscleGroups: ['cardio', 'calves'], equipment: ['other'] },
  { name: 'Burpees', muscleGroups: ['fullbody', 'cardio'], equipment: ['bodyweight'] },
  { name: 'Kettlebell Swing', muscleGroups: ['glutes', 'core', 'shoulders'], equipment: ['kettlebell'] },
];

export const muscleGroupLabels: Record<MuscleGroup, string> = {
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearms: 'Forearms',
  core: 'Core',
  quadriceps: 'Quadriceps',
  hamstrings: 'Hamstrings',
  glutes: 'Glutes',
  calves: 'Calves',
  fullbody: 'Full Body',
  cardio: 'Cardio',
};

export interface Workout {
  id?: number;
  exercise: string;
  muscleGroups: MuscleGroup[];
  sets: number;
  reps: number;
  duration: number;
  weight: number;
  date: Date;
  gymTag?: string;
}

export interface Palette {
  id?: number;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  isDefault: boolean;
}

export interface Gym {
  id?: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

const db = new Dexie('GymTrackerDB') as Dexie & {
  workouts: EntityTable<Workout, 'id'>;
  palettes: EntityTable<Palette, 'id'>;
  gyms: EntityTable<Gym, 'id'>;
};

db.version(2).stores({
  workouts: '++id, exercise, date, gymTag',
  palettes: '++id, name, isDefault',
  gyms: '++id, name',
});

export const defaultPalettes: Palette[] = [
  {
    name: 'Ocean',
    primary: '#0ea5e9',
    secondary: '#0369a1',
    accent: '#7dd3fc',
    background: '#f0f9ff',
    isDefault: true,
  },
  {
    name: 'Sunset',
    primary: '#f97316',
    secondary: '#ea580c',
    accent: '#fdba74',
    background: '#fff7ed',
    isDefault: false,
  },
  {
    name: 'Forest',
    primary: '#22c55e',
    secondary: '#16a34a',
    accent: '#86efac',
    background: '#f0fdf4',
    isDefault: false,
  },
  {
    name: 'Lavender',
    primary: '#a855f7',
    secondary: '#9333ea',
    accent: '#d8b4fe',
    background: '#faf5ff',
    isDefault: false,
  },
  {
    name: 'Midnight',
    primary: '#6366f1',
    secondary: '#4338ca',
    accent: '#818cf8',
    background: '#0f172a',
    isDefault: false,
  },
  {
    name: 'Rose',
    primary: '#f43f5e',
    secondary: '#e11d48',
    accent: '#fda4af',
    background: '#fff1f2',
    isDefault: false,
  },
];

export { db };