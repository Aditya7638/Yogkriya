import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { routinesApi } from '../api';
import { LoadingPage, EmptyState } from '../components/ui';
import { Flame, Plus, Trash2, Play, RefreshCw, ChevronRight, Dumbbell, Leaf, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { Routine } from '../types';

const typeIcon = (t: string) => {
  if (t === 'yoga') return <Leaf size={13} className="text-forest-500" />;
  if (t === 'gym') return <Dumbbell size={13} className="text-blue-500" />;
  return <BookOpen size={13} className="text-amber-500" />;
};

function RoutineCard({ routine, onDelete }: { routine: Routine; onDelete: () => void }) {
  const navigate = useNavigate();
  const exCount = routine.exercises.length;
  const typeSet = new Set(routine.exercises.map(e => e.exercise_type));
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-1">{routine.name}</h3>
          {routine.description && <p className="text-stone-500 dark:text-stone-400 text-sm line-clamp-1">{routine.description}</p>}
        </div>
        <button onClick={onDelete} className="p-2 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          <Trash2 size={15} />
        </button>
      </div>
      <div className="space-y-1.5 mb-4">
        {routine.exercises.slice(0, 4).map(ex => (
          <div key={ex.id} className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
            {typeIcon(ex.exercise_type)}
            <span>{ex.exercise_name}</span>
            {ex.sets && <span className="text-stone-400 text-xs">{ex.sets}×{ex.reps}</span>}
            {ex.duration_seconds && <span className="text-stone-400 text-xs">{Math.round(ex.duration_seconds / 60)} min</span>}
          </div>
        ))}
        {exCount > 4 && <p className="text-xs text-stone-400">+{exCount - 4} more exercises</p>}
      </div>
      <div className="flex items-center gap-2 mb-4">
        {Array.from(typeSet).map(t => <span key={t} className="badge-stone capitalize text-xs">{t}</span>)}
        <span className="badge-stone text-xs">{exCount} exercises</span>
      </div>
      <div className="flex gap-2">
        <button onClick={() => navigate(`/workout/${routine.id}`)} className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5">
          <Play size={15} /> Start Workout
        </button>
        <Link to={`/routines/${routine.id}`} className="btn-secondary px-4 flex items-center gap-1">
          View <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function Routines() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);

  const { data: routines, isLoading } = useQuery<Routine[]>({
    queryKey: ['routines'],
    queryFn: routinesApi.list,
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: routinesApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['routines'] }),
  });

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const r = await routinesApi.generate();
      qc.invalidateQueries({ queryKey: ['routines'] });
      navigate(`/routines/${r.id}`);
    } finally {
      setGenerating(false);
    }
  };

  if (!user) return (
    <div className="page-container py-20 text-center">
      <h2 className="text-xl font-semibold mb-3 text-stone-700 dark:text-stone-300">Sign in to access routines</h2>
      <Link to="/login" className="btn-primary">Sign in</Link>
    </div>
  );

  if (isLoading) return <LoadingPage />;

  return (
    <div className="page-container py-12">
      <div className="flex items-start justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-saffron-100 dark:bg-saffron-900/40 flex items-center justify-center text-saffron-600 dark:text-saffron-400">
              <Flame size={20} />
            </div>
            <h1 className="section-title">My Routines</h1>
          </div>
          <p className="text-stone-500 dark:text-stone-400">Personalised workout plans built around your goals.</p>
        </div>
        <button onClick={handleGenerate} disabled={generating} className="btn-primary flex items-center gap-2 shrink-0">
          {generating ? <RefreshCw size={15} className="animate-spin" /> : <Plus size={15} />}
          {generating ? 'Generating…' : 'Generate Routine'}
        </button>
      </div>

      {!user.profile?.onboarding_completed && (
        <div className="card p-6 bg-forest-50 dark:bg-forest-900/20 border-forest-200 dark:border-forest-700 mb-8">
          <h3 className="font-semibold text-forest-800 dark:text-forest-300 mb-1">Complete your profile first</h3>
          <p className="text-forest-700 dark:text-forest-400 text-sm mb-3">Tell us your goals so we can generate the right routine for you.</p>
          <Link to="/onboarding" className="btn-primary py-2">Complete Onboarding</Link>
        </div>
      )}

      {!routines?.length ? (
        <EmptyState
          icon={<Flame size={24} className="text-stone-400" />}
          title="No routines yet"
          description="Generate your first personalised routine based on your goals."
          action={<button onClick={handleGenerate} disabled={generating} className="btn-primary">{generating ? 'Generating…' : 'Generate My Routine'}</button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {routines.map(r => <RoutineCard key={r.id} routine={r} onDelete={() => deleteMutation.mutate(r.id)} />)}
        </div>
      )}
    </div>
  );
}
