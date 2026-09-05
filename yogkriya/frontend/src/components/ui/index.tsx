import type { ReactNode } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

// Spinner
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sz = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-10 w-10' : 'h-7 w-7';
  return (
    <div className={`${sz} border-2 border-forest-200 border-t-forest-600 rounded-full animate-spin`} />
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-3 text-stone-400 text-sm">Loading…</p>
      </div>
    </div>
  );
}

// Empty state
export function EmptyState({ icon, title, description, action }: {
  icon: ReactNode; title: string; description?: string; action?: ReactNode;
}) {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-stone-100 dark:bg-stone-800 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-1">{title}</h3>
      {description && <p className="text-stone-400 text-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}

// Difficulty badge
export function DifficultyBadge({ level }: { level?: string }) {
  if (!level) return null;
  const map: Record<string, string> = {
    beginner: 'badge-green',
    intermediate: 'badge-amber',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 badge',
  };
  return <span className={map[level] || 'badge-stone'}>{level}</span>;
}

// Category badge
export function CategoryBadge({ label }: { label?: string }) {
  if (!label) return null;
  return <span className="badge-stone capitalize">{label.replace(/_/g, ' ')}</span>;
}

// Favorite button
export function FavoriteButton({ type, id }: { type: string; id: number }) {
  const { user } = useAuth();
  const { isFav, toggle } = useFavorites();
  if (!user) return null;
  const active = isFav(type, id);
  return (
    <button
      onClick={() => toggle(type, id)}
      className={`p-2 rounded-xl transition-all duration-150 ${
        active
          ? 'bg-red-50 dark:bg-red-900/30 text-red-500'
          : 'bg-stone-100 dark:bg-stone-700 text-stone-400 hover:text-red-500'
      }`}
      title={active ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart size={16} fill={active ? 'currentColor' : 'none'} />
    </button>
  );
}

// Video embed
export function YouTubeEmbed({ youtubeId, title }: { youtubeId: string; title?: string }) {
  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ paddingBottom: '56.25%' }}>
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
        title={title || 'Exercise video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

// Progress bar
export function ProgressBar({ value, max, color = 'forest' }: { value: number; max: number; color?: string }) {
  const pct = Math.min(100, Math.round((value / Math.max(max, 1)) * 100));
  return (
    <div className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color === 'saffron' ? 'bg-saffron-500' : 'bg-forest-500'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// Stat card
export function StatCard({ label, value, sub, icon }: {
  label: string; value: string | number; sub?: string; icon: ReactNode;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-forest-50 dark:bg-forest-900/30 flex items-center justify-center text-forest-600 dark:text-forest-400">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-stone-900 dark:text-stone-50">{value}</div>
      <div className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-stone-400 mt-1">{sub}</div>}
    </div>
  );
}

// Exercise card (used across yoga, gym, practices)
export function ExerciseCard({ id, name, description, category, difficulty, duration, badge, type, path }: {
  id: number; name: string; description?: string; category?: string;
  difficulty?: string; duration?: string; badge?: string; type: string; path: string;
}) {
  return (
    <Link
      to={path}
      className="card p-5 flex flex-col gap-3 hover:shadow-card-hover transition-shadow duration-200 group"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-stone-900 dark:text-stone-100 group-hover:text-forest-700 dark:group-hover:text-forest-400 transition-colors leading-snug">
          {name}
        </h3>
        <FavoriteButton type={type} id={id} />
      </div>
      {description && (
        <p className="text-stone-500 dark:text-stone-400 text-sm line-clamp-2 leading-relaxed">{description}</p>
      )}
      <div className="flex items-center gap-2 flex-wrap mt-auto">
        {difficulty && <DifficultyBadge level={difficulty} />}
        {category && <CategoryBadge label={badge || category} />}
        {duration && <span className="badge-stone">{duration}</span>}
      </div>
    </Link>
  );
}

// Filter bar
export function FilterBar({ filters, active, onChange }: {
  filters: { value: string; label: string }[];
  active: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map(f => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            active === f.value
              ? 'bg-forest-600 text-white'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
