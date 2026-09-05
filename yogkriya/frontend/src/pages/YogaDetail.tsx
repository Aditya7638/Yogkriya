import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { yogaApi } from '../api';
import { LoadingPage, YouTubeEmbed, DifficultyBadge, CategoryBadge, FavoriteButton } from '../components/ui';
import { ArrowLeft, Clock, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';
import type { YogaExercise } from '../types';

export default function YogaDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: yoga, isLoading } = useQuery<YogaExercise>({
    queryKey: ['yoga', id],
    queryFn: () => yogaApi.get(Number(id)),
  });

  if (isLoading) return <LoadingPage />;
  if (!yoga) return <div className="page-container py-12 text-center text-stone-400">Not found</div>;

  return (
    <div className="page-container py-12 max-w-4xl">
      <Link to="/yoga" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 text-sm mb-8 transition-colors">
        <ArrowLeft size={15} /> Back to Yoga Library
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="font-display text-3xl font-bold text-stone-900 dark:text-stone-50">{yoga.name}</h1>
              <FavoriteButton type="yoga" id={yoga.id} />
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <DifficultyBadge level={yoga.difficulty} />
              <CategoryBadge label={yoga.category} />
              <span className="badge-stone flex items-center gap-1"><Clock size={11} /> {yoga.duration_minutes} min</span>
            </div>
            {yoga.description && (
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{yoga.description}</p>
            )}
          </div>

          {yoga.video && <YouTubeEmbed youtubeId={yoga.video.youtube_id} title={yoga.name} />}

          {/* Instructions */}
          {yoga.instructions?.length > 0 && (
            <div>
              <h2 className="font-semibold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-forest-100 dark:bg-forest-900/40 flex items-center justify-center text-forest-600 text-xs">1</span>
                How to practice
              </h2>
              <ol className="space-y-3">
                {yoga.instructions.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-forest-50 dark:bg-forest-900/30 text-forest-700 dark:text-forest-400 text-xs font-semibold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="lg:col-span-2 space-y-5">
          {yoga.benefits?.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-saffron-500" /> Benefits
              </h3>
              <ul className="space-y-2">
                {yoga.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400">
                    <CheckCircle size={14} className="text-forest-500 mt-0.5 shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {yoga.precautions?.length > 0 && (
            <div className="card p-5 border-amber-200 dark:border-amber-800">
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" /> Precautions
              </h3>
              <ul className="space-y-2">
                {yoga.precautions.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="card p-5 bg-stone-50 dark:bg-stone-800/50 text-xs text-stone-400 leading-relaxed">
            Consult a qualified healthcare professional before beginning any new exercise practice, particularly if you have pre-existing medical conditions.
          </div>
        </div>
      </div>
    </div>
  );
}
