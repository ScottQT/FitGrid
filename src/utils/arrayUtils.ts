/**
 * Reorder an array by moving the item at fromIndex to the position after overId.
 * Used for drag-down reorder: e.g. [A, B, C] drag A over B -> [B, A, C].
 */
export function reorderArray(
  ids: string[],
  fromIndex: number,
  overId: string
): string[] {
  const result = [...ids];
  const [removed] = result.splice(fromIndex, 1);
  const overIndex = result.indexOf(overId);
  const insertIndex = overIndex === -1 ? result.length : overIndex + 1;
  result.splice(insertIndex, 0, removed);
  return result;
}
