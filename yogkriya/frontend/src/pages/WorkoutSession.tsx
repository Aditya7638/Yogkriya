import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { routinesApi, workoutsApi } from '../api';
import { LoadingPage, YouTubeEmbed, ProgressBar } from '../components/ui';
import { CheckCircle, SkipForward, Play, Pause, RotateCcw, Trophy, Clock, Dumbbell, Leaf, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Routine, RoutineExercise } from '../types';

function RestTimer({ seconds, onDone }: { seconds: number; onDone: () => void }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) { onDone(); return; }
    const t = setTimeout(() => setLeft(l => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  return (
    <div className="text-center py-8">
      <p className="text-stone-500 dark:text-stone-400 mb-2 text-sm">Rest time</p>
      <div className="text-6xl font-bold text-forest-600 dark:text-forest-400 font-display">{left}s</div>
      <ProgressBar value={seconds - left} max={seconds} />
      <button onClick={onDone} className="mt-4 btn-secondary text-sm">Skip rest</button>
    </div>
  );
}

function CompletionScreen({ duration, completed, total, onDone }: {
  duration: number; completed: number; total: number; onDone: () => void;
}) {
  const pct = Math.round((completed / Math.max(total, 1)) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto text-center py-12"
    >
      <div className="w-20 h-20 rounded-full bg-forest-100 dark:bg-forest-900/40 flex items-center justify-center mx-auto mb-6">
        <Trophy size={36} className="text-saffron-500" />
      </div>
      <h2 className="font-display text-3xl font-bold text-stone-900 dark:text-stone-50 mb-2">Workout Complete!</h2>
      <p className="text-stone-500 dark:text-stone-400 mb-8">Excellent work. Every session counts.</p>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Duration', value: `${duration}m` },
          { label: 'Exercises', value: `${completed}/${total}` },
          { label: 'Completion', value: `${pct}%` },
        ].map(({ label, value }) => (
          <div key={label} className="card p-4 text-center">
            <div className="text-2xl font-bold text-stone-900 dark:text-stone-50">{value}</div>
            <div className="text-xs text-stone-400 mt-1">{label}</div>
          </div>
        ))}
      </div>
      <button onClick={onDone} className="btn-primary w-full py-3 text-base">Back to Routines</button>
    </motion.div>
  );
}

const typeIcon = (t: string) => {
  if (t === 'yoga') return <Leaf size={14} className="text-forest-500" />;
  if (t === 'gym') return <Dumbbell size={14} className="text-blue-500" />;
  return <BookOpen size={14} className="text-amber-500" />;
};

