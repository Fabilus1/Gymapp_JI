import type { MuscleGroup, WorkoutSession } from '../types'
import { getExerciseById } from '../data/exercises'

export interface MuscleVolume {
  muscle: MuscleGroup
  /** total tonnage in lb: Σ (weight × reps) across all sets */
  tonnage: number
  sets: number
}

/** Tonnage per muscle group over the trailing 7 days, heaviest first. */
export function weeklyVolume(sessions: WorkoutSession[], now: Date = new Date()): MuscleVolume[] {
  const cutoff = now.getTime() - 7 * 86400000
  const totals = new Map<MuscleGroup, { tonnage: number; sets: number }>()

  for (const session of sessions) {
    if (new Date(session.date).getTime() < cutoff) continue
    for (const entry of session.exercises) {
      const exercise = getExerciseById(entry.exerciseId)
      if (!exercise) continue
      const counted = entry.sets.filter((s) => s.type !== 'W')
      const tonnage = counted.reduce((sum, s) => sum + s.weight * s.reps, 0)
      const worked = counted.filter((s) => s.reps > 0).length
      const current = totals.get(exercise.muscle) ?? { tonnage: 0, sets: 0 }
      current.tonnage += tonnage
      current.sets += worked
      totals.set(exercise.muscle, current)
    }
  }

  return [...totals.entries()]
    .map(([muscle, t]) => ({ muscle, tonnage: t.tonnage, sets: t.sets }))
    .filter((v) => v.sets > 0)
    .sort((a, b) => b.tonnage - a.tonnage)
}
