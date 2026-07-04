// Matches our exercise list against the public-domain free-exercise-db
// dataset and emits src/data/exerciseImages.ts (id -> image URL).
// Run: node scripts/match-images.mjs
import { readFileSync, writeFileSync } from 'node:fs'

const DATASET_URL =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json'
const IMAGE_BASE =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/'

function normalize(name) {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\b(with|the|and|of|for)\b/g, ' ')
    .replace(/\bdumbbells\b/g, 'dumbbell')
    .replace(/\bbarbells\b/g, 'barbell')
    .replace(/\bd ring\b|\bstrap\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Manual aliases: our id -> dataset exercise name (as it appears in the db).
const ALIASES = {
  'barbell-bench-press': 'Barbell Bench Press - Medium Grip',
  'dumbbell-bench-press': 'Dumbbell Bench Press',
  'incline-dumbbell-press': 'Incline Dumbbell Press',
  'machine-chest-press': 'Machine Bench Press',
  'push-up-weighted': 'Pushups',
  'cable-fly': 'Flat Bench Cable Flyes',
  'dumbbell-fly': 'Dumbbell Flyes',
  'cable-crossover': 'Cable Crossover',
  'conventional-deadlift': 'Barbell Deadlift',
  'barbell-row': 'Bent Over Barbell Row',
  't-bar-row': 'Lying T-Bar Row',
  'lat-pulldown': 'Wide-Grip Lat Pulldown',
  'pull-up': 'Pullups',
  'chin-up': 'Chin-Up',
  'inverted-row': 'Inverted Row',
  'seated-cable-row': 'Seated Cable Rows',
  'single-arm-dumbbell-row': 'One-Arm Dumbbell Row',
  'straight-arm-pulldown': 'Straight-Arm Pulldown',
  'barbell-overhead-press': 'Standing Military Press',
  'seated-dumbbell-shoulder-press': 'Seated Dumbbell Press',
  'machine-shoulder-press': 'Machine Shoulder (Military) Press',
  'arnold-press': 'Arnold Dumbbell Press',
  'dumbbell-lateral-raise': 'Side Lateral Raise',
  'rear-delt-fly-dumbbell': 'Seated Bent-Over Rear Delt Raise',
  'face-pull': 'Face Pull',
  'front-raise-dumbbell': 'Front Dumbbell Raise',
  'barbell-shrug': 'Barbell Shrug',
  'dumbbell-shrug': 'Dumbbell Shrug',
  'back-squat': 'Barbell Squat',
  'front-squat': 'Front Barbell Squat',
  'leg-press': 'Leg Press',
  'goblet-squat': 'Goblet Squat',
  'bulgarian-split-squat': 'One Leg Barbell Squat',
  'step-up-dumbbell': 'Dumbbell Step Ups',
  'leg-extension': 'Leg Extensions',
  'romanian-deadlift': 'Romanian Deadlift',
  'good-morning': 'Good Morning',
  'glute-ham-raise': 'Glute Ham Raise',
  'seated-leg-curl': 'Seated Leg Curl',
  'lying-leg-curl': 'Lying Leg Curls',
  'nordic-ham-curl': 'Natural Glute Ham Raise',
  'hip-thrust': 'Barbell Hip Thrust',
  'cable-kickback': 'Glute Kickback',
  'cable-pull-through': 'Pull Through',
  'standing-calf-raise': 'Standing Calf Raises',
  'seated-calf-raise': 'Seated Calf Raise',
  'leg-press-calf-raise': 'Calf Press On The Leg Press Machine',
  'donkey-calf-raise': 'Donkey Calf Raises',
  'barbell-curl': 'Barbell Curl',
  'dumbbell-curl': 'Dumbbell Bicep Curl',
  'incline-dumbbell-curl': 'Incline Dumbbell Curl',
  'hammer-curl': 'Hammer Curls',
  'preacher-curl': 'Preacher Curl',
  'close-grip-bench-press': 'Close-Grip Barbell Bench Press',
  'diamond-push-up': 'Push-Ups - Close Triceps Position',
  'dips-triceps': 'Dips - Triceps Version',
  'tricep-pushdown': 'Triceps Pushdown',
  'overhead-tricep-extension-dumbbell': 'Standing Dumbbell Triceps Extension',
  'skull-crushers': 'EZ-Bar Skullcrusher',
  'cable-overhead-extension': 'Cable Rope Overhead Triceps Extension',
  'hanging-leg-raise': 'Hanging Leg Raise',
  'cable-crunch': 'Cable Crunch',
  'ab-wheel-rollout': 'Ab Roller',
  'russian-twist-dumbbell': 'Russian Twist',
  'weighted-sit-up': 'Weighted Sit-Ups - With Bands',
  'decline-sit-up': 'Decline Crunch',
  'barbell-reverse-wrist-curl': 'Seated Palms-Down Barbell Wrist Curl',
  'farmers-carry': "Farmer's Walk",
  'pec-deck': 'Butterfly',
  'chest-dip': 'Dips - Chest Version',
  'smith-machine-bench-press': 'Smith Machine Bench Press',
  'smith-machine-incline-press': 'Smith Machine Incline Bench Press',
  'low-to-high-cable-fly': 'Low Cable Crossover',
  'high-to-low-cable-fly': 'Cable Crossover',
  'floor-press': 'Floor Press',
  'rack-pull': 'Rack Pulls',
  'sumo-deadlift': 'Sumo Deadlift',
  'trap-bar-deadlift': 'Trap Bar Deadlift',
  'snatch-grip-deadlift': 'Snatch Deadlift',
  'deficit-deadlift': 'Deficit Deadlift',
  'seal-row': 'Lying Cambered Barbell Row',
  'machine-row': 'Leverage Iso Row',
  'machine-high-row': 'Leverage High Row',
  'neutral-grip-lat-pulldown': 'V-Bar Pulldown',
  'single-arm-lat-pulldown': 'One Arm Lat Pulldown',
  'dumbbell-pullover': 'Straight-Arm Dumbbell Pullover',
  'back-extension': 'Hyperextensions (Back Extensions)',
  'reverse-pec-deck': 'Reverse Machine Flyes',
  'cable-rear-delt-fly': 'Cable Rear Delt Fly',
  'barbell-upright-row': 'Upright Barbell Row',
  'landmine-press': 'Landmine 180’s',
  'push-press': 'Push Press',
  'trap-bar-shrug': 'Trap Bar Shrug',
  'belt-squat': 'Leverage Squat',
  'smith-machine-squat': 'Smith Machine Squat',
  'zercher-squat': 'Zercher Squats',
  'box-squat': 'Box Squat',
  'reverse-lunge-dumbbell': 'Dumbbell Rear Lunge',
  'single-leg-leg-press': 'Single Leg Press',
  'hip-adduction-machine': 'Thigh Adductor',
  'hip-abduction-machine': 'Thigh Abductor',
  'stiff-leg-deadlift': 'Stiff-Legged Barbell Deadlift',
  'dumbbell-rdl': 'Stiff-Legged Dumbbell Deadlift',
  'smith-machine-calf-raise': 'Smith Machine Calf Raise',
  'single-leg-calf-raise': 'Standing Dumbbell Calf Raise',
  'ez-bar-curl': 'EZ-Bar Curl',
  'concentration-curl': 'Concentration Curls',
  'spider-curl': 'Spider Curl',
  'reverse-curl': 'Reverse Barbell Curl',
  'cross-body-hammer-curl': 'Cross Body Hammer Curl',
  'machine-preacher-curl': 'Machine Preacher Curls',
  'rope-hammer-curl': 'Cable Hammer Curls - Rope Attachment',
  'machine-bicep-curl': 'Machine Bicep Curl',
  'high-cable-curl': 'Overhead Cable Curl',
  'single-arm-cable-curl': 'Standing One-Arm Cable Curl',
  'rope-pushdown': 'Triceps Pushdown - Rope Attachment',
  'single-arm-cable-tricep-extension': 'Triceps Pushdown - Rope Attachment',
  'single-arm-overhead-cable-extension': 'Cable One Arm Tricep Extension',
  'reverse-grip-pushdown': 'Reverse Grip Triceps Pushdown',
  'jm-press': 'JM Press',
  'dumbbell-kickback': 'Tricep Dumbbell Kickback',
  'bench-dip': 'Bench Dips',
  'pallof-press': 'Pallof Press',
  'cable-woodchopper': 'Standing Cable Wood Chop',
  'weighted-plank': 'Plank',
  'v-up': 'Jackknife Sit-Up',
  'wrist-roller': 'Wrist Roller',
  'plate-pinch': 'Plate Pinch',
  'dead-hang': 'Dead Hang',
  'machine-fly': 'Butterfly',
  'wide-grip-seated-row': 'Seated Cable Rows',
  'smith-machine-row': 'Bent Over Barbell Row',
  'cable-front-raise': 'Front Cable Raise',
  'cable-shoulder-press': 'Standing Cable Shoulder Press',
  'smith-machine-lunge': 'Smith Machine Squat',
  'cable-rdl': 'Pull Through',
  'standing-leg-curl-machine': 'Standing Leg Curl',
  'cable-hip-abduction': 'Cable Hip Adduction',
  'smith-machine-hip-thrust': 'Barbell Hip Thrust',
  'cable-standing-calf-raise': 'Standing Calf Raises',
  'cross-cable-tricep-extension': 'Cable Lying Triceps Extension',
  'smith-close-grip-bench': 'Smith Machine Close-Grip Bench Press',
  'cable-side-bend': 'Cable Judo Flip',
  'machine-back-extension': 'Hyperextensions (Back Extensions)',
  'machine-crunch': 'Ab Crunch Machine',
  'machine-lateral-raise': 'Machine Lateral Raise',
  'cable-curl': 'Standing Biceps Cable Curl',
  'cable-shrug': 'Cable Shrugs',
  'hack-squat': 'Hack Squat',
  'sissy-squat': 'Sissy Squat',
  'meadows-row': 'One-Arm Long Bar Row',
  'pendlay-row': 'Bent Over Barbell Row',
  'chest-supported-dumbbell-row': 'Dumbbell Incline Row',
  'glute-bridge-dumbbell': 'Barbell Glute Bridge',
  'machine-glute-kickback': 'Glute Kickback',
  'dumbbell-wrist-curl': 'Seated One-Arm Dumbbell Palms-Up Wrist Curl',
  'incline-machine-press': 'Leverage Incline Chest Press',
  'seated-dip-machine': 'Machine Triceps Extension',
  'machine-pullover': 'Straight-Arm Dumbbell Pullover',
  'cable-pullover': 'Straight-Arm Pulldown',
  'machine-rear-delt-row': 'Leverage High Row',
  'machine-tricep-extension': 'Machine Triceps Extension',
  'rotary-torso-machine': 'Torso Rotation',
  'gripper-machine': 'Plate Pinch',
  'incline-barbell-bench-press': 'Barbell Incline Bench Press Medium-Grip',
  'walking-lunge-dumbbell': 'Barbell Walking Lunge',
  'smith-machine-shrug': 'Barbell Shrug',
  'machine-hip-thrust': 'Barbell Hip Thrust',
  'curtsy-lunge-dumbbell': 'Crossover Reverse Lunge',
  'assisted-pull-up-machine': 'Band Assisted Pull-Up',
  'cable-deadlift': 'Pull Through',
  'cable-upright-row': 'Upright Cable Row',
  'cable-squat': 'Goblet Squat',
  'machine-squat': 'Hack Squat',
  'single-arm-cable-lateral': 'Tricep Dumbbell Kickback',
  'cable-crunch-standing': 'Cable Crunch',
  'cable-lateral-raise': 'Cable Seated Lateral Raise',
  'lying-cable-lateral-raise': 'Cable Seated Lateral Raise',
  'barbell-wrist-curl': 'Palms-Up Barbell Wrist Curl Over A Bench',
  'single-leg-rdl-dumbbell': 'Stiff-Legged Dumbbell Deadlift',
  'smith-machine-rdl': 'Smith Machine Stiff-Legged Deadlift',
  'single-arm-cable-row': 'Seated One-arm Cable Pulley Rows',
  // V7 exact-name injection
  'x-preacher-curl-machine': 'Machine Preacher Curls',
  'x-machine-seated-tricep-dip': 'Machine Triceps Extension',
  'x-calf-press-on-leg-press': 'Calf Press On The Leg Press Machine',
  'x-machine-incline-chest-press': 'Leverage Incline Chest Press',
  'x-machine-seated-row': 'Leverage Iso Row',
  'x-smith-machine-stiff-leg-deadlift': 'Smith Machine Stiff-Legged Deadlift',
  'x-machine-leg-extension': 'Leg Extensions',
  'x-machine-ab-crunch': 'Ab Crunch Machine',
  'x-cable-lat-pulldown-wide-grip': 'Wide-Grip Lat Pulldown',
  'x-hack-squat': 'Hack Squat',
  'x-machine-back-extension': 'Hyperextensions (Back Extensions)',
  'x-machine-leg-press': 'Leg Press',
  'x-cable-reverse-fly': 'Cable Rear Delt Fly',
  'x-machine-hip-adduction': 'Thigh Adductor',
  'x-cable-one-arm-tricep-pushdown': 'Reverse Grip Triceps Pushdown',
  'x-cable-one-arm-tricep-extension': 'Cable One Arm Tricep Extension',
  'x-cable-bayesian-curl': 'Standing One-Arm Cable Curl',
  'x-cable-lateral-raise': 'Cable Lateral Raise',
  'x-machine-lat-pulldown': 'Wide-Grip Lat Pulldown',
  'x-machine-seated-leg-curl': 'Seated Leg Curl',
  'x-machine-calf-press': 'Calf Press On The Leg Press Machine',
  'x-machine-deltoid-raise': 'Machine Lateral Raise',
  'x-machine-seated-calf-raise': 'Seated Calf Raise',
  'x-machine-calf-raise': 'Standing Calf Raises',
  'x-machine-fly': 'Butterfly',
  'x-machine-bench-press': 'Machine Bench Press',
  'x-cable-pullover-supine': 'Straight-Arm Pulldown',
  'x-cable-tricep-pushdown-v-bar': 'Triceps Pushdown',
  'x-cable-rope-overhead-tricep-extension': 'Cable Rope Overhead Triceps Extension',
  'x-cable-bicep-curl': 'Standing Biceps Cable Curl',
  'x-machine-lateral-shoulder-raise': 'Machine Lateral Raise',
  'x-cable-kneeling-crunch-rope': 'Cable Crunch',
  'x-dumbbell-alternating-bicep-curl': 'Dumbbell Bicep Curl',
  'x-smith-machine-deadlift': 'Barbell Deadlift',
  'x-t-bar-row': 'Lying T-Bar Row',
  'x-cable-seated-row': 'Seated Cable Rows',
  // V5 additions
  'larsen-press': 'Barbell Bench Press - Medium Grip',
  'spoto-press': 'Barbell Bench Press - Medium Grip',
  'converging-chest-press': 'Machine Bench Press',
  'decline-machine-press': 'Smith Machine Decline Press',
  'deficit-push-up': 'Pushups',
  'kroc-row': 'One-Arm Dumbbell Row',
  'helms-row': 'Dumbbell Incline Row',
  'close-grip-lat-pulldown': 'V-Bar Pulldown',
  'powell-raise': 'Side Lying One Arm Lateral Raise',
  'cable-external-rotation': 'Cable External Rotation',
  'snatch-grip-high-pull': 'Clean Pull',
  'paused-back-squat': 'Barbell Squat',
  'pin-squat': 'Box Squat',
  'front-foot-elevated-split-squat': 'One Leg Barbell Squat',
  'walking-barbell-lunge': 'Barbell Walking Lunge',
  'unilateral-leg-extension': 'Leg Extensions',
  'b-stance-hip-thrust': 'Barbell Hip Thrust',
  'reverse-hyperextension': 'Hyperextensions (Back Extensions)',
  'hack-squat-calf-raise': 'Calf Press On The Leg Press Machine',
  'incline-cable-curl': 'Incline Dumbbell Curl',
  'drag-curl': 'Drag Curl',
  'waiter-curl': 'Dumbbell Bicep Curl',
  'zottman-curl': 'Zottman Curl',
  'tate-press': 'Tate Press',
  'rolling-tricep-extension': 'Lying Triceps Press',
  'katana-extension': 'Cable Rope Overhead Triceps Extension',
}

const res = await fetch(DATASET_URL)
if (!res.ok) throw new Error(`fetch failed: ${res.status}`)
const dataset = await res.json()
console.log('dataset size:', dataset.length)

const byNorm = new Map()
for (const ex of dataset) {
  byNorm.set(normalize(ex.name), ex)
}
const byExact = new Map(dataset.map((ex) => [ex.name, ex]))

const ours =
  readFileSync('src/data/exercises.ts', 'utf8') +
  readFileSync('src/data/exercisesExtra.ts', 'utf8') +
  readFileSync('src/data/exercisesExact.ts', 'utf8')
const entries = [...ours.matchAll(/id: '([a-z0-9-]+)', name: (?:'((?:[^'\\]|\\')*)'|"([^"]*)")/g)].map(
  (m) => ({
    id: m[1],
    name: (m[2] ?? m[3]).replace(/\\'/g, "'"),
  })
)
console.log('our exercises:', entries.length)

const mapping = {}
const unmatched = []
for (const { id, name } of entries) {
  let hit = null
  if (ALIASES[id]) {
    hit = byExact.get(ALIASES[id]) ?? byNorm.get(normalize(ALIASES[id]))
  }
  if (!hit) hit = byNorm.get(normalize(name))
  if (hit && hit.images && hit.images.length > 0) {
    mapping[id] = IMAGE_BASE + hit.images[0]
  } else {
    unmatched.push(`${id} (${name})`)
  }
}

console.log('matched:', Object.keys(mapping).length)
console.log('unmatched:', unmatched.length)
for (const u of unmatched) {
  const name = u.match(/\((.*)\)$/)?.[1] ?? u
  const tokens = normalize(name)
    .split(' ')
    .filter((t) => !['cable', 'machine', 'dumbbell', 'barbell', 'smith', 'single', 'arm', 'leg', 'standing', 'seated', 'lying'].includes(t))
  const candidates = dataset
    .filter((ex) => tokens.some((t) => normalize(ex.name).includes(t)))
    .slice(0, 4)
    .map((ex) => ex.name)
  console.log('  -', u, '=>', candidates.join(' | '))
}

const out = `// Generated by scripts/match-images.mjs — do not edit by hand.
// Images are public domain, from https://github.com/yuhonas/free-exercise-db
export const EXERCISE_IMAGES: Record<string, string> = ${JSON.stringify(mapping, null, 2)}
`
writeFileSync('src/data/exerciseImages.ts', out)
console.log('wrote src/data/exerciseImages.ts')
