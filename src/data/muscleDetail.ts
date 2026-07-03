// Precise muscle targeting per exercise — drives the muscle diagram
// highlights and the "works: side delts, traps" copy in the detail view.

export type SpecificMuscle =
  | 'upper chest'
  | 'mid chest'
  | 'lower chest'
  | 'lats'
  | 'upper back'
  | 'traps'
  | 'erectors'
  | 'front delts'
  | 'side delts'
  | 'rear delts'
  | 'biceps'
  | 'brachialis'
  | 'triceps'
  | 'forearm flexors'
  | 'forearm extensors'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'adductors'
  | 'calves'
  | 'tibialis'
  | 'abs'
  | 'obliques'
  | 'hip flexors'

export interface MuscleTarget {
  primary: SpecificMuscle[]
  secondary: SpecificMuscle[]
}

export const MUSCLE_DETAIL: Record<string, MuscleTarget> = {
  // Chest
  'barbell-bench-press': { primary: ['mid chest'], secondary: ['front delts', 'triceps'] },
  'incline-barbell-bench-press': { primary: ['upper chest'], secondary: ['front delts', 'triceps'] },
  'decline-barbell-bench-press': { primary: ['lower chest'], secondary: ['triceps', 'front delts'] },
  'dumbbell-bench-press': { primary: ['mid chest'], secondary: ['front delts', 'triceps'] },
  'incline-dumbbell-press': { primary: ['upper chest'], secondary: ['front delts', 'triceps'] },
  'machine-chest-press': { primary: ['mid chest'], secondary: ['front delts', 'triceps'] },
  'push-up-weighted': { primary: ['mid chest'], secondary: ['front delts', 'triceps', 'abs'] },
  'cable-fly': { primary: ['mid chest'], secondary: ['front delts'] },
  'dumbbell-fly': { primary: ['mid chest'], secondary: ['front delts'] },
  'cable-crossover': { primary: ['mid chest', 'lower chest'], secondary: ['front delts'] },
  'pec-deck': { primary: ['mid chest'], secondary: ['front delts'] },
  'chest-dip': { primary: ['lower chest'], secondary: ['triceps', 'front delts'] },
  'smith-machine-bench-press': { primary: ['mid chest'], secondary: ['front delts', 'triceps'] },
  'smith-machine-incline-press': { primary: ['upper chest'], secondary: ['front delts', 'triceps'] },
  'low-to-high-cable-fly': { primary: ['upper chest'], secondary: ['front delts'] },
  'high-to-low-cable-fly': { primary: ['lower chest'], secondary: ['front delts'] },
  'floor-press': { primary: ['mid chest'], secondary: ['triceps', 'front delts'] },
  'cable-chest-press': { primary: ['mid chest'], secondary: ['front delts', 'triceps'] },
  'incline-machine-press': { primary: ['upper chest'], secondary: ['front delts', 'triceps'] },
  'machine-fly': { primary: ['mid chest'], secondary: ['front delts'] },
  'seated-dip-machine': { primary: ['lower chest'], secondary: ['triceps', 'front delts'] },

  // Back
  'conventional-deadlift': { primary: ['erectors', 'glutes', 'hamstrings'], secondary: ['lats', 'traps', 'forearm flexors', 'quads'] },
  'barbell-row': { primary: ['lats', 'upper back'], secondary: ['rear delts', 'biceps', 'erectors'] },
  'pendlay-row': { primary: ['upper back', 'lats'], secondary: ['rear delts', 'biceps', 'erectors'] },
  't-bar-row': { primary: ['upper back', 'lats'], secondary: ['rear delts', 'biceps'] },
  'lat-pulldown': { primary: ['lats'], secondary: ['biceps', 'rear delts', 'upper back'] },
  'pull-up': { primary: ['lats'], secondary: ['biceps', 'upper back', 'abs'] },
  'chin-up': { primary: ['lats', 'biceps'], secondary: ['upper back', 'abs'] },
  'inverted-row': { primary: ['upper back', 'lats'], secondary: ['rear delts', 'biceps'] },
  'seated-cable-row': { primary: ['upper back', 'lats'], secondary: ['rear delts', 'biceps', 'erectors'] },
  'chest-supported-dumbbell-row': { primary: ['upper back', 'lats'], secondary: ['rear delts', 'biceps'] },
  'single-arm-dumbbell-row': { primary: ['lats'], secondary: ['upper back', 'rear delts', 'biceps'] },
  'straight-arm-pulldown': { primary: ['lats'], secondary: ['triceps', 'abs'] },
  'rack-pull': { primary: ['erectors', 'traps'], secondary: ['lats', 'glutes', 'forearm flexors'] },
  'sumo-deadlift': { primary: ['glutes', 'adductors', 'erectors'], secondary: ['quads', 'hamstrings', 'traps', 'forearm flexors'] },
  'trap-bar-deadlift': { primary: ['glutes', 'quads', 'erectors'], secondary: ['hamstrings', 'traps', 'forearm flexors'] },
  'snatch-grip-deadlift': { primary: ['erectors', 'traps', 'upper back'], secondary: ['glutes', 'hamstrings', 'forearm flexors'] },
  'deficit-deadlift': { primary: ['erectors', 'glutes', 'hamstrings'], secondary: ['quads', 'lats', 'forearm flexors'] },
  'meadows-row': { primary: ['lats', 'upper back'], secondary: ['rear delts', 'biceps'] },
  'seal-row': { primary: ['upper back', 'lats'], secondary: ['rear delts', 'biceps'] },
  'machine-high-row': { primary: ['lats'], secondary: ['upper back', 'rear delts', 'biceps'] },
  'machine-row': { primary: ['upper back', 'lats'], secondary: ['rear delts', 'biceps'] },
  'single-arm-cable-row': { primary: ['lats'], secondary: ['upper back', 'biceps'] },
  'neutral-grip-lat-pulldown': { primary: ['lats'], secondary: ['biceps', 'upper back'] },
  'single-arm-lat-pulldown': { primary: ['lats'], secondary: ['biceps'] },
  'dumbbell-pullover': { primary: ['lats'], secondary: ['mid chest', 'triceps'] },
  'back-extension': { primary: ['erectors'], secondary: ['glutes', 'hamstrings'] },
  'assisted-pull-up-machine': { primary: ['lats'], secondary: ['biceps', 'upper back'] },
  'machine-pullover': { primary: ['lats'], secondary: ['mid chest', 'triceps'] },
  'cable-pullover': { primary: ['lats'], secondary: ['triceps'] },
  'wide-grip-seated-row': { primary: ['upper back', 'rear delts'], secondary: ['lats', 'biceps'] },
  'smith-machine-row': { primary: ['upper back', 'lats'], secondary: ['rear delts', 'biceps'] },
  'cable-deadlift': { primary: ['glutes', 'hamstrings'], secondary: ['erectors'] },
  'machine-back-extension': { primary: ['erectors'], secondary: ['glutes'] },

  // Shoulders
  'barbell-overhead-press': { primary: ['front delts'], secondary: ['side delts', 'triceps', 'upper chest', 'abs'] },
  'seated-dumbbell-shoulder-press': { primary: ['front delts', 'side delts'], secondary: ['triceps'] },
  'machine-shoulder-press': { primary: ['front delts', 'side delts'], secondary: ['triceps'] },
  'arnold-press': { primary: ['front delts', 'side delts'], secondary: ['triceps'] },
  'dumbbell-lateral-raise': { primary: ['side delts'], secondary: ['traps'] },
  'cable-lateral-raise': { primary: ['side delts'], secondary: ['traps'] },
  'machine-lateral-raise': { primary: ['side delts'], secondary: ['traps'] },
  'rear-delt-fly-dumbbell': { primary: ['rear delts'], secondary: ['upper back', 'traps'] },
  'face-pull': { primary: ['rear delts'], secondary: ['upper back', 'traps'] },
  'front-raise-dumbbell': { primary: ['front delts'], secondary: ['upper chest'] },
  'reverse-pec-deck': { primary: ['rear delts'], secondary: ['upper back', 'traps'] },
  'cable-rear-delt-fly': { primary: ['rear delts'], secondary: ['upper back'] },
  'barbell-upright-row': { primary: ['side delts', 'traps'], secondary: ['biceps', 'front delts'] },
  'landmine-press': { primary: ['front delts'], secondary: ['upper chest', 'triceps', 'abs'] },
  'push-press': { primary: ['front delts'], secondary: ['side delts', 'triceps', 'quads'] },
  'cable-y-raise': { primary: ['side delts', 'traps'], secondary: ['rear delts'] },
  'cable-front-raise': { primary: ['front delts'], secondary: ['upper chest'] },
  'machine-rear-delt-row': { primary: ['rear delts', 'upper back'], secondary: ['biceps', 'traps'] },
  'cable-shoulder-press': { primary: ['front delts', 'side delts'], secondary: ['triceps'] },
  'lying-cable-lateral-raise': { primary: ['side delts'], secondary: [] },

  // Traps
  'barbell-shrug': { primary: ['traps'], secondary: ['forearm flexors'] },
  'dumbbell-shrug': { primary: ['traps'], secondary: ['forearm flexors'] },
  'cable-shrug': { primary: ['traps'], secondary: ['forearm flexors'] },
  'trap-bar-shrug': { primary: ['traps'], secondary: ['forearm flexors'] },
  'smith-machine-shrug': { primary: ['traps'], secondary: ['forearm flexors'] },
  'cable-upright-row': { primary: ['traps', 'side delts'], secondary: ['biceps'] },

  // Quads
  'back-squat': { primary: ['quads', 'glutes'], secondary: ['erectors', 'hamstrings', 'adductors', 'abs'] },
  'front-squat': { primary: ['quads'], secondary: ['glutes', 'abs', 'erectors'] },
  'leg-press': { primary: ['quads', 'glutes'], secondary: ['hamstrings', 'adductors'] },
  'hack-squat': { primary: ['quads'], secondary: ['glutes', 'adductors'] },
  'goblet-squat': { primary: ['quads', 'glutes'], secondary: ['abs', 'erectors'] },
  'walking-lunge-dumbbell': { primary: ['quads', 'glutes'], secondary: ['hamstrings', 'adductors', 'abs'] },
  'bulgarian-split-squat': { primary: ['quads', 'glutes'], secondary: ['hamstrings', 'adductors', 'abs'] },
  'step-up-dumbbell': { primary: ['quads', 'glutes'], secondary: ['hamstrings', 'calves'] },
  'leg-extension': { primary: ['quads'], secondary: ['hip flexors'] },
  'sissy-squat': { primary: ['quads'], secondary: ['hip flexors', 'abs'] },
  'pendulum-squat': { primary: ['quads'], secondary: ['glutes', 'adductors'] },
  'belt-squat': { primary: ['quads', 'glutes'], secondary: ['adductors', 'hamstrings'] },
  'smith-machine-squat': { primary: ['quads'], secondary: ['glutes', 'hamstrings'] },
  'zercher-squat': { primary: ['quads', 'glutes'], secondary: ['abs', 'erectors', 'upper back', 'biceps'] },
  'safety-bar-squat': { primary: ['quads', 'glutes'], secondary: ['erectors', 'upper back', 'abs'] },
  'box-squat': { primary: ['glutes', 'quads'], secondary: ['hamstrings', 'erectors'] },
  'reverse-lunge-dumbbell': { primary: ['quads', 'glutes'], secondary: ['hamstrings', 'abs'] },
  'single-leg-leg-press': { primary: ['quads', 'glutes'], secondary: ['hamstrings', 'adductors'] },
  'hip-adduction-machine': { primary: ['adductors'], secondary: [] },
  'cable-squat': { primary: ['quads', 'glutes'], secondary: ['abs'] },
  'smith-machine-lunge': { primary: ['quads', 'glutes'], secondary: ['hamstrings', 'adductors'] },
  'machine-squat': { primary: ['quads', 'glutes'], secondary: ['adductors'] },

  // Hamstrings
  'romanian-deadlift': { primary: ['hamstrings', 'glutes'], secondary: ['erectors', 'forearm flexors'] },
  'good-morning': { primary: ['hamstrings', 'erectors'], secondary: ['glutes'] },
  'single-leg-rdl-dumbbell': { primary: ['hamstrings', 'glutes'], secondary: ['erectors', 'abs'] },
  'glute-ham-raise': { primary: ['hamstrings'], secondary: ['glutes', 'erectors', 'calves'] },
  'seated-leg-curl': { primary: ['hamstrings'], secondary: ['calves'] },
  'lying-leg-curl': { primary: ['hamstrings'], secondary: ['calves'] },
  'nordic-ham-curl': { primary: ['hamstrings'], secondary: ['glutes', 'calves'] },
  'stiff-leg-deadlift': { primary: ['hamstrings', 'erectors'], secondary: ['glutes', 'forearm flexors'] },
  'dumbbell-rdl': { primary: ['hamstrings', 'glutes'], secondary: ['erectors', 'forearm flexors'] },
  'sliding-leg-curl': { primary: ['hamstrings', 'glutes'], secondary: ['abs'] },
  'cable-rdl': { primary: ['hamstrings', 'glutes'], secondary: ['erectors'] },
  'smith-machine-rdl': { primary: ['hamstrings', 'glutes'], secondary: ['erectors'] },
  'standing-leg-curl-machine': { primary: ['hamstrings'], secondary: ['calves'] },

  // Glutes
  'hip-thrust': { primary: ['glutes'], secondary: ['hamstrings', 'quads'] },
  'glute-bridge-dumbbell': { primary: ['glutes'], secondary: ['hamstrings', 'abs'] },
  'cable-kickback': { primary: ['glutes'], secondary: ['hamstrings'] },
  'hip-abduction-machine': { primary: ['glutes'], secondary: [] },
  'cable-pull-through': { primary: ['glutes', 'hamstrings'], secondary: ['erectors'] },
  'machine-hip-thrust': { primary: ['glutes'], secondary: ['hamstrings'] },
  'curtsy-lunge-dumbbell': { primary: ['glutes'], secondary: ['quads', 'adductors'] },
  'machine-glute-kickback': { primary: ['glutes'], secondary: ['hamstrings'] },
  'cable-hip-abduction': { primary: ['glutes'], secondary: [] },
  'smith-machine-hip-thrust': { primary: ['glutes'], secondary: ['hamstrings'] },

  // Calves
  'standing-calf-raise': { primary: ['calves'], secondary: [] },
  'seated-calf-raise': { primary: ['calves'], secondary: [] },
  'leg-press-calf-raise': { primary: ['calves'], secondary: [] },
  'donkey-calf-raise': { primary: ['calves'], secondary: ['hamstrings'] },
  'smith-machine-calf-raise': { primary: ['calves'], secondary: [] },
  'single-leg-calf-raise': { primary: ['calves'], secondary: [] },
  'tibialis-raise': { primary: ['tibialis'], secondary: [] },
  'cable-standing-calf-raise': { primary: ['calves'], secondary: [] },

  // Biceps
  'barbell-curl': { primary: ['biceps'], secondary: ['brachialis', 'forearm flexors'] },
  'dumbbell-curl': { primary: ['biceps'], secondary: ['brachialis', 'forearm flexors'] },
  'incline-dumbbell-curl': { primary: ['biceps'], secondary: ['brachialis'] },
  'hammer-curl': { primary: ['brachialis', 'biceps'], secondary: ['forearm extensors'] },
  'cable-curl': { primary: ['biceps'], secondary: ['brachialis', 'forearm flexors'] },
  'preacher-curl': { primary: ['biceps'], secondary: ['brachialis'] },
  'ez-bar-curl': { primary: ['biceps'], secondary: ['brachialis', 'forearm flexors'] },
  'concentration-curl': { primary: ['biceps'], secondary: ['brachialis'] },
  'spider-curl': { primary: ['biceps'], secondary: ['brachialis'] },
  'bayesian-cable-curl': { primary: ['biceps'], secondary: ['brachialis'] },
  'reverse-curl': { primary: ['brachialis', 'forearm extensors'], secondary: ['biceps'] },
  'cross-body-hammer-curl': { primary: ['brachialis'], secondary: ['biceps', 'forearm extensors'] },
  'machine-preacher-curl': { primary: ['biceps'], secondary: ['brachialis'] },
  'rope-hammer-curl': { primary: ['brachialis', 'biceps'], secondary: ['forearm extensors'] },
  'machine-bicep-curl': { primary: ['biceps'], secondary: ['brachialis'] },
  'high-cable-curl': { primary: ['biceps'], secondary: [] },
  'single-arm-cable-curl': { primary: ['biceps'], secondary: ['brachialis'] },

  // Triceps
  'close-grip-bench-press': { primary: ['triceps'], secondary: ['mid chest', 'front delts'] },
  'diamond-push-up': { primary: ['triceps'], secondary: ['mid chest', 'front delts', 'abs'] },
  'dips-triceps': { primary: ['triceps'], secondary: ['lower chest', 'front delts'] },
  'tricep-pushdown': { primary: ['triceps'], secondary: [] },
  'overhead-tricep-extension-dumbbell': { primary: ['triceps'], secondary: [] },
  'skull-crushers': { primary: ['triceps'], secondary: ['forearm flexors'] },
  'cable-overhead-extension': { primary: ['triceps'], secondary: [] },
  'rope-pushdown': { primary: ['triceps'], secondary: [] },
  'single-arm-cable-tricep-extension': { primary: ['triceps'], secondary: [] },
  'single-arm-overhead-cable-extension': { primary: ['triceps'], secondary: [] },
  'reverse-grip-pushdown': { primary: ['triceps'], secondary: ['forearm extensors'] },
  'jm-press': { primary: ['triceps'], secondary: ['mid chest', 'front delts'] },
  'dumbbell-kickback': { primary: ['triceps'], secondary: ['rear delts'] },
  'machine-tricep-extension': { primary: ['triceps'], secondary: [] },
  'bench-dip': { primary: ['triceps'], secondary: ['front delts', 'lower chest'] },
  'single-arm-cable-lateral': { primary: ['triceps'], secondary: ['rear delts'] },
  'cross-cable-tricep-extension': { primary: ['triceps'], secondary: [] },
  'smith-close-grip-bench': { primary: ['triceps'], secondary: ['mid chest', 'front delts'] },

  // Core
  'hanging-leg-raise': { primary: ['abs', 'hip flexors'], secondary: ['obliques', 'forearm flexors'] },
  'cable-crunch': { primary: ['abs'], secondary: ['obliques'] },
  'ab-wheel-rollout': { primary: ['abs'], secondary: ['obliques', 'lats', 'hip flexors'] },
  'russian-twist-dumbbell': { primary: ['obliques'], secondary: ['abs'] },
  'weighted-sit-up': { primary: ['abs'], secondary: ['hip flexors'] },
  'machine-crunch': { primary: ['abs'], secondary: [] },
  'decline-sit-up': { primary: ['abs'], secondary: ['hip flexors'] },
  'pallof-press': { primary: ['obliques'], secondary: ['abs'] },
  'cable-woodchopper': { primary: ['obliques'], secondary: ['abs'] },
  'weighted-plank': { primary: ['abs'], secondary: ['obliques', 'erectors'] },
  'copenhagen-plank': { primary: ['adductors', 'obliques'], secondary: ['abs'] },
  'dragon-flag': { primary: ['abs'], secondary: ['obliques', 'lats', 'hip flexors'] },
  'v-up': { primary: ['abs', 'hip flexors'], secondary: ['obliques'] },
  'rotary-torso-machine': { primary: ['obliques'], secondary: ['abs'] },
  'cable-side-bend': { primary: ['obliques'], secondary: [] },
  'cable-crunch-standing': { primary: ['abs'], secondary: ['obliques'] },

  // Forearms
  'barbell-wrist-curl': { primary: ['forearm flexors'], secondary: [] },
  'barbell-reverse-wrist-curl': { primary: ['forearm extensors'], secondary: [] },
  'dumbbell-wrist-curl': { primary: ['forearm flexors'], secondary: [] },
  'farmers-carry': { primary: ['forearm flexors'], secondary: ['traps', 'abs', 'erectors'] },
  'wrist-roller': { primary: ['forearm flexors', 'forearm extensors'], secondary: [] },
  'plate-pinch': { primary: ['forearm flexors'], secondary: [] },
  'dead-hang': { primary: ['forearm flexors'], secondary: ['lats'] },
  'behind-back-cable-wrist-curl': { primary: ['forearm flexors'], secondary: [] },
  'gripper-machine': { primary: ['forearm flexors'], secondary: [] },
}

export function getMuscleTarget(exerciseId: string): MuscleTarget | undefined {
  return MUSCLE_DETAIL[exerciseId]
}
