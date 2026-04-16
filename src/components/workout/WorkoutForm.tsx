'use client';

import { useState, useRef, useEffect } from 'react';
import { useWorkouts } from '@/hooks/useWorkouts';
import { exerciseLibrary, type MuscleGroup } from '@/lib/db';

interface WorkoutFormProps {
  onSuccess?: () => void;
}

export function WorkoutForm({ onSuccess }: WorkoutFormProps) {
  const { addWorkout } = useWorkouts();
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [gymTag, setGymTag] = useState('');
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredExercises, setFilteredExercises] = useState(exerciseLibrary);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (exercise.trim()) {
      const filtered = exerciseLibrary.filter(e => 
        e.name.toLowerCase().includes(exercise.toLowerCase())
      );
      setFilteredExercises(filtered);
      setShowDropdown(filtered.length > 0 && filtered.length < exerciseLibrary.length);
    } else {
      setFilteredExercises(exerciseLibrary.slice(0, 10));
      setShowDropdown(false);
    }
  }, [exercise]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getExerciseMuscleGroups = (exerciseName: string): MuscleGroup[] => {
    const found = exerciseLibrary.find(e => e.name === exerciseName);
    return found?.muscleGroups || [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!exercise.trim()) {
        setError('Please select an exercise');
        setIsSubmitting(false);
        return;
      }

      await addWorkout({
        exercise: exercise.trim(),
        muscleGroups: getExerciseMuscleGroups(exercise.trim()),
        sets: parseInt(sets) || 0,
        reps: parseInt(reps) || 0,
        duration: 0,
        weight: parseFloat(weight) || 0,
        date: new Date(workoutDate + 'T' + new Date().toTimeString().slice(0,8)),
        gymTag: gymTag.trim() || undefined,
      });

      setExercise('');
      setSets('');
      setReps('');
      setWeight('');
      setGymTag('');
      setWorkoutDate(new Date().toISOString().split('T')[0]);
      setShowDetails(false);
      onSuccess?.();
    } catch {
      setError('Failed to save workout');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="p-3 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30">
          {error}
        </div>
      )}

      <div className="space-y-2" ref={dropdownRef}>
        <div className="relative">
          <input
            type="text"
            value={exercise}
            onChange={(e) => {
              setExercise(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(filteredExercises.length > 0)}
            placeholder="Search exercise..."
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-gray-700 transition-all cursor-pointer"
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          {showDropdown && filteredExercises.length > 0 && (
            <div className="absolute z-30 w-full mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 max-h-48 overflow-y-auto">
              {filteredExercises.slice(0, 8).map((ex) => (
                <button
                  key={ex.name}
                  type="button"
                  onClick={() => {
                    setExercise(ex.name);
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between items-center cursor-pointer transition-colors"
                >
                  <span className="font-medium text-foreground">{ex.name}</span>
                  <span className="text-xs text-muted capitalize">{ex.muscleGroups[0]}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="relative">
            <input
              type="number"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl text-center font-condensed text-lg font-semibold cursor-pointer"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted uppercase tracking-wide">sets</span>
          </div>
          <div className="relative">
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl text-center font-condensed text-lg font-semibold cursor-pointer"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted uppercase tracking-wide">reps</span>
          </div>
          <div className="relative">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl text-center font-condensed text-lg font-semibold cursor-pointer"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted uppercase tracking-wide">kg</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-muted hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
        >
          <svg className={`w-3 h-3 transition-transform ${showDetails ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {showDetails ? 'Less' : 'More'} details
        </button>

        {showDetails && (
          <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <input
              type="date"
              value={workoutDate}
              onChange={(e) => setWorkoutDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl text-sm cursor-pointer"
            />
            <input
              type="text"
              value={gymTag}
              onChange={(e) => setGymTag(e.target.value)}
              placeholder="Gym location (optional)"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl text-sm cursor-pointer"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 font-condensed text-base font-semibold text-white rounded-xl transition-all hover:opacity-90 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        style={{ backgroundColor: 'var(--primary, #F97316)' }}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Saving...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Log Workout
          </span>
        )}
      </button>
    </form>
  );
}
