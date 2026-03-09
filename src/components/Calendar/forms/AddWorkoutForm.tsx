'use client';

import { useState } from 'react';

export interface AddWorkoutFormProps {
  onSubmit: (title: string) => void;
  onCancel: () => void;
}

export function AddWorkoutForm({ onSubmit, onCancel }: AddWorkoutFormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) onSubmit(title.trim());
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="workout-title">Title</label>
        <input
          id="workout-title"
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
          Add
        </button>
      </div>
    </form>
  );
}
