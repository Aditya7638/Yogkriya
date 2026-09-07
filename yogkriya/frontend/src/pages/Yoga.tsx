import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { yogaApi } from '../api';
import { ExerciseCard, LoadingPage, EmptyState, FilterBar } from '../components/ui';
import { Leaf, Search, PlayCircle, Loader2 } from 'lucide-react';
import type { YogaExercise } from '../types';
import { useDebounce } from '../hooks/useDebounce';

const categories = [
  { value: '', label: 'All' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'strength', label: 'Strength' },
  { value: 'flexibility', label: 'Flexibility' },
  { value: 'relaxation', label: 'Relaxation' },
];

const difficulties = [
  { value: '', label: 'Any Level' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export default function YogaPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data, isPending, isFetching } = useQuery<YogaExercise[]>({
    queryKey: ['yoga', category, difficulty, debouncedSearch],
    queryFn: () => yogaApi.list({
      category: category || undefined,
      difficulty: difficulty || undefined,
      search: debouncedSearch.trim() || undefined,
    }),
    placeholderData: keepPreviousData,
  });

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim().length >= 2) {
      e.preventDefault();
      navigate(`/video-search?topic=${encodeURIComponent(search.trim())}`);
    }
  };

  if (isPending) return <LoadingPage />;

  return (
    <div className="page-container py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-forest-100 dark:bg-forest-900/40 flex items-center justify-center text-forest-600 dark:text-forest-400">
            <Leaf size={20} />
          </div>
          <h1 className="section-title">Yoga Library</h1>
        </div>
        <p className="text-stone-500 dark:text-stone-400 max-w-xl">
          Curated asanas with video guidance, step-by-step instructions, and traditional benefits.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search poses…"
            className="input pl-9 pr-8"
            autoComplete="off"
          />
          {isFetching && (
            <Loader2 size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-500 animate-spin" />
          )}
        </div>
        {search.trim().length >= 2 && (
          <Link
            to={`/video-search?topic=${encodeURIComponent(search.trim())}`}
            className="btn-secondary inline-flex items-center justify-center gap-2 shrink-0"
          >
            <PlayCircle size={16} /> Find videos
          </Link>
        )}
        <div className="flex flex-col gap-2">
          <FilterBar filters={categories} active={category} onChange={setCategory} />
          <FilterBar filters={difficulties} active={difficulty} onChange={setDifficulty} />
        </div>
      </div>

      {/* Grid */}
      {!data?.length ? (
        <EmptyState icon={<Leaf size={24} className="text-stone-400" />} title="No poses found" description="Try adjusting your filters." />
      ) : (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity duration-200 ${isFetching ? 'opacity-70' : 'opacity-100'}`}>
          {data.map(y => (
            <ExerciseCard
              key={y.id}
              id={y.id}
              name={y.name}
              description={y.description}
              category={y.category}
              difficulty={y.difficulty}
              duration={`${y.duration_minutes} min`}
              type="yoga"
              path={`/yoga/${y.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
