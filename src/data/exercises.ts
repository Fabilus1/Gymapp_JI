import type { Exercise } from '../types'

// ~85 exercises across a full commercial-gym equipment set.
// Weight increments follow the spec's double-progression rule of thumb:
//   +10 lb — big barbell compounds for legs/back (squat, deadlift, row, hip thrust)
//   +5 lb  — other compounds (bench, OHP, dumbbell work)
//   +2.5 lb — isolation exercises
export const EXERCISES: Exercise[] = [
  // Chest
  { id: 'barbell-bench-press', name: 'Barbell Bench Press', muscle: 'chest', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 5, cue: 'Shoulder blades pinched and down, slight arch, bar to lower chest, elbows ~45° from torso.' },
  { id: 'incline-barbell-bench-press', name: 'Incline Barbell Bench Press', muscle: 'chest', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 5, cue: "Bench around 30°, bar path to upper chest, keep elbows under wrists, don't let shoulders round forward." },
  { id: 'decline-barbell-bench-press', name: 'Decline Barbell Bench Press', muscle: 'chest', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 5, cue: 'Bar to lower chest, shorter range than flat bench, keep shoulder blades set.' },
  { id: 'dumbbell-bench-press', name: 'Dumbbell Bench Press', muscle: 'chest', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: "Press dumbbells up and slightly in, control the stretch at the bottom, don't flare elbows to 90°." },
  { id: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', muscle: 'chest', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: 'Bench around 30°, press up and in, avoid letting the dumbbells drift behind your shoulders.' },
  { id: 'machine-chest-press', name: 'Machine Chest Press', muscle: 'chest', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: 'Set seat so handles align with mid-chest, press through without shrugging shoulders up.' },
  { id: 'push-up-weighted', name: 'Push-Up (Weighted)', muscle: 'chest', type: 'compound', equipment: 'bodyweight', repRange: [6, 10], increment: 5, cue: 'Hands under shoulders, body in a straight line, add weight via a plate or vest once bodyweight is easy.' },
  { id: 'cable-fly', name: 'Cable Fly', muscle: 'chest', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Slight bend in elbows, hinge forward, bring hands together in front of chest, control the stretch back.' },
  { id: 'dumbbell-fly', name: 'Dumbbell Fly', muscle: 'chest', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: "Soft elbow bend held constant, lower until you feel a stretch across the chest, don't drop too deep." },
  { id: 'cable-crossover', name: 'Cable Crossover', muscle: 'chest', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Stand centered between towers, cross hands at the finish, squeeze the chest rather than the shoulders.' },

  // Back
  { id: 'conventional-deadlift', name: 'Conventional Deadlift', muscle: 'back', type: 'compound', equipment: 'barbell', repRange: [5, 8], increment: 10, cue: 'Bar over mid-foot, shins to the bar, flat back. Push the floor away rather than pulling with your back.' },
  { id: 'barbell-row', name: 'Barbell Row', muscle: 'back', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 10, cue: 'Hinge to ~45°, flat back, pull to lower ribs, avoid using momentum from the legs.' },
  { id: 'pendlay-row', name: 'Pendlay Row', muscle: 'back', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 10, cue: 'Start each rep from a dead stop on the floor, torso near parallel, pull explosively to the lower ribs.' },
  { id: 't-bar-row', name: 'T-Bar Row', muscle: 'back', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 10, cue: 'Chest against the pad or hinge flat-backed, pull the handles to your sternum, squeeze at the top.' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', muscle: 'back', type: 'compound', equipment: 'cable', repRange: [6, 10], increment: 5, cue: 'Lead with the elbows, pull to upper chest, avoid leaning back excessively.' },
  { id: 'pull-up', name: 'Pull-Up', muscle: 'back', type: 'compound', equipment: 'bodyweight', repRange: [6, 10], increment: 5, cue: 'Full hang at the bottom, drive elbows down and back, chin clears the bar without kipping.' },
  { id: 'chin-up', name: 'Chin-Up', muscle: 'back', type: 'compound', equipment: 'bodyweight', repRange: [6, 10], increment: 5, cue: 'Underhand grip, full hang to chin over the bar, keep the ribcage down rather than swinging up.' },
  { id: 'inverted-row', name: 'Inverted Row', muscle: 'back', type: 'compound', equipment: 'bodyweight', repRange: [6, 10], increment: 5, cue: 'Body straight under a bar, pull chest to the bar, adjust difficulty with foot position.' },
  { id: 'seated-cable-row', name: 'Seated Cable Row', muscle: 'back', type: 'compound', equipment: 'cable', repRange: [6, 10], increment: 5, cue: 'Sit tall, pull to the stomach, squeeze shoulder blades together, avoid rounding forward on the return.' },
  { id: 'chest-supported-dumbbell-row', name: 'Chest-Supported Dumbbell Row', muscle: 'back', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: 'Chest pinned to an incline bench, pull dumbbells to your hips, no body English.' },
  { id: 'single-arm-dumbbell-row', name: 'Single-Arm Dumbbell Row', muscle: 'back', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: 'Flat back, brace on a bench, pull the elbow up and back rather than rotating the torso.' },
  { id: 'straight-arm-pulldown', name: 'Straight-Arm Pulldown', muscle: 'back', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Arms stay straight, push the bar down and back in an arc, feel it in the lats not the triceps.' },

  // Shoulders
  { id: 'barbell-overhead-press', name: 'Barbell Overhead Press', muscle: 'shoulders', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 5, cue: 'Brace core, bar starts at collarbone, press straight up, move head back then through at the top.' },
  { id: 'seated-dumbbell-shoulder-press', name: 'Seated Dumbbell Shoulder Press', muscle: 'shoulders', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: 'Back supported, press dumbbells up and slightly in, avoid flaring elbows past shoulder height on the way down.' },
  { id: 'machine-shoulder-press', name: 'Machine Shoulder Press', muscle: 'shoulders', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: 'Set seat so handles start at shoulder height, press up without shrugging.' },
  { id: 'arnold-press', name: 'Arnold Press', muscle: 'shoulders', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: 'Start palms facing you, rotate to face forward as you press, control the rotation on the way down.' },
  { id: 'dumbbell-lateral-raise', name: 'Dumbbell Lateral Raise', muscle: 'shoulders', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: 'Slight bend in elbow, lead with the elbow not the hand, stop around shoulder height.' },
  { id: 'cable-lateral-raise', name: 'Cable Lateral Raise', muscle: 'shoulders', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Cable behind you at the ankle, raise out to the side, keep tension on through the bottom of the rep.' },
  { id: 'machine-lateral-raise', name: 'Machine Lateral Raise', muscle: 'shoulders', type: 'isolation', equipment: 'machine', repRange: [10, 15], increment: 2.5, cue: "Set pads at the upper arm, raise with control, don't let the weight stack slam down." },
  { id: 'rear-delt-fly-dumbbell', name: 'Rear Delt Fly (Dumbbell)', muscle: 'shoulders', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: 'Hinge forward, slight elbow bend, raise dumbbells out to the sides, squeeze the rear delts not the traps.' },
  { id: 'face-pull', name: 'Face Pull', muscle: 'shoulders', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Pull to eye level, lead with the elbows high, externally rotate at the finish.' },
  { id: 'front-raise-dumbbell', name: 'Front Raise (Dumbbell)', muscle: 'shoulders', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: 'Raise one or both dumbbells to shoulder height, avoid swinging or using the hips for momentum.' },

  // Traps
  { id: 'barbell-shrug', name: 'Barbell Shrug', muscle: 'traps', type: 'isolation', equipment: 'barbell', repRange: [10, 15], increment: 2.5, cue: 'Straight arms, shrug straight up toward your ears, avoid rolling the shoulders.' },
  { id: 'dumbbell-shrug', name: 'Dumbbell Shrug', muscle: 'traps', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: 'Same pattern as the barbell version with a longer range of motion at the bottom.' },
  { id: 'cable-shrug', name: 'Cable Shrug', muscle: 'traps', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Constant tension version of the shrug, pause briefly at the top of each rep.' },

  // Quads
  { id: 'back-squat', name: 'Back Squat', muscle: 'quads', type: 'compound', equipment: 'barbell', repRange: [5, 8], increment: 10, cue: 'Brace before you unrack. Sit back and down, knees tracking over toes, chest up. Drive through mid-foot.' },
  { id: 'front-squat', name: 'Front Squat', muscle: 'quads', type: 'compound', equipment: 'barbell', repRange: [5, 8], increment: 10, cue: 'Bar rests on the front delts, elbows high, stay more upright than a back squat, brace hard.' },
  { id: 'leg-press', name: 'Leg Press', muscle: 'quads', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: "Feet shoulder-width, don't let knees cave in, avoid locking out hard at the top." },
  { id: 'hack-squat', name: 'Hack Squat', muscle: 'quads', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: 'Feet mid-platform, lower under control, drive through the whole foot without letting knees collapse in.' },
  { id: 'goblet-squat', name: 'Goblet Squat', muscle: 'quads', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: 'Hold a dumbbell at your chest, squat between your knees, stay tall through the torso.' },
  { id: 'walking-lunge-dumbbell', name: 'Walking Lunge (Dumbbell)', muscle: 'quads', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: 'Step out, drop the back knee toward the floor, drive through the front heel to the next step.' },
  { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', muscle: 'quads', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: 'Rear foot elevated, most of the weight in the front foot, drop straight down and drive back up.' },
  { id: 'step-up-dumbbell', name: 'Step-Up (Dumbbell)', muscle: 'quads', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: 'Drive through the lead foot on the box, avoid pushing off the trailing leg.' },
  { id: 'leg-extension', name: 'Leg Extension', muscle: 'quads', type: 'isolation', equipment: 'machine', repRange: [10, 15], increment: 2.5, cue: 'Adjust the pad to the shin, extend fully, pause briefly at the top, control the negative.' },
  { id: 'sissy-squat', name: 'Sissy Squat', muscle: 'quads', type: 'isolation', equipment: 'bodyweight', repRange: [10, 15], increment: 2.5, cue: 'Rise onto the toes, lean back from the knees keeping hips extended, feel it in the front of the thigh.' },

  // Hamstrings
  { id: 'romanian-deadlift', name: 'Romanian Deadlift', muscle: 'hamstrings', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 10, cue: 'Soft knees, push hips back, bar stays close to legs, stop when hamstrings are fully loaded.' },
  { id: 'good-morning', name: 'Good Morning', muscle: 'hamstrings', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 10, cue: 'Bar on the back, soft knees, hinge at the hips keeping a flat back, stop when you feel a stretch.' },
  { id: 'single-leg-rdl-dumbbell', name: 'Single-Leg RDL (Dumbbell)', muscle: 'hamstrings', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: 'Hinge on one leg, trailing leg extends back for balance, keep hips square to the floor.' },
  { id: 'glute-ham-raise', name: 'Glute Ham Raise', muscle: 'hamstrings', type: 'compound', equipment: 'bodyweight', repRange: [6, 10], increment: 5, cue: 'Lower under control from the knees, drive back up leading with the hamstrings not the hips.' },
  { id: 'seated-leg-curl', name: 'Seated Leg Curl', muscle: 'hamstrings', type: 'isolation', equipment: 'machine', repRange: [10, 15], increment: 2.5, cue: 'Adjust the pad above the heel, curl through a full range, control the return.' },
  { id: 'lying-leg-curl', name: 'Lying Leg Curl', muscle: 'hamstrings', type: 'isolation', equipment: 'machine', repRange: [10, 15], increment: 2.5, cue: 'Hips pressed into the pad, curl heels to glutes, avoid hips popping up off the bench.' },
  { id: 'nordic-ham-curl', name: 'Nordic Ham Curl', muscle: 'hamstrings', type: 'isolation', equipment: 'bodyweight', repRange: [10, 15], increment: 2.5, cue: 'Anchor the ankles, lower yourself forward as slowly as possible, catch yourself with your hands at the bottom.' },

  // Glutes
  { id: 'hip-thrust', name: 'Hip Thrust', muscle: 'glutes', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 10, cue: 'Upper back on a bench, bar over hips, drive through the heels, squeeze glutes hard at the top.' },
  { id: 'glute-bridge-dumbbell', name: 'Glute Bridge (Dumbbell)', muscle: 'glutes', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: 'Dumbbell across the hips, drive through the heels, pause at the top of each rep.' },
  { id: 'cable-kickback', name: 'Cable Kickback', muscle: 'glutes', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Cuff on the ankle, kick straight back, squeeze the glute rather than arching the lower back.' },
  { id: 'hip-abduction-machine', name: 'Hip Abduction Machine', muscle: 'glutes', type: 'isolation', equipment: 'machine', repRange: [10, 15], increment: 2.5, cue: 'Sit tall, push the pads out with control, avoid rocking the torso for momentum.' },
  { id: 'cable-pull-through', name: 'Cable Pull-Through', muscle: 'glutes', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Hinge at the hips facing away from the stack, pull through by squeezing the glutes at the top.' },

  // Calves
  { id: 'standing-calf-raise', name: 'Standing Calf Raise', muscle: 'calves', type: 'isolation', equipment: 'machine', repRange: [12, 20], increment: 2.5, cue: 'Full stretch at the bottom, rise onto the toes as high as possible, pause at the top.' },
  { id: 'seated-calf-raise', name: 'Seated Calf Raise', muscle: 'calves', type: 'isolation', equipment: 'machine', repRange: [12, 20], increment: 2.5, cue: 'Targets the soleus more than standing versions, same full range, controlled tempo.' },
  { id: 'leg-press-calf-raise', name: 'Leg Press Calf Raise', muscle: 'calves', type: 'isolation', equipment: 'machine', repRange: [12, 20], increment: 2.5, cue: 'Balls of the feet on the platform edge, press through a full range without locking the knees.' },
  { id: 'donkey-calf-raise', name: 'Donkey Calf Raise', muscle: 'calves', type: 'isolation', equipment: 'machine', repRange: [12, 20], increment: 2.5, cue: 'Hinged forward position increases the stretch at the bottom, rise fully onto the toes.' },

  // Biceps
  { id: 'barbell-curl', name: 'Barbell Curl', muscle: 'biceps', type: 'isolation', equipment: 'barbell', repRange: [10, 15], increment: 2.5, cue: 'Elbows pinned to sides, avoid swinging, control the eccentric.' },
  { id: 'dumbbell-curl', name: 'Dumbbell Curl', muscle: 'biceps', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: 'Curl with a slight supination at the top, keep elbows still, alternate or go together.' },
  { id: 'incline-dumbbell-curl', name: 'Incline Dumbbell Curl', muscle: 'biceps', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: 'Seated on an incline bench, arms hang behind the torso for a longer stretch at the bottom.' },
  { id: 'hammer-curl', name: 'Hammer Curl', muscle: 'biceps', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: 'Neutral grip throughout, curl without letting the elbows drift forward.' },
  { id: 'cable-curl', name: 'Cable Curl', muscle: 'biceps', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Constant tension version of the curl, keep elbows fixed at your sides.' },
  { id: 'preacher-curl', name: 'Preacher Curl', muscle: 'biceps', type: 'isolation', equipment: 'barbell', repRange: [10, 15], increment: 2.5, cue: "Upper arms flat on the pad, control the full stretch at the bottom, don't bounce out of it." },

  // Triceps
  { id: 'close-grip-bench-press', name: 'Close-Grip Bench Press', muscle: 'triceps', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 5, cue: 'Hands just inside shoulder width, elbows track close to the torso, press through the triceps.' },
  { id: 'diamond-push-up', name: 'Diamond Push-Up', muscle: 'triceps', type: 'compound', equipment: 'bodyweight', repRange: [6, 10], increment: 5, cue: 'Hands together under the chest, lower with elbows close to the body, press back up.' },
  { id: 'dips-triceps', name: 'Dips (Triceps-Focused)', muscle: 'triceps', type: 'compound', equipment: 'bodyweight', repRange: [6, 10], increment: 5, cue: 'Torso upright to bias triceps, lower until a stretch in the shoulders, press back to lockout.' },
  { id: 'tricep-pushdown', name: 'Tricep Pushdown', muscle: 'triceps', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Elbows pinned at your sides, extend fully, control the return without letting the elbows flare.' },
  { id: 'overhead-tricep-extension-dumbbell', name: 'Overhead Tricep Extension (Dumbbell)', muscle: 'triceps', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: 'Elbows pointed forward and stationary, lower behind the head, extend fully without flaring.' },
  { id: 'skull-crushers', name: 'Skull Crushers', muscle: 'triceps', type: 'isolation', equipment: 'barbell', repRange: [10, 15], increment: 2.5, cue: 'Elbows stay fixed in place, lower the bar toward the forehead, extend back up under control.' },
  { id: 'cable-overhead-extension', name: 'Cable Overhead Extension', muscle: 'triceps', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Face away from the stack, extend overhead, keep elbows close to the head throughout.' },

  // Core
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', muscle: 'core', type: 'isolation', equipment: 'bodyweight', repRange: [12, 20], increment: 2.5, cue: 'Hang from the bar, raise legs by curling the pelvis, avoid swinging.' },
  { id: 'cable-crunch', name: 'Cable Crunch', muscle: 'core', type: 'isolation', equipment: 'cable', repRange: [12, 20], increment: 2.5, cue: 'Kneel below the stack, crunch down by flexing the spine, not by pulling with the arms.' },
  { id: 'ab-wheel-rollout', name: 'Ab Wheel Rollout', muscle: 'core', type: 'isolation', equipment: 'bodyweight', repRange: [12, 20], increment: 2.5, cue: 'Brace hard before rolling out, keep the hips from sagging, roll back within a range you control.' },
  { id: 'russian-twist-dumbbell', name: 'Russian Twist (Dumbbell)', muscle: 'core', type: 'isolation', equipment: 'dumbbell', repRange: [12, 20], increment: 2.5, cue: "Lean back to engage the core, rotate side to side under control, don't just swing the arms." },
  { id: 'weighted-sit-up', name: 'Weighted Sit-Up', muscle: 'core', type: 'isolation', equipment: 'bodyweight', repRange: [12, 20], increment: 2.5, cue: 'Hold a plate at your chest, sit up under control, avoid yanking with the neck.' },
  { id: 'machine-crunch', name: 'Machine Crunch', muscle: 'core', type: 'isolation', equipment: 'machine', repRange: [12, 20], increment: 2.5, cue: 'Set the pad at the upper chest, crunch by flexing the spine, control the return.' },
  { id: 'decline-sit-up', name: 'Decline Sit-Up', muscle: 'core', type: 'isolation', equipment: 'bodyweight', repRange: [12, 20], increment: 2.5, cue: 'On a decline bench, sit up under control, add a plate across the chest once bodyweight is easy.' },

  // Forearms
  { id: 'barbell-wrist-curl', name: 'Barbell Wrist Curl', muscle: 'forearms', type: 'isolation', equipment: 'barbell', repRange: [12, 20], increment: 2.5, cue: 'Forearms on your thighs or a bench, curl the wrists up through a full range.' },
  { id: 'barbell-reverse-wrist-curl', name: 'Barbell Reverse Wrist Curl', muscle: 'forearms', type: 'isolation', equipment: 'barbell', repRange: [12, 20], increment: 2.5, cue: "Same setup as the wrist curl with an overhand grip, small range, don't use momentum." },
  { id: 'dumbbell-wrist-curl', name: 'Dumbbell Wrist Curl', muscle: 'forearms', type: 'isolation', equipment: 'dumbbell', repRange: [12, 20], increment: 2.5, cue: 'Same pattern as the barbell version, train each side independently.' },
  { id: 'farmers-carry', name: "Farmer's Carry", muscle: 'forearms', type: 'isolation', equipment: 'dumbbell', repRange: [12, 20], increment: 5, cue: 'Heavy dumbbells at your sides, walk with a tall posture and a tight grip for distance or time.' },
]

export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id)
}
