import type { Exercise, WorkoutSession, SetEntry } from '../types'

export interface Suggestion {
  weight: number | null // null = no history, user picks a starting weight
  reps: number
  /** last logged sets, for display ("Last: 135 × 8, 8, 7") */
  lastSets: SetEntry[] | null
  increased: boolean
}

/** Most recent session containing the exercise, scanning sessions sorted most-recent-first. */
export function findLastPerformance(
  sessions: WorkoutSession[],
  exerciseId: string
): { session: WorkoutSession; sets: SetEntry[] } | null {
  for (const session of sessions) {
    const entry = session.exercises.find((e) => e.exerciseId === exerciseId)
    if (entry && entry.sets.length > 0) {
      return { session, sets: entry.sets }
    }
  }
  return null
}

/**
 * Double progression: if every set of the last session hit the top of the
 * rep range, add the exercise's increment and reset target reps to the
 * bottom of the range; otherwise keep the weight and aim for one more rep.
 */
export function suggestNext(exercise: Exercise, sessions: WorkoutSession[]): Suggestion {
  const [low, high] = exercise.repRange
  const last = findLastPerformance(sessions, exercise.id)

  if (!last) {
    return { weight: null, reps: low, lastSets: null, increased: false }
  }

  const topWeight = Math.max(...last.sets.map((s) => s.weight))
  const allHitTop = last.sets.every((s) => s.reps >= high)

  if (allHitTop) {
    return { weight: topWeight + exercise.increment, reps: low, lastSets: last.sets, increased: true }
  }

  const bestReps = Math.max(...last.sets.map((s) => s.reps))
  return {
    weight: topWeight,
    reps: Math.min(bestReps + 1, high),
    lastSets: last.sets,
    increased: false,
  }
}

/** Top-set weight per session for an exercise, oldest first — feeds the strength trend chart. */
export function strengthTrend(
  sessions: WorkoutSession[],
  exerciseId: string
): { date: string; weight: number }[] {
  const points: { date: string; weight: number }[] = []
  for (const session of sessions) {
    const entry = session.exercises.find((e) => e.exerciseId === exerciseId)
    if (entry && entry.sets.length > 0) {
      points.push({ date: session.date, weight: Math.max(...entry.sets.map((s) => s.weight)) })
    }
  }
  return points.reverse()
}
