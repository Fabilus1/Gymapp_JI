import type { IExerciseData, Muscle } from 'react-body-highlighter'
import type { SpecificMuscle } from '../data/muscleDetail'

// Maps our granular SpecificMuscle vocabulary onto the coarser muscle enum
// that react-body-highlighter understands. `null` = the package has no
// equivalent region, so that muscle simply isn't highlighted (see the
// data-mapping conflicts noted in the component header).
const TO_PACKAGE: Record<SpecificMuscle, Muscle | null> = {
  'upper chest': 'chest',
  'mid chest': 'chest',
  'lower chest': 'chest',
  lats: 'upper-back', // package has no distinct lats → folds into upper-back
  'upper back': 'upper-back',
  traps: 'trapezius',
  erectors: 'lower-back',
  'front delts': 'front-deltoids',
  'side delts': 'front-deltoids', // no lateral-delt region → shown as front-delt
  'rear delts': 'back-deltoids',
  biceps: 'biceps',
  brachialis: 'biceps', // no separate brachialis
  triceps: 'triceps',
  'forearm flexors': 'forearm',
  'forearm extensors': 'forearm',
  quads: 'quadriceps',
  hamstrings: 'hamstring',
  glutes: 'gluteal',
  adductors: 'adductor',
  calves: 'calves',
  tibialis: null, // no shin region in the model
  abs: 'abs',
  obliques: 'obliques',
  'hip flexors': null, // no hip-flexor region in the model
}

export function mapMuscle(m: SpecificMuscle): Muscle | null {
  return TO_PACKAGE[m]
}

/**
 * Build the `data` array for <Model>. The package colours a muscle by how many
 * data entries include it (frequency), so we emit primaries twice (frequency 2)
 * and secondaries once (frequency 1). Paired with
 * highlightedColors=[secondary, primary] that yields a two-tier heat map.
 * A muscle that is both primary and secondary resolves to primary.
 */
export function buildHighlighterData(
  primary: SpecificMuscle[],
  secondary: SpecificMuscle[]
): IExerciseData[] {
  const primaryPkg = new Set<Muscle>()
  for (const m of primary) {
    const p = mapMuscle(m)
    if (p) primaryPkg.add(p)
  }
  const secondaryPkg = new Set<Muscle>()
  for (const m of secondary) {
    const p = mapMuscle(m)
    if (p && !primaryPkg.has(p)) secondaryPkg.add(p)
  }

  const data: IExerciseData[] = []
  for (const m of primaryPkg) {
    data.push({ name: 'primary', muscles: [m] })
    data.push({ name: 'primary', muscles: [m] }) // → frequency 2
  }
  for (const m of secondaryPkg) {
    data.push({ name: 'secondary', muscles: [m] }) // → frequency 1
  }
  return data
}
