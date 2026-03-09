'use client';

import { useState } from 'react';

export interface ExerciseFormProps {
  initialName: string;
  initialSetInfo: string;
  initialSets: number;
  onSubmit: (name: string, setInfo: string, sets: number) => void;
  onCancel: () => void;
}

export function ExerciseForm({
  initialName,
  initialSetInfo,
  initialSets,
  onSubmit,
  onCancel,
}: ExerciseFormProps) {
  const [name, setName] = useState(initialName);
  const [setInfo, setSetInfo] = useState(initialSetInfo);
  const [sets, setSets] = useState(String(initialSets));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const setsNum = Math.max(1, parseInt(sets, 10) || 1);
    if (name.trim()) onSubmit(name.trim(), setInfo.trim(), setsNum);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="exercise-name">Exercise name</label>
        <input
          id="exercise-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Bench Press"
          autoFocus
        />
      </div>
      <div className="form-group">
        <label htmlFor="exercise-set-info">Set info</label>
        <input
          id="exercise-set-info"
          type="text"
          value={setInfo}
          onChange={(e) => setSetInfo(e.target.value)}
          placeholder="e.g. 50 lb x 5, 60 lb x 5"
        />
      </div>
      <div className="form-group">
        <label htmlFor="exercise-sets">Number of sets</label>
        <input
          id="exercise-sets"
          type="number"
          min={1}
          value={sets}
          onChange={(e) => setSets(e.target.value)}
        />
      </div>
      <div className="modal-actions">
        <button type="button" className="btn btn--secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary" disabled={!name.trim()}>
          Save
        </button>
      </div>
    </form>
  );
}
