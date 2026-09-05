import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { routinesApi } from '../api';
import { LoadingPage } from '../components/ui';
import { ArrowLeft, Play, Trash2, Dumbbell, Leaf, BookOpen, Clock } from 'lucide-react';
import type { Routine } from '../types';

const typeIcon = (t: string) => {
  if (t === 'yoga') return <Leaf size={15} className="text-forest-500" />;
  if (t === 'gym') return <Dumbbell size={15} className="text-blue-500" />;
  return <BookOpen size={15} className="text-amber-500" />;
};

export default function RoutineDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: routine, isLoading } = useQuery<Routine>({
    queryKey: ['routine', id],
    queryFn: () => routinesApi.get(Number(id)),
  });

  const removeEx = useMutation({
    mutationFn: (exId: number) => routinesApi.removeExercise(Number(id), exId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['routine', id] }),
  });

  if (isLoading) return <LoadingPage />;
  if (!routine) return <div className="page-container py-12 text-center text-stone-400">Not found</div>;

  const totalDuration = routine.exercises.reduce((acc, ex) => {
    if (ex.duration_seconds) return acc + Math.round(ex.duration_seconds / 60);
    if (ex.sets) return acc + (ex.sets * 2);
    return acc;
  }, 0);

  return (
    <div className="page-container py-12 max-w-3xl">
      <Link to="/routines" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 text-sm mb-8 transition-colors">
        <ArrowLeft size={15} /> Back to Routines
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-50 mb-1">{routine.name}</h1>
          {routine.description && <p className="text-stone-500 dark:text-stone-400 text-sm">{routine.description}</p>}
          <div className="flex gap-3 mt-2 text-xs text-stone-400">
            <span>{routine.exercises.length} exercises</span>
            <span>~{totalDuration} min</span>
          </div>
        </div>
        <button onClick={() => navigate(`/workout/${routine.id}`)} className="btn-primary flex items-center gap-2 shrink-0">
          <Play size={15} /> Start
        </button>
      </div>

      <div className="space-y-3">
        {routine.exercises.map((ex, i) => (
          <div key={ex.id} className="card p-5 flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-700 flex items-center justify-center text-stone-500 dark:text-stone-400 text-sm font-semibold shrink-0">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {typeIcon(ex.exercise_type)}
                <span className="font-medium text-stone-900 dark:text-stone-100">{ex.exercise_name}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-stone-400">
                {ex.sets && <span>{ex.sets} sets × {ex.reps}</span>}
                {ex.duration_seconds && (
                  <span className="flex items-center gap-1"><Clock size={12} /> {Math.round(ex.duration_seconds / 60)} min</span>
                )}
                <span className="capitalize badge-stone">{ex.exercise_type}</span>
              </div>
            </div>
            <button onClick={() => removeEx.mutate(ex.id)} className="p-1.5 text-stone-300 hover:text-red-500 transition-colors rounded-lg">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
