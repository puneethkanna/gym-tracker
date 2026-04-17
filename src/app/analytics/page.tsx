'use client';

import { useWorkouts } from '@/hooks/useWorkouts';
import { BottomNav } from '@/components/BottomNav';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import { useMemo } from 'react';
import { muscleGroupLabels, type MuscleGroup } from '@/lib/db';
import { useRouter } from 'next/navigation';

export default function AnalyticsPage() {
  const { workouts, isLoading } = useWorkouts();
  const router = useRouter();

  const stats = useMemo(() => {
    if (workouts.length === 0) {
      return {
        totalWorkouts: 0,
        totalVolume: 0,
        avgVolume: 0,
        mostFrequent: null,
        muscleBreakdown: {},
        weeklyData: [],
        dailyData: [],
      };
    }

    const totalVolume = workouts.reduce((acc, w) => acc + (w.weight * w.sets * w.reps), 0);
    const exerciseCounts: Record<string, number> = {};
    const muscleCounts: Record<string, number> = {};
    const weeklyWorkouts: Record<string, number> = {};
    const dailyWorkouts: Record<string, { count: number; sessions: number[] }> = {};

    workouts.forEach(w => {
      exerciseCounts[w.exercise] = (exerciseCounts[w.exercise] || 0) + 1;
      
      w.muscleGroups.forEach(mg => {
        muscleCounts[mg] = (muscleCounts[mg] || 0) + 1;
      });

      const weekKey = getWeekKey(new Date(w.date));
      weeklyWorkouts[weekKey] = (weeklyWorkouts[weekKey] || 0) + 1;

      const dayKey = new Date(w.date).toISOString().split('T')[0];
      if (!dailyWorkouts[dayKey]) {
        dailyWorkouts[dayKey] = { count: 0, sessions: [] };
      }
      dailyWorkouts[dayKey].count++;
      if (!dailyWorkouts[dayKey].sessions.includes(w.session)) {
        dailyWorkouts[dayKey].sessions.push(w.session);
      }
    });

    const mostFrequent = Object.entries(exerciseCounts)
      .sort((a, b) => b[1] - a[1])[0];

    const weeklyData = getLast4WeeksWeekly(weeklyWorkouts);
    const dailyData = getCurrentWeekDaily(dailyWorkouts);

    return {
      totalWorkouts: workouts.length,
      totalVolume,
      avgVolume: Math.round(totalVolume / workouts.length),
      mostFrequent: mostFrequent ? { name: mostFrequent[0], count: mostFrequent[1] } : null,
      muscleBreakdown: muscleCounts,
      weeklyData,
      dailyData,
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
      
      <header className="fixed top-0 left-0 right-0 z-40 glass h-16" style={{ backgroundColor: 'var(--glass-bg)', borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
        <div className="max-w-md mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-xl font-bold tracking-wide" style={{ color: 'var(--foreground)', fontFamily: 'var(--md-sys-typescale-title-large-font)' }}>ANALYTICS</h1>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>Track your progress</p>
        </div>
      </header>

      <main className="pt-16 px-4 pb-4 max-w-md mx-auto space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
          </div>
        ) : workouts.length === 0 ? (
          <div className="rounded-3xl p-8 text-center border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--outline-variant)' }}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--surface-container-high)' }}>
              <svg className="w-8 h-8" style={{ color: 'var(--muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>No data yet</p>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Start logging workouts to see analytics!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-3xl border" style={{ backgroundColor: 'var(--surface-container-high)', borderColor: 'var(--outline-variant)' }}>
                <p className="text-[10px] uppercase tracking-wide font-semibold" style={{ color: 'var(--muted)' }}>Total Workouts</p>
                <p className="text-3xl font-bold mt-1" style={{ color: 'var(--primary)' }}>{stats.totalWorkouts}</p>
              </div>
              <div className="p-4 rounded-3xl border" style={{ backgroundColor: 'var(--surface-container-high)', borderColor: 'var(--outline-variant)' }}>
                <p className="text-[10px] uppercase tracking-wide font-semibold" style={{ color: 'var(--muted)' }}>Total Volume</p>
                <p className="text-3xl font-bold mt-1" style={{ color: 'var(--foreground)' }}>
                  {stats.totalVolume > 1000 ? `${(stats.totalVolume / 1000).toFixed(1)}k` : stats.totalVolume}
                </p>
                <p className="text-[10px]" style={{ color: 'var(--muted)' }}>kg</p>
              </div>
              <div className="p-4 rounded-3xl border" style={{ backgroundColor: 'var(--surface-container-high)', borderColor: 'var(--outline-variant)' }}>
                <p className="text-[10px] uppercase tracking-wide font-semibold" style={{ color: 'var(--muted)' }}>Avg Volume/Session</p>
                <p className="text-3xl font-bold mt-1" style={{ color: 'var(--foreground)' }}>{stats.avgVolume}</p>
                <p className="text-[10px]" style={{ color: 'var(--muted)' }}>kg</p>
              </div>
              <div className="p-4 rounded-3xl border" style={{ backgroundColor: 'var(--surface-container-high)', borderColor: 'var(--outline-variant)' }}>
                <p className="text-[10px] uppercase tracking-wide font-semibold" style={{ color: 'var(--muted)' }}>Favorite</p>
                <p className="text-lg font-bold mt-1 truncate" style={{ color: 'var(--foreground)' }}>{stats.mostFrequent?.name || '-'}</p>
                <p className="text-[10px]" style={{ color: 'var(--muted)' }}>{stats.mostFrequent?.count || 0} sessions</p>
              </div>
            </div>

            <div className="p-4 rounded-3xl border" style={{ backgroundColor: 'var(--surface-container-high)', borderColor: 'var(--outline-variant)' }}>
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>Weekly Activity</h2>
              <div className="flex items-end justify-between h-32 gap-2">
                {stats.dailyData.map((day, i) => {
                  const max = Math.max(...stats.dailyData.map(d => d.count), 1);
                  const height = max > 0 ? (day.count / max) * 100 : 0;
                  const hasWorkouts = day.count > 0;
                  return (
                    <button
                      key={i}
                      onClick={() => hasWorkouts && router.push(`/analytics/day/${day.date}`)}
                      disabled={!hasWorkouts}
                      className="flex-1 flex flex-col items-center"
                      style={{ cursor: hasWorkouts ? 'pointer' : 'default' }}
                    >
                      <div className="w-full relative" style={{ height: '100px' }}>
                        <div 
                          className="absolute bottom-0 w-full rounded-t-md transition-all duration-500"
                          style={{ height: `${height}%`, minHeight: day.count > 0 ? '8px' : '2px', backgroundColor: hasWorkouts ? 'var(--primary)' : 'var(--surface-container-high)' }}
                        />
                      </div>
                      <p className="text-[10px] mt-2" style={{ color: 'var(--muted)' }}>{day.label}</p>
                      <p className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{day.count}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
              <h2 className="font-condensed text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>Muscle Groups</h2>
              <div className="space-y-3">
                {Object.entries(stats.muscleBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .map(([muscle, count]) => {
                    const percentage = totalMuscleWork > 0 ? (count / totalMuscleWork) * 100 : 0;
                    return (
                      <div key={muscle}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium capitalize" style={{ color: 'var(--foreground)' }}>{muscleGroupLabels[muscle as MuscleGroup] || muscle}</span>
                          <span className="text-xs" style={{ color: 'var(--muted)' }}>{count} sets</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-container-high)' }}>
                          <div 
                            className="h-full rounded-full"
                            style={{ width: `${percentage}%`, backgroundColor: 'var(--primary)' }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
              <h2 className="font-condensed text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>Top Exercises</h2>
              <div className="space-y-3">
                {topExercises.map(([name, volume], i) => {
                  const maxVol = topExercises[0]?.[1] || 1;
                  const percentage = (volume / maxVol) * 100;
                  return (
                    <div key={name} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center" style={{ backgroundColor: 'var(--primary)', color: 'var(--on-primary)', opacity: 0.1 }}>
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{name}</p>
                        <div className="h-1.5 rounded-full overflow-hidden mt-1" style={{ backgroundColor: 'var(--surface-container-high)' }}>
                          <div 
                            className="h-full rounded-full"
                            style={{ width: `${percentage}%`, backgroundColor: 'var(--primary)' }}
                          />
                        </div>
                      </div>
                      <span className="text-xs whitespace-nowrap" style={{ color: 'var(--muted)' }}>
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

function getCurrentWeekDaily(dailyWorkouts: Record<string, { count: number; sessions: number[] }>) {
  const days: { label: string; count: number; date: string }[] = [];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();
  const currentDay = now.getDay();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - currentDay + i);
    const dateKey = date.toISOString().split('T')[0];
    days.push({
      label: dayLabels[i],
      count: dailyWorkouts[dateKey]?.count || 0,
      date: dateKey,
    });
  }
  
  return days;
}