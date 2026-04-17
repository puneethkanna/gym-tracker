'use client';

import { useState, useMemo } from 'react';
import { useWorkouts } from '@/hooks/useWorkouts';
import type { Workout } from '@/lib/db';

interface WorkoutListProps {
  today: string;
  yesterday: string;
}

export function WorkoutList({ today, yesterday }: WorkoutListProps) {
  const { workouts, deleteWorkout, isLoading } = useWorkouts();
  const [sortBy, setSortBy] = useState<'date' | 'exercise'>('date');

  const sortedWorkouts = useMemo(() => {
    return [...workouts].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return a.exercise.localeCompare(b.exercise);
    });
  }, [workouts, sortBy]);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-2 rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--surface-container-high)' }}>
          <svg className="w-7 h-7" style={{ color: 'var(--muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>No workouts yet</p>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Log your first workout!</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Recent Workouts</h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'exercise')}
          className="text-xs px-2 py-1 rounded-lg cursor-pointer bg-transparent"
          style={{ 
            backgroundColor: 'var(--surface-container-high)', 
            border: '1px solid var(--outline-variant)',
            color: 'var(--foreground)'
          }}
        >
          <option value="date">Recent</option>
          <option value="exercise">Exercise</option>
        </select>
      </div>

      <div className="space-y-0">
        {sortedWorkouts.slice(0, 10).map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} onDelete={deleteWorkout} today={today} yesterday={yesterday} />
        ))}
      </div>

      {sortedWorkouts.length > 10 && (
        <p className="text-center text-xs mt-3" style={{ color: 'var(--muted)' }}>
          + {sortedWorkouts.length - 10} more
        </p>
      )}
    </div>
  );
}

interface WorkoutCardProps {
  workout: Workout;
  onDelete: (id: number) => void;
  today: string;
  yesterday: string;
}

function WorkoutCard({ workout, onDelete, today, yesterday }: WorkoutCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const date = new Date(workout.date);
  const isToday = date.toDateString() === today;
  const isYesterday = date.toDateString() === yesterday;
  
  let timeStr = '';
  if (isToday) {
    timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (isYesterday) {
    timeStr = 'Yesterday';
  } else {
    timeStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  const totalSets = workout.setDetails?.length || 0;
  const firstSet = workout.setDetails[0];
  const isUniform = totalSets > 0 && workout.setDetails.every(s => s.reps === firstSet.reps && s.weight === firstSet.weight);

  const handleDelete = async () => {
    if (confirm('Delete this workout?')) {
      await onDelete(workout.id!);
    }
  };

  return (
    <div 
      className="rounded-2xl p-3 transition-all cursor-pointer border border-transparent hover:border-[var(--outline-variant)]"
      style={{ backgroundColor: expanded ? 'var(--surface-container-low)' : 'transparent' }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate" style={{ color: 'var(--foreground)' }}>{workout.exercise}</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px]" style={{ color: 'var(--muted)' }}>{timeStr}</span>
            <span className="text-muted-light">•</span>
            <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>
              {isUniform ? (
                <>
                  {totalSets}×{firstSet.reps} @ <span style={{ color: 'var(--primary)' }}>{firstSet.weight}kg</span>
                </>
              ) : (
                `${totalSets} sets (mixed)`
              )}
            </span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDelete(!showDelete);
          }}
          className="p-1.5 -mr-1 rounded-xl transition-colors cursor-pointer"
          style={{ backgroundColor: 'transparent' }}
        >
          <svg className="w-4 h-4" style={{ color: 'var(--muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {expanded && (
        <div className="mt-2 pl-4 border-l-2 space-y-1" style={{ borderColor: 'var(--outline-variant)' }}>
          {workout.setDetails.map((set, idx) => (
            <div key={idx} className="text-xs flex justify-between" style={{ color: 'var(--muted)' }}>
              <span>Set {idx + 1}</span>
              <span>{set.reps} reps × {set.weight}kg</span>
            </div>
          ))}
        </div>
      )}

      {showDelete && (
        <div className="mt-2 pt-2 border-t flex justify-end gap-2" style={{ borderColor: 'var(--outline-variant)' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDelete(false);
            }}
            className="px-3 py-1.5 text-xs transition-colors cursor-pointer"
            style={{ color: 'var(--muted)' }}
          >
            Cancel
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="px-3 py-1.5 text-xs transition-colors cursor-pointer rounded-lg"
            style={{ color: 'var(--error)' }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
