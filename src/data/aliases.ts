// V18 database normalization. The V7 "exact-name" batch (exercisesExact.ts,
// `x-` prefixed) duplicated already-existing movements under non-strict names
// (e.g. "Cable Bicep Curl" vs the canonical "Curl (Cable)"). This maps each
// redundant id onto its canonical, strictly-named equivalent. getExerciseById
// resolves through it, ALL_EXERCISES drops the duplicates, and a one-time
// migration rewrites saved plans/sessions so everything points at one id.
export const EXERCISE_ALIASES: Record<string, string> = {
  'x-preacher-curl-machine': 'machine-preacher-curl-plate',
  'x-machine-seated-tricep-dip': 'triceps-dip-machine',
  'x-calf-press-on-leg-press': 'leg-press-calf-raise',
  'x-machine-incline-chest-press': 'incline-machine-press',
  'x-machine-seated-row': 'machine-row',
  // NOT aliased: a Smith stiff-leg deadlift is a distinct lift from the Smith
  // RDL (straighter knees, different hinge), so it stays as its own exercise.
  'x-machine-leg-extension': 'leg-extension',
  'x-machine-ab-crunch': 'machine-crunch',
  'x-cable-lat-pulldown-wide-grip': 'wide-grip-lat-pulldown-cable',
  'x-hack-squat': 'hack-squat',
  'x-machine-back-extension': 'machine-back-extension',
  'x-machine-leg-press': 'leg-press',
  'x-cable-reverse-fly': 'cable-rear-delt-fly',
  'x-machine-hip-adduction': 'hip-adduction-machine',
  'x-cable-one-arm-tricep-pushdown': 'single-arm-pushdown-cable',
  'x-cable-one-arm-tricep-extension': 'single-arm-cable-tricep-extension',
  'x-cable-bayesian-curl': 'bayesian-cable-curl',
  'x-cable-lateral-raise': 'cable-lateral-raise',
  'x-machine-lat-pulldown': 'lat-pulldown-machine',
  'x-machine-seated-leg-curl': 'seated-leg-curl',
  'x-machine-calf-press': 'leg-press-calf-raise',
  'x-machine-deltoid-raise': 'machine-lateral-raise',
  'x-machine-seated-calf-raise': 'seated-calf-raise',
  'x-machine-calf-raise': 'standing-calf-raise-machine',
  'x-machine-fly': 'machine-fly',
  'x-machine-bench-press': 'machine-chest-press',
  'x-cable-pullover-supine': 'cable-pullover',
  'x-cable-tricep-pushdown-v-bar': 'pushdown-cable-v-bar',
  'x-cable-rope-overhead-tricep-extension': 'overhead-extension-cable-rope',
  'x-cable-bicep-curl': 'cable-curl',
  'x-machine-lateral-shoulder-raise': 'machine-lateral-raise',
  'x-cable-kneeling-crunch-rope': 'cable-crunch-kneeling',
  'x-dumbbell-alternating-bicep-curl': 'dumbbell-curl',
  'x-t-bar-row': 't-bar-row',
  'x-cable-seated-row': 'seated-cable-row',
  // no clean canonical — kept, just renamed strictly in exercisesExact.ts:
  //   x-smith-machine-deadlift → "Deadlift (Smith Machine)"
}

/** Resolve any legacy/duplicate id to its canonical id (idempotent). */
export function canonicalId(id: string): string {
  return EXERCISE_ALIASES[id] ?? id
}
