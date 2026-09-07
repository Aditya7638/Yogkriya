import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { practicesApi } from '../api';
import { ExerciseCard, LoadingPage, EmptyState, FilterBar } from '../components/ui';
import { BookOpen, PlayCircle, Search, Loader2 } from 'lucide-react';
import type { AncientPractice } from '../types';
import { useDebounce } from '../hooks/useDebounce';

const categories = [
  { value: '', label: 'All' },
  { value: 'pranayama', label: 'Pranayama' },
  { value: 'meditation', label: 'Meditation' },
  { value: 'lifestyle', label: 'Lifestyle' },
];

const difficulties = [
  { value: '', label: 'Any Level' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
];

export default function AncientWisdom() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data, isPending, isFetching } = useQuery<AncientPractice[]>({
    queryKey: ['practices', category, difficulty, debouncedSearch],
    queryFn: () => practicesApi.list({
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
      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <BookOpen size={20} />
          </div>
          <h1 className="section-title">Ancient Wisdom</h1>
        </div>
        <p className="text-stone-500 dark:text-stone-400 max-w-2xl leading-relaxed">
          Traditional Indian wellness practices — Pranayama, Dhyana, Dinacharya, and more — presented with classical sources, modern context, and instructional video.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs">
          <BookOpen size={12} /> Content draws on Ministry of AYUSH publications and classical texts. Not medical advice.
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search practices or videos…"
              className="input pl-9 pr-8"
              autoComplete="off"
            />
            {isFetching && (
              <Loader2 size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 animate-spin" />
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
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <FilterBar filters={categories} active={category} onChange={setCategory} />
          <FilterBar filters={difficulties} active={difficulty} onChange={setDifficulty} />
        </div>
      </div>

      {!data?.length ? (
        <EmptyState icon={<BookOpen size={24} className="text-stone-400" />} title="No practices found" description="Try adjusting your filters." />
      ) : (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity duration-200 ${isFetching ? 'opacity-70' : 'opacity-100'}`}>
          {data.map(p => (
            <ExerciseCard
              key={p.id}
              id={p.id}
              name={p.name}
              description={p.description}
              category={p.category}
              difficulty={p.difficulty}
              duration={`${p.duration_minutes} min`}
              type="practice"
              path={`/ancient-wisdom/${p.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
