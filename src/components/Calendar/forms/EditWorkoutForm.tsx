'use client';

import { useState } from 'react';

export interface EditWorkoutFormProps {
  workoutId: string;
  initialTitle: string;
  onSubmit: (title: string) => void;
  onCancel: () => void;
}

export function EditWorkoutForm({
  initialTitle,
  onSubmit,
  onCancel,
}: EditWorkoutFormProps) {
  const [title, setTitle] = useState(initialTitle);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) onSubmit(title.trim());
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="edit-workout-title">Title</label>
        <input
          id="edit-workout-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Chest Day"
          autoFocus
        />
      </div>
      <div className="modal-actions">
        <button type="button" className="btn btn--secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary" disabled={!title.trim()}>
          Save
        </button>
      </div>
    </form>
  );
}
