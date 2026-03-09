'use client';

import type { Exercise as ExerciseType } from '@/types/workout';

export interface ExerciseItemProps {
  exercise: ExerciseType;
  onAddExercise?: () => void;
  onEdit?: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
  isDragging?: boolean;
}

const TITLE_MAX_LENGTH = 28;

export function ExerciseItem({
  exercise,
  dragHandleProps,
  isDragging,
}: ExerciseItemProps) {
  const displayName =
    exercise.name.length > TITLE_MAX_LENGTH
      ? `${exercise.name.slice(0, TITLE_MAX_LENGTH)}...`
      : exercise.name;

  return (
    <div
      className={`exercise-item ${isDragging ? 'exercise-item--dragging' : ''}`}
      data-exercise-id={exercise.id}
    >
      <div className="exercise-item__content" {...dragHandleProps}>
        <div
          className="exercise-item__name"
          title={exercise.name.length > TITLE_MAX_LENGTH ? exercise.name : undefined}
        >
          {displayName}
        </div>
        <div className="exercise-item__row">
          <span className="exercise-item__sets">{exercise.sets}x</span>
          <span
            className="exercise-item__set-info"
            title={exercise.setInfo.length > 24 ? exercise.setInfo : undefined}
          >
            {exercise.setInfo}
          </span>
        </div>
      </div>
    </div>
  );
}
