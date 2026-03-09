import type { Collision } from '@dnd-kit/core';
import { pointerWithin } from '@dnd-kit/core';

/**
 * Prefer sortable droppables (workout-*, ex-*) over container droppables (day-*)
 * when the pointer is within both. Fixes reorder drag from top to bottom.
 */
export function sortablePreferredCollision(
  args: Parameters<typeof pointerWithin>[0]
): Collision[] {
  const collisions = pointerWithin(args);
  if (!collisions.length) return collisions;
  return [...collisions].sort((a, b) => {
    const idA = String(a.id);
    const idB = String(b.id);
    const aIsSortable = idA.startsWith('workout-') || idA.startsWith('ex-');
    const bIsSortable = idB.startsWith('workout-') || idB.startsWith('ex-');
    if (aIsSortable && !bIsSortable) return -1;
    if (!aIsSortable && bIsSortable) return 1;
    return 0;
  });
}
