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
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="font-condensed text-lg font-semibold text-foreground">No workouts yet</p>
        <p className="text-sm text-muted mt-1">Log your first workout to get started!</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-condensed text-sm font-semibold text-muted uppercase tracking-wider">Recent</h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'exercise')}
          className="text-xs px-2 py-1 bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="date">Recent</option>
          <option value="exercise">Exercise</option>
        </select>
      </div>

      <div className="space-y-2">
        {sortedWorkouts.slice(0, 10).map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} onDelete={deleteWorkout} today={today} yesterday={yesterday} />
        ))}
      </div>
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

  const handleDelete = async () => {
    if (confirm('Delete this workout?')) {
      await onDelete(workout.id!);
    }
  };

  return (
    <div 
      className="rounded-xl p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <h3 className="font-condensed font-semibold text-foreground truncate">{workout.exercise}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-muted">{timeStr}</span>
            <span className="text-xs text-muted">•</span>
            <span className="text-xs text-foreground font-medium">
              {workout.sets}×{workout.reps} @ <span className="text-primary font-semibold">{workout.weight}kg</span>
            </span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDelete(!showDelete);
          }}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {showDelete && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDelete(false);
            }}
            className="px-3 py-1.5 text-xs text-muted hover:text-foreground transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="px-3 py-1.5 text-xs text-red-500 hover:text-red-700 transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}