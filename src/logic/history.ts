import type { SetEntry, WorkoutSession } from '../types'
import { workingSets, e1rm } from './progression'

export interface HistoryEntry {
  date: string
  sets: SetEntry[] // working sets only (warmups excluded)
}

/** exerciseId → its working-set history, most-recent first. */
export type HistoryIndex = Map<string, HistoryEntry[]>

/**
 * Build a per-exercise history index in a SINGLE pass over all sessions,
 * instead of rescanning the whole history once per exercise. `sessions` is
 * already most-recent-first, so appended entries keep that order.
 *
 * Turns the analytics hot paths (Library last-performance, Progress trend
 * discovery, Log historical bests) from O(exercises × sessions) into
 * O(sessions + lookups).
 */
export function buildHistoryIndex(sessions: WorkoutSession[]): HistoryIndex {
  const index: HistoryIndex = new Map()
  for (const session of sessions) {
    for (const entry of session.exercises) {
      const sets = workingSets(entry.sets)
      if (sets.length === 0) continue
      let list = index.get(entry.exerciseId)
      if (!list) {
        list = []
        index.set(entry.exerciseId, list)
      }
      list.push({ date: session.date, sets })
    }
  }
  return index
}

export function lastPerformanceFromIndex(
  index: HistoryIndex,
  exerciseId: string
): HistoryEntry | null {
  return index.get(exerciseId)?.[0] ?? null
}

export function bestE1rmFromIndex(index: HistoryIndex, exerciseId: string): number {
  let best = 0
  for (const entry of index.get(exerciseId) ?? []) {
    for (const set of entry.sets) {
      const est = e1rm(set.weight, set.reps)
      if (est > best) best = est
    }
  }
  return best
}

/** Top working-set weight per session, oldest first — feeds the trend chart. */
export function strengthTrendFromIndex(
  index: HistoryIndex,
  exerciseId: string
): { date: string; weight: number }[] {
  const entries = index.get(exerciseId)
  if (!entries) return []
  return entries
    .map((e) => ({ date: e.date, weight: Math.max(...e.sets.map((s) => s.weight)) }))
    .reverse()
}
