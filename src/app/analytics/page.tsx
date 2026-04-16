'use client';

import { useWorkouts } from '@/hooks/useWorkouts';
import { BottomNav } from '@/components/BottomNav';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import { useMemo } from 'react';
import { muscleGroupLabels, type MuscleGroup } from '@/lib/db';

export default function AnalyticsPage() {
  const { workouts, isLoading } = useWorkouts();

  const stats = useMemo(() => {
    if (workouts.length === 0) {
      return {
        totalWorkouts: 0,
        totalVolume: 0,
        avgVolume: 0,
        mostFrequent: null,
        muscleBreakdown: {},
        weeklyData: [],
      };
    }

    const totalVolume = workouts.reduce((acc, w) => acc + (w.weight * w.sets * w.reps), 0);
    const exerciseCounts: Record<string, number> = {};
    const muscleCounts: Record<string, number> = {};
    const weeklyWorkouts: Record<string, number> = {};

    workouts.forEach(w => {
      exerciseCounts[w.exercise] = (exerciseCounts[w.exercise] || 0) + 1;
      
      w.muscleGroups.forEach(mg => {
        muscleCounts[mg] = (muscleCounts[mg] || 0) + 1;
      });

      const weekKey = getWeekKey(new Date(w.date));
      weeklyWorkouts[weekKey] = (weeklyWorkouts[weekKey] || 0) + 1;
    });

    const mostFrequent = Object.entries(exerciseCounts)
      .sort((a, b) => b[1] - a[1])[0];

    const weeklyData = getLast4WeeksWeekly(weeklyWorkouts);

    return {
      totalWorkouts: workouts.length,
      totalVolume,
      avgVolume: Math.round(totalVolume / workouts.length),
      mostFrequent: mostFrequent ? { name: mostFrequent[0], count: mostFrequent[1] } : null,
      muscleBreakdown: muscleCounts,
      weeklyData,
    };
  }, [workouts]);

  const totalMuscleWork = Object.values(stats.muscleBreakdown).reduce((a, b) => a + b, 0);

  const topExercises = useMemo(() => {
    const exerciseVolume: Record<string, number> = {};
    workouts.forEach(w => {
      const vol = w.weight * w.sets * w.reps;
      exerciseVolume[w.exercise] = (exerciseVolume[w.exercise] || 0) + vol;
    });
    return Object.entries(exerciseVolume)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [workouts]);

  return (
    <div className="min-h-screen pb-20">
      <ServiceWorkerRegistration />
      
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/10">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="font-condensed text-xl font-bold text-foreground tracking-wide">ANALYTICS</h1>
          <p className="text-xs text-muted">Track your progress</p>
        </div>
      </header>

      <main className="pt-16 px-4 pb-4 max-w-md mx-auto space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : workouts.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-700/50">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="font-condensed text-lg font-semibold text-foreground">No data yet</p>
            <p className="text-sm text-muted mt-1">Start logging workouts to see analytics!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
                <p className="text-[10px] text-muted uppercase tracking-wide font-medium">Total Workouts</p>
                <p className="font-condensed text-3xl font-bold text-primary mt-1">{stats.totalWorkouts}</p>
              </div>
              <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
                <p className="text-[10px] text-muted uppercase tracking-wide font-medium">Total Volume</p>
                <p className="font-condensed text-3xl font-bold text-foreground mt-1">
                  {stats.totalVolume > 1000 ? `${(stats.totalVolume / 1000).toFixed(1)}k` : stats.totalVolume}
                </p>
                <p className="text-[10px] text-muted">kg</p>
              </div>
              <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
                <p className="text-[10px] text-muted uppercase tracking-wide font-medium">Avg Volume/Session</p>
                <p className="font-condensed text-3xl font-bold text-foreground mt-1">{stats.avgVolume}</p>
                <p className="text-[10px] text-muted">kg</p>
              </div>
              <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
                <p className="text-[10px] text-muted uppercase tracking-wide font-medium">Favorite</p>
                <p className="font-condensed text-lg font-bold text-foreground mt-1 truncate">{stats.mostFrequent?.name || '-'}</p>
                <p className="text-[10px] text-muted">{stats.mostFrequent?.count || 0} sessions</p>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
              <h2 className="font-condensed text-sm font-semibold text-muted uppercase tracking-wider mb-4">Weekly Activity</h2>
              <div className="flex items-end justify-between h-32 gap-2">
                {stats.weeklyData.map((week, i) => {
                  const max = Math.max(...stats.weeklyData.map(w => w.count), 1);
                  const height = max > 0 ? (week.count / max) * 100 : 0;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="w-full relative" style={{ height: '100px' }}>
                        <div 
                          className="absolute bottom-0 w-full rounded-t-md bg-primary transition-all duration-500"
                          style={{ height: `${height}%`, minHeight: week.count > 0 ? '8px' : '2px' }}
                        />
                      </div>
                      <p className="text-[10px] text-muted mt-2">{week.label}</p>
                      <p className="text-xs font-semibold text-foreground">{week.count}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
              <h2 className="font-condensed text-sm font-semibold text-muted uppercase tracking-wider mb-4">Muscle Groups</h2>
              <div className="space-y-3">
                {Object.entries(stats.muscleBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .map(([muscle, count]) => {
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

            <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
              <h2 className="font-condensed text-sm font-semibold text-muted uppercase tracking-wider mb-4">Top Exercises</h2>
              <div className="space-y-3">
                {topExercises.map(([name, volume], i) => {
                  const maxVol = topExercises[0]?.[1] || 1;
                  const percentage = (volume / maxVol) * 100;
                  return (
                    <div key={name} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{name}</p>
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
                          <div 
                            className="h-full rounded-full bg-cta"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-muted whitespace-nowrap">
                        {volume > 1000 ? `${(volume / 1000).toFixed(1)}k` : volume} kg
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

function getWeekKey(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().split('T')[0];
}

function getLast4WeeksWeekly(weeklyWorkouts: Record<string, number>) {
  const weeks: { label: string; count: number }[] = [];
  const now = new Date();
  
  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() - (i * 7));
    const weekKey = weekStart.toISOString().split('T')[0];
    
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    weeks.push({
      label: `${monthLabels[weekStart.getMonth()]} ${weekStart.getDate()}`,
      count: weeklyWorkouts[weekKey] || 0,
    });
  }
  
  return weeks;
}