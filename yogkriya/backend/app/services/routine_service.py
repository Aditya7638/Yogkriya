"""
Deterministic rule-based routine generator.
Architecture is designed so an AI service can be swapped in later
by replacing generate_routine() while keeping the same return contract.
"""
from sqlalchemy.orm import Session
from app.models.models import (
    UserProfile, YogaExercise, GymExercise, AncientPractice,
    Routine, RoutineExercise, User
)
from typing import List, Dict, Any


def _goal_label(goal: str) -> str:
    labels = {
        "general_fitness": "General Fitness",
        "weight_loss": "Weight Loss",
        "muscle_gain": "Muscle Gain",
        "flexibility": "Flexibility",
        "stress_reduction": "Stress Reduction",
    }
    return labels.get(goal, "General Fitness")


def generate_routine(user: User, db: Session) -> Routine:
    profile: UserProfile = user.profile
    if not profile:
        raise ValueError("User profile not found")

    goal = profile.fitness_goal or "general_fitness"
    level = profile.fitness_level or "beginner"
    style = profile.preferred_style or "hybrid"
    time = profile.available_time or 30

    routine_name = f"{_goal_label(goal)} — {time} min {style.title()} Routine"

    # Select exercises based on rules
    exercises_to_add: List[Dict[str, Any]] = []

    # Always start with a pranayama warm-up
    pranayama = db.query(AncientPractice).filter(
        AncientPractice.category == "pranayama"
    ).first()
    if pranayama:
        exercises_to_add.append({
            "type": "practice",
            "id": pranayama.id,
            "sets": None,
            "reps": None,
            "duration": 300,  # 5 min
        })

    if style in ("yoga", "hybrid"):
        # Add yoga based on goal
        yoga_categories = {
            "flexibility": "flexibility",
            "stress_reduction": "relaxation",
            "general_fitness": "beginner",
            "weight_loss": "strength",
            "muscle_gain": "strength",
        }
        cat = yoga_categories.get(goal, "beginner")
        yoga_items = db.query(YogaExercise).filter(
            YogaExercise.category == cat,
            YogaExercise.difficulty == (level if level != "advanced" else "intermediate"),
        ).limit(3).all()
        if not yoga_items:
            yoga_items = db.query(YogaExercise).limit(3).all()
        for y in yoga_items:
            exercises_to_add.append({
                "type": "yoga",
                "id": y.id,
                "sets": None,
                "reps": None,
                "duration": y.duration_minutes * 60,
            })

    if style in ("gym", "hybrid") and time >= 30:
        # Add gym exercises based on goal
        muscle_map = {
            "muscle_gain": ["chest", "back", "legs"],
            "weight_loss": ["full body", "cardio", "core"],
            "general_fitness": ["full body", "core"],
            "flexibility": ["core"],
            "stress_reduction": ["core"],
        }
        muscles = muscle_map.get(goal, ["full body"])
        count = 3 if time >= 45 else 2
        for muscle in muscles[:2]:
            items = db.query(GymExercise).filter(
                GymExercise.muscle_group == muscle,
                GymExercise.difficulty == level,
            ).limit(count).all()
            if not items:
                items = db.query(GymExercise).filter(
                    GymExercise.muscle_group == muscle
                ).limit(count).all()
            for g in items:
                sets = 3 if level != "beginner" else 2
                exercises_to_add.append({
                    "type": "gym",
                    "id": g.id,
                    "sets": sets,
                    "reps": g.default_reps,
                    "duration": None,
                })

    # Cooldown — nadi shodhana or any practice
    cooldown = db.query(AncientPractice).filter(
        AncientPractice.name.ilike("%nadi%")
    ).first()
    if not cooldown:
        cooldown = db.query(AncientPractice).offset(1).first()
    if cooldown:
        exercises_to_add.append({
            "type": "practice",
            "id": cooldown.id,
            "sets": None,
            "reps": None,
            "duration": 300,
        })

    # Persist
    routine = Routine(
        user_id=user.id,
        name=routine_name,
        description=f"Personalized {time}-minute routine for {_goal_label(goal)}.",
        is_ai_generated=False,
    )
    db.add(routine)
    db.flush()

    for idx, ex in enumerate(exercises_to_add):
        re = RoutineExercise(
            routine_id=routine.id,
            exercise_type=ex["type"],
            exercise_id=ex["id"],
            order_index=idx,
            sets=ex.get("sets"),
            reps=ex.get("reps"),
            duration_seconds=ex.get("duration"),
        )
        db.add(re)

    db.commit()
    db.refresh(routine)
    return routine
