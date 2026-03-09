'use client';

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useCalendarState } from '@/hooks/useCalendarState';
import { Calendar } from '@/components/Calendar';
import { getWeekStart } from '@/utils/dateUtils';
import { ExerciseItem } from '@/components/ExerciseItem';
import { WorkoutDragOverlayContent } from '@/components/WorkoutCard/WorkoutDragOverlayContent';
import { sortablePreferredCollision } from '@/utils/dndUtils';
import {
  findDayAndWorkoutIndexByWorkoutId,
  findIndicesByExerciseId,
} from '@/utils/calendarFinders';
import { reorderArray } from '@/utils/arrayUtils';
import { useState, useEffect } from 'react';
import type { Workout, Exercise } from '@/types/workout';

const DRAG_ACTIVATION_DISTANCE = 8;

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const calendar = useCalendarState();
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: DRAG_ACTIVATION_DISTANCE } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);
    if (id.startsWith('workout-')) {
      const found = findDayAndWorkoutIndexByWorkoutId(calendar.days, id);
      if (found) {
        setActiveWorkout(calendar.days[found.dayIndex].workouts[found.workoutIndex]);
      }
    } else if (id.startsWith('ex-')) {
      const found = findIndicesByExerciseId(calendar.days, id);
      if (found) {
        setActiveExercise(
          calendar.days[found.dayIndex].workouts[found.workoutIndex].exercises[
            found.exerciseIndex
          ]
        );
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveWorkout(null);
    setActiveExercise(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId.startsWith('workout-')) {
      const source = findDayAndWorkoutIndexByWorkoutId(calendar.days, activeId);
      if (!source) return;
      const sourceDayId = calendar.days[source.dayIndex].id;

      if (overId.startsWith('day-')) {
        const targetDayIndex = calendar.days.findIndex((d) => d.id === overId);
        if (targetDayIndex >= 0 && targetDayIndex !== source.dayIndex) {
          calendar.moveWorkout(
            activeId,
            sourceDayId,
            overId,
            calendar.days[targetDayIndex].workouts.length
          );
        } else if (targetDayIndex >= 0 && targetDayIndex === source.dayIndex) {
          const workoutIds = calendar.days[source.dayIndex].workouts.map((w) => w.id);
          const lastId = workoutIds[workoutIds.length - 1];
          if (lastId && lastId !== activeId) {
            calendar.reorderWorkoutsInDay(
              sourceDayId,
              reorderArray(workoutIds, source.workoutIndex, lastId)
            );
          }
        }
      } else if (overId.startsWith('workout-')) {
        const target = findDayAndWorkoutIndexByWorkoutId(calendar.days, overId);
        if (target && (target.dayIndex !== source.dayIndex || target.workoutIndex !== source.workoutIndex)) {
          const targetDayId = calendar.days[target.dayIndex].id;
          calendar.moveWorkout(activeId, sourceDayId, targetDayId, target.workoutIndex);
        } else if (target && target.dayIndex === source.dayIndex) {
          calendar.reorderWorkoutsInDay(
            sourceDayId,
            reorderArray(
              calendar.days[source.dayIndex].workouts.map((w) => w.id),
              source.workoutIndex,
              overId
            )
          );
        }
      }
      return;
    }

    if (activeId.startsWith('ex-')) {
      const source = findIndicesByExerciseId(calendar.days, activeId);
      if (!source) return;
      const sourceWorkoutId = calendar.days[source.dayIndex].workouts[source.workoutIndex].id;

      if (overId.startsWith('workout-') && overId !== sourceWorkoutId) {
        const targetDay = calendar.days.find((d) => d.workouts.some((w) => w.id === overId));
        if (targetDay) {
          const targetWorkout = targetDay.workouts.find((w) => w.id === overId);
          if (targetWorkout) {
            calendar.moveExercise(
              activeId,
              sourceWorkoutId,
              overId,
              targetWorkout.exercises.length
            );
          }
        }
      } else if (overId.startsWith('ex-')) {
        const target = findIndicesByExerciseId(calendar.days, overId);
        if (!target) return;
        const targetWorkoutId = calendar.days[target.dayIndex].workouts[target.workoutIndex].id;
        if (targetWorkoutId === sourceWorkoutId) {
          const workout = calendar.days[source.dayIndex].workouts[source.workoutIndex];
          calendar.reorderExercisesInWorkout(
            sourceWorkoutId,
            reorderArray(
              workout.exercises.map((e) => e.id),
              source.exerciseIndex,
              overId
            )
          );
        } else {
          calendar.moveExercise(
            activeId,
            sourceWorkoutId,
            targetWorkoutId,
            target.exerciseIndex
          );
        }
      }
    }
  };

  const today = new Date();
  const weekStart = getWeekStart(today);

  if (!mounted) {
    return (
      <main className="page">
        <div className="calendar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
          <span style={{ color: '#666' }}>Loading...</span>
        </div>
      </main>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={sortablePreferredCollision}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <main className="page">
          <Calendar
            days={calendar.days}
            today={today}
            weekStart={weekStart}
            onAddWorkout={calendar.addWorkout}
            onUpdateWorkout={calendar.updateWorkout}
            onAddExercise={calendar.addExercise}
            onUpdateExercise={calendar.updateExercise}
          />
        </main>

        <DragOverlay>
          {activeWorkout ? <WorkoutDragOverlayContent workout={activeWorkout} /> : null}
          {activeExercise && !activeWorkout ? (
            <ExerciseItem exercise={activeExercise} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