export default function WorkoutSession() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: routine, isLoading } = useQuery<Routine>({
    queryKey: ['routine', id],
    queryFn: () => routinesApi.get(Number(id)),
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [skipped, setSkipped] = useState<Set<number>>(new Set());
  const [resting, setResting] = useState(false);
  const [done, setDone] = useState(false);
  const [startTime] = useState(Date.now());
  const [timerActive, setTimerActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive]);

  if (isLoading) return <LoadingPage />;
  if (!routine) return <div className="page-container py-12 text-center text-stone-400">Routine not found</div>;

  const exercises = routine.exercises;
  const total = exercises.length;
  const current: RoutineExercise | undefined = exercises[currentIdx];

  if (done || (!current && exercises.length > 0)) {
    const durationMins = Math.round((Date.now() - startTime) / 60000) || 1;
    const handleDone = async () => {
      try {
        await workoutsApi.log({
          routine_id: routine.id,
          duration_minutes: durationMins,
          total_exercises: total,
          completed_exercises_count: completed.size,
          completed_exercises: Array.from(completed).map(idx => ({
            exercise_type: exercises[idx]?.exercise_type,
            exercise_id: exercises[idx]?.exercise_id,
            exercise_name: exercises[idx]?.exercise_name,
          })),
        });
      } catch {}
      navigate('/progress');
    };
    return (
      <div className="page-container py-12">
        <CompletionScreen duration={durationMins} completed={completed.size} total={total} onDone={handleDone} />
      </div>
    );
  }

  const handleComplete = () => {
    setCompleted(prev => new Set([...prev, currentIdx]));
    if (currentIdx < total - 1) {
      setResting(true);
    } else {
      setDone(true);
    }
  };

  const handleSkip = () => {
    setSkipped(prev => new Set([...prev, currentIdx]));
    if (currentIdx < total - 1) setCurrentIdx(i => i + 1);
    else setDone(true);
  };

  const handleRestDone = () => {
    setResting(false);
    setCurrentIdx(i => i + 1);
  };

  const pct = Math.round(((completed.size + skipped.size) / total) * 100);

  return (
    <div className="page-container py-10 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-stone-400">Exercise {currentIdx + 1} of {total}</p>
          <h1 className="font-semibold text-stone-900 dark:text-stone-100">{routine.name}</h1>
        </div>
        <div className="flex items-center gap-2 text-stone-400 text-sm">
          <Clock size={14} />
          {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}
        </div>
      </div>

      {/* Overall progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-stone-400 mb-1.5">
          <span>{completed.size} completed</span>
          <span>{pct}%</span>
        </div>
        <ProgressBar value={completed.size + skipped.size} max={total} />
      </div>

      {/* Exercise list sidebar */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {exercises.map((ex, i) => (
          <button
            key={ex.id}
            onClick={() => { setCurrentIdx(i); setResting(false); }}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              i === currentIdx
                ? 'border-forest-500 bg-forest-50 dark:bg-forest-900/30 text-forest-700 dark:text-forest-400'
                : completed.has(i)
                ? 'border-green-200 bg-green-50 dark:bg-green-900/20 text-green-600'
                : skipped.has(i)
                ? 'border-stone-200 bg-stone-100 dark:bg-stone-700 text-stone-400 line-through'
                : 'border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400'
            }`}
          >
            {i + 1}. {ex.exercise_name?.split(' ')[0]}
          </button>
        ))}
      </div>

      {resting ? (
        <div className="card p-8">
          <RestTimer seconds={60} onDone={handleRestDone} />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {/* Exercise card */}
            <div className="card p-6">
              <div className="flex items-start justify-between gap-3 mb-1">
                <div className="flex items-center gap-2">
                  {typeIcon(current.exercise_type)}
                  <span className="text-xs text-stone-400 capitalize">{current.exercise_type}</span>
                </div>
                {completed.has(currentIdx) && <CheckCircle size={18} className="text-green-500" />}
              </div>
              <h2 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-50 mb-4">
                {current.exercise_name}
              </h2>

              {/* Sets/reps/duration */}
              <div className="flex gap-4 mb-5">
                {current.sets && (
                  <div className="card p-3 text-center flex-1 bg-stone-50 dark:bg-stone-800/50">
                    <div className="text-xl font-bold text-stone-900 dark:text-stone-50">{current.sets}</div>
                    <div className="text-xs text-stone-400">Sets</div>
                  </div>
                )}
                {current.reps && (
                  <div className="card p-3 text-center flex-1 bg-stone-50 dark:bg-stone-800/50">
                    <div className="text-xl font-bold text-stone-900 dark:text-stone-50">{current.reps}</div>
                    <div className="text-xs text-stone-400">Reps</div>
                  </div>
                )}
                {current.duration_seconds && (
                  <div className="card p-3 text-center flex-1 bg-stone-50 dark:bg-stone-800/50">
                    <div className="text-xl font-bold text-stone-900 dark:text-stone-50">
                      {Math.round(current.duration_seconds / 60)}m
                    </div>
                    <div className="text-xs text-stone-400">Duration</div>
                  </div>
                )}
              </div>

              {current.exercise_description && (
                <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-5">
                  {current.exercise_description}
                </p>
              )}

              {current.video_youtube_id && (
                <div className="mb-5">
                  <YouTubeEmbed youtubeId={current.video_youtube_id} title={current.exercise_name} />
                </div>
              )}

              {/* Timer for duration exercises */}
              {current.duration_seconds && (
                <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50">
                  <div className="text-lg font-mono font-bold text-stone-700 dark:text-stone-300">
                    {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}
                  </div>
                  <button
                    onClick={() => setTimerActive(a => !a)}
                    className="flex items-center gap-1.5 text-sm text-forest-600 dark:text-forest-400 font-medium"
                  >
                    {timerActive ? <Pause size={14} /> : <Play size={14} />}
                    {timerActive ? 'Pause' : 'Start'} timer
                  </button>
                  <button onClick={() => setElapsed(0)} className="ml-auto text-stone-400 hover:text-stone-600">
                    <RotateCcw size={14} />
                  </button>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={handleComplete} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3">
                  <CheckCircle size={16} /> Complete Exercise
                </button>
                <button onClick={handleSkip} className="btn-secondary px-4 flex items-center gap-1.5">
                  <SkipForward size={15} /> Skip
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
