'use client';

import { useWorkouts } from '@/hooks/useWorkouts';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import { useMemo, useState } from 'react';
import { muscleGroupLabels, type MuscleGroup } from '@/lib/db';
import { useParams, useRouter } from 'next/navigation';

export default function DayAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const date = params.date as string;
  const { workouts, isLoading } = useWorkouts();
  const [sortBy, setSortBy] = useState<'session' | 'exercise'>('session');

  const dayWorkouts = useMemo(() => {
    return workouts.filter(w => {
      const workoutDate = new Date(w.date).toISOString().split('T')[0];
      return workoutDate === date;
    });
  }, [workouts, date]);

  const sessions = useMemo(() => {
    const session1 = dayWorkouts.filter(w => w.session === 1);
    const session2 = dayWorkouts.filter(w => w.session === 2);
    return { 1: session1, 2: session2 };
  }, [dayWorkouts]);

  const stats = useMemo(() => {
    const totalVolume = dayWorkouts.reduce((acc, w) => acc + (w.weight * w.sets * w.reps), 0);
    const exerciseCounts: Record<string, number> = {};
    const muscleCounts: Record<string, number> = {};

    dayWorkouts.forEach(w => {
      exerciseCounts[w.exercise] = (exerciseCounts[w.exercise] || 0) + 1;
      w.muscleGroups.forEach(mg => {
        muscleCounts[mg] = (muscleCounts[mg] || 0) + 1;
      });
    });

    return {
      totalWorkouts: dayWorkouts.length,
      totalVolume,
      exerciseCounts,
      muscleCounts,
    };
  }, [dayWorkouts]);

  const formattedDate = useMemo(() => {
    const d = new Date(date + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }, [date]);

  if (isLoading) {
    return (
      <div className="min-h-screen pb-20">
        <ServiceWorkerRegistration />
        <div className="flex justify-center pt-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <ServiceWorkerRegistration />
      
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/10">
        <div className="max-w-md mx-auto px-4 py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors cursor-pointer mb-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="font-condensed text-xl font-bold text-foreground tracking-wide">{formattedDate}</h1>
          <p className="text-xs text-muted">{dayWorkouts.length} exercises logged</p>
        </div>
      </header>

      <main className="pt-20 px-4 pb-4 max-w-md mx-auto space-y-4">
        {dayWorkouts.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-700/50">
            <p className="font-condensed text-lg font-semibold text-foreground">No workouts</p>
            <p className="text-sm text-muted mt-1">No workouts logged for this day</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
                <p className="text-[10px] text-muted uppercase tracking-wide font-medium">Total Exercises</p>
                <p className="font-condensed text-3xl font-bold text-primary mt-1">{stats.totalWorkouts}</p>
              </div>
              <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
                <p className="text-[10px] text-muted uppercase tracking-wide font-medium">Total Volume</p>
                <p className="font-condensed text-3xl font-bold text-foreground mt-1">
                  {stats.totalVolume > 1000 ? `${(stats.totalVolume / 1000).toFixed(1)}k` : stats.totalVolume}
                </p>
                <p className="text-[10px] text-muted">kg</p>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-condensed text-sm font-semibold text-muted uppercase tracking-wider">Sessions</h2>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'session' | 'exercise')}
                  className="text-xs px-2 py-1 bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="session">By Session</option>
                  <option value="exercise">By Exercise</option>
                </select>
              </div>

              {sortBy === 'session' ? (
                <div className="space-y-4">
                  {sessions[1].length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-foreground">Session 1 (Morning)</span>
                        <span className="text-xs text-muted">({sessions[1].length} exercises)</span>
                      </div>
                      <div className="space-y-2 pl-4 border-l-2 border-primary/30">
                        {sessions[1].map(w => (
                          <DayWorkoutItem key={w.id} workout={w} />
                        ))}
                      </div>
                    </div>
                  )}
                  {sessions[2].length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-foreground">Session 2 (Evening)</span>
                        <span className="text-xs text-muted">({sessions[2].length} exercises)</span>
                      </div>
                      <div className="space-y-2 pl-4 border-l-2 border-secondary/30">
                        {sessions[2].map(w => (
                          <DayWorkoutItem key={w.id} workout={w} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(stats.exerciseCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([exercise, count]) => {
                      const exerciseWorkouts = dayWorkouts.filter(w => w.exercise === exercise);
                      const sessionNum = exerciseWorkouts[0]?.session || 1;
                      return (
                        <div key={exercise} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${sessionNum === 1 ? 'bg-primary' : 'bg-secondary'}`} />
                            <span className="text-sm font-medium text-foreground">{exercise}</span>
                          </div>
                          <span className="text-xs text-muted">{count} sets</span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
              <h2 className="font-condensed text-sm font-semibold text-muted uppercase tracking-wider mb-4">Muscle Groups</h2>
              <div className="space-y-3">
                {Object.entries(stats.muscleCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([muscle, count]) => {
                    const totalMuscleWork = Object.values(stats.muscleCounts).reduce((a, b) => a + b, 0);
                    const percentage = totalMuscleWork > 0 ? (count / totalMuscleWork) * 100 : 0;
                    return (
                      <div key={muscle}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-foreground capitalize">{muscleGroupLabels[muscle as MuscleGroup] || muscle}</span>
                          <span className="text-xs text-muted">{count} sets</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-primary transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function DayWorkoutItem({ workout }: { workout: any }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      className="rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-foreground">{workout.exercise}</span>
        <span className="text-xs text-foreground font-semibold">
          {workout.sets}×{workout.reps} @ {workout.weight}kg
        </span>
      </div>
      {expanded && workout.muscleGroups.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {workout.muscleGroups.map((mg: string) => (
            <span key={mg} className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-muted capitalize">
              {mg}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}