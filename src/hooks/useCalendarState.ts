'use client';

import { useState, useCallback } from 'react';
import type { DayColumn, Workout, Exercise } from '@/types/workout';
import { getMockDays } from '@/data/mockData';

export function useCalendarState(initialDays?: DayColumn[]) {
  const [days, setDays] = useState<DayColumn[]>(() => initialDays ?? getMockDays());

  const updateDays = useCallback((updater: (prev: DayColumn[]) => DayColumn[]) => {
    setDays(updater);
  }, []);

  const moveWorkout = useCallback(
    (workoutId: string, fromDayId: string, toDayId: string, index: number) => {
      if (fromDayId === toDayId) return;
      setDays((prev) => {
        const fromDay = prev.find((d) => d.id === fromDayId);
        const toDay = prev.find((d) => d.id === toDayId);
        if (!fromDay || !toDay) return prev;
        const workout = fromDay.workouts.find((w) => w.id === workoutId);
        if (!workout) return prev;
        return prev.map((d) => {
          if (d.id === fromDayId) {
            return {
              ...d,
              workouts: d.workouts.filter((w) => w.id !== workoutId),
            };
          }
          if (d.id === toDayId) {
            const newWorkouts = [...d.workouts];
            newWorkouts.splice(Math.min(index, newWorkouts.length), 0, workout);
            return { ...d, workouts: newWorkouts };
          }
          return d;
        });
      });
    },
    []
  );

  const reorderWorkoutsInDay = useCallback((dayId: string, workoutIds: string[]) => {
    setDays((prev) =>
      prev.map((d) => {
        if (d.id !== dayId) return d;
        const orderMap = new Map(workoutIds.map((id, i) => [id, i]));
        const sorted = [...d.workouts].sort(
          (a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0)
        );
        return { ...d, workouts: sorted };
      })
    );
  }, []);

  const moveExercise = useCallback(
    (
      exerciseId: string,
      fromWorkoutId: string,
      toWorkoutId: string,
      toIndex: number
    ) => {
      setDays((prev) => {
        let exercise: Exercise | null = null;
        const withoutExercise = prev.map((day) => ({
          ...day,
          workouts: day.workouts.map((w) => {
            if (w.id === fromWorkoutId) {
              const ex = w.exercises.find((e) => e.id === exerciseId);
              if (ex) {
                exercise = ex;
                return {
                  ...w,
                  exercises: w.exercises.filter((e) => e.id !== exerciseId),
                };
              }
            }
            return w;
          }),
        }));
        if (!exercise) return prev;
        return withoutExercise.map((day) => ({
          ...day,
          workouts: day.workouts.map((w) => {
            if (w.id !== toWorkoutId) return w;
            const newExercises = [...w.exercises];
            newExercises.splice(Math.min(toIndex, newExercises.length), 0, exercise!);
            return { ...w, exercises: newExercises };
          }),
        }));
      });
    },
    []
  );

  const reorderExercisesInWorkout = useCallback(
    (workoutId: string, exerciseIds: string[]) => {
      setDays((prev) =>
        prev.map((day) => ({
          ...day,
          workouts: day.workouts.map((w) => {
            if (w.id !== workoutId) return w;
            const orderMap = new Map(exerciseIds.map((id, i) => [id, i]));
            const sorted = [...w.exercises].sort(
              (a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0)
            );
            return { ...w, exercises: sorted };
          }),
        }))
      );
    },
    []
  );

  const addWorkout = useCallback((dayId: string, title: string) => {
    const id = `workout-${Date.now()}`;
    const workout: Workout = { id, title, exercises: [] };
    setDays((prev) =>
      prev.map((d) =>
        d.id === dayId ? { ...d, workouts: [...d.workouts, workout] } : d
      )
    );
    return id;
  }, []);

  const updateWorkout = useCallback((workoutId: string, title: string) => {
    setDays((prev) =>
      prev.map((day) => ({
        ...day,
        workouts: day.workouts.map((w) =>
          w.id === workoutId ? { ...w, title } : w
        ),
      }))
    );
  }, []);

  const deleteWorkout = useCallback((workoutId: string) => {
    setDays((prev) =>
      prev.map((day) => ({
        ...day,
        workouts: day.workouts.filter((w) => w.id !== workoutId),
      }))
    );
  }, []);

  const addExercise = useCallback(
    (workoutId: string, name: string, setInfo: string, sets: number) => {
      const id = `ex-${Date.now()}`;
      const exercise: Exercise = { id, name, setInfo, sets };
      setDays((prev) =>
        prev.map((day) => ({
          ...day,
          workouts: day.workouts.map((w) =>
            w.id === workoutId
              ? { ...w, exercises: [...w.exercises, exercise] }
              : w
          ),
        }))
      );
      return id;
    },
    []
  );

  const updateExercise = useCallback(
    (exerciseId: string, name: string, setInfo: string, sets: number) => {
      setDays((prev) =>
        prev.map((day) => ({
          ...day,
          workouts: day.workouts.map((w) => ({
            ...w,
            exercises: w.exercises.map((e) =>
              e.id === exerciseId ? { ...e, name, setInfo, sets } : e
            ),
          })),
        }))
      );
    },
    []
  );

  const deleteExercise = useCallback((exerciseId: string) => {
    setDays((prev) =>
      prev.map((day) => ({
        ...day,
        workouts: day.workouts.map((w) => ({
          ...w,
          exercises: w.exercises.filter((e) => e.id !== exerciseId),
        })),
      }))
    );
  }, []);

  return {
    days,
    updateDays,
    moveWorkout,
    reorderWorkoutsInDay,
    moveExercise,
    reorderExercisesInWorkout,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    addExercise,
    updateExercise,
    deleteExercise,
  };
}
