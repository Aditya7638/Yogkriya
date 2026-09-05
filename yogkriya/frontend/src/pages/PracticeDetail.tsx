import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { practicesApi } from '../api';
import { LoadingPage, YouTubeEmbed, DifficultyBadge, CategoryBadge, FavoriteButton } from '../components/ui';
import { ArrowLeft, Clock, CheckCircle, AlertTriangle, BookOpen, Sparkles } from 'lucide-react';
import type { AncientPractice } from '../types';

export default function PracticeDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: practice, isLoading } = useQuery<AncientPractice>({
    queryKey: ['practice', id],
    queryFn: () => practicesApi.get(Number(id)),
  });

  if (isLoading) return <LoadingPage />;
  if (!practice) return <div className="page-container py-12 text-center text-stone-400">Not found</div>;

  return (
    <div className="page-container py-12 max-w-4xl">
      <Link to="/ancient-wisdom" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 text-sm mb-8 transition-colors">
        <ArrowLeft size={15} /> Back to Ancient Wisdom
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="font-display text-3xl font-bold text-stone-900 dark:text-stone-50">{practice.name}</h1>
              <FavoriteButton type="practice" id={practice.id} />
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <DifficultyBadge level={practice.difficulty} />
              <CategoryBadge label={practice.category} />
              <span className="badge-stone flex items-center gap-1"><Clock size={11} /> {practice.duration_minutes} min</span>
            </div>
            {practice.description && (
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{practice.description}</p>
            )}
          </div>

          {/* Traditional context */}
          {practice.traditional_context && (
            <div className="card p-5 bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800">
              <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
                <BookOpen size={15} /> Traditional Context
              </h3>
              <p className="text-amber-700 dark:text-amber-400 text-sm leading-relaxed">{practice.traditional_context}</p>
              {practice.traditional_source && (
                <p className="text-amber-500 dark:text-amber-500 text-xs mt-2 italic">Source: {practice.traditional_source}</p>
              )}
            </div>
          )}

          {practice.video && <YouTubeEmbed youtubeId={practice.video.youtube_id} title={practice.name} />}

          {/* Instructions */}
          {practice.instructions?.length > 0 && (
            <div>
              <h2 className="font-semibold text-stone-900 dark:text-stone-100 mb-4">How to practice</h2>
              <ol className="space-y-3">
                {practice.instructions.map((step, i) => (
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

          {/* Modern understanding */}
          {practice.modern_understanding && (
            <div className="card p-5 border-forest-200 dark:border-forest-800">
              <h3 className="font-semibold text-forest-700 dark:text-forest-400 mb-2 flex items-center gap-2">
                <Sparkles size={15} /> Modern Understanding
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">{practice.modern_understanding}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-5">
          {practice.traditional_benefits?.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
                <Sparkles size={16} className="text-saffron-500" /> Traditional Benefits
              </h3>
              <ul className="space-y-2">
                {practice.traditional_benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400">
                    <CheckCircle size={14} className="text-forest-500 mt-0.5 shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {practice.precautions?.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" /> Precautions
              </h3>
              <ul className="space-y-2">
                {practice.precautions.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="card p-4 text-xs text-stone-400 leading-relaxed">
            The traditional benefits described reflect classical Ayurvedic and yogic literature. They are presented as cultural and historical context, not medical claims. Consult a qualified healthcare professional for medical advice.
          </div>
        </div>
      </div>
    </div>
  );
}
