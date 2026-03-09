'use client';

import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Workout as WorkoutType, Exercise as ExerciseType } from '@/types/workout';
import { ExerciseItem } from '@/components/ExerciseItem';
import { PlusIcon } from '@/components/PlusIcon';

const TITLE_MAX_LENGTH = 30;

function getSortableStyle(
  transform: ReturnType<typeof useSortable>['transform'],
  transition: string | undefined,
  isDragging: boolean,
  extra?: React.CSSProperties
) {
  return {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? '',
    zIndex: isDragging ? 1000 : undefined,
    ...extra,
  };
}

export interface WorkoutCardProps {
  workout: WorkoutType;
  onAddExercise: () => void;
  onEditWorkout: () => void;
  onEditExercise: (exerciseId: string) => void;
  onAddExerciseClick: (workoutId: string) => void;
  isOver?: boolean;
}

export function WorkoutCard({
  workout,
  onAddExercise,
  onEditWorkout,
  onEditExercise,
  onAddExerciseClick,
  isOver,
}: WorkoutCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: workout.id });

  const style = getSortableStyle(transform, transition, isDragging);

  const displayTitle =
    workout.title.length > TITLE_MAX_LENGTH
      ? `${workout.title.slice(0, TITLE_MAX_LENGTH)}...`
      : workout.title;

  const { setNodeRef: setExercisesRef } = useDroppable({ id: workout.id });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`workout-card ${isDragging ? 'workout-card--dragging' : ''} ${isOver ? 'workout-card--over' : ''}`}
      data-workout-id={workout.id}
    >
      <div className="workout-card__header">
        <h3
          className="workout-card__title"
          title={workout.title.length > TITLE_MAX_LENGTH ? workout.title : undefined}
          {...attributes}
          {...listeners}
        >
          {displayTitle}
        </h3>
        <div className="workout-card__actions">
          <button
            type="button"
            className="workout-card__menu-btn"
            onClick={onEditWorkout}
            aria-label="Workout options"
          >
            ⋯
          </button>
        </div>
      </div>
      <div ref={setExercisesRef} className="workout-card__exercises">
        {workout.exercises.map((exercise) => (
          <SortableExerciseItem
            key={exercise.id}
            exercise={exercise}
            onAddExercise={() => onAddExerciseClick(workout.id)}
            onEdit={() => onEditExercise(exercise.id)}
          />
        ))}
      </div>
      <button
        type="button"
        className="workout-card__add-exercise"
        onClick={onAddExercise}
        aria-label="Add exercise"
      >
        <PlusIcon size={6} />
      </button>
    </div>
  );
}

function SortableExerciseItem({
  exercise,
  onAddExercise,
  onEdit,
}: {
  exercise: ExerciseType;
  onAddExercise: () => void;
  onEdit: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exercise.id });

  const style = getSortableStyle(transform, transition, isDragging, { width: '100%' });

  return (
    <div ref={setNodeRef} style={style}>
      <ExerciseItem
        exercise={exercise}
        onAddExercise={onAddExercise}
        onEdit={onEdit}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  );
}
