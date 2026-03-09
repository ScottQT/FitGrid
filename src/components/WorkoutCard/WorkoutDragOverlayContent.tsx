'use client';

import type { Workout } from '@/types/workout';

const OVERLAY_TITLE_MAX_LENGTH = 30;
const OVERLAY_PREVIEW_EXERCISES = 2;

interface WorkoutDragOverlayContentProps {
  workout: Workout;
}

/**
 * Preview card shown in DragOverlay when dragging a workout.
 * Matches the original overlay behavior (uppercase title, first 2 exercises).
 */
export function WorkoutDragOverlayContent({ workout }: WorkoutDragOverlayContentProps) {
  const displayTitle =
    workout.title.length > OVERLAY_TITLE_MAX_LENGTH
      ? `${workout.title.slice(0, OVERLAY_TITLE_MAX_LENGTH).toUpperCase()}...`
      : workout.title.toUpperCase();

  return (
    <div className="workout-card workout-card--dragging workout-card--overlay">
      <div className="workout-card__header">
        <h3 className="workout-card__title">{displayTitle}</h3>
      </div>
      <div className="workout-card__exercises">
        {workout.exercises.slice(0, OVERLAY_PREVIEW_EXERCISES).map((exercise) => (
          <div key={exercise.id} className="exercise-item">
            <div className="exercise-item__name">{exercise.name}</div>
            <div className="exercise-item__row">
              <span className="exercise-item__sets">{exercise.sets}x</span>
              <span className="exercise-item__set-info">{exercise.setInfo}</span>
            </div>
          </div>
        ))}
        {workout.exercises.length > OVERLAY_PREVIEW_EXERCISES && (
          <div className="exercise-item__more">
            +{workout.exercises.length - OVERLAY_PREVIEW_EXERCISES} more
          </div>
        )}
      </div>
    </div>
  );
}
