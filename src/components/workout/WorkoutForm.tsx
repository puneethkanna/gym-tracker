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
  const [numSets, setNumSets] = useState('');
  const [setEntries, setSetEntries] = useState<Array<{ reps: string; weight: string }>>([]);
  const [gymTag, setGymTag] = useState('');
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split('T')[0]);
  const [session, setSession] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredExercises, setFilteredExercises] = useState(exerciseLibrary.slice(0, 10));
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync setEntries length with numSets
  useEffect(() => {
    const count = parseInt(numSets) || 0;
    setSetEntries(prev => {
      if (count > prev.length) {
        const newEntries = [...prev];
        for (let i = prev.length; i < count; i++) {
          newEntries.push({ reps: '', weight: '' });
        }
        return newEntries;
      } else if (count < prev.length) {
        return prev.slice(0, count);
      }
      return prev;
    });
  }, [numSets]);

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

  const updateSetEntry = (index: number, field: 'reps' | 'weight', value: string) => {
    setSetEntries(prev => prev.map((entry, i) => 
      i === index ? { ...entry, [field]: value } : entry
    ));
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

      const setDetails = setEntries.map(entry => ({
        reps: parseInt(entry.reps) || 0,
        weight: parseFloat(entry.weight) || 0,
      }));

      await addWorkout({
        exercise: exercise.trim(),
        muscleGroups: getExerciseMuscleGroups(exercise.trim()),
        setDetails,
        duration: 0,
        date: new Date(workoutDate + 'T' + new Date().toTimeString().slice(0,8)),
        gymTag: gymTag.trim() || undefined,
        session,
      });

      setExercise('');
      setNumSets('');
      setSetEntries([]);
      setGymTag('');
      setWorkoutDate(new Date().toISOString().split('T')[0]);
      setSession(1);
      setShowDetails(false);
      onSuccess?.();
    } catch {
      setError('Failed to save workout');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm rounded-xl border" style={{ backgroundColor: 'var(--error-container)', color: 'var(--error)', borderColor: 'var(--error)' }}>
          {error}
        </div>
      )}

      <div className="space-y-3" ref={dropdownRef}>
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
            className="w-full px-4 py-3 rounded-xl text-sm transition-all cursor-pointer"
            style={{ 
              backgroundColor: 'var(--surface-container-high)', 
              border: '1px solid var(--outline)',
              color: 'var(--foreground)'
            }}
          />
          <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: 'var(--muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          {showDropdown && filteredExercises.length > 0 && (
            <div className="absolute z-50 w-full mt-2 rounded-xl shadow-lg border overflow-y-auto max-h-48" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--outline-variant)' }}>
              {filteredExercises.slice(0, 8).map((ex) => (
                <button
                  key={ex.name}
                  type="button"
                  onClick={() => {
                    setExercise(ex.name);
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm flex justify-between items-center cursor-pointer transition-colors border-b"
                  style={{ borderColor: 'var(--outline-variant)' }}
                >
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>{ex.name}</span>
                  <span className="text-xs capitalize rounded-full px-2 py-0.5" style={{ backgroundColor: 'var(--surface-container-high)', color: 'var(--muted)' }}>
                    {ex.muscleGroups[0]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          {/* Number of Sets input */}
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              value={numSets}
              onChange={(e) => setNumSets(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-3 rounded-xl text-center text-lg font-bold cursor-pointer transition-all"
              style={{ 
                backgroundColor: 'var(--surface-container-high)', 
                border: '1px solid var(--outline)',
                color: 'var(--foreground)'
              }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wide pointer-events-none" style={{ color: 'var(--muted)' }}>sets</span>
          </div>

          {/* Per-set reps & weight inputs */}
          {setEntries.map((entry, index) => (
            <div key={index} className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  type="number"
                  inputMode="numeric"
                  value={entry.reps}
                  onChange={(e) => updateSetEntry(index, 'reps', e.target.value)}
                  placeholder="reps"
                  className="w-full px-3 py-3 rounded-xl text-center text-lg font-bold cursor-pointer transition-all"
                  style={{ 
                    backgroundColor: 'var(--surface-container-high)', 
                    border: '1px solid var(--outline)',
                    color: 'var(--foreground)'
                  }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wide pointer-events-none" style={{ color: 'var(--muted)' }}>reps</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  inputMode="decimal"
                  value={entry.weight}
                  onChange={(e) => updateSetEntry(index, 'weight', e.target.value)}
                  placeholder="kg"
                  className="w-full px-3 py-3 rounded-xl text-center text-lg font-bold cursor-pointer transition-all"
                  style={{ 
                    backgroundColor: 'var(--surface-container-high)', 
                    border: '1px solid var(--outline)',
                    color: 'var(--foreground)'
                  }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wide pointer-events-none" style={{ color: 'var(--muted)' }}>kg</span>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm flex items-center gap-2 transition-colors cursor-pointer"
          style={{ color: 'var(--muted)' }}
        >
          <svg className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {showDetails ? 'Less' : 'More'} details
        </button>

        {showDetails && (
          <div className="space-y-3 pt-2 border-t" style={{ borderColor: 'var(--outline-variant)' }}>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs uppercase tracking-wide mb-2" style={{ color: 'var(--muted)' }}>Date</label>
                <input
                  type="date"
                  value={workoutDate}
                  onChange={(e) => setWorkoutDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm cursor-pointer"
                  style={{ 
                    backgroundColor: 'var(--surface-container-high)', 
                    border: '1px solid var(--outline)',
                    color: 'var(--foreground)'
                  }}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide mb-2" style={{ color: 'var(--muted)' }}>Session</label>
                <select
                  value={session}
                  onChange={(e) => setSession(parseInt(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl text-sm cursor-pointer"
                  style={{ 
                    backgroundColor: 'var(--surface-container-high)', 
                    border: '1px solid var(--outline)',
                    color: 'var(--foreground)'
                  }}
                >
                  <option value={1}>Morning</option>
                  <option value={2}>Evening</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide mb-2" style={{ color: 'var(--muted)' }}>Gym Location</label>
              <input
                type="text"
                value={gymTag}
                onChange={(e) => setGymTag(e.target.value)}
                placeholder="e.g., Gold's Gym"
                className="w-full px-4 py-3 rounded-xl text-sm cursor-pointer"
                style={{ 
                  backgroundColor: 'var(--surface-container-high)', 
                  border: '1px solid var(--outline)',
                  color: 'var(--foreground)'
                }}
              />
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 px-4 font-semibold rounded-xl transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
        style={{ 
          backgroundColor: 'var(--primary)', 
          color: 'var(--on-primary)'
        }}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Saving...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Log Workout
          </>
        )}
      </button>
    </form>
  );
}