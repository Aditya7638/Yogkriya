import { useQuery } from '@tanstack/react-query';
import { progressApi } from '../api';
import { LoadingPage, StatCard, EmptyState } from '../components/ui';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart2, Flame, Clock, Dumbbell, Trophy, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { ProgressStats } from '../types';

function StreakDisplay({ current, longest }: { current: number; longest: number }) {
  return (
    <div className="card p-6 bg-gradient-to-br from-saffron-50 to-amber-50 dark:from-saffron-900/20 dark:to-amber-900/20 border-saffron-200 dark:border-saffron-800">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-saffron-100 dark:bg-saffron-900/40 flex items-center justify-center">
          <Flame size={20} className="text-saffron-600 dark:text-saffron-400" />
        </div>
        <h3 className="font-semibold text-stone-900 dark:text-stone-100">Your Streak</h3>
      </div>
      <div className="flex items-end gap-6">
        <div>
          <div className="text-5xl font-bold text-saffron-600 dark:text-saffron-400 font-display">{current}</div>
          <div className="text-sm text-stone-500 dark:text-stone-400 mt-1">Current streak (days)</div>
        </div>
        <div className="mb-1">
          <div className="text-2xl font-bold text-stone-700 dark:text-stone-300">{longest}</div>
          <div className="text-xs text-stone-400">Longest streak</div>
        </div>
      </div>
      {current === 0 && (
        <p className="mt-3 text-sm text-stone-400">Complete a workout today to start your streak! 🌿</p>
      )}
      {current >= 7 && (
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-100 dark:bg-saffron-900/40 text-saffron-700 dark:text-saffron-400 text-xs font-medium">
          <Trophy size={12} /> 7-day warrior
        </div>
      )}
    </div>
  );
}

export default function Progress() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useQuery<ProgressStats>({
    queryKey: ['progress'],
    queryFn: progressApi.get,
    enabled: !!user,
  });

  if (!user) return (
    <div className="page-container py-20 text-center">
      <h2 className="text-xl font-semibold mb-3 text-stone-700 dark:text-stone-300">Sign in to track progress</h2>
      <Link to="/login" className="btn-primary">Sign in</Link>
    </div>
  );

  if (isLoading) return <LoadingPage />;
  if (!stats) return null;

  return (
    <div className="page-container py-12">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
          <BarChart2 size={20} />
        </div>
        <div>
          <h1 className="section-title">Your Progress</h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm">Track your consistency and growth.</p>
        </div>
      </div>

      {stats.total_sessions === 0 ? (
        <EmptyState
          icon={<BarChart2 size={24} className="text-stone-400" />}
          title="No workouts yet"
          description="Complete your first workout to start tracking your progress."
          action={<Link to="/routines" className="btn-primary">Go to Routines</Link>}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Sessions" value={stats.total_sessions} icon={<Dumbbell size={18} />} />
            <StatCard label="Total Minutes" value={stats.total_minutes} icon={<Clock size={18} />} />
            <StatCard label="This Week" value={stats.sessions_this_week} sub="sessions" icon={<Target size={18} />} />
            <StatCard label="Exercises Done" value={stats.total_exercises_completed} icon={<Trophy size={18} />} />
          </div>

          <div className="mb-8">
            <StreakDisplay current={stats.current_streak} longest={stats.longest_streak} />
          </div>

          <div className="card p-6 mb-6">
            <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-5">Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.weekly_activity} barSize={32}>
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} />
                <YAxis hide allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: 13 }}
                  formatter={(v: any) => [v, 'Sessions']}
                />
                <Bar dataKey="sessions" fill="#3a7a3a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {stats.recent_sessions.length > 0 && (
            <div className="card p-6">
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-4">Recent Workouts</h3>
              <div className="space-y-3">
                {stats.recent_sessions.map(s => (
                  <div key={s.id} className="flex items-center justify-between py-3 border-b border-stone-100 dark:border-stone-700 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-stone-800 dark:text-stone-200">
                        {new Date(s.completed_at).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </p>
                      <p className="text-xs text-stone-400">
                        {s.completed_exercises_count}/{s.total_exercises} exercises · {s.duration_minutes} min
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-forest-600 dark:text-forest-400">
                        {Math.round((s.completed_exercises_count / Math.max(s.total_exercises, 1)) * 100)}%
                      </div>
                      <div className="text-xs text-stone-400">completion</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
