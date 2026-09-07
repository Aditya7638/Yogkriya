from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime, timedelta
from app.db.database import get_db
from app.dependencies.auth import get_current_user
from app.models.models import (
    User, UserProfile, Routine, RoutineExercise, WorkoutSession,
    CompletedExercise, Favorite, YogaExercise, GymExercise, AncientPractice
)
from app.schemas.schemas import (
    ProfileUpdate, ProfileOut, RoutineOut, RoutineExerciseOut,
    RoutineCreate, AddExerciseToRoutine, WorkoutSessionCreate,
    WorkoutSessionOut, ProgressStats, FavoriteCreate, FavoriteOut
)
from app.services.routine_service import generate_routine
from app.services.youtube_service import find_exercise_video

profile_router = APIRouter(prefix="/api/profile", tags=["profile"])
routines_router = APIRouter(prefix="/api/routines", tags=["routines"])
workouts_router = APIRouter(prefix="/api/workouts", tags=["workouts"])
progress_router = APIRouter(prefix="/api/progress", tags=["progress"])
favorites_router = APIRouter(prefix="/api/favorites", tags=["favorites"])


# Profile
@profile_router.put("", response_model=ProfileOut)
def update_profile(
    data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = current_user.profile
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return profile


# Routines
def _enrich_exercises(routine: Routine, db: Session) -> RoutineOut:
    """Attach exercise name/description/video to each RoutineExercise."""
    enriched = []
    for re in routine.exercises:
        out = RoutineExerciseOut(
            id=re.id,
            exercise_type=re.exercise_type,
            exercise_id=re.exercise_id,
            order_index=re.order_index,
            sets=re.sets,
            reps=re.reps,
            duration_seconds=re.duration_seconds,
        )
        if re.exercise_type == "yoga":
            ex = db.query(YogaExercise).filter(YogaExercise.id == re.exercise_id).first()
        elif re.exercise_type == "gym":
            ex = db.query(GymExercise).filter(GymExercise.id == re.exercise_id).first()
        else:
            ex = db.query(AncientPractice).filter(AncientPractice.id == re.exercise_id).first()
        if ex:
            out.exercise_name = ex.name
            out.exercise_description = getattr(ex, "description", None)
            try:
                video = find_exercise_video(ex.name)
            except HTTPException:
                video = None
            if video:
                out.video_youtube_id = video["youtube_id"]
        enriched.append(out)
    return RoutineOut(
        id=routine.id,
        name=routine.name,
        description=routine.description,
        is_ai_generated=routine.is_ai_generated,
        created_at=routine.created_at,
        exercises=enriched,
    )


@routines_router.get("", response_model=List[RoutineOut])
def list_routines(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    routines = db.query(Routine).filter(Routine.user_id == current_user.id).all()
    return [_enrich_exercises(r, db) for r in routines]


@routines_router.post("/generate", response_model=RoutineOut)
def generate(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    routine = generate_routine(current_user, db)
    return _enrich_exercises(routine, db)


@routines_router.get("/{routine_id}", response_model=RoutineOut)
def get_routine(routine_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    r = db.query(Routine).filter(Routine.id == routine_id, Routine.user_id == current_user.id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Routine not found")
    return _enrich_exercises(r, db)


@routines_router.delete("/{routine_id}")
def delete_routine(routine_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    r = db.query(Routine).filter(Routine.id == routine_id, Routine.user_id == current_user.id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(r)
    db.commit()
    return {"ok": True}


@routines_router.post("/{routine_id}/exercises")
def add_exercise(
    routine_id: int,
    data: AddExerciseToRoutine,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    r = db.query(Routine).filter(Routine.id == routine_id, Routine.user_id == current_user.id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Not found")
    exercise_models = {
        "yoga": YogaExercise,
        "gym": GymExercise,
        "practice": AncientPractice,
    }
    exercise_model = exercise_models.get(data.exercise_type)
    if not exercise_model or not db.query(exercise_model).filter(exercise_model.id == data.exercise_id).first():
        raise HTTPException(status_code=404, detail="Exercise not found")
    max_idx = db.query(func.max(RoutineExercise.order_index)).filter(
        RoutineExercise.routine_id == routine_id
    ).scalar() or 0
    re = RoutineExercise(
        routine_id=routine_id,
        exercise_type=data.exercise_type,
        exercise_id=data.exercise_id,
        order_index=max_idx + 1,
        sets=data.sets,
        reps=data.reps,
        duration_seconds=data.duration_seconds,
    )
    db.add(re)
    db.commit()
    return {"ok": True}


@routines_router.delete("/{routine_id}/exercises/{exercise_id}")
def remove_exercise(
    routine_id: int,
    exercise_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    r = db.query(Routine).filter(Routine.id == routine_id, Routine.user_id == current_user.id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Not found")
    re = db.query(RoutineExercise).filter(
        RoutineExercise.id == exercise_id,
        RoutineExercise.routine_id == routine_id,
    ).first()
    if re:
        db.delete(re)
        db.commit()
    return {"ok": True}


# Workout Sessions
@workouts_router.post("", response_model=WorkoutSessionOut)
def log_session(
    data: WorkoutSessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if data.routine_id is not None and not db.query(Routine).filter(
        Routine.id == data.routine_id,
        Routine.user_id == current_user.id,
    ).first():
        raise HTTPException(status_code=404, detail="Routine not found")
    if data.completed_exercises_count > data.total_exercises:
        raise HTTPException(status_code=422, detail="Completed exercises cannot exceed total exercises")
    session = WorkoutSession(
        user_id=current_user.id,
        routine_id=data.routine_id,
        duration_minutes=data.duration_minutes,
        total_exercises=data.total_exercises,
        completed_exercises_count=data.completed_exercises_count,
    )
    db.add(session)
    db.flush()
    for ex in data.completed_exercises:
        ce = CompletedExercise(
            session_id=session.id,
            exercise_type=ex.get("exercise_type", ""),
            exercise_id=ex.get("exercise_id", 0),
            exercise_name=ex.get("exercise_name", ""),
            sets_completed=ex.get("sets_completed"),
            reps_completed=ex.get("reps_completed"),
            duration_seconds=ex.get("duration_seconds"),
        )
        db.add(ce)
    db.commit()
    db.refresh(session)
    return session


@workouts_router.get("", response_model=List[WorkoutSessionOut])
def list_sessions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(WorkoutSession).filter(WorkoutSession.user_id == current_user.id).order_by(
        WorkoutSession.completed_at.desc()
    ).limit(50).all()


# Progress
@progress_router.get("", response_model=ProgressStats)
def get_progress(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    sessions = db.query(WorkoutSession).filter(WorkoutSession.user_id == current_user.id).all()
    total_sessions = len(sessions)
    total_minutes = sum(s.duration_minutes for s in sessions)
    total_exercises = sum(s.completed_exercises_count for s in sessions)

    # Streak calculation
    dates = sorted({s.completed_at.date() for s in sessions}, reverse=True)
    current_streak = 0
    longest_streak = 0
    if dates:
        today = datetime.utcnow().date()
        streak = 0
        check = today
        for d in dates:
            if d == check or d == check - timedelta(days=1):
                streak += 1
                check = d
            else:
                break
        current_streak = streak
        # Longest streak
        tmp = 1
        for i in range(1, len(dates)):
            if (dates[i - 1] - dates[i]).days == 1:
                tmp += 1
                longest_streak = max(longest_streak, tmp)
            else:
                tmp = 1
        longest_streak = max(longest_streak, current_streak)

    # This week
    week_ago = datetime.utcnow() - timedelta(days=7)
    sessions_this_week = sum(1 for s in sessions if s.completed_at >= week_ago)

    # Weekly activity (last 7 days)
    weekly = []
    for i in range(6, -1, -1):
        day = datetime.utcnow().date() - timedelta(days=i)
        count = sum(1 for s in sessions if s.completed_at.date() == day)
        weekly.append({"date": day.strftime("%a"), "sessions": count})

    recent = db.query(WorkoutSession).filter(WorkoutSession.user_id == current_user.id).order_by(
        WorkoutSession.completed_at.desc()
    ).limit(5).all()

    return ProgressStats(
        total_sessions=total_sessions,
        total_minutes=total_minutes,
        current_streak=current_streak,
        longest_streak=longest_streak,
        total_exercises_completed=total_exercises,
        sessions_this_week=sessions_this_week,
        weekly_activity=weekly,
        recent_sessions=recent,
    )


# Favorites
@favorites_router.get("", response_model=List[FavoriteOut])
def list_favorites(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Favorite).filter(Favorite.user_id == current_user.id).all()


@favorites_router.post("", response_model=FavoriteOut)
def add_favorite(
    data: FavoriteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.item_type == data.item_type,
        Favorite.item_id == data.item_id,
    ).first()
    if existing:
        return existing
    item_models = {
        "yoga": YogaExercise,
        "gym": GymExercise,
        "practice": AncientPractice,
    }
    item_model = item_models[data.item_type]
    if not db.query(item_model).filter(item_model.id == data.item_id).first():
        raise HTTPException(status_code=404, detail="Favorite item not found")
    fav = Favorite(user_id=current_user.id, item_type=data.item_type, item_id=data.item_id)
    db.add(fav)
    db.commit()
    db.refresh(fav)
    return fav


@favorites_router.delete("/{fav_id}")
def remove_favorite(fav_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    fav = db.query(Favorite).filter(Favorite.id == fav_id, Favorite.user_id == current_user.id).first()
    if fav:
        db.delete(fav)
        db.commit()
    return {"ok": True}
