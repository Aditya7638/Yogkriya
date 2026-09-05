import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const steps = [
  {
    key: 'fitness_goal',
    title: 'What is your primary goal?',
    subtitle: 'We\'ll build your routine around this.',
    options: [
      { value: 'general_fitness', label: '⚡ General Fitness', desc: 'Stay active and healthy overall' },
      { value: 'weight_loss', label: '🔥 Weight Loss', desc: 'Burn fat and improve body composition' },
      { value: 'muscle_gain', label: '💪 Muscle Gain', desc: 'Build strength and lean muscle' },
      { value: 'flexibility', label: '🧘 Flexibility', desc: 'Move better and prevent injury' },
      { value: 'stress_reduction', label: '🌿 Stress Reduction', desc: 'Find calm and mental clarity' },
    ],
  },
  {
    key: 'fitness_level',
    title: 'What is your current fitness level?',
    subtitle: 'Be honest — we\'ll meet you where you are.',
    options: [
      { value: 'beginner', label: '🌱 Beginner', desc: 'New to structured exercise' },
      { value: 'intermediate', label: '🌿 Intermediate', desc: 'Active for 6+ months regularly' },
      { value: 'advanced', label: '🌳 Advanced', desc: 'Training consistently for years' },
    ],
  },
  {
    key: 'available_time',
    title: 'How much time can you commit daily?',
    subtitle: 'Even 15 minutes creates real progress.',
    options: [
      { value: 15, label: '⏱ 15 minutes', desc: 'Quick, focused sessions' },
      { value: 30, label: '⏱ 30 minutes', desc: 'Balanced routine' },
      { value: 45, label: '⏱ 45 minutes', desc: 'Comprehensive practice' },
      { value: 60, label: '⏱ 60 minutes', desc: 'Full deep-dive session' },
    ],
  },
  {
    key: 'preferred_style',
    title: 'What style resonates with you?',
    subtitle: 'You can always mix and match later.',
    options: [
      { value: 'yoga', label: '🧘 Yoga', desc: 'Asanas, breathwork, and meditation' },
      { value: 'gym', label: '🏋️ Modern Fitness', desc: 'Strength training and cardio' },
      { value: 'hybrid', label: '⚡ Hybrid', desc: 'Best of both worlds' },
    ],
  },
  {
    key: 'dietary_preference',
    title: 'What is your dietary preference?',
    subtitle: 'For personalised nutrition guidance.',
    options: [
      { value: 'vegetarian', label: '🥦 Vegetarian', desc: 'No meat or fish' },
      { value: 'vegan', label: '🌱 Vegan', desc: 'No animal products' },
      { value: 'eggetarian', label: '🥚 Eggetarian', desc: 'Vegetarian + eggs' },
      { value: 'non_vegetarian', label: '🍗 Non-Vegetarian', desc: 'All foods included' },
    ],
  },
];

export default function Onboarding() {
  const { updateProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  const current = steps[step];
  const selected = answers[current.key];
  const isLast = step === steps.length - 1;

  const handleSelect = (value: any) => {
    setAnswers(a => ({ ...a, [current.key]: value }));
  };

  const handleNext = async () => {
    if (isLast) {
      setSaving(true);
      try {
        await updateProfile({ ...answers, onboarding_completed: true });
        navigate('/routines');
      } catch {
        setSaving(false);
      }
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-forest-50 via-stone-50 to-saffron-50 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-forest-600' : 'bg-stone-200 dark:bg-stone-700'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mb-8">
              <p className="text-sm text-stone-400 mb-2">Step {step + 1} of {steps.length}</p>
              <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-1">{current.title}</h1>
              <p className="text-stone-500 dark:text-stone-400">{current.subtitle}</p>
            </div>

            <div className="space-y-3 mb-8">
              {current.options.map((opt) => {
                const isActive = selected === opt.value;
                return (
                  <button
                    key={String(opt.value)}
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 flex items-center justify-between gap-3 ${
                      isActive
                        ? 'border-forest-500 bg-forest-50 dark:bg-forest-900/30'
                        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-stone-300 dark:hover:border-stone-600'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-stone-900 dark:text-stone-100">{opt.label}</div>
                      <div className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">{opt.desc}</div>
                    </div>
                    {isActive && <CheckCircle size={20} className="text-forest-500 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)} className="btn-secondary flex items-center gap-2">
                  <ArrowLeft size={16} /> Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!selected || saving}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? 'Saving…' : isLast ? 'Generate My Routine' : 'Continue'}
                {!saving && <ArrowRight size={16} />}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
