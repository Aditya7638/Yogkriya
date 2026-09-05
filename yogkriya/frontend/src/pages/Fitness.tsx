import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { exercisesApi } from '../api';
import { ExerciseCard, LoadingPage, EmptyState, FilterBar, YouTubeEmbed, DifficultyBadge, CategoryBadge, FavoriteButton } from '../components/ui';
import { Dumbbell, Search, ArrowLeft, AlertCircle } from 'lucide-react';
import type { GymExercise } from '../types';

const muscles = [
  { value: '', label: 'All' },
  { value: 'chest', label: 'Chest' },
  { value: 'back', label: 'Back' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'legs', label: 'Legs' },
  { value: 'core', label: 'Core' },
  { value: 'full body', label: 'Full Body' },
  { value: 'cardio', label: 'Cardio' },
];

const difficulties = [
  { value: '', label: 'Any Level' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export function FitnessPage() {
  const [muscle, setMuscle] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery<GymExercise[]>({
    queryKey: ['exercises', muscle, difficulty, search],
    queryFn: () => exercisesApi.list({ muscle_group: muscle || undefined, difficulty: difficulty || undefined, search: search || undefined }),
  });

  if (isLoading) return <LoadingPage />;

  return (
    <div className="page-container py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Dumbbell size={20} />
          </div>
          <h1 className="section-title">Modern Fitness</h1>
        </div>
        <p className="text-stone-500 dark:text-stone-400 max-w-xl">
          Evidence-based exercises across all muscle groups with proper form guidance and instructional video.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search exercises…" className="input pl-9" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="overflow-x-auto">
            <FilterBar filters={muscles} active={muscle} onChange={setMuscle} />
          </div>
          <FilterBar filters={difficulties} active={difficulty} onChange={setDifficulty} />
        </div>
      </div>

      {!data?.length ? (
        <EmptyState icon={<Dumbbell size={24} className="text-stone-400" />} title="No exercises found" description="Try adjusting your filters." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map(e => (
            <ExerciseCard
              key={e.id} id={e.id} name={e.name} description={e.description}
              category={e.muscle_group} difficulty={e.difficulty} badge={e.equipment}
              type="gym" path={`/fitness/${e.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FitnessDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: ex, isLoading } = useQuery<GymExercise>({
    queryKey: ['exercise', id],
    queryFn: () => exercisesApi.get(Number(id)),
  });

  if (isLoading) return <LoadingPage />;
  if (!ex) return <div className="page-container py-12 text-center text-stone-400">Not found</div>;

  const restMin = Math.floor(ex.rest_seconds / 60);
  const restSec = ex.rest_seconds % 60;
  const restLabel = restMin > 0 ? `${restMin}m ${restSec > 0 ? restSec + 's' : ''}`.trim() : `${restSec}s`;

  return (
    <div className="page-container py-12 max-w-4xl">
      <Link to="/fitness" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 text-sm mb-8 transition-colors">
        <ArrowLeft size={15} /> Back to Fitness Library
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="font-display text-3xl font-bold text-stone-900 dark:text-stone-50">{ex.name}</h1>
              <FavoriteButton type="gym" id={ex.id} />
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <DifficultyBadge level={ex.difficulty} />
              <CategoryBadge label={ex.muscle_group} />
              {ex.equipment && <span className="badge-stone">{ex.equipment}</span>}
            </div>
            {ex.description && <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{ex.description}</p>}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Sets', value: String(ex.default_sets) },
              { label: 'Reps', value: ex.default_reps },
              { label: 'Rest', value: restLabel },
            ].map(({ label, value }) => (
              <div key={label} className="card p-4 text-center">
                <div className="text-xl font-bold text-stone-900 dark:text-stone-50">{value}</div>
                <div className="text-xs text-stone-400 mt-1">{label}</div>
              </div>
            ))}
          </div>

          {ex.video && <YouTubeEmbed youtubeId={ex.video.youtube_id} title={ex.name} />}

          {ex.instructions?.length > 0 && (
            <div>
              <h2 className="font-semibold text-stone-900 dark:text-stone-100 mb-4">How to perform</h2>
              <ol className="space-y-3">
                {ex.instructions.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold flex items-center justify-center mt-0.5">{i + 1}</span>
                    <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-5">
          {ex.common_mistakes?.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-500" /> Common Mistakes
              </h3>
              <ul className="space-y-2">
                {ex.common_mistakes.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" /> {m}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="card p-4 text-xs text-stone-400 leading-relaxed">
            Warm up properly before training. Stop if you feel sharp pain. Consult a healthcare professional if you have any injuries or conditions.
          </div>
        </div>
      </div>
    </div>
  );
}
