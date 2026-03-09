import type { DayColumn, Workout, Exercise } from '@/types/workout';
import { getWeekStart, getDateNumber, getDayOfWeek } from '@/utils/dateUtils';

function createExercise(
  id: string,
  name: string,
  setInfo: string,
  sets: number
): Exercise {
  return { id, name, setInfo, sets };
}

function createWorkout(id: string, title: string, exercises: Exercise[]): Workout {
  return { id, title, exercises };
}

/**
 * Returns a week of 7 day columns with initial mock data.
 * Used as initial calendar state.
 */
export function getMockDays(): DayColumn[] {
  const today = new Date();
  const weekStart = getWeekStart(today);

  const days: DayColumn[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    days.push({
      id: `day-${i}`,
      date: getDateNumber(d),
      dayOfWeek: getDayOfWeek(d),
      workouts: [],
    });
  }

  // Tuesday (index 1) - one workout
  days[1].workouts = [
    createWorkout('workout-1', 'Chest Day - with Arm exercises', [
      createExercise('ex-1', 'Bench Press Medium Grip', '50 lb x 5, 60 lb x 5, 70 lb x 5', 3),
      createExercise('ex-2', 'Exercise B', '40 lb x 10', 1),
    ]),
  ];

  // Wednesday (index 2) - two workouts
  days[2].workouts = [
    createWorkout('workout-2', 'Leg Day', [
      createExercise('ex-3', 'Exercise C', '30 lb x 6', 1),
      createExercise('ex-4', 'Exercise D', '40 lb x 5', 1),
      createExercise('ex-5', 'Exercise E', '50 lb x 5', 1),
    ]),
    createWorkout('workout-3', 'Arm Day', [
      createExercise('ex-6', 'Exercise F', '60 lb x 6', 1),
    ]),
  ];

  return days;
}
