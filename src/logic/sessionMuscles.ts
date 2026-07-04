import type { WorkoutSession } from '../types'
import type { SpecificMuscle } from '../data/muscleDetail'
import { getMuscleTarget } from '../data/muscleDetail'

/**
 * Aggregate the specific muscles worked in a single session. A muscle is
 * "primary" if it was the primary target of any logged exercise, otherwise
 * "secondary" if it appears as a secondary target — feeds the session
 * muscle-map in the workout report.
 */
export function sessionMuscles(session: WorkoutSession): {
  primary: SpecificMuscle[]
  secondary: SpecificMuscle[]
} {
  const primary = new Set<SpecificMuscle>()
  const secondary = new Set<SpecificMuscle>()

  for (const entry of session.exercises) {
    // ignore exercises with only warmup sets
    const worked = entry.sets.some((s) => s.type !== 'W')
    if (!worked) continue
    const target = getMuscleTarget(entry.exerciseId)
    if (!target) continue
    for (const m of target.primary) primary.add(m)
    for (const m of target.secondary) secondary.add(m)
  }

  // a primary target shouldn't also be dimmed as secondary
  for (const m of primary) secondary.delete(m)

  return { primary: [...primary], secondary: [...secondary] }
}
