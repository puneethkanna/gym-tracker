'use client';

import { WorkoutForm } from '@/components/workout/WorkoutForm';
import { WorkoutList } from '@/components/workout/WorkoutList';
import { BottomNav } from '@/components/BottomNav';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useState, useMemo } from 'react';

function getDates() {
  const now = new Date();
  return { today: now.toDateString(), yesterday: new Date(now.getTime() - 86400000).toDateString() };
}

export default function HomeContent() {
  const { workouts } = useWorkouts();
  const [showForm, setShowForm] = useState(false);
  const { today, yesterday } = useMemo(() => getDates(), []);

  const thisWeekWorkouts = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return workouts.filter(w => new Date(w.date) >= weekAgo).length;
  }, [workouts]);

  const totalVolume = useMemo(() => {
    return workouts.reduce((acc, w) => acc + (w.weight * w.sets * w.reps), 0);
  }, [workouts]);

  const streak = useMemo(() => {
    if (workouts.length === 0) return 0;
    
    const uniqueDays = new Set<string>();
    workouts.forEach(w => {
      uniqueDays.add(new Date(w.date).toDateString());
    });
    
    if (uniqueDays.size === 0) return 0;
    
    const sortedDates = Array.from(uniqueDays).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
    
    if (sortedDates[0] !== today && sortedDates[0] !== yesterday) return 0;
    
    let streakCount = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const dateStr of sortedDates) {
      const workoutDate = new Date(dateStr);
      workoutDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        streakCount++;
        currentDate = workoutDate;
      } else {
        break;
      }
    }
    return streakCount;
  }, [workouts, today, yesterday]);

  return (
    <div className="min-h-screen pb-20">
      <ServiceWorkerRegistration />
      
      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center animate-pulse-glow">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <div>
              <h1 className="font-condensed text-xl font-bold text-foreground tracking-wide">GYM TRACKER</h1>
              <p className="text-xs text-muted">Track your progress</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-condensed text-2xl font-bold text-primary">{workouts.length}</p>
            <p className="text-[10px] text-muted uppercase tracking-wider">Workouts</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-4 pb-4 max-w-md mx-auto space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50 animate-fade-in stagger-1">
            <div className="flex items-center gap-1.5 mb-1">
              <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-[10px] text-muted uppercase tracking-wide font-medium">This Week</p>
            </div>
            <p className="font-condensed text-3xl font-bold text-foreground">{thisWeekWorkouts}</p>
            <p className="text-[10px] text-muted">sessions</p>
          </div>
          
          <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50 animate-fade-in stagger-2">
            <div className="flex items-center gap-1.5 mb-1">
              <svg className="w-3.5 h-3.5 text-cta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-[10px] text-muted uppercase tracking-wide font-medium">Volume</p>
            </div>
            <p className="font-condensed text-3xl font-bold text-foreground">
              {totalVolume > 1000 ? `${(totalVolume / 1000).toFixed(1)}k` : totalVolume}
            </p>
            <p className="text-[10px] text-muted">kg lifted</p>
          </div>
          
          <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50 animate-fade-in stagger-3">
            <div className="flex items-center gap-1.5 mb-1">
              <svg className="w-3.5 h-3.5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
              <p className="text-[10px] text-muted uppercase tracking-wide font-medium">Streak</p>
            </div>
            <p className="font-condensed text-3xl font-bold text-foreground">{streak}</p>
            <p className="text-[10px] text-muted">days</p>
          </div>
        </div>

        {/* Workout Form Card */}
        <div className="bg-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden animate-slide-up stagger-2">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full p-4 flex items-center gap-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-condensed text-lg font-semibold text-foreground">Log Workout</p>
                <p className="text-xs text-muted">Add your sets, reps & weight</p>
              </div>
              <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-condensed text-lg font-semibold text-foreground">Log Workout</p>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <WorkoutForm onSuccess={() => setShowForm(false)} />
            </div>
          )}
        </div>

        {/* Recent Workouts */}
        <div className="bg-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden animate-slide-up stagger-3">
          <WorkoutList today={today} yesterday={yesterday} />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}