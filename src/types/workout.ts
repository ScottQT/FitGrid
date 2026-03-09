export interface Exercise {
  id: string;
  name: string;
  setInfo: string;
  sets: number;
}

export interface Workout {
  id: string;
  title: string;
  exercises: Exercise[];
}

export interface DayColumn {
  id: string;
  date: number;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ...
  workouts: Workout[];
}

export type DayId = string;
