import type { SetEntry, WorkoutSession } from '../types'
import { canonicalId } from '../data/aliases'

export interface ExerciseLog {
  date: string
  sets: SetEntry[] // working sets logged that session (warmups excluded)
}

/**
 * Per-session log history for one exercise, most-recent first — so you can see
 * every previous session's actual sets, not just the top set. Empty-guarded.
 */
export function exerciseHistory(
  sessions: WorkoutSession[] | undefined,
  exerciseId: string
): ExerciseLog[] {
  if (!sessions?.length) return []
  const target = canonicalId(exerciseId)
  const out: ExerciseLog[] = []
  for (const session of sessions) {
    const sets: SetEntry[] = []
    for (const entry of session?.exercises ?? []) {
      if (canonicalId(entry?.exerciseId ?? '') !== target) continue
      for (const set of entry?.sets ?? []) {
        if (set?.type === 'W') continue
        if ((set?.weight ?? 0) <= 0 && (set?.reps ?? 0) <= 0) continue
        sets.push(set)
      }
    }
    if (sets.length > 0) out.push({ date: session.date, sets })
  }
  // sessions are already newest-first from the store, but sort defensively
  return out.sort((a, b) => b.date.localeCompare(a.date))
}

export interface ExerciseStats {
  sessionCount: number
  maxWeightAllTime: number
  maxWeightRecent: number // best top-set in the last 30 days
  maxReps: number
  bestSetVolume: number // best single working set (weight × reps)
  bestSessionVolume: number // best total volume in one session
}

const RECENT_MS = 30 * 86400000

/**
 * All-time / recent PRs for one exercise from logged history. Everything is
 * optional-chained and empty-guarded so a not-yet-loaded or empty history can
 * never throw (no Math.max on []). Warmup sets are excluded.
 */
export function computeExerciseStats(
  sessions: WorkoutSession[] | undefined,
  exerciseId: string,
  now: number = Date.now()
): ExerciseStats {
  const empty: ExerciseStats = {
    sessionCount: 0,
    maxWeightAllTime: 0,
    maxWeightRecent: 0,
    maxReps: 0,
    bestSetVolume: 0,
    bestSessionVolume: 0,
  }
  if (!sessions?.length) return empty

  const target = canonicalId(exerciseId)
  const stats = { ...empty }

  for (const session of sessions) {
    const isRecent = now - new Date(session?.date ?? 0).getTime() <= RECENT_MS
    let sessionVolume = 0
    let hitThisSession = false

    for (const entry of session?.exercises ?? []) {
      if (canonicalId(entry?.exerciseId ?? '') !== target) continue
      for (const set of entry?.sets ?? []) {
        if (set?.type === 'W') continue
        const weight = set?.weight ?? 0
        const reps = set?.reps ?? 0
        if (weight <= 0 && reps <= 0) continue
        hitThisSession = true
        if (weight > stats.maxWeightAllTime) stats.maxWeightAllTime = weight
        if (isRecent && weight > stats.maxWeightRecent) stats.maxWeightRecent = weight
        if (reps > stats.maxReps) stats.maxReps = reps
        const vol = weight * reps
        if (vol > stats.bestSetVolume) stats.bestSetVolume = vol
        sessionVolume += vol
      }
    }

    if (hitThisSession) {
      stats.sessionCount += 1
      if (sessionVolume > stats.bestSessionVolume) stats.bestSessionVolume = sessionVolume
    }
  }

  return stats
}
