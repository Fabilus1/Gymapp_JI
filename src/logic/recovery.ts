import type { MuscleGroup, RecoveryEntry, WorkoutSession } from '../types'
import { getExerciseById } from '../data/exercises'

export type RecoveryStatus = 'trained-today' | 'recovering' | 'almost-ready' | 'ready'

export const STATUS_LABELS: Record<RecoveryStatus, string> = {
  'trained-today': 'Trained today',
  recovering: 'Recovering',
  'almost-ready': 'Almost ready',
  ready: 'Ready to train',
}

const ORDER: RecoveryStatus[] = ['trained-today', 'recovering', 'almost-ready', 'ready']

export interface MuscleRecovery {
  muscle: MuscleGroup
  status: RecoveryStatus
  lastTrained: string | null // ISO date, null = never
  soreness: number | null // most recent soreness in last 48h, if any
}

function statusFromHours(hours: number): RecoveryStatus {
  if (hours < 24) return 'trained-today'
  if (hours < 48) return 'recovering'
  if (hours < 72) return 'almost-ready'
  return 'ready'
}

/** One tier less recovered — reported soreness shouldn't be overridden by time alone. */
function downgrade(status: RecoveryStatus): RecoveryStatus {
  const i = ORDER.indexOf(status)
  return ORDER[Math.max(0, i - 1)]
}

export function muscleRecovery(
  muscle: MuscleGroup,
  sessions: WorkoutSession[],
  recoveryLog: RecoveryEntry[],
  now: Date = new Date()
): MuscleRecovery {
  let lastTrained: string | null = null
  for (const session of sessions) {
    const hits = session.exercises.some((e) => getExerciseById(e.exerciseId)?.muscle === muscle)
    if (hits) {
      if (lastTrained === null || session.date > lastTrained) lastTrained = session.date
    }
  }

  const recentSoreness = recoveryLog.find(
    (r) => r.muscle === muscle && now.getTime() - new Date(r.date).getTime() < 48 * 3600000
  )

  let status: RecoveryStatus
  if (lastTrained === null) {
    status = 'ready'
  } else {
    const hours = (now.getTime() - new Date(lastTrained).getTime()) / 3600000
    status = statusFromHours(hours)
  }
  if (recentSoreness && recentSoreness.soreness >= 4) {
    status = downgrade(status)
  }
  return { muscle, status, lastTrained, soreness: recentSoreness?.soreness ?? null }
}
