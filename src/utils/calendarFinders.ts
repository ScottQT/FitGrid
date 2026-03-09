import type { DayColumn } from '@/types/workout';

/**
 * Find the day index and workout index for a given workout ID.
 */
export function findDayAndWorkoutIndexByWorkoutId(
  days: DayColumn[],
  workoutId: string
): { dayIndex: number; workoutIndex: number } | null {
  for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
    const workoutIndex = days[dayIndex].workouts.findIndex((w) => w.id === workoutId);
    if (workoutIndex >= 0) return { dayIndex, workoutIndex };
  }
  return null;
}

/**
 * Find day, workout, and exercise indices for a given exercise ID.
 */
export function findIndicesByExerciseId(
  days: DayColumn[],
  exerciseId: string
): { dayIndex: number; workoutIndex: number; exerciseIndex: number } | null {
  for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
    const workouts = days[dayIndex].workouts;
    for (let workoutIndex = 0; workoutIndex < workouts.length; workoutIndex++) {
      const exerciseIndex = workouts[workoutIndex].exercises.findIndex(
        (e) => e.id === exerciseId
      );
      if (exerciseIndex >= 0) return { dayIndex, workoutIndex, exerciseIndex };
    }
  }
  return null;
}
