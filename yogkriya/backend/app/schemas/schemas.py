from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from datetime import datetime


# Auth
class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    confirm_password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# User Profile
class ProfileUpdate(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    fitness_level: Optional[str] = None
    fitness_goal: Optional[str] = None
    preferred_style: Optional[str] = None
    available_time: Optional[int] = None
    dietary_preference: Optional[str] = None
    onboarding_completed: Optional[bool] = None


class ProfileOut(BaseModel):
    id: int
    age: Optional[int]
    gender: Optional[str]
    height_cm: Optional[float]
    weight_kg: Optional[float]
    fitness_level: Optional[str]
    fitness_goal: Optional[str]
    preferred_style: Optional[str]
    available_time: Optional[int]
    dietary_preference: Optional[str]
    onboarding_completed: bool

    class Config:
        from_attributes = True


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    is_admin: bool
    created_at: datetime
    profile: Optional[ProfileOut]

    class Config:
        from_attributes = True


# Video
class VideoOut(BaseModel):
    id: int
    youtube_id: str
    title: Optional[str]
    thumbnail_url: Optional[str]
    channel_name: Optional[str]
    duration_seconds: Optional[int]
    category: Optional[str]

    class Config:
        from_attributes = True


# Yoga
class YogaExerciseOut(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str]
    category: Optional[str]
    difficulty: Optional[str]
    duration_minutes: int
    instructions: List[str]
    benefits: List[str]
    precautions: List[str]
    video: Optional[VideoOut]

    class Config:
        from_attributes = True


# Ancient Practice
class AncientPracticeOut(BaseModel):
    id: int
    name: str
    slug: str
    category: Optional[str]
    description: Optional[str]
    traditional_context: Optional[str]
    traditional_source: Optional[str]
    instructions: List[str]
    duration_minutes: int
    difficulty: Optional[str]
    traditional_benefits: List[str]
    modern_understanding: Optional[str]
    precautions: List[str]
    video: Optional[VideoOut]

    class Config:
        from_attributes = True


# Gym Exercise
class GymExerciseOut(BaseModel):
    id: int
    name: str
    slug: str
    muscle_group: Optional[str]
    equipment: Optional[str]
    difficulty: Optional[str]
    description: Optional[str]
    instructions: List[str]
    common_mistakes: List[str]
    default_sets: int
    default_reps: str
    rest_seconds: int
    video: Optional[VideoOut]

    class Config:
        from_attributes = True


# Routine
class RoutineExerciseOut(BaseModel):
    id: int
    exercise_type: str
    exercise_id: int
    order_index: int
    sets: Optional[int]
    reps: Optional[str]
    duration_seconds: Optional[int]
    exercise_name: Optional[str] = None
    exercise_description: Optional[str] = None
    video_youtube_id: Optional[str] = None

    class Config:
        from_attributes = True


class RoutineOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    is_ai_generated: bool
    created_at: datetime
    exercises: List[RoutineExerciseOut]

    class Config:
        from_attributes = True


class RoutineCreate(BaseModel):
    name: Optional[str] = None


class AddExerciseToRoutine(BaseModel):
    exercise_type: str
    exercise_id: int
    sets: Optional[int] = None
    reps: Optional[str] = None
    duration_seconds: Optional[int] = None


# Workout Session
class WorkoutSessionCreate(BaseModel):
    routine_id: Optional[int] = None
    duration_minutes: int = Field(ge=0)
    total_exercises: int = Field(ge=0)
    completed_exercises_count: int = Field(ge=0)
    completed_exercises: List[dict] = Field(default_factory=list)


class WorkoutSessionOut(BaseModel):
    id: int
    routine_id: Optional[int]
    duration_minutes: int
    total_exercises: int
    completed_exercises_count: int
    completed_at: datetime

    class Config:
        from_attributes = True


# Progress
class ProgressStats(BaseModel):
    total_sessions: int
    total_minutes: int
    current_streak: int
    longest_streak: int
    total_exercises_completed: int
    sessions_this_week: int
    weekly_activity: List[dict]
    recent_sessions: List[WorkoutSessionOut]


# Favorites
class FavoriteCreate(BaseModel):
    item_type: str = Field(pattern="^(yoga|gym|practice)$")
    item_id: int = Field(gt=0)


class FavoriteOut(BaseModel):
    id: int
    item_type: str
    item_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Nutrition
class FoodOut(BaseModel):
    id: int
    name: str
    category: Optional[str]
    description: Optional[str]
    calories_per_100g: Optional[float]
    protein_g: Optional[float]
    carbs_g: Optional[float]
    fat_g: Optional[float]
    traditional_context: Optional[str]
    is_traditional: bool

    class Config:
        from_attributes = True


class DietPlanOut(BaseModel):
    id: int
    name: str
    goal: str
    diet_type: str
    meals: Any
    estimated_calories: Optional[int]
    is_traditional: bool

    class Config:
        from_attributes = True
