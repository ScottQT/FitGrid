# Training Calendar

A weekly workout training calendar built with **Next.js** and **React**, featuring drag-and-drop for workouts and exercises. The UI follows a clean, modern design with purple accents and light gray day columns.

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **@dnd-kit** (core, sortable, utilities) — only external library used, for drag-and-drop

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles (calendar, cards, modal, forms)
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page: DndContext, Calendar, DragOverlay
├── components/
│   ├── Calendar/       # Weekly grid, modal state, form modals
│   ├── DayColumn/      # Single day column (droppable), header, workout list
│   ├── WorkoutCard/    # Draggable workout card, sortable exercises
│   ├── ExerciseItem/   # Draggable exercise row (name, setInfo, sets)
│   └── Modal/          # Reusable modal (backdrop, close, body)
├── hooks/
│   └── useCalendarState.ts   # Days state, move/reorder, add/edit/delete
├── types/
│   └── workout.ts       # DayColumn, Workout, Exercise interfaces
├── data/
│   └── mockData.ts      # getMockDays() — builds current week + sample workouts
└── utils/
    └── dateUtils.ts    # getWeekStart, getDateNumber, DAY_ABBREVS, isSameDay
```

## Drag and Drop Approach

- **Library:** `@dnd-kit` (core + sortable + utilities).
- **Single `DndContext`** for both workout-level and exercise-level dragging.
- **Workouts**
  - Each workout card uses `useSortable` with `id = workout.id` (e.g. `workout-1`).
  - Each day column uses `useDroppable` with `id = day.id` (e.g. `day-0`).
  - A day also wraps its workouts in `SortableContext` so workouts can be reordered within the same day.
  - On `onDragEnd`: if the active id is a workout and the over target is a day id, the workout is moved to that day (at end or at index if over another workout). If over another workout in the same day, order is updated via `reorderWorkoutsInDay`.
- **Exercises**
  - Each exercise uses `useSortable` with `id = exercise.id` (e.g. `ex-1`).
  - Each workout card’s exercise list is a `useDroppable` with `id = workout.id`, so an exercise can be dropped onto another workout.
  - Each workout has a `SortableContext` with its exercise ids for reordering within that workout.
  - On `onDragEnd`: if the active id is an exercise, we resolve source workout and (from `over`) either the target workout (drop on card) or target exercise (reorder or move to another workout at that index). We then call `moveExercise` or `reorderExercisesInWorkout`.
- **IDs:** Workout ids are prefixed with `workout-`, exercise ids with `ex-`, day ids with `day-`, so we can tell draggable/drop target type in `onDragEnd` and implement move/reorder logic in one place (page-level handler + `useCalendarState`).

## Assumptions

- Week starts on **Monday**; the calendar shows Mon–Sun for the current week.
- “Today” is derived from the client’s current date; the corresponding day’s date number is shown in **purple** and **bold**.
- Mock data builds the current week (Monday–Sunday) and pre-fills Tuesday and Wednesday with sample workouts/exercises so the UI and DnD can be tested immediately.
- Add/Edit Workout and Add/Edit Exercise are implemented with **modal forms** (no inline editing). Edit workout is triggered from the workout card’s “⋯” menu; edit exercise from the “⋯” on each exercise row.
- Long workout titles and exercise names are **truncated with "..."** in the UI (character limits in code); full values are kept in state and in edit forms.
- No backend or persistence: all state is in memory (`useCalendarState`). Refreshing the page resets to mock data.

## Features Implemented

1. **Calendar layout**
   - 7 columns (Mon–Sun) with day name and date; today’s date in purple and bold.
2. **Day container**
   - Each day is a droppable column with light gray background; multiple workout cards per day.
3. **Workout card**
   - Purple title, truncation, “⋯” (edit) and “+” (add exercise). Draggable between days and reorderable within a day.
4. **Exercise item**
   - Name, set info, sets count, “+” to add and “⋯” to edit. Draggable within a workout and movable to another workout.
5. **Drag and drop**
   - Workouts: move between days, reorder within a day.
   - Exercises: reorder within a workout, move to another workout.
   - Drag overlay shows the dragged workout (with first 2 exercises) or the dragged exercise.
6. **Modals**
   - **Add Workout:** title field; submits to add a workout to the selected day.
   - **Edit Workout:** title field; updates the workout whose “⋯” was clicked.
   - **Add Exercise:** name, set info, number of sets; adds to the workout whose “+” was used.
   - **Edit Exercise:** same fields; updates the exercise whose “⋯” was clicked.
7. **Data**
   - Types in `src/types/workout.ts`; mock data in `src/data/mockData.ts`; week and “today” logic in `src/utils/dateUtils.ts`.

## Running the App

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use “+ Add workout” on a day to add a workout (modal), and “+” on a workout to add an exercise (modal). Use “⋯” on a workout or exercise to edit. Drag workout cards between days and exercise rows between workouts or within a workout.

## Build

```bash
npm run build
npm start
```

No console errors are expected when using the app in development or production build.
