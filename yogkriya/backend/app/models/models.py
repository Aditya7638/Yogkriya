from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime, Text, JSON, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.database import Base


class FitnessLevel(str, enum.Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"


class FitnessGoal(str, enum.Enum):
    general_fitness = "general_fitness"
    weight_loss = "weight_loss"
    muscle_gain = "muscle_gain"
    flexibility = "flexibility"
    stress_reduction = "stress_reduction"


class PreferredStyle(str, enum.Enum):
    yoga = "yoga"
    gym = "gym"
    hybrid = "hybrid"


class DietaryPreference(str, enum.Enum):
    vegetarian = "vegetarian"
    vegan = "vegan"
    eggetarian = "eggetarian"
    non_vegetarian = "non_vegetarian"


class ExerciseType(str, enum.Enum):
    yoga = "yoga"
    gym = "gym"
    practice = "practice"


class Difficulty(str, enum.Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    profile = relationship("UserProfile", back_populates="user", uselist=False)
    routines = relationship("Routine", back_populates="user")
    workout_sessions = relationship("WorkoutSession", back_populates="user")
    favorites = relationship("Favorite", back_populates="user")


class UserProfile(Base):
    __tablename__ = "user_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    height_cm = Column(Float, nullable=True)
    weight_kg = Column(Float, nullable=True)
    fitness_level = Column(String(20), default="beginner")
    fitness_goal = Column(String(30), default="general_fitness")
    preferred_style = Column(String(20), default="hybrid")
    available_time = Column(Integer, default=30)  # minutes
    dietary_preference = Column(String(20), default="vegetarian")
    onboarding_completed = Column(Boolean, default=False)

    user = relationship("User", back_populates="profile")


class Video(Base):
    __tablename__ = "videos"
    id = Column(Integer, primary_key=True, index=True)
    youtube_id = Column(String(20), unique=True, nullable=False)
    title = Column(String(255))
    thumbnail_url = Column(String(500))
    channel_name = Column(String(100))
    duration_seconds = Column(Integer, nullable=True)
    category = Column(String(50))
    language = Column(String(20), default="en")
    difficulty = Column(String(20), nullable=True)
    is_approved = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class YogaExercise(Base):
    __tablename__ = "yoga_exercises"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(120), unique=True, nullable=False)
    description = Column(Text)
    category = Column(String(50))
    difficulty = Column(String(20))
    duration_minutes = Column(Integer, default=5)
    instructions = Column(JSON, default=list)
    benefits = Column(JSON, default=list)
    precautions = Column(JSON, default=list)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    video = relationship("Video")


class AncientPractice(Base):
    __tablename__ = "ancient_practices"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(120), unique=True, nullable=False)
    category = Column(String(50))
    description = Column(Text)
    traditional_context = Column(Text)
    traditional_source = Column(String(255))
    instructions = Column(JSON, default=list)
    duration_minutes = Column(Integer, default=10)
    difficulty = Column(String(20))
    traditional_benefits = Column(JSON, default=list)
    modern_understanding = Column(Text, nullable=True)
    precautions = Column(JSON, default=list)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    video = relationship("Video")


class GymExercise(Base):
    __tablename__ = "gym_exercises"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(120), unique=True, nullable=False)
    muscle_group = Column(String(50))
    equipment = Column(String(50))
    difficulty = Column(String(20))
    description = Column(Text)
    instructions = Column(JSON, default=list)
    common_mistakes = Column(JSON, default=list)
    default_sets = Column(Integer, default=3)
    default_reps = Column(String(20), default="10")
    rest_seconds = Column(Integer, default=60)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    video = relationship("Video")


class Routine(Base):
    __tablename__ = "routines"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(100))
    description = Column(Text, nullable=True)
    is_ai_generated = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="routines")
    exercises = relationship("RoutineExercise", back_populates="routine", order_by="RoutineExercise.order_index")
    sessions = relationship("WorkoutSession", back_populates="routine")


class RoutineExercise(Base):
    __tablename__ = "routine_exercises"
    id = Column(Integer, primary_key=True, index=True)
    routine_id = Column(Integer, ForeignKey("routines.id"))
    exercise_type = Column(String(20))  # yoga, gym, practice
    exercise_id = Column(Integer)
    order_index = Column(Integer, default=0)
    sets = Column(Integer, nullable=True)
    reps = Column(String(20), nullable=True)
    duration_seconds = Column(Integer, nullable=True)

    routine = relationship("Routine", back_populates="exercises")


class WorkoutSession(Base):
    __tablename__ = "workout_sessions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    routine_id = Column(Integer, ForeignKey("routines.id"), nullable=True)
    duration_minutes = Column(Integer, default=0)
    total_exercises = Column(Integer, default=0)
    completed_exercises_count = Column(Integer, default=0)
    notes = Column(Text, nullable=True)
    completed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="workout_sessions")
    routine = relationship("Routine", back_populates="sessions")
    completed_exercises = relationship("CompletedExercise", back_populates="session")


class CompletedExercise(Base):
    __tablename__ = "completed_exercises"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("workout_sessions.id"))
    exercise_type = Column(String(20))
    exercise_id = Column(Integer)
    exercise_name = Column(String(100))
    sets_completed = Column(Integer, nullable=True)
    reps_completed = Column(String(20), nullable=True)
    duration_seconds = Column(Integer, nullable=True)

    session = relationship("WorkoutSession", back_populates="completed_exercises")


class Favorite(Base):
    __tablename__ = "favorites"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    item_type = Column(String(20))  # yoga, gym, practice
    item_id = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="favorites")


class Food(Base):
    __tablename__ = "foods"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50))
    description = Column(Text)
    calories_per_100g = Column(Float, nullable=True)
    protein_g = Column(Float, nullable=True)
    carbs_g = Column(Float, nullable=True)
    fat_g = Column(Float, nullable=True)
    traditional_context = Column(Text, nullable=True)
    season = Column(String(30), nullable=True)
    is_traditional = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class DietPlan(Base):
    __tablename__ = "diet_plans"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    goal = Column(String(30))
    diet_type = Column(String(30))
    meals = Column(JSON, default=dict)
    estimated_calories = Column(Integer, nullable=True)
    is_traditional = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
