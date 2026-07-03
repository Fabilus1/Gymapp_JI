import type { Exercise, WorkoutSession, SetEntry } from '../types'
import { suggestNext } from './progression'

// Rule-based progressive-overload coach. Reads training history and tells
// the lifter exactly what to chase today — the "AI-ish" assistant layer.

export type InsightKind = 'new' | 'increase' | 'push' | 'stall' | 'regress' | 'build'

export interface CoachInsight {
  kind: InsightKind
  /** Short line shown under the exercise on Today. */
  message: string
  /** Concrete goal for the Log screen, e.g. "Beat 50 × 8, 8, 7". */
  target: string | null
}

function historyFor(sessions: WorkoutSession[], exerciseId: string): SetEntry[][] {
  const out: SetEntry[][] = []
  for (const session of sessions) {
    const entry = session.exercises.find((e) => e.exerciseId === exerciseId)
    if (entry && entry.sets.length > 0) out.push(entry.sets)
  }
  return out // most recent first
}

const topWeight = (sets: SetEntry[]) => Math.max(...sets.map((s) => s.weight))
const totalReps = (sets: SetEntry[]) => sets.reduce((sum, s) => sum + s.reps, 0)

export function coachInsight(exercise: Exercise, sessions: WorkoutSession[]): CoachInsight {
  const history = historyFor(sessions, exercise.id)
  const [low, high] = exercise.repRange

  if (history.length === 0) {
    return {
      kind: 'new',
      message: `First session — find a weight you can control for ${low} clean reps.`,
      target: null,
    }
  }

  const last = history[0]
  const lastTop = topWeight(last)
  const repsStr = last.map((s) => s.reps).join(', ')
  const suggestion = suggestNext(exercise, sessions)

  // Every set hit the ceiling — time to load.
  if (last.every((s) => s.reps >= high)) {
    return {
      kind: 'increase',
      message: `You maxed the rep range at ${lastTop} lb. Loading ${suggestion.weight} lb today — aim for ${low}s and rebuild.`,
      target: `New weight: ${suggestion.weight} lb × ${low}+ per set`,
    }
  }

  // Regression check: last top weight below the best of the 3 sessions before it.
  if (history.length >= 2) {
    const prevBest = Math.max(...history.slice(1, 4).map(topWeight))
    if (lastTop < prevBest) {
      return {
        kind: 'regress',
        message: `Last session dipped to ${lastTop} lb (best was ${prevBest}). Shake it off — get back to ${prevBest} today.`,
        target: `Reclaim ${prevBest} lb`,
      }
    }
  }

  // Stall check: 3+ sessions at the same weight with no total-rep growth.
  if (history.length >= 3) {
    const [a, b, c] = history
    const sameWeight = topWeight(a) === topWeight(b) && topWeight(b) === topWeight(c)
    if (sameWeight && totalReps(a) <= totalReps(c)) {
      const deload = Math.max(exercise.increment, Math.round((lastTop * 0.9) / 5) * 5)
      return {
        kind: 'stall',
        message: `Three sessions stuck at ${lastTop} lb. Two ways out: drop to ~${deload} lb and rebuild momentum, or fight for one extra rep on set 1.`,
        target: `Break the stall: beat ${repsStr} total`,
      }
    }
  }

  // Within one rep of the ceiling on every set — one push away.
  const missing = last.reduce((sum, s) => sum + Math.max(0, high - s.reps), 0)
  if (missing <= 2) {
    return {
      kind: 'push',
      message: `${missing === 1 ? 'One rep' : 'Two reps'} away from ${
        (suggestion.weight ?? lastTop) + exercise.increment
      } lb. Last time: ${lastTop} × ${repsStr}. Close it out today.`,
      target: `Hit ${high} on every set to unlock ${lastTop + exercise.increment} lb`,
    }
  }

  return {
    kind: 'build',
    message: `Last time: ${lastTop} lb × ${repsStr}. Add a rep anywhere today.`,
    target: `Beat ${lastTop} × ${repsStr}`,
  }
}

/** One-line session summary for the Today screen banner. */
export function sessionSummary(
  exercises: Exercise[],
  sessions: WorkoutSession[]
): string | null {
  if (sessions.length === 0) return null
  const insights = exercises.map((e) => coachInsight(e, sessions))
  const increases = insights.filter((i) => i.kind === 'increase').length
  const pushes = insights.filter((i) => i.kind === 'push').length
  const stalls = insights.filter((i) => i.kind === 'stall').length

  const parts: string[] = []
  if (increases > 0) parts.push(`${increases} lift${increases > 1 ? 's' : ''} moving up in weight`)
  if (pushes > 0) parts.push(`${pushes} within a rep of progressing`)
  if (stalls > 0) parts.push(`${stalls} stalled — plan of attack below`)
  if (parts.length === 0) return 'Steady building day. Add reps where you can.'
  return parts.join(' · ')
}
