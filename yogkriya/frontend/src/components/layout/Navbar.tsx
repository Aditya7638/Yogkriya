import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { searchApi } from '../../api';
import {
  Sun, Moon, Menu, X, Search, User, LogOut,
  Dumbbell, Leaf, Flame, UtensilsCrossed, BarChart2, Heart, BookOpen
} from 'lucide-react';

const navLinks = [
  { to: '/yoga', label: 'Yoga', icon: Leaf },
  { to: '/ancient-wisdom', label: 'Wisdom', icon: BookOpen },
  { to: '/fitness', label: 'Fitness', icon: Dumbbell },
  { to: '/nutrition', label: 'Nutrition', icon: UtensilsCrossed },
  { to: '/routines', label: 'Routines', icon: Flame },
  { to: '/progress', label: 'Progress', icon: BarChart2 },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (searchQ.length < 2) { setSearchResults(null); return; }
    const t = setTimeout(() => {
      searchApi.query(searchQ).then(setSearchResults).catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [searchQ]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-stone-900/90 backdrop-blur border-b border-stone-200 dark:border-stone-700">
      <div className="page-container">
        <div className="flex items-center h-16 gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🌿</span>
            <span className="font-display font-bold text-xl text-forest-700 dark:text-forest-400">YogKriya</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1 flex-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-forest-50 dark:bg-forest-900/40 text-forest-700 dark:text-forest-400'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setSearchOpen(o => !o)}
                className="p-2 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <Search size={18} />
              </button>
              {searchOpen && (
                <div className="absolute right-0 top-12 w-80 card p-3 shadow-xl z-50">
                  <input
                    autoFocus
                    value={searchQ}
                    onChange={e => setSearchQ(e.target.value)}
                    placeholder="Search yoga, fitness, wisdom…"
                    className="input text-sm"
                  />
                  {searchResults && (
                    <div className="mt-2 space-y-1">
                      {[
                        ...(searchResults.yoga || []).map((i: any) => ({ ...i, path: `/yoga/${i.id}` })),
                        ...(searchResults.practices || []).map((i: any) => ({ ...i, path: `/ancient-wisdom/${i.id}` })),
                        ...(searchResults.exercises || []).map((i: any) => ({ ...i, path: `/fitness/${i.id}` })),
                      ].slice(0, 8).map((item: any) => (
                        <button
                          key={`${item.type}-${item.id}`}
                          onClick={() => { navigate(item.path); setSearchOpen(false); setSearchQ(''); }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 text-sm flex items-center justify-between gap-2"
                        >
                          <span className="text-stone-900 dark:text-stone-100 font-medium">{item.name}</span>
                          <span className="badge-stone text-xs">{item.type}</span>
                        </button>
                      ))}
                      {Object.values(searchResults).every((a: any) => a.length === 0) && (
                        <p className="text-stone-400 text-sm text-center py-2">No results found</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <>
                <NavLink
                  to="/favorites"
                  className={({ isActive }) =>
                    `p-2 rounded-lg transition-colors ${isActive ? 'text-saffron-500' : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'}`
                  }
                >
                  <Heart size={18} />
                </NavLink>
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-forest-100 dark:bg-forest-900 flex items-center justify-center">
                      <span className="text-forest-700 dark:text-forest-400 text-sm font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-stone-700 dark:text-stone-300">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>
                  <div className="absolute right-0 top-12 w-44 card shadow-xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700">
                      <User size={15} /> Profile
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-stone-50 dark:hover:bg-stone-700 w-full">
                      <LogOut size={15} /> Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2">Sign in</Link>
                <Link to="/register" className="btn-primary text-sm py-2">Get started</Link>
              </div>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden p-2 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-stone-200 dark:border-stone-700 py-3 pb-4">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg mx-1 ${
                    isActive
                      ? 'bg-forest-50 dark:bg-forest-900/40 text-forest-700 dark:text-forest-400'
                      : 'text-stone-600 dark:text-stone-400'
                  }`
                }
              >
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
