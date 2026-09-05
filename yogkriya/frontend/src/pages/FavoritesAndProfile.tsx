import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { yogaApi, practicesApi, exercisesApi } from '../api';
import { EmptyState, DifficultyBadge, CategoryBadge, FavoriteButton } from '../components/ui';
import { Heart, Leaf, Dumbbell, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { YogaExercise, AncientPractice, GymExercise, Favorite } from '../types';

function FavCard({ fav, yoga, practices, exercises }: {
  fav: Favorite;
  yoga: YogaExercise[];
  practices: AncientPractice[];
  exercises: GymExercise[];
}) {
  let item: any = null;
  let path = '/';
  let icon = <Leaf size={14} />;

  if (fav.item_type === 'yoga') {
    item = yoga.find(y => y.id === fav.item_id);
    path = `/yoga/${fav.item_id}`;
    icon = <Leaf size={14} className="text-forest-500" />;
  } else if (fav.item_type === 'practice') {
    item = practices.find(p => p.id === fav.item_id);
    path = `/ancient-wisdom/${fav.item_id}`;
    icon = <BookOpen size={14} className="text-amber-500" />;
  } else {
    item = exercises.find(e => e.id === fav.item_id);
    path = `/fitness/${fav.item_id}`;
    icon = <Dumbbell size={14} className="text-blue-500" />;
  }

  if (!item) return null;

  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon}
          <Link to={path} className="font-semibold text-stone-900 dark:text-stone-100 hover:text-forest-700 dark:hover:text-forest-400 transition-colors">
            {item.name}
          </Link>
        </div>
        <FavoriteButton type={fav.item_type} id={fav.item_id} />
      </div>
      {item.description && <p className="text-stone-500 dark:text-stone-400 text-sm line-clamp-2">{item.description}</p>}
      <div className="flex gap-2 flex-wrap">
        <DifficultyBadge level={item.difficulty} />
        <CategoryBadge label={item.category || item.muscle_group} />
      </div>
    </div>
  );
}

export function FavoritesPage() {
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const { data: yoga = [] } = useQuery<YogaExercise[]>({ queryKey: ['yoga'], queryFn: () => yogaApi.list() });
  const { data: practices = [] } = useQuery<AncientPractice[]>({ queryKey: ['practices'], queryFn: () => practicesApi.list() });
  const { data: exercises = [] } = useQuery<GymExercise[]>({ queryKey: ['exercises'], queryFn: () => exercisesApi.list() });

  if (!user) return (
    <div className="page-container py-20 text-center">
      <Link to="/login" className="btn-primary">Sign in</Link>
    </div>
  );

  return (
    <div className="page-container py-12">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-500">
          <Heart size={20} />
        </div>
        <div>
          <h1 className="section-title">My Favorites</h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm">Your saved exercises and practices.</p>
        </div>
      </div>

      {!favorites.length ? (
        <EmptyState
          icon={<Heart size={24} className="text-stone-400" />}
          title="No favorites yet"
          description="Tap the heart icon on any exercise or practice to save it here."
          action={<Link to="/yoga" className="btn-primary">Browse Yoga</Link>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map(fav => (
            <FavCard key={fav.id} fav={fav} yoga={yoga} practices={practices} exercises={exercises} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    age: String(user?.profile?.age || ''),
    height_cm: String(user?.profile?.height_cm || ''),
    weight_kg: String(user?.profile?.weight_kg || ''),
    fitness_level: user?.profile?.fitness_level || 'beginner',
    fitness_goal: user?.profile?.fitness_goal || 'general_fitness',
    preferred_style: user?.profile?.preferred_style || 'hybrid',
    available_time: String(user?.profile?.available_time || 30),
    dietary_preference: user?.profile?.dietary_preference || 'vegetarian',
  });

  if (!user) return (
    <div className="page-container py-20 text-center">
      <Link to="/login" className="btn-primary">Sign in</Link>
    </div>
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        ...form,
        age: form.age ? Number(form.age) : undefined,
        height_cm: form.height_cm ? Number(form.height_cm) : undefined,
        weight_kg: form.weight_kg ? Number(form.weight_kg) : undefined,
        available_time: Number(form.available_time),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const field = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div className="page-container py-12 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-forest-100 dark:bg-forest-900/40 flex items-center justify-center text-forest-700 dark:text-forest-400 text-2xl font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-50">{user.name}</h1>
          <p className="text-stone-400 text-sm">{user.email}</p>
        </div>
      </div>

      <div className="card p-6 space-y-5">
        <h2 className="font-semibold text-stone-900 dark:text-stone-100">Profile & Preferences</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Age', key: 'age', placeholder: '28' },
            { label: 'Height (cm)', key: 'height_cm', placeholder: '170' },
            { label: 'Weight (kg)', key: 'weight_kg', placeholder: '70' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">{label}</label>
              <input type="number" value={(form as any)[key]} onChange={field(key)} placeholder={placeholder} className="input" />
            </div>
          ))}
        </div>

        {[
          { label: 'Fitness Goal', key: 'fitness_goal', options: [{ value: 'general_fitness', label: 'General Fitness' }, { value: 'weight_loss', label: 'Weight Loss' }, { value: 'muscle_gain', label: 'Muscle Gain' }, { value: 'flexibility', label: 'Flexibility' }, { value: 'stress_reduction', label: 'Stress Reduction' }] },
          { label: 'Fitness Level', key: 'fitness_level', options: [{ value: 'beginner', label: 'Beginner' }, { value: 'intermediate', label: 'Intermediate' }, { value: 'advanced', label: 'Advanced' }] },
          { label: 'Preferred Style', key: 'preferred_style', options: [{ value: 'yoga', label: 'Yoga' }, { value: 'gym', label: 'Gym' }, { value: 'hybrid', label: 'Hybrid' }] },
          { label: 'Available Time', key: 'available_time', options: [{ value: '15', label: '15 min' }, { value: '30', label: '30 min' }, { value: '45', label: '45 min' }, { value: '60', label: '60 min' }] },
          { label: 'Dietary Preference', key: 'dietary_preference', options: [{ value: 'vegetarian', label: 'Vegetarian' }, { value: 'vegan', label: 'Vegan' }, { value: 'eggetarian', label: 'Eggetarian' }, { value: 'non_vegetarian', label: 'Non-Vegetarian' }] },
        ].map(({ label, key, options }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">{label}</label>
            <select value={(form as any)[key]} onChange={field(key)} className="input">
              {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        ))}

        <div className="flex gap-3 pt-2">
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
            {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
          </button>
          <button onClick={logout} className="btn-secondary text-red-500 dark:text-red-400">Sign out</button>
        </div>
      </div>
    </div>
  );
}
