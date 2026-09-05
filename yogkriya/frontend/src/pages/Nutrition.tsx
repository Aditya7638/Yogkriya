import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { nutritionApi } from '../api';
import { LoadingPage, FilterBar } from '../components/ui';
import { UtensilsCrossed, Leaf, Zap, Info } from 'lucide-react';
import type { Food, DietPlan } from '../types';

const foodCategories = [
  { value: '', label: 'All' },
  { value: 'grains', label: 'Grains' },
  { value: 'millets', label: 'Millets' },
  { value: 'pulses', label: 'Pulses' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'nuts', label: 'Nuts' },
  { value: 'spices', label: 'Spices' },
  { value: 'proteins', label: 'Proteins' },
];

function FoodCard({ food }: { food: Food }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-stone-900 dark:text-stone-100">{food.name}</h3>
        {food.is_traditional && (
          <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 text-xs">Traditional</span>
        )}
      </div>
      {food.description && <p className="text-stone-500 dark:text-stone-400 text-sm mb-3 line-clamp-2">{food.description}</p>}
      {food.calories_per_100g && (
        <div className="grid grid-cols-4 gap-1 text-center mt-3 pt-3 border-t border-stone-100 dark:border-stone-700">
          {[
            { label: 'kcal', value: food.calories_per_100g },
            { label: 'protein', value: food.protein_g ? `${food.protein_g}g` : '—' },
            { label: 'carbs', value: food.carbs_g ? `${food.carbs_g}g` : '—' },
            { label: 'fat', value: food.fat_g ? `${food.fat_g}g` : '—' },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-sm font-bold text-stone-800 dark:text-stone-200">{value}</div>
              <div className="text-xs text-stone-400">{label}</div>
            </div>
          ))}
        </div>
      )}
      {food.traditional_context && (
        <p className="text-amber-700 dark:text-amber-400 text-xs mt-3 italic line-clamp-2">{food.traditional_context}</p>
      )}
    </div>
  );
}

function MealSection({ label, items, calories }: { label: string; items: string[]; calories?: number }) {
  return (
    <div className="border-l-2 border-forest-200 dark:border-forest-700 pl-4 py-1">
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-stone-800 dark:text-stone-200 text-sm">{label}</span>
        {calories && <span className="text-xs text-stone-400">~{calories} kcal</span>}
      </div>
      <ul className="space-y-0.5">
        {items.map((item, i) => (
          <li key={i} className="text-stone-500 dark:text-stone-400 text-sm flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-forest-400 shrink-0" /> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DietPlanCard({ plan }: { plan: DietPlan }) {
  const meals = plan.meals as Record<string, any>;
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-stone-900 dark:text-stone-100">{plan.name}</h3>
        {plan.is_traditional && (
          <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Traditional</span>
        )}
      </div>
      {plan.estimated_calories && (
        <p className="text-sm text-forest-600 dark:text-forest-400 font-medium mb-4">~{plan.estimated_calories} kcal/day (estimate)</p>
      )}
      <div className="space-y-4">
        {Object.entries(meals).map(([key, meal]: [string, any]) => (
          <MealSection
            key={key}
            label={key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            items={meal.items || []}
            calories={meal.approx_calories}
          />
        ))}
      </div>
    </div>
  );
}

export default function Nutrition() {
  const [tab, setTab] = useState<'traditional' | 'modern'>('traditional');
  const [foodCategory, setFoodCategory] = useState('');

  const { data: foods, isLoading: foodsLoading } = useQuery<Food[]>({
    queryKey: ['foods', foodCategory],
    queryFn: () => nutritionApi.foods({ category: foodCategory || undefined }),
    enabled: tab === 'traditional',
  });

  const { data: dietPlans, isLoading: plansLoading } = useQuery<DietPlan[]>({
    queryKey: ['diet-plans'],
    queryFn: () => nutritionApi.dietPlans(),
  });

  const traditionalPlans = dietPlans?.filter(p => p.is_traditional) || [];
  const modernPlans = dietPlans?.filter(p => !p.is_traditional) || [];

  return (
    <div className="page-container py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <UtensilsCrossed size={20} />
          </div>
          <h1 className="section-title">Nutrition</h1>
        </div>
        <p className="text-stone-500 dark:text-stone-400 max-w-xl">
          Traditional Indian foods and modern meal structures to complement your practice.
        </p>
        <div className="mt-3 flex items-start gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs max-w-lg">
          <Info size={13} className="mt-0.5 shrink-0" />
          Nutritional values are general estimates. YogKriya is not a substitute for advice from a registered dietitian or physician.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl w-fit">
        {[
          { key: 'traditional', label: '🪔 Traditional', icon: Leaf },
          { key: 'modern', label: '⚡ Modern Plans', icon: Zap },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === key
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'traditional' && (
        <div className="space-y-10">
          {/* Traditional foods */}
          <section>
            <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-5">Traditional Indian Foods</h2>
            <div className="mb-5 overflow-x-auto">
              <FilterBar filters={foodCategories} active={foodCategory} onChange={setFoodCategory} />
            </div>
            {foodsLoading ? <LoadingPage /> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {foods?.map(f => <FoodCard key={f.id} food={f} />)}
              </div>
            )}
          </section>

          {/* Traditional meal plans */}
          {traditionalPlans.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-5">Traditional Meal Plans</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {traditionalPlans.map(p => <DietPlanCard key={p.id} plan={p} />)}
              </div>
            </section>
          )}
        </div>
      )}

      {tab === 'modern' && (
        <div>
          <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-5">Structured Meal Plans</h2>
          {plansLoading ? <LoadingPage /> : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {modernPlans.map(p => <DietPlanCard key={p.id} plan={p} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
