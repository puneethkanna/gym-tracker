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
  session: number;
}

export interface Palette {
  id?: number;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  cardBg: string;
  cardBorder: string;
  muted: string;
  isDefault: boolean;
  // Light mode only - use darkPrimary as "isDarkPalette" flag
  darkPrimary?: string;
  darkSecondary?: string;
  darkAccent?: string;
  darkBackground?: string;
  darkCardBg?: string;
  darkCardBorder?: string;
  darkMuted?: string;
}

export interface DarkPalette {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  cardBg: string;
  cardBorder: string;
  muted: string;
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

db.version(4).stores({
  workouts: '++id, exercise, date, gymTag, session',
  palettes: '++id, name, isDefault',
  gyms: '++id, name',
}).upgrade(tx => {
  return tx.table('workouts').toCollection().modify(workout => {
    if (workout.session === undefined) {
      workout.session = Math.random() < 0.5 ? 1 : 2;
    }
  });
});

export const defaultPalettes: Palette[] = [
  {
    name: 'Ocean',
    primary: '#0ea5e9',
    secondary: '#0369a1',
    accent: '#7dd3fc',
    background: '#f0f9ff',
    cardBg: '#e0f2fe',
    cardBorder: '#7dd3fc',
    muted: '#0c4a6e',
    isDefault: true,
    darkPrimary: '#38bdf8',
    darkSecondary: '#7dd3fc',
    darkAccent: '#0c4a6e',
    darkBackground: '#0f172a',
    darkCardBg: '#1e293b',
    darkCardBorder: '#38bdf8',
    darkMuted: '#94a3b8',
  },
  {
    name: 'Sunset',
    primary: '#f97316',
    secondary: '#ea580c',
    accent: '#fdba74',
    background: '#fff7ed',
    cardBg: '#ffedd5',
    cardBorder: '#fdba74',
    muted: '#7c2d12',
    isDefault: false,
    darkPrimary: '#fb923c',
    darkSecondary: '#fdba74',
    darkAccent: '#7c2d12',
    darkBackground: '#1c1917',
    darkCardBg: '#292524',
    darkCardBorder: '#fb923c',
    darkMuted: '#a8a29e',
  },
  {
    name: 'Forest',
    primary: '#22c55e',
    secondary: '#16a34a',
    accent: '#86efac',
    background: '#f0fdf4',
    cardBg: '#dcfce7',
    cardBorder: '#86efac',
    muted: '#14532d',
    isDefault: false,
    darkPrimary: '#4ade80',
    darkSecondary: '#86efac',
    darkAccent: '#14532d',
    darkBackground: '#052e16',
    darkCardBg: '#14532d',
    darkCardBorder: '#4ade80',
    darkMuted: '#86efac',
  },
  {
    name: 'Lavender',
    primary: '#a855f7',
    secondary: '#9333ea',
    accent: '#d8b4fe',
    background: '#faf5ff',
    cardBg: '#f3e8ff',
    cardBorder: '#d8b4fe',
    muted: '#581c87',
    isDefault: false,
    darkPrimary: '#c084fc',
    darkSecondary: '#d8b4fe',
    darkAccent: '#581c87',
    darkBackground: '#2e1065',
    darkCardBg: '#4c1d95',
    darkCardBorder: '#c084fc',
    darkMuted: '#d8b4fe',
  },
  {
    name: 'Midnight',
    primary: '#6366f1',
    secondary: '#4338ca',
    accent: '#818cf8',
    background: '#f8fafc',
    cardBg: '#e2e8f0',
    cardBorder: '#6366f1',
    muted: '#475569',
    isDefault: false,
    darkPrimary: '#818cf8',
    darkSecondary: '#a5b4fc',
    darkAccent: '#4338ca',
    darkBackground: '#0f172a',
    darkCardBg: '#1e1b4b',
    darkCardBorder: '#818cf8',
    darkMuted: '#c7d2fe',
  },
  {
    name: 'Rose',
    primary: '#f43f5e',
    secondary: '#e11d48',
    accent: '#fda4af',
    background: '#fff1f2',
    cardBg: '#ffe4e6',
    cardBorder: '#fda4af',
    muted: '#881337',
    isDefault: false,
    darkPrimary: '#fb7185',
    darkSecondary: '#fda4af',
    darkAccent: '#881337',
    darkBackground: '#1f1015',
    darkCardBg: '#2f131c',
    darkCardBorder: '#fb7185',
    darkMuted: '#fda4af',
  },
  {
    name: 'System',
    primary: '#6750A4',
    secondary: '#625B71',
    accent: '#7D5260',
    background: '#FEF7FF',
    cardBg: '#F3EDF7',
    cardBorder: '#CAC4D0',
    muted: '#49454F',
    isDefault: false,
    darkPrimary: '#D0BCFF',
    darkSecondary: '#CCC2DC',
    darkAccent: '#EFB8C8',
    darkBackground: '#141218',
    darkCardBg: '#211F26',
    darkCardBorder: '#49454F',
    darkMuted: '#938F99',
  },
];

export const darkPalettes: DarkPalette[] = [
  {
    name: 'Ocean Night',
    primary: '#38bdf8',
    secondary: '#7dd3fc',
    accent: '#0c4a6e',
    background: '#0f172a',
    cardBg: '#1e293b',
    cardBorder: '#38bdf8',
    muted: '#94a3b8',
  },
  {
    name: 'Ember Night',
    primary: '#fb923c',
    secondary: '#fdba74',
    accent: '#7c2d12',
    background: '#1c1917',
    cardBg: '#292524',
    cardBorder: '#fb923c',
    muted: '#a8a29e',
  },
  {
    name: 'Forest Night',
    primary: '#4ade80',
    secondary: '#86efac',
    accent: '#14532d',
    background: '#052e16',
    cardBg: '#14532d',
    cardBorder: '#4ade80',
    muted: '#86efac',
  },
  {
    name: 'Violet Night',
    primary: '#c084fc',
    secondary: '#d8b4fe',
    accent: '#581c87',
    background: '#2e1065',
    cardBg: '#4c1d95',
    cardBorder: '#c084fc',
    muted: '#d8b4fe',
  },
  {
    name: 'Midnight Dark',
    primary: '#818cf8',
    secondary: '#a5b4fc',
    accent: '#4338ca',
    background: '#0f172a',
    cardBg: '#1e1b4b',
    cardBorder: '#818cf8',
    muted: '#c7d2fe',
  },
  {
    name: 'Rose Night',
    primary: '#fb7185',
    secondary: '#fda4af',
    accent: '#881337',
    background: '#1f1015',
    cardBg: '#2f131c',
    cardBorder: '#fb7185',
    muted: '#fda4af',
  },
  {
    name: 'Slate Night',
    primary: '#94a3b8',
    secondary: '#cbd5e1',
    accent: '#64748b',
    background: '#0f172a',
    cardBg: '#1e293b',
    cardBorder: '#475569',
    muted: '#e2e8f0',
  },
  {
    name: 'System Dark',
    primary: '#D0BCFF',
    secondary: '#CCC2DC',
    accent: '#EFB8C8',
    background: '#141218',
    cardBg: '#211F26',
    cardBorder: '#49454F',
    muted: '#938F99',
  },
];

export { db };