export interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: number;
  age?: number;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  fitness_level?: string;
  fitness_goal?: string;
  preferred_style?: string;
  available_time?: number;
  dietary_preference?: string;
  onboarding_completed: boolean;
}

export interface Video {
  id: number;
  youtube_id: string;
  title?: string;
  thumbnail_url?: string;
  channel_name?: string;
  duration_seconds?: number;
  category?: string;
}

export interface YogaExercise {
  id: number;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  difficulty?: string;
  duration_minutes: number;
  instructions: string[];
  benefits: string[];
  precautions: string[];
  video?: Video;
}

export interface AncientPractice {
  id: number;
  name: string;
  slug: string;
  category?: string;
  description?: string;
  traditional_context?: string;
  traditional_source?: string;
  instructions: string[];
  duration_minutes: number;
  difficulty?: string;
  traditional_benefits: string[];
  modern_understanding?: string;
  precautions: string[];
  video?: Video;
}

export interface GymExercise {
  id: number;
  name: string;
  slug: string;
  muscle_group?: string;
  equipment?: string;
  difficulty?: string;
  description?: string;
  instructions: string[];
  common_mistakes: string[];
  default_sets: number;
  default_reps: string;
  rest_seconds: number;
  video?: Video;
}

export interface RoutineExercise {
  id: number;
  exercise_type: 'yoga' | 'gym' | 'practice';
  exercise_id: number;
  order_index: number;
  sets?: number;
  reps?: string;
  duration_seconds?: number;
  exercise_name?: string;
  exercise_description?: string;
  video_youtube_id?: string;
}

export interface Routine {
  id: number;
  name: string;
  description?: string;
  is_ai_generated: boolean;
  created_at: string;
  exercises: RoutineExercise[];
}

export interface WorkoutSession {
  id: number;
  routine_id?: number;
  duration_minutes: number;
  total_exercises: number;
  completed_exercises_count: number;
  completed_at: string;
}

export interface ProgressStats {
  total_sessions: number;
  total_minutes: number;
  current_streak: number;
  longest_streak: number;
  total_exercises_completed: number;
  sessions_this_week: number;
  weekly_activity: { date: string; sessions: number }[];
  recent_sessions: WorkoutSession[];
}

export interface Favorite {
  id: number;
  item_type: 'yoga' | 'gym' | 'practice';
  item_id: number;
  created_at: string;
}

export interface Food {
  id: number;
  name: string;
  category?: string;
  description?: string;
  calories_per_100g?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  traditional_context?: string;
  is_traditional: boolean;
}

export interface DietPlan {
  id: number;
  name: string;
  goal: string;
  diet_type: string;
  meals: Record<string, any>;
  estimated_calories?: number;
  is_traditional: boolean;
}
