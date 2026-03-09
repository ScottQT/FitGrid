'use client';

import { useState, useCallback } from 'react';
import type { DayColumn as DayColumnType, Exercise as ExerciseType } from '@/types/workout';
import { DayColumn } from '@/components/DayColumn';
import { Modal } from '@/components/Modal';
import { AddWorkoutForm, EditWorkoutForm, ExerciseForm } from '@/components/Calendar/forms';
import { isSameDay } from '@/utils/dateUtils';

export interface CalendarProps {
  days: DayColumnType[];
  today: Date;
  weekStart: Date;
  onAddWorkout: (dayId: string, title: string) => string;
  onUpdateWorkout: (workoutId: string, title: string) => void;
  onAddExercise: (workoutId: string, name: string, setInfo: string, sets: number) => string;
  onUpdateExercise: (exerciseId: string, name: string, setInfo: string, sets: number) => void;
}

type ModalType = 'add-workout' | 'edit-workout' | 'add-exercise' | 'edit-exercise' | null;

interface ModalState {
  type: ModalType;
  dayId?: string;
  workoutId?: string;
  exerciseId?: string;
}

export function Calendar({
  days,
  today,
  weekStart,
  onAddWorkout,
  onUpdateWorkout,
  onAddExercise,
  onUpdateExercise,
}: CalendarProps) {
  const [modal, setModal] = useState<ModalState | null>(null);

  const closeModal = useCallback(() => setModal(null), []);

  const getExerciseById = useCallback(
    (exerciseId: string): ExerciseType | null => {
      for (const day of days) {
        for (const workout of day.workouts) {
          const ex = workout.exercises.find((e) => e.id === exerciseId);
          if (ex) return ex;
        }
      }
      return null;
    },
    [days]
  );

  const editExerciseId = modal?.type === 'edit-exercise' ? modal.exerciseId ?? '' : '';
  const editExercise = getExerciseById(editExerciseId);

  return (
    <div className="calendar">
      <div className="calendar__grid">
        {days.map((day, index) => {
          const dayDate = new Date(weekStart);
          dayDate.setDate(weekStart.getDate() + index);
          const isToday = isSameDay(dayDate, today);
          return (
            <DayColumn
              key={day.id}
              day={day}
              isToday={isToday}
              onAddWorkout={() => setModal({ type: 'add-workout', dayId: day.id })}
              onEditWorkout={(workoutId: string) => setModal({ type: 'edit-workout', workoutId })}
              onAddExercise={(workoutId: string) => setModal({ type: 'add-exercise', workoutId })}
              onEditExercise={(exerciseId: string) => setModal({ type: 'edit-exercise', exerciseId })}
            />
          );
        })}
      </div>

      <Modal
        isOpen={modal?.type === 'add-workout'}
        onClose={closeModal}
        title="Add Workout"
      >
        <AddWorkoutForm
          onSubmit={(title) => {
            if (modal?.dayId) onAddWorkout(modal.dayId, title);
            closeModal();
          }}
          onCancel={closeModal}
        />
      </Modal>

      <Modal
        isOpen={modal?.type === 'edit-workout'}
        onClose={closeModal}
        title="Edit Workout"
      >
        <EditWorkoutForm
          key={modal?.workoutId}
          workoutId={modal?.workoutId ?? ''}
          initialTitle={
            days.flatMap((d) => d.workouts).find((w) => w.id === modal?.workoutId)?.title ?? ''
          }
          onSubmit={(title) => {
            if (modal?.workoutId) onUpdateWorkout(modal.workoutId, title);
            closeModal();
          }}
          onCancel={closeModal}
        />
      </Modal>

      <Modal
        isOpen={modal?.type === 'add-exercise'}
        onClose={closeModal}
        title="Add Exercise"
      >
        <ExerciseForm
          initialName=""
          initialSetInfo=""
          initialSets={1}
          onSubmit={(name, setInfo, sets) => {
            if (modal?.workoutId) onAddExercise(modal.workoutId, name, setInfo, sets);
            closeModal();
          }}
          onCancel={closeModal}
        />
      </Modal>

      <Modal
        isOpen={modal?.type === 'edit-exercise'}
        onClose={closeModal}
        title="Edit Exercise"
      >
        <ExerciseForm
          key={modal?.exerciseId}
          initialName={editExercise?.name ?? ''}
          initialSetInfo={editExercise?.setInfo ?? ''}
          initialSets={editExercise?.sets ?? 1}
          onSubmit={(name, setInfo, sets) => {
            if (modal?.exerciseId) onUpdateExercise(modal.exerciseId, name, setInfo, sets);
            closeModal();
          }}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}
