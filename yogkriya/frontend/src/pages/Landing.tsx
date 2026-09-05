import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Dumbbell, BookOpen, UtensilsCrossed, BarChart2, Flame, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const features = [
  { icon: Leaf, title: 'Yoga Library', desc: '15+ curated asanas with video guidance, instructions, and benefits.', to: '/yoga', color: 'bg-forest-50 dark:bg-forest-900/30 text-forest-600 dark:text-forest-400' },
  { icon: BookOpen, title: 'Ancient Wisdom', desc: 'Pranayama, Dhyana, Dinacharya and more — rooted in classical tradition.', to: '/ancient-wisdom', color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
  { icon: Dumbbell, title: 'Modern Fitness', desc: '15+ gym exercises across all muscle groups with proper form cues.', to: '/fitness', color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
  { icon: UtensilsCrossed, title: 'Nutrition', desc: 'Traditional Indian foods and modern meal plans tailored to your goal.', to: '/nutrition', color: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' },
  { icon: Flame, title: 'Personalised Routines', desc: 'Get a rule-based routine matched to your goal, level and available time.', to: '/routines', color: 'bg-saffron-50 dark:bg-saffron-900/30 text-saffron-600 dark:text-saffron-400' },
  { icon: BarChart2, title: 'Progress Tracking', desc: 'Streaks, weekly charts, session history — see your journey grow.', to: '/progress', color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
];

const testimonials = [
  { name: 'Priya S.', text: 'Finally a platform that blends my morning pranayama with my evening gym routine. The hybrid approach is exactly what I needed.', stars: 5 },
  { name: 'Arjun M.', text: 'The ancient wisdom section is beautifully researched. I\'ve learned more about Nadi Shodhana here than in years of casual reading.', stars: 5 },
  { name: 'Kavita R.', text: 'Clean, fast, no fluff. The progress tracker keeps me accountable. 22-day streak and counting.', stars: 5 },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center">
        {/* background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-forest-50 via-stone-50 to-saffron-50 dark:from-stone-900 dark:via-stone-900 dark:to-forest-950" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-forest-100 dark:bg-forest-900/20 rounded-full blur-3xl opacity-60 -translate-y-24 translate-x-24" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-saffron-100 dark:bg-saffron-900/10 rounded-full blur-3xl opacity-50 translate-y-16 -translate-x-16" />
        </div>

        <div className="page-container py-20">
          <div className="max-w-3xl">
            <motion.div initial="hidden" animate="show" variants={stagger}>
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-100 dark:bg-forest-900/50 text-forest-700 dark:text-forest-400 text-sm font-medium mb-6">
                  🌿 Wellness rooted in tradition
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-stone-900 dark:text-stone-50 leading-tight mb-4">
                YogKriya
              </motion.h1>

              <motion.p variants={fadeUp} className="font-display text-2xl sm:text-3xl text-forest-700 dark:text-forest-400 italic mb-6">
                Ancient Wisdom. Modern Strength.
              </motion.p>

              <motion.p variants={fadeUp} className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed mb-10 max-w-2xl">
                One platform for yoga, traditional Indian wellness, modern fitness, personalised routines, and progress tracking. Where your heritage meets your health goals.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                {user ? (
                  <Link to="/routines" className="btn-primary text-base px-6 py-3 flex items-center gap-2">
                    My Routines <ArrowRight size={18} />
                  </Link>
                ) : (
                  <Link to="/register" className="btn-primary text-base px-6 py-3 flex items-center gap-2">
                    Start Your Journey <ArrowRight size={18} />
                  </Link>
                )}
                <Link to="/yoga" className="btn-secondary text-base px-6 py-3">
                  Explore Practices
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-center gap-6 mt-12 text-sm text-stone-500 dark:text-stone-400">
                <div className="flex items-center gap-1.5">
                  <span className="text-forest-500 font-bold">15+</span> Yoga poses
                </div>
                <div className="w-px h-4 bg-stone-300 dark:bg-stone-600" />
                <div className="flex items-center gap-1.5">
                  <span className="text-forest-500 font-bold">10+</span> Ancient practices
                </div>
                <div className="w-px h-4 bg-stone-300 dark:bg-stone-600" />
                <div className="flex items-center gap-1.5">
                  <span className="text-forest-500 font-bold">15+</span> Gym exercises
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 page-container">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-14"
        >
          <motion.h2 variants={fadeUp} className="section-title mb-3">
            Everything you need, in one place
          </motion.h2>
          <motion.p variants={fadeUp} className="text-stone-500 dark:text-stone-400 max-w-xl mx-auto">
            YogKriya combines the depth of India's wellness heritage with the structure of modern fitness science.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map(({ icon: Icon, title, desc, to, color }) => (
            <motion.div key={title} variants={fadeUp}>
              <Link
                to={to}
                className="card p-6 flex flex-col gap-4 hover:shadow-card-hover transition-all duration-200 group h-full"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-1 group-hover:text-forest-700 dark:group-hover:text-forest-400 transition-colors">
                    {title}
                  </h3>
                  <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">{desc}</p>
                </div>
                <div className="mt-auto flex items-center gap-1 text-forest-600 dark:text-forest-400 text-sm font-medium">
                  Explore <ArrowRight size={14} />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Philosophy strip */}
      <section className="py-20 bg-forest-700 dark:bg-forest-900">
        <div className="page-container text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={fadeUp} className="font-display text-3xl sm:text-4xl text-white italic mb-4">
              "Yogaḥ karmasu kauśalam"
            </motion.p>
            <motion.p variants={fadeUp} className="text-forest-200 text-sm mb-8">
              Yoga is excellence in action — Bhagavad Gita 2.50
            </motion.p>
            <motion.p variants={fadeUp} className="text-forest-100 max-w-xl mx-auto leading-relaxed">
              We believe that the most sustainable wellness practice is one that honours the past while meeting you where you are today — whatever your body, your schedule, and your goals.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 page-container">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="section-title text-center mb-12">
            What practitioners say
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <motion.div key={t.name} variants={fadeUp} className="card p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={14} className="fill-saffron-400 text-saffron-400" />
                  ))}
                </div>
                <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <p className="font-medium text-stone-800 dark:text-stone-200 text-sm">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-20 page-container">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="bg-gradient-to-br from-forest-600 to-forest-800 rounded-3xl p-12 text-center"
          >
            <h2 className="font-display text-4xl font-bold text-white mb-4">Begin your journey today</h2>
            <p className="text-forest-200 mb-8 max-w-md mx-auto">
              Free to join. No subscriptions. Just honest, holistic wellness guidance.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 bg-white text-forest-700 hover:bg-forest-50 px-8 py-3.5 rounded-xl font-semibold transition-colors">
              Create your account <ArrowRight size={18} />
            </Link>
          </motion.div>
        </section>
      )}
    </div>
  );
}
