'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { DayColumn as DayColumnType } from '@/types/workout';
import { WorkoutCard } from '@/components/WorkoutCard';
import { PlusIcon } from '@/components/PlusIcon';
import { DAY_ABBREVS } from '@/utils/dateUtils';

export interface DayColumnProps {
  day: DayColumnType;
  isToday: boolean;
  onAddWorkout: () => void;
  onEditWorkout: (workoutId: string) => void;
  onAddExercise: (workoutId: string) => void;
  onEditExercise: (exerciseId: string) => void;
}

export function DayColumn({
  day,
  isToday,
  onAddWorkout,
  onEditWorkout,
  onAddExercise,
  onEditExercise,
}: DayColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: day.id });
  const workoutIds = day.workouts.map((w) => w.id);

  const dayLabel = DAY_ABBREVS[day.dayOfWeek] ?? '';

  return (
    <div
      ref={setNodeRef}
      className="day-column"
      data-day-id={day.id}
    >
      <span className="day-column__day-name">{dayLabel}</span>
      <div className={`day-column__date-row-container ${isOver ? 'day-column--over' : ''}`}>
        <div className="day-column__header">
          <div className="day-column__date-row">
            <span
              className={`day-column__date ${isToday ? 'day-column__date--today' : ''}`}
            >
              {String(day.date).padStart(2, '0')}
            </span>
            <button
              type="button"
              className="day-column__add-workout"
              onClick={onAddWorkout}
              aria-label="Add workout"
            >
              <PlusIcon size={6} />
            </button>
          </div>
        </div>
      <div className="day-column__content">
        <SortableContext items={workoutIds} strategy={verticalListSortingStrategy}>
          {day.workouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onAddExercise={() => onAddExercise(workout.id)}
              onEditWorkout={() => onEditWorkout(workout.id)}
              onEditExercise={onEditExercise}
              onAddExerciseClick={onAddExercise}
            />
          ))}
        </SortableContext>
      </div>
      </div>
    </div>
  );
}
