import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import AppLayout from './components/layout/AppLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import YogaPage from './pages/Yoga';
import YogaDetail from './pages/YogaDetail';
import AncientWisdom from './pages/AncientWisdom';
import PracticeDetail from './pages/PracticeDetail';
import { FitnessPage, FitnessDetail } from './pages/Fitness';
import Nutrition from './pages/Nutrition';
import Routines from './pages/Routines';
import RoutineDetail from './pages/RoutineDetail';
import WorkoutSession from './pages/WorkoutSession';
import Progress from './pages/Progress';
import { FavoritesPage, ProfilePage } from './pages/FavoritesAndProfile';

const qc = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <FavoritesProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Landing />} />
                  <Route path="/yoga" element={<YogaPage />} />
                  <Route path="/yoga/:id" element={<YogaDetail />} />
                  <Route path="/ancient-wisdom" element={<AncientWisdom />} />
                  <Route path="/ancient-wisdom/:id" element={<PracticeDetail />} />
                  <Route path="/fitness" element={<FitnessPage />} />
                  <Route path="/fitness/:id" element={<FitnessDetail />} />
                  <Route path="/nutrition" element={<Nutrition />} />
                  <Route path="/routines" element={<ProtectedRoute><Routines /></ProtectedRoute>} />
                  <Route path="/routines/:id" element={<ProtectedRoute><RoutineDetail /></ProtectedRoute>} />
                  <Route path="/workout/:id" element={<ProtectedRoute><WorkoutSession /></ProtectedRoute>} />
                  <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
                  <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                </Route>
              </Routes>
            </FavoritesProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
