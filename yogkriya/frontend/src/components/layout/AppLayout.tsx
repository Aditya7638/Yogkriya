import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors duration-200">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="mt-20 border-t border-stone-200 dark:border-stone-700 py-10 text-center text-stone-400 text-sm">
        <p className="font-display italic mb-1">Ancient Wisdom. Modern Strength.</p>
        <p>© 2024 YogKriya · Wellness is a journey, not a destination.</p>
        <p className="mt-2 text-xs max-w-md mx-auto">
          YogKriya provides general wellness information only. Consult a qualified healthcare professional before beginning any exercise or wellness program.
        </p>
      </footer>
    </div>
  );
}
