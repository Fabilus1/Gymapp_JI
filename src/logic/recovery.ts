import type { MuscleGroup, RecoveryEntry, WorkoutSession } from '../types'
import { getExerciseById } from '../data/exercises'

export type RecoveryStatus = 'trained-today' | 'recovering' | 'almost-ready' | 'ready'

export const STATUS_LABELS: Record<RecoveryStatus, string> = {
  'trained-today': 'Trained today',
  recovering: 'Recovering',
  'almost-ready': 'Almost ready',
  ready: 'Ready to train',
}

export interface MuscleRecovery {
  muscle: MuscleGroup
  status: RecoveryStatus
  lastTrained: string | null // ISO date, null = never
  soreness: number | null // most recent soreness in last 48h, if any
  /** decayed fatigue load, 0 (fresh) … LOAD_CAP; exposed for future UI */
  load: number
}

// Volume-weighted fatigue with a 48h half-life. Each logged working set adds
// one "fatigue unit" that decays by half every 48h, so a muscle returns to
// "ready" within ~2–3 days for a normal session (more volume = a touch longer,
// capped). This replaces the old time-only model that maxed out instantly and
// took 4–5 days regardless of how hard you actually trained.
const HALF_LIFE_H = 48
// Cap the fatigue a single session can deposit at 6 working sets — beyond that,
// extra volume doesn't meaningfully extend recovery, and this keeps even a
// 10-set muscle back to "ready" within ~3 days (not 4–5).
const SETS_CAP = 6
const LOAD_CAP = 9 // headroom so reported soreness can still extend recovery
const LOOKBACK_H = 24 * 6 // ignore anything older than 6 days (fully decayed)

/** Fatigue remaining from `units` fresh units after `hours` (48h half-life). */
function decay(units: number, hours: number): number {
  return units * Math.pow(0.5, hours / HALF_LIFE_H)
}

function statusFromLoad(load: number): RecoveryStatus {
  if (load >= 5) return 'trained-today'
  if (load >= 3.5) return 'recovering'
  if (load >= 2.5) return 'almost-ready'
  return 'ready'
}

/** Working sets (exclude warmups and empty sets) an exercise contributes. */
function workingSetCount(sets: { reps: number; type?: string }[]): number {
  return sets.filter((s) => s.type !== 'W' && s.reps > 0).length
}

export function muscleRecovery(
  muscle: MuscleGroup,
  sessions: WorkoutSession[],
  recoveryLog: RecoveryEntry[],
  now: Date = new Date()
): MuscleRecovery {
  const nowMs = now.getTime()
  let lastTrained: string | null = null
  let load = 0

  for (const session of sessions) {
    const hours = (nowMs - new Date(session.date).getTime()) / 3600000
    if (hours < 0 || hours > LOOKBACK_H) continue

    let setsForMuscle = 0
    for (const e of session.exercises) {
      if (getExerciseById(e.exerciseId)?.muscle === muscle) {
        setsForMuscle += workingSetCount(e.sets)
      }
    }
    if (setsForMuscle > 0) {
      load += decay(Math.min(setsForMuscle, SETS_CAP), hours)
      if (lastTrained === null || session.date > lastTrained) lastTrained = session.date
    }
  }

  // Reported soreness feeds the same decaying load, so a sore muscle stays
  // "recovering" longer without a special-case override (soreness 4 ≈ ~5 sets).
  let recentSoreness: number | null = null
  for (const r of recoveryLog) {
    if (r.muscle !== muscle) continue
    const hours = (nowMs - new Date(r.date).getTime()) / 3600000
    if (hours < 0 || hours > LOOKBACK_H) continue
    load += decay(r.soreness * 1.2, hours)
    if (hours < 48 && recentSoreness === null) recentSoreness = r.soreness
  }

  load = Math.min(load, LOAD_CAP)
  return { muscle, status: statusFromLoad(load), lastTrained, soreness: recentSoreness, load }
}
