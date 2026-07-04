import type { Exercise, WorkoutSession, SetEntry } from '../types'

export interface Suggestion {
  weight: number | null // null = no history, user picks a starting weight
  reps: number
  /** last logged working sets, for display ("Last: 135 × 8, 8, 7") */
  lastSets: SetEntry[] | null
  increased: boolean
}

/** Warmup sets don't count toward progression, PRs, trends, or volume. */
export function workingSets(sets: SetEntry[]): SetEntry[] {
  return sets.filter((s) => s.type !== 'W')
}

/** Epley estimated 1-rep max: weight × (1 + reps/30). */
export function e1rm(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0
  return weight * (1 + reps / 30)
}

/** Best historical e1RM for an exercise across all working sets. */
export function bestE1rm(sessions: WorkoutSession[], exerciseId: string): number {
  let best = 0
  for (const session of sessions) {
    const entry = session.exercises.find((e) => e.exerciseId === exerciseId)
    if (!entry) continue
    for (const set of workingSets(entry.sets)) {
      const est = e1rm(set.weight, set.reps)
      if (est > best) best = est
    }
  }
  return best
}

/** Most recent session containing working sets of the exercise (sessions sorted most-recent-first). */
export function findLastPerformance(
  sessions: WorkoutSession[],
  exerciseId: string
): { session: WorkoutSession; sets: SetEntry[] } | null {
  for (const session of sessions) {
    const entry = session.exercises.find((e) => e.exerciseId === exerciseId)
    if (entry) {
      const sets = workingSets(entry.sets)
      if (sets.length > 0) return { session, sets }
    }
  }
  return null
}

/**
 * Double progression: if every working set of the last session hit the top
 * of the rep range, add the exercise's increment and reset target reps to
 * the bottom of the range; otherwise keep the weight and aim for one more rep.
 * `repRangeOverride` comes from the Planner's per-exercise template settings.
 */
export function suggestNext(
  exercise: Exercise,
  sessions: WorkoutSession[],
  repRangeOverride?: [number, number]
): Suggestion {
  const [low, high] = repRangeOverride ?? exercise.repRange
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

/** Top working-set weight per session, oldest first — feeds the strength trend chart. */
export function strengthTrend(
  sessions: WorkoutSession[],
  exerciseId: string
): { date: string; weight: number }[] {
  const points: { date: string; weight: number }[] = []
  for (const session of sessions) {
    const entry = session.exercises.find((e) => e.exerciseId === exerciseId)
    if (!entry) continue
    const sets = workingSets(entry.sets)
    if (sets.length > 0) {
      points.push({ date: session.date, weight: Math.max(...sets.map((s) => s.weight)) })
    }
  }
  return points.reverse()
}
