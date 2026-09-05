import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('yk_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('yk_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authApi = {
  register: (d: any) => api.post('/api/auth/register', d).then(r => r.data),
  login: (d: any) => api.post('/api/auth/login', d).then(r => r.data),
  me: () => api.get('/api/auth/me').then(r => r.data),
};

// Profile
export const profileApi = {
  update: (d: any) => api.put('/api/profile', d).then(r => r.data),
};

// Yoga
export const yogaApi = {
  list: (params?: any) => api.get('/api/yoga', { params }).then(r => r.data),
  get: (id: number) => api.get(`/api/yoga/${id}`).then(r => r.data),
};

// Practices
export const practicesApi = {
  list: (params?: any) => api.get('/api/practices', { params }).then(r => r.data),
  get: (id: number) => api.get(`/api/practices/${id}`).then(r => r.data),
};

// Gym
export const exercisesApi = {
  list: (params?: any) => api.get('/api/exercises', { params }).then(r => r.data),
  get: (id: number) => api.get(`/api/exercises/${id}`).then(r => r.data),
  videoSearch: (q: string, maxResults = 5) =>
    api.get('/api/exercises/videos/search', { params: { q, max_results: maxResults } }).then(r => r.data),
};

// Nutrition
export const nutritionApi = {
  foods: (params?: any) => api.get('/api/nutrition/foods', { params }).then(r => r.data),
  dietPlans: (params?: any) => api.get('/api/nutrition/diet-plans', { params }).then(r => r.data),
};

// Routines
export const routinesApi = {
  list: () => api.get('/api/routines').then(r => r.data),
  get: (id: number) => api.get(`/api/routines/${id}`).then(r => r.data),
  generate: () => api.post('/api/routines/generate').then(r => r.data),
  delete: (id: number) => api.delete(`/api/routines/${id}`).then(r => r.data),
  addExercise: (id: number, d: any) => api.post(`/api/routines/${id}/exercises`, d).then(r => r.data),
  removeExercise: (routineId: number, exId: number) =>
    api.delete(`/api/routines/${routineId}/exercises/${exId}`).then(r => r.data),
};

// Workouts
export const workoutsApi = {
  log: (d: any) => api.post('/api/workouts', d).then(r => r.data),
  list: () => api.get('/api/workouts').then(r => r.data),
};

// Progress
export const progressApi = {
  get: () => api.get('/api/progress').then(r => r.data),
};

// Favorites
export const favoritesApi = {
  list: () => api.get('/api/favorites').then(r => r.data),
  add: (d: any) => api.post('/api/favorites', d).then(r => r.data),
  remove: (id: number) => api.delete(`/api/favorites/${id}`).then(r => r.data),
};

// Search
export const searchApi = {
  query: (q: string) => api.get('/api/search', { params: { q } }).then(r => r.data),
};
