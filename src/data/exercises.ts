import type { Exercise } from '../types'

// ~85 exercises across a full commercial-gym equipment set.
// Weight increments follow the spec's double-progression rule of thumb:
//   +10 lb — big barbell compounds for legs/back (squat, deadlift, row, hip thrust)
//   +5 lb  — other compounds (bench, OHP, dumbbell work)
//   +2.5 lb — isolation exercises
export const EXERCISES: Exercise[] = [
  // Chest
  { id: 'barbell-bench-press', name: 'Bench Press (Barbell)', muscle: 'chest', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 5, cue: 'Shoulder blades pinched and down, slight arch, bar to lower chest, elbows ~45° from torso.' },
  { id: 'incline-barbell-bench-press', name: 'Incline Bench Press (Barbell)', muscle: 'chest', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 5, cue: "Bench around 30°, bar path to upper chest, keep elbows under wrists, don't let shoulders round forward." },
  { id: 'decline-barbell-bench-press', name: 'Decline Bench Press (Barbell)', muscle: 'chest', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 5, cue: 'Bar to lower chest, shorter range than flat bench, keep shoulder blades set.' },
  { id: 'dumbbell-bench-press', name: 'Bench Press (Dumbbell)', muscle: 'chest', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: "Press dumbbells up and slightly in, control the stretch at the bottom, don't flare elbows to 90°." },
  { id: 'incline-dumbbell-press', name: 'Incline Press (Dumbbell)', muscle: 'chest', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: 'Bench around 30°, press up and in, avoid letting the dumbbells drift behind your shoulders.' },
  { id: 'machine-chest-press', name: 'Chest Press (Machine)', muscle: 'chest', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: 'Set seat so handles align with mid-chest, press through without shrugging shoulders up.' },
  { id: 'push-up-weighted', name: 'Push-Up, Weighted (Bodyweight)', muscle: 'chest', type: 'compound', equipment: 'bodyweight', repRange: [6, 10], increment: 5, cue: 'Hands under shoulders, body in a straight line, add weight via a plate or vest once bodyweight is easy.' },
  { id: 'cable-fly', name: 'Fly (Cable)', muscle: 'chest', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Slight bend in elbows, hinge forward, bring hands together in front of chest, control the stretch back.' },
  { id: 'dumbbell-fly', name: 'Fly (Dumbbell)', muscle: 'chest', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: "Soft elbow bend held constant, lower until you feel a stretch across the chest, don't drop too deep." },
  { id: 'cable-crossover', name: 'Crossover (Cable)', muscle: 'chest', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Stand centered between towers, cross hands at the finish, squeeze the chest rather than the shoulders.' },

  // Back
  { id: 'conventional-deadlift', name: 'Conventional Deadlift (Barbell)', muscle: 'back', type: 'compound', equipment: 'barbell', repRange: [5, 8], increment: 10, cue: 'Bar over mid-foot, shins to the bar, flat back. Push the floor away rather than pulling with your back.' },
  { id: 'barbell-row', name: 'Row (Barbell)', muscle: 'back', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 10, cue: 'Hinge to ~45°, flat back, pull to lower ribs, avoid using momentum from the legs.' },
  { id: 'pendlay-row', name: 'Pendlay Row (Barbell)', muscle: 'back', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 10, cue: 'Start each rep from a dead stop on the floor, torso near parallel, pull explosively to the lower ribs.' },
  { id: 't-bar-row', name: 'T-Bar Row (Barbell)', muscle: 'back', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 10, cue: 'Chest against the pad or hinge flat-backed, pull the handles to your sternum, squeeze at the top.' },
  { id: 'lat-pulldown', name: 'Lat Pulldown (Cable)', muscle: 'back', type: 'compound', equipment: 'cable', repRange: [6, 10], increment: 5, cue: 'Lead with the elbows, pull to upper chest, avoid leaning back excessively.' },
  { id: 'pull-up', name: 'Pull-Up (Bodyweight)', muscle: 'back', type: 'compound', equipment: 'bodyweight', repRange: [6, 10], increment: 5, cue: 'Full hang at the bottom, drive elbows down and back, chin clears the bar without kipping.' },
  { id: 'chin-up', name: 'Chin-Up (Bodyweight)', muscle: 'back', type: 'compound', equipment: 'bodyweight', repRange: [6, 10], increment: 5, cue: 'Underhand grip, full hang to chin over the bar, keep the ribcage down rather than swinging up.' },
  { id: 'inverted-row', name: 'Inverted Row (Bodyweight)', muscle: 'back', type: 'compound', equipment: 'bodyweight', repRange: [6, 10], increment: 5, cue: 'Body straight under a bar, pull chest to the bar, adjust difficulty with foot position.' },
  { id: 'seated-cable-row', name: 'Seated Row (Cable)', muscle: 'back', type: 'compound', equipment: 'cable', repRange: [6, 10], increment: 5, cue: 'Sit tall, pull to the stomach, squeeze shoulder blades together, avoid rounding forward on the return.' },
  { id: 'chest-supported-dumbbell-row', name: 'Chest-Supported Row (Dumbbell)', muscle: 'back', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: 'Chest pinned to an incline bench, pull dumbbells to your hips, no body English.' },
  { id: 'single-arm-dumbbell-row', name: 'Single-Arm Row (Dumbbell)', muscle: 'back', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: 'Flat back, brace on a bench, pull the elbow up and back rather than rotating the torso.' },
  { id: 'straight-arm-pulldown', name: 'Straight-Arm Pulldown (Cable)', muscle: 'back', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Arms stay straight, push the bar down and back in an arc, feel it in the lats not the triceps.' },

  // Shoulders
  { id: 'barbell-overhead-press', name: 'Overhead Press (Barbell)', muscle: 'shoulders', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 5, cue: 'Brace core, bar starts at collarbone, press straight up, move head back then through at the top.' },
  { id: 'seated-dumbbell-shoulder-press', name: 'Seated Shoulder Press (Dumbbell)', muscle: 'shoulders', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: 'Back supported, press dumbbells up and slightly in, avoid flaring elbows past shoulder height on the way down.' },
  { id: 'machine-shoulder-press', name: 'Shoulder Press (Machine)', muscle: 'shoulders', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: 'Set seat so handles start at shoulder height, press up without shrugging.' },
  { id: 'arnold-press', name: 'Arnold Press (Dumbbell)', muscle: 'shoulders', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: 'Start palms facing you, rotate to face forward as you press, control the rotation on the way down.' },
  { id: 'dumbbell-lateral-raise', name: 'Lateral Raise (Dumbbell)', muscle: 'shoulders', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: 'Slight bend in elbow, lead with the elbow not the hand, stop around shoulder height.' },
  { id: 'cable-lateral-raise', name: 'Lateral Raise (Cable)', muscle: 'shoulders', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Cable behind you at the ankle, raise out to the side, keep tension on through the bottom of the rep.' },
  { id: 'machine-lateral-raise', name: 'Lateral Raise (Machine)', muscle: 'shoulders', type: 'isolation', equipment: 'machine', repRange: [10, 15], increment: 2.5, cue: "Set pads at the upper arm, raise with control, don't let the weight stack slam down." },
  { id: 'rear-delt-fly-dumbbell', name: 'Rear Delt Fly (Dumbbell)', muscle: 'shoulders', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: 'Hinge forward, slight elbow bend, raise dumbbells out to the sides, squeeze the rear delts not the traps.' },
  { id: 'face-pull', name: 'Face Pull (Cable)', muscle: 'shoulders', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Pull to eye level, lead with the elbows high, externally rotate at the finish.' },
  { id: 'front-raise-dumbbell', name: 'Front Raise (Dumbbell)', muscle: 'shoulders', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: 'Raise one or both dumbbells to shoulder height, avoid swinging or using the hips for momentum.' },

  // Traps
  { id: 'barbell-shrug', name: 'Shrug (Barbell)', muscle: 'traps', type: 'isolation', equipment: 'barbell', repRange: [10, 15], increment: 2.5, cue: 'Straight arms, shrug straight up toward your ears, avoid rolling the shoulders.' },
  { id: 'dumbbell-shrug', name: 'Shrug (Dumbbell)', muscle: 'traps', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: 'Same pattern as the barbell version with a longer range of motion at the bottom.' },
  { id: 'cable-shrug', name: 'Shrug (Cable)', muscle: 'traps', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Constant tension version of the shrug, pause briefly at the top of each rep.' },

  // Quads
  { id: 'back-squat', name: 'Back Squat (Barbell)', muscle: 'quads', type: 'compound', equipment: 'barbell', repRange: [5, 8], increment: 10, cue: 'Brace before you unrack. Sit back and down, knees tracking over toes, chest up. Drive through mid-foot.' },
  { id: 'front-squat', name: 'Front Squat (Barbell)', muscle: 'quads', type: 'compound', equipment: 'barbell', repRange: [5, 8], increment: 10, cue: 'Bar rests on the front delts, elbows high, stay more upright than a back squat, brace hard.' },
  { id: 'leg-press', name: 'Leg Press (Machine)', muscle: 'quads', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: "Feet shoulder-width, don't let knees cave in, avoid locking out hard at the top." },
  { id: 'hack-squat', name: 'Hack Squat (Machine)', muscle: 'quads', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: 'Feet mid-platform, lower under control, drive through the whole foot without letting knees collapse in.' },
  { id: 'goblet-squat', name: 'Goblet Squat (Dumbbell)', muscle: 'quads', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: 'Hold a dumbbell at your chest, squat between your knees, stay tall through the torso.' },
  { id: 'walking-lunge-dumbbell', name: 'Walking Lunge (Dumbbell)', muscle: 'quads', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: 'Step out, drop the back knee toward the floor, drive through the front heel to the next step.' },
  { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat (Dumbbell)', muscle: 'quads', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: 'Rear foot elevated, most of the weight in the front foot, drop straight down and drive back up.' },
  { id: 'step-up-dumbbell', name: 'Step-Up (Dumbbell)', muscle: 'quads', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: 'Drive through the lead foot on the box, avoid pushing off the trailing leg.' },
  { id: 'leg-extension', name: 'Leg Extension (Machine)', muscle: 'quads', type: 'isolation', equipment: 'machine', repRange: [10, 15], increment: 2.5, cue: 'Adjust the pad to the shin, extend fully, pause briefly at the top, control the negative.' },
  { id: 'sissy-squat', name: 'Sissy Squat (Bodyweight)', muscle: 'quads', type: 'isolation', equipment: 'bodyweight', repRange: [10, 15], increment: 2.5, cue: 'Rise onto the toes, lean back from the knees keeping hips extended, feel it in the front of the thigh.' },

  // Hamstrings
  { id: 'romanian-deadlift', name: 'Romanian Deadlift (Barbell)', muscle: 'hamstrings', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 10, cue: 'Soft knees, push hips back, bar stays close to legs, stop when hamstrings are fully loaded.' },
  { id: 'good-morning', name: 'Good Morning (Barbell)', muscle: 'hamstrings', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 10, cue: 'Bar on the back, soft knees, hinge at the hips keeping a flat back, stop when you feel a stretch.' },
  { id: 'single-leg-rdl-dumbbell', name: 'Single-Leg RDL (Dumbbell)', muscle: 'hamstrings', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: 'Hinge on one leg, trailing leg extends back for balance, keep hips square to the floor.' },
  { id: 'glute-ham-raise', name: 'Glute Ham Raise (Bodyweight)', muscle: 'hamstrings', type: 'compound', equipment: 'bodyweight', repRange: [6, 10], increment: 5, cue: 'Lower under control from the knees, drive back up leading with the hamstrings not the hips.' },
  { id: 'seated-leg-curl', name: 'Seated Leg Curl (Machine)', muscle: 'hamstrings', type: 'isolation', equipment: 'machine', repRange: [10, 15], increment: 2.5, cue: 'Adjust the pad above the heel, curl through a full range, control the return.' },
  { id: 'lying-leg-curl', name: 'Lying Leg Curl (Machine)', muscle: 'hamstrings', type: 'isolation', equipment: 'machine', repRange: [10, 15], increment: 2.5, cue: 'Hips pressed into the pad, curl heels to glutes, avoid hips popping up off the bench.' },
  { id: 'nordic-ham-curl', name: 'Nordic Ham Curl (Bodyweight)', muscle: 'hamstrings', type: 'isolation', equipment: 'bodyweight', repRange: [10, 15], increment: 2.5, cue: 'Anchor the ankles, lower yourself forward as slowly as possible, catch yourself with your hands at the bottom.' },

  // Glutes
  { id: 'hip-thrust', name: 'Hip Thrust (Barbell)', muscle: 'glutes', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 10, cue: 'Upper back on a bench, bar over hips, drive through the heels, squeeze glutes hard at the top.' },
  { id: 'glute-bridge-dumbbell', name: 'Glute Bridge (Dumbbell)', muscle: 'glutes', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: 'Dumbbell across the hips, drive through the heels, pause at the top of each rep.' },
  { id: 'cable-kickback', name: 'Kickback (Cable)', muscle: 'glutes', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Cuff on the ankle, kick straight back, squeeze the glute rather than arching the lower back.' },
  { id: 'hip-abduction-machine', name: 'Hip Abduction (Machine)', muscle: 'glutes', type: 'isolation', equipment: 'machine', repRange: [10, 15], increment: 2.5, cue: 'Sit tall, push the pads out with control, avoid rocking the torso for momentum.' },
  { id: 'cable-pull-through', name: 'Pull-Through (Cable)', muscle: 'glutes', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Hinge at the hips facing away from the stack, pull through by squeezing the glutes at the top.' },

  // Calves
  { id: 'standing-calf-raise', name: 'Standing Calf Raise (Machine)', muscle: 'calves', type: 'isolation', equipment: 'machine', repRange: [12, 20], increment: 2.5, cue: 'Full stretch at the bottom, rise onto the toes as high as possible, pause at the top.' },
  { id: 'seated-calf-raise', name: 'Seated Calf Raise (Machine)', muscle: 'calves', type: 'isolation', equipment: 'machine', repRange: [12, 20], increment: 2.5, cue: 'Targets the soleus more than standing versions, same full range, controlled tempo.' },
  { id: 'leg-press-calf-raise', name: 'Leg Press Calf Raise (Machine)', muscle: 'calves', type: 'isolation', equipment: 'machine', repRange: [12, 20], increment: 2.5, cue: 'Balls of the feet on the platform edge, press through a full range without locking the knees.' },
  { id: 'donkey-calf-raise', name: 'Donkey Calf Raise (Machine)', muscle: 'calves', type: 'isolation', equipment: 'machine', repRange: [12, 20], increment: 2.5, cue: 'Hinged forward position increases the stretch at the bottom, rise fully onto the toes.' },

  // Biceps
  { id: 'barbell-curl', name: 'Curl (Barbell)', muscle: 'biceps', type: 'isolation', equipment: 'barbell', repRange: [10, 15], increment: 2.5, cue: 'Elbows pinned to sides, avoid swinging, control the eccentric.' },
  { id: 'dumbbell-curl', name: 'Curl (Dumbbell)', muscle: 'biceps', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: 'Curl with a slight supination at the top, keep elbows still, alternate or go together.' },
  { id: 'incline-dumbbell-curl', name: 'Incline Curl (Dumbbell)', muscle: 'biceps', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: 'Seated on an incline bench, arms hang behind the torso for a longer stretch at the bottom.' },
  { id: 'hammer-curl', name: 'Hammer Curl (Dumbbell)', muscle: 'biceps', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: 'Neutral grip throughout, curl without letting the elbows drift forward.' },
  { id: 'cable-curl', name: 'Curl (Cable)', muscle: 'biceps', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Constant tension version of the curl, keep elbows fixed at your sides.' },
  { id: 'preacher-curl', name: 'Preacher Curl (Barbell)', muscle: 'biceps', type: 'isolation', equipment: 'barbell', repRange: [10, 15], increment: 2.5, cue: "Upper arms flat on the pad, control the full stretch at the bottom, don't bounce out of it." },

  // Triceps
  { id: 'close-grip-bench-press', name: 'Close-Grip Bench Press (Barbell)', muscle: 'triceps', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 5, cue: 'Hands just inside shoulder width, elbows track close to the torso, press through the triceps.' },
  { id: 'diamond-push-up', name: 'Diamond Push-Up (Bodyweight)', muscle: 'triceps', type: 'compound', equipment: 'bodyweight', repRange: [6, 10], increment: 5, cue: 'Hands together under the chest, lower with elbows close to the body, press back up.' },
  { id: 'dips-triceps', name: 'Dips (Bodyweight, Triceps-Focused)', muscle: 'triceps', type: 'compound', equipment: 'bodyweight', repRange: [6, 10], increment: 5, cue: 'Torso upright to bias triceps, lower until a stretch in the shoulders, press back to lockout.' },
  { id: 'tricep-pushdown', name: 'Tricep Pushdown (Cable)', muscle: 'triceps', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Elbows pinned at your sides, extend fully, control the return without letting the elbows flare.' },
  { id: 'overhead-tricep-extension-dumbbell', name: 'Overhead Tricep Extension (Dumbbell)', muscle: 'triceps', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: 'Elbows pointed forward and stationary, lower behind the head, extend fully without flaring.' },
  { id: 'skull-crushers', name: 'Skull Crushers (Barbell)', muscle: 'triceps', type: 'isolation', equipment: 'barbell', repRange: [10, 15], increment: 2.5, cue: 'Elbows stay fixed in place, lower the bar toward the forehead, extend back up under control.' },
  { id: 'cable-overhead-extension', name: 'Overhead Extension (Cable)', muscle: 'triceps', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Face away from the stack, extend overhead, keep elbows close to the head throughout.' },

  // Core
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise (Bodyweight)', muscle: 'core', type: 'isolation', equipment: 'bodyweight', repRange: [12, 20], increment: 2.5, cue: 'Hang from the bar, raise legs by curling the pelvis, avoid swinging.' },
  { id: 'cable-crunch', name: 'Crunch (Cable)', muscle: 'core', type: 'isolation', equipment: 'cable', repRange: [12, 20], increment: 2.5, cue: 'Kneel below the stack, crunch down by flexing the spine, not by pulling with the arms.' },
  { id: 'ab-wheel-rollout', name: 'Ab Wheel Rollout (Bodyweight)', muscle: 'core', type: 'isolation', equipment: 'bodyweight', repRange: [12, 20], increment: 2.5, cue: 'Brace hard before rolling out, keep the hips from sagging, roll back within a range you control.' },
  { id: 'russian-twist-dumbbell', name: 'Russian Twist (Dumbbell)', muscle: 'core', type: 'isolation', equipment: 'dumbbell', repRange: [12, 20], increment: 2.5, cue: "Lean back to engage the core, rotate side to side under control, don't just swing the arms." },
  { id: 'weighted-sit-up', name: 'Weighted Sit-Up (Bodyweight)', muscle: 'core', type: 'isolation', equipment: 'bodyweight', repRange: [12, 20], increment: 2.5, cue: 'Hold a plate at your chest, sit up under control, avoid yanking with the neck.' },
  { id: 'machine-crunch', name: 'Crunch (Machine)', muscle: 'core', type: 'isolation', equipment: 'machine', repRange: [12, 20], increment: 2.5, cue: 'Set the pad at the upper chest, crunch by flexing the spine, control the return.' },
  { id: 'decline-sit-up', name: 'Decline Sit-Up (Bodyweight)', muscle: 'core', type: 'isolation', equipment: 'bodyweight', repRange: [12, 20], increment: 2.5, cue: 'On a decline bench, sit up under control, add a plate across the chest once bodyweight is easy.' },

  // Forearms
  { id: 'barbell-wrist-curl', name: 'Wrist Curl (Barbell)', muscle: 'forearms', type: 'isolation', equipment: 'barbell', repRange: [12, 20], increment: 2.5, cue: 'Forearms on your thighs or a bench, curl the wrists up through a full range.' },
  { id: 'barbell-reverse-wrist-curl', name: 'Reverse Wrist Curl (Barbell)', muscle: 'forearms', type: 'isolation', equipment: 'barbell', repRange: [12, 20], increment: 2.5, cue: "Same setup as the wrist curl with an overhand grip, small range, don't use momentum." },
  { id: 'dumbbell-wrist-curl', name: 'Wrist Curl (Dumbbell)', muscle: 'forearms', type: 'isolation', equipment: 'dumbbell', repRange: [12, 20], increment: 2.5, cue: 'Same pattern as the barbell version, train each side independently.' },
  { id: 'farmers-carry', name: "Farmer's Carry (Dumbbell)", muscle: 'forearms', type: 'isolation', equipment: 'dumbbell', repRange: [12, 20], increment: 5, cue: 'Heavy dumbbells at your sides, walk with a tall posture and a tight grip for distance or time.' },

  // --- Niche & variation movements ---

  // Chest
  { id: 'pec-deck', name: 'Pec Deck (Machine)', muscle: 'chest', type: 'isolation', equipment: 'machine', repRange: [10, 15], increment: 2.5, cue: 'Elbows or forearms on the pads, sweep together in front of the chest, control the stretch on the return.' },
  { id: 'chest-dip', name: 'Chest Dip (Bodyweight)', muscle: 'chest', type: 'compound', equipment: 'bodyweight', repRange: [6, 10], increment: 5, cue: 'Lean the torso forward, flare elbows slightly, lower until a stretch across the chest, press up and in.' },
  { id: 'smith-machine-bench-press', name: 'Bench Press (Smith Machine)', muscle: 'chest', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: 'Set the bench so the bar path meets your lower chest, same setup cues as a barbell bench.' },
  { id: 'smith-machine-incline-press', name: 'Incline Press (Smith Machine)', muscle: 'chest', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: 'Bench at ~30° under the bar, touch the upper chest, drive up without bouncing.' },
  { id: 'low-to-high-cable-fly', name: 'Low-to-High Fly (Cable)', muscle: 'chest', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Pulleys at the bottom, sweep up and in toward eye level, biases the upper chest.' },
  { id: 'floor-press', name: 'Floor Press (Barbell)', muscle: 'chest', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 5, cue: 'Bench press from the floor — triceps touch down briefly each rep, press without bouncing the elbows.' },

  // Back
  { id: 'rack-pull', name: 'Rack Pull (Barbell)', muscle: 'back', type: 'compound', equipment: 'barbell', repRange: [5, 8], increment: 10, cue: 'Deadlift from knee-height pins, flat back, drive hips through and squeeze the upper back at lockout.' },
  { id: 'sumo-deadlift', name: 'Sumo Deadlift (Barbell)', muscle: 'back', type: 'compound', equipment: 'barbell', repRange: [5, 8], increment: 10, cue: 'Wide stance, toes out, shins vertical against the bar, spread the floor as you drive up.' },
  { id: 'trap-bar-deadlift', name: 'Trap Bar Deadlift (Barbell)', muscle: 'back', type: 'compound', equipment: 'barbell', repRange: [5, 8], increment: 10, cue: 'Stand centered in the bar, neutral grip at your sides, push the floor away with a tall chest.' },
  { id: 'snatch-grip-deadlift', name: 'Snatch-Grip Deadlift (Barbell)', muscle: 'back', type: 'compound', equipment: 'barbell', repRange: [5, 8], increment: 10, cue: 'Very wide grip forces a deeper start position — extra upper-back and trap work, keep the lats tight.' },
  { id: 'deficit-deadlift', name: 'Deficit Deadlift (Barbell)', muscle: 'back', type: 'compound', equipment: 'barbell', repRange: [5, 8], increment: 10, cue: 'Stand on a low plate or block, longer range of motion, stay patient off the floor with a flat back.' },
  { id: 'meadows-row', name: 'Meadows Row (Barbell)', muscle: 'back', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 5, cue: 'Landmine bar, overhand grip on the sleeve, hinge and row the elbow high and out.' },
  { id: 'seal-row', name: 'Seal Row (Barbell)', muscle: 'back', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 10, cue: 'Lying face down on an elevated bench, row the bar to the bench — zero momentum, all back.' },
  { id: 'machine-high-row', name: 'High Row (Machine)', muscle: 'back', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: 'Chest on the pad, pull the handles down and back toward your hips, squeeze the lats.' },
  { id: 'machine-row', name: 'Row (Machine)', muscle: 'back', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: 'Chest supported, pull straight back, drive the elbows behind you without shrugging.' },
  { id: 'single-arm-cable-row', name: 'Single-Arm Row (Cable)', muscle: 'back', type: 'compound', equipment: 'cable', repRange: [6, 10], increment: 5, cue: 'Seated or staggered stance, row to the hip, let the shoulder blade glide forward on the stretch.' },
  { id: 'neutral-grip-lat-pulldown', name: 'Neutral-Grip Lat Pulldown (Cable)', muscle: 'back', type: 'compound', equipment: 'cable', repRange: [6, 10], increment: 5, cue: 'Palms facing, elbows track in front of the torso, pull to the upper chest with a tall spine.' },
  { id: 'single-arm-lat-pulldown', name: 'Single-Arm Lat Pulldown (Cable)', muscle: 'back', type: 'compound', equipment: 'cable', repRange: [6, 10], increment: 5, cue: 'D-handle overhead, pull the elbow down to your side, feel the lat lengthen fully at the top.' },
  { id: 'dumbbell-pullover', name: 'Pullover (Dumbbell)', muscle: 'back', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: 'Upper back across a bench, lower the dumbbell behind your head with soft elbows, pull over with the lats.' },
  { id: 'back-extension', name: 'Back Extension (Bodyweight)', muscle: 'back', type: 'isolation', equipment: 'bodyweight', repRange: [10, 15], increment: 2.5, cue: '45° pad at the hip crease, hinge down with a flat back, squeeze glutes and erectors to rise.' },

  // Shoulders
  { id: 'reverse-pec-deck', name: 'Reverse Pec Deck (Machine)', muscle: 'shoulders', type: 'isolation', equipment: 'machine', repRange: [10, 15], increment: 2.5, cue: 'Face the pad, sweep the arms back with slight elbow bend, squeeze the rear delts not the traps.' },
  { id: 'cable-rear-delt-fly', name: 'Rear Delt Fly (Cable)', muscle: 'shoulders', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Cross the cables, pull apart at shoulder height, keep the movement in the rear delts.' },
  { id: 'barbell-upright-row', name: 'Upright Row (Barbell)', muscle: 'shoulders', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 5, cue: 'Grip just outside shoulder width, lead with the elbows to chest height — stop lower if shoulders complain.' },
  { id: 'landmine-press', name: 'Landmine Press (Barbell)', muscle: 'shoulders', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 5, cue: 'Bar in a landmine, press up and forward at an angle, brace the core in a half-kneeling or standing stance.' },
  { id: 'push-press', name: 'Push Press (Barbell)', muscle: 'shoulders', type: 'compound', equipment: 'barbell', repRange: [5, 8], increment: 5, cue: 'Shallow knee dip, drive the bar off the shoulders with the legs, lock out overhead.' },
  { id: 'cable-y-raise', name: 'Y-Raise (Cable)', muscle: 'shoulders', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Raise the cables up and out into a Y, thumbs up, keep the traps quiet.' },

  // Traps
  { id: 'trap-bar-shrug', name: 'Trap Bar Shrug (Barbell)', muscle: 'traps', type: 'isolation', equipment: 'barbell', repRange: [10, 15], increment: 2.5, cue: 'Neutral grip at your sides lets you load heavier — shrug straight up, pause at the top.' },
  { id: 'smith-machine-shrug', name: 'Shrug (Smith Machine)', muscle: 'traps', type: 'isolation', equipment: 'machine', repRange: [10, 15], increment: 2.5, cue: 'Fixed bar path, shrug straight up toward the ears, controlled negative.' },

  // Quads
  { id: 'pendulum-squat', name: 'Pendulum Squat (Machine)', muscle: 'quads', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: 'Arc path keeps you upright — sink deep, drive through the whole foot, knees tracking forward.' },
  { id: 'belt-squat', name: 'Belt Squat (Machine)', muscle: 'quads', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: 'Load hangs from the hips so the spine stays unloaded — squat deep and stay tall.' },
  { id: 'smith-machine-squat', name: 'Squat (Smith Machine)', muscle: 'quads', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: 'Feet slightly forward of the bar, sit straight down, let the fixed path bias the quads.' },
  { id: 'zercher-squat', name: 'Zercher Squat (Barbell)', muscle: 'quads', type: 'compound', equipment: 'barbell', repRange: [5, 8], increment: 10, cue: 'Bar in the crook of the elbows, stay upright, brace hard — brutal on the core and upper back too.' },
  { id: 'safety-bar-squat', name: 'Safety Bar Squat (Barbell)', muscle: 'quads', type: 'compound', equipment: 'barbell', repRange: [5, 8], increment: 10, cue: 'Cambered bar sits higher and pushes you forward — fight to stay upright, drive through mid-foot.' },
  { id: 'box-squat', name: 'Box Squat (Barbell)', muscle: 'quads', type: 'compound', equipment: 'barbell', repRange: [5, 8], increment: 10, cue: 'Sit back to a box just below parallel, pause briefly without rocking, drive up explosively.' },
  { id: 'reverse-lunge-dumbbell', name: 'Reverse Lunge (Dumbbell)', muscle: 'quads', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: 'Step back, drop the rear knee, drive through the front heel — easier on the knees than forward lunges.' },
  { id: 'single-leg-leg-press', name: 'Single-Leg Leg Press (Machine)', muscle: 'quads', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: 'One foot centered on the platform, full range, keep the knee tracking over the toes.' },
  { id: 'hip-adduction-machine', name: 'Hip Adduction (Machine)', muscle: 'quads', type: 'isolation', equipment: 'machine', repRange: [10, 15], increment: 2.5, cue: 'Squeeze the pads together with the inner thighs, pause at the squeeze, control the opening.' },

  // Hamstrings
  { id: 'stiff-leg-deadlift', name: 'Stiff-Leg Deadlift (Barbell)', muscle: 'hamstrings', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 10, cue: 'Straighter knees than an RDL, hinge until the hamstrings are fully stretched, keep the bar close.' },
  { id: 'dumbbell-rdl', name: 'RDL (Dumbbell)', muscle: 'hamstrings', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: 'Dumbbells slide down the front of the thighs, hips back, flat back, stand up by squeezing the glutes.' },
  { id: 'sliding-leg-curl', name: 'Sliding Leg Curl (Bodyweight)', muscle: 'hamstrings', type: 'isolation', equipment: 'bodyweight', repRange: [10, 15], increment: 2.5, cue: 'Heels on sliders or a towel, bridge the hips, curl the heels in without dropping the hips.' },

  // Glutes
  { id: 'machine-hip-thrust', name: 'Hip Thrust (Machine)', muscle: 'glutes', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: 'Belt or pad over the hips, drive through the heels, full lockout with a posterior tilt at the top.' },
  { id: 'curtsy-lunge-dumbbell', name: 'Curtsy Lunge (Dumbbell)', muscle: 'glutes', type: 'compound', equipment: 'dumbbell', repRange: [6, 10], increment: 5, cue: 'Step back and across behind the front leg, keep hips square, drive up through the front heel.' },
  { id: 'machine-glute-kickback', name: 'Glute Kickback (Machine)', muscle: 'glutes', type: 'isolation', equipment: 'machine', repRange: [10, 15], increment: 2.5, cue: 'Chest on the pad, push the platform back and up with one leg, squeeze at full hip extension.' },

  // Calves
  { id: 'smith-machine-calf-raise', name: 'Calf Raise (Smith Machine)', muscle: 'calves', type: 'isolation', equipment: 'machine', repRange: [12, 20], increment: 2.5, cue: 'Balls of the feet on a block under the bar, full stretch at the bottom, pause at the top.' },
  { id: 'single-leg-calf-raise', name: 'Single-Leg Calf Raise (Dumbbell)', muscle: 'calves', type: 'isolation', equipment: 'dumbbell', repRange: [12, 20], increment: 2.5, cue: 'Dumbbell on the working side, ball of the foot on a step, full range one leg at a time.' },
  { id: 'tibialis-raise', name: 'Tibialis Raise (Bodyweight)', muscle: 'calves', type: 'isolation', equipment: 'bodyweight', repRange: [12, 20], increment: 2.5, cue: 'Heels on the ground, back against a wall, lift the toes as high as possible — shin armor for knees.' },

  // Biceps
  { id: 'ez-bar-curl', name: 'EZ-Bar Curl (Barbell)', muscle: 'biceps', type: 'isolation', equipment: 'barbell', repRange: [10, 15], increment: 2.5, cue: 'Angled grip is easier on the wrists — same rules as a barbell curl, no swinging.' },
  { id: 'concentration-curl', name: 'Concentration Curl (Dumbbell)', muscle: 'biceps', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: 'Elbow braced against the inner thigh, curl slowly, squeeze hard at the top.' },
  { id: 'spider-curl', name: 'Spider Curl (Dumbbell)', muscle: 'biceps', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: 'Chest on an incline bench, arms hanging straight down, curl without any body movement.' },
  { id: 'bayesian-cable-curl', name: 'Bayesian Curl (Cable)', muscle: 'biceps', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Face away from a low pulley, arm slightly behind the torso — maximum stretch on the long head.' },
  { id: 'reverse-curl', name: 'Reverse Curl (Barbell)', muscle: 'biceps', type: 'isolation', equipment: 'barbell', repRange: [10, 15], increment: 2.5, cue: 'Overhand grip, curl with the elbows pinned — hits the brachialis and forearms.' },
  { id: 'cross-body-hammer-curl', name: 'Cross-Body Hammer Curl (Dumbbell)', muscle: 'biceps', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: 'Neutral grip, curl across the body toward the opposite shoulder, control the way down.' },
  { id: 'machine-preacher-curl', name: 'Preacher Curl (Machine)', muscle: 'biceps', type: 'isolation', equipment: 'machine', repRange: [10, 15], increment: 2.5, cue: 'Upper arms flat on the pad, full stretch at the bottom, no bouncing out of the hole.' },
  { id: 'rope-hammer-curl', name: 'Rope Hammer Curl (Cable)', muscle: 'biceps', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Neutral grip on the rope, constant cable tension, elbows fixed at the sides.' },

  // Triceps
  { id: 'rope-pushdown', name: 'Rope Pushdown (Cable)', muscle: 'triceps', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Split the rope apart at the bottom, elbows pinned, full lockout each rep.' },
  { id: 'single-arm-cable-tricep-extension', name: 'Single-Arm Tricep Extension (Cable, D-Ring Strap)', muscle: 'triceps', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'D-ring or strap in one hand, elbow pinned at your side, extend fully and control the return — strict, no torso lean.' },
  { id: 'single-arm-overhead-cable-extension', name: 'Single-Arm Overhead Extension (Cable)', muscle: 'triceps', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Face away from a low pulley, arm overhead, deep stretch behind the head, extend without flaring.' },
  { id: 'reverse-grip-pushdown', name: 'Reverse-Grip Pushdown (Cable)', muscle: 'triceps', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Underhand grip on a bar, elbows pinned, biases the medial head — usually lighter than a normal pushdown.' },
  { id: 'jm-press', name: 'JM Press (Barbell)', muscle: 'triceps', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 5, cue: 'Hybrid of close-grip bench and skull crusher — lower to the chin/neck with elbows forward, press back up.' },
  { id: 'dumbbell-kickback', name: 'Kickback (Dumbbell)', muscle: 'triceps', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: 'Torso parallel to the floor, upper arm locked at your side, extend to full lockout and squeeze.' },
  { id: 'machine-tricep-extension', name: 'Tricep Extension (Machine)', muscle: 'triceps', type: 'isolation', equipment: 'machine', repRange: [10, 15], increment: 2.5, cue: 'Elbows on the pad, extend through a full range, control the stack on the way back.' },
  { id: 'bench-dip', name: 'Bench Dip (Bodyweight)', muscle: 'triceps', type: 'compound', equipment: 'bodyweight', repRange: [6, 10], increment: 5, cue: 'Hands on a bench behind you, hips close to the bench, lower until elbows hit ~90°, add plates on the lap to load.' },

  // Core
  { id: 'pallof-press', name: 'Pallof Press (Cable)', muscle: 'core', type: 'isolation', equipment: 'cable', repRange: [12, 20], increment: 2.5, cue: 'Cable at chest height, press straight out and resist the rotation — anti-rotation, not a push.' },
  { id: 'cable-woodchopper', name: 'Woodchopper (Cable)', muscle: 'core', type: 'isolation', equipment: 'cable', repRange: [12, 20], increment: 2.5, cue: 'Rotate high-to-low or low-to-high through the trunk, arms stay long, pivot the back foot.' },
  { id: 'weighted-plank', name: 'Weighted Plank (Bodyweight)', muscle: 'core', type: 'isolation', equipment: 'bodyweight', repRange: [12, 20], increment: 2.5, cue: 'Plate on the upper back, straight line head to heels — log the hold time in seconds as reps.' },
  { id: 'copenhagen-plank', name: 'Copenhagen Plank (Bodyweight)', muscle: 'core', type: 'isolation', equipment: 'bodyweight', repRange: [12, 20], increment: 2.5, cue: 'Side plank with the top foot on a bench — adductor and oblique killer, log seconds as reps.' },
  { id: 'dragon-flag', name: 'Dragon Flag (Bodyweight)', muscle: 'core', type: 'isolation', equipment: 'bodyweight', repRange: [12, 20], increment: 2.5, cue: 'Grip the bench behind your head, lower the body as one rigid line from the shoulders, no hip break.' },
  { id: 'v-up', name: 'V-Up (Bodyweight)', muscle: 'core', type: 'isolation', equipment: 'bodyweight', repRange: [12, 20], increment: 2.5, cue: 'Fold at the hips, hands meet the feet at the top, lower both halves under control.' },

  // Forearms
  { id: 'wrist-roller', name: 'Wrist Roller (Machine)', muscle: 'forearms', type: 'isolation', equipment: 'machine', repRange: [12, 20], increment: 2.5, cue: 'Roll the weight up and back down with full wrist turns, arms out in front — count one full up-down as a rep.' },
  { id: 'plate-pinch', name: 'Plate Pinch (Bodyweight)', muscle: 'forearms', type: 'isolation', equipment: 'bodyweight', repRange: [12, 20], increment: 2.5, cue: 'Pinch smooth plates together fingertips-to-thumb — log hold seconds as reps.' },
  { id: 'dead-hang', name: 'Dead Hang (Bodyweight)', muscle: 'forearms', type: 'isolation', equipment: 'bodyweight', repRange: [12, 20], increment: 2.5, cue: 'Full grip on the bar, shoulders relaxed but not slack — log hold seconds as reps.' },
  { id: 'behind-back-cable-wrist-curl', name: 'Behind-the-Back Wrist Curl (Cable)', muscle: 'forearms', type: 'isolation', equipment: 'cable', repRange: [12, 20], increment: 2.5, cue: 'Bar behind you at arms length, curl the wrists up, constant tension through the range.' },

  // --- Cable & machine expansion ---

  // Chest
  { id: 'cable-chest-press', name: 'Chest Press (Cable)', muscle: 'chest', type: 'compound', equipment: 'cable', repRange: [6, 10], increment: 5, cue: 'Handles at chest height, staggered stance, press forward and together — constant tension unlike a barbell.' },
  { id: 'incline-machine-press', name: 'Incline Press (Machine)', muscle: 'chest', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: 'Seat set so handles start at upper-chest height, press up and together without shrugging.' },
  { id: 'high-to-low-cable-fly', name: 'High-to-Low Fly (Cable)', muscle: 'chest', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Pulleys at the top, sweep down and in toward the waist — biases the lower chest fibers.' },
  { id: 'machine-fly', name: 'Fly (Machine)', muscle: 'chest', type: 'isolation', equipment: 'machine', repRange: [10, 15], increment: 2.5, cue: 'Arms slightly bent on the handles, sweep together, pause and squeeze at the midline.' },
  { id: 'seated-dip-machine', name: 'Seated Dip (Machine)', muscle: 'chest', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: 'Push the handles down and slightly forward, lean in a touch to load the lower chest.' },

  // Back
  { id: 'assisted-pull-up-machine', name: 'Assisted Pull-Up (Machine)', muscle: 'back', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: 'Kneel on the pad, same pulling mechanics as a pull-up — reduce assistance over time (lower counterweight = harder).' },
  { id: 'machine-pullover', name: 'Pullover (Machine)', muscle: 'back', type: 'isolation', equipment: 'machine', repRange: [10, 15], increment: 2.5, cue: 'Elbows or upper arms on the pads, sweep down in an arc using the lats, not the arms.' },
  { id: 'cable-pullover', name: 'Pullover (Cable, Rope)', muscle: 'back', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Hinge slightly facing a high pulley, arms long, pull the rope down to your hips in an arc.' },
  { id: 'wide-grip-seated-row', name: 'Wide-Grip Seated Row (Cable)', muscle: 'back', type: 'compound', equipment: 'cable', repRange: [6, 10], increment: 5, cue: 'Wide bar, pull high toward the sternum with elbows out — biases upper back and rear delts.' },
  { id: 'smith-machine-row', name: 'Row (Smith Machine)', muscle: 'back', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: 'Fixed bar path lets you focus on the squeeze — hinge, pull to the lower ribs, control down.' },
  { id: 'cable-deadlift', name: 'Pull-Through Deadlift (Cable)', muscle: 'back', type: 'compound', equipment: 'cable', repRange: [8, 12], increment: 5, cue: 'Low pulley between the legs, hinge and stand tall — a friendly hinge pattern for high-rep work.' },

  // Shoulders
  { id: 'cable-front-raise', name: 'Front Raise (Cable)', muscle: 'shoulders', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Cable behind you at the bottom, raise straight ahead to eye level — constant tension on the front delt.' },
  { id: 'machine-rear-delt-row', name: 'Rear Delt Row (Machine, High Row)', muscle: 'shoulders', type: 'compound', equipment: 'machine', repRange: [8, 12], increment: 5, cue: 'Elbows high and wide, pull toward the ears — targets rear delts and upper back together.' },
  { id: 'cable-shoulder-press', name: 'Shoulder Press (Cable)', muscle: 'shoulders', type: 'compound', equipment: 'cable', repRange: [6, 10], increment: 5, cue: 'Seated or standing between low pulleys, press up — tension stays on through lockout.' },
  { id: 'lying-cable-lateral-raise', name: 'Lying Lateral Raise (Cable)', muscle: 'shoulders', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Side-lying on an incline bench, raise the cable across your body — brutal stretch on the side delt.' },

  // Traps
  { id: 'cable-upright-row', name: 'Upright Row (Cable)', muscle: 'traps', type: 'compound', equipment: 'cable', repRange: [8, 12], increment: 2.5, cue: 'Rope or wide bar from a low pulley, lead with the elbows to chest height.' },

  // Legs
  { id: 'cable-squat', name: 'Goblet Squat (Cable)', muscle: 'quads', type: 'compound', equipment: 'cable', repRange: [8, 12], increment: 5, cue: 'Hold a low-pulley handle at your chest, sit back against the tension — great for keeping upright.' },
  { id: 'smith-machine-lunge', name: 'Split Squat (Smith Machine)', muscle: 'quads', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: 'Fixed bar over the shoulders, one foot forward, drop straight down and drive through the front heel.' },
  { id: 'machine-squat', name: 'V-Squat (Machine)', muscle: 'quads', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: 'Shoulders under the pads, sit deep and drive up — arc path keeps the torso supported.' },
  { id: 'cable-rdl', name: 'RDL (Cable)', muscle: 'hamstrings', type: 'compound', equipment: 'cable', repRange: [8, 12], increment: 5, cue: 'Low pulley in both hands, hinge with soft knees — tension peaks in the stretch where it matters.' },
  { id: 'smith-machine-rdl', name: 'RDL (Smith Machine)', muscle: 'hamstrings', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: 'Fixed path keeps the bar tight to the legs — hips back until the hamstrings load fully.' },
  { id: 'standing-leg-curl-machine', name: 'Standing Single-Leg Curl (Machine)', muscle: 'hamstrings', type: 'isolation', equipment: 'machine', repRange: [10, 15], increment: 2.5, cue: 'One leg at a time, curl the heel to the glute, keep hips pressed to the pad.' },
  { id: 'cable-hip-abduction', name: 'Hip Abduction (Cable)', muscle: 'glutes', type: 'isolation', equipment: 'cable', repRange: [12, 15], increment: 2.5, cue: 'Cuff at the ankle, swing the leg out to the side under control — upper glute burner.' },
  { id: 'smith-machine-hip-thrust', name: 'Hip Thrust (Smith Machine)', muscle: 'glutes', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 10, cue: 'Fixed bar over the hips makes setup fast — drive through heels, hard squeeze at the top.' },
  { id: 'cable-standing-calf-raise', name: 'Standing Calf Raise (Cable)', muscle: 'calves', type: 'isolation', equipment: 'cable', repRange: [12, 20], increment: 2.5, cue: 'Low handle held at the hip or shoulder, rise onto the toes through a full range.' },

  // Arms
  { id: 'machine-bicep-curl', name: 'Bicep Curl (Machine)', muscle: 'biceps', type: 'isolation', equipment: 'machine', repRange: [10, 15], increment: 2.5, cue: 'Arms locked on the pad, curl through the machine arc, squeeze at the top without lifting the elbows.' },
  { id: 'high-cable-curl', name: 'High Curl (Cable, Crucifix)', muscle: 'biceps', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Arms out to the sides at shoulder height, curl toward the ears — peak-contraction focused.' },
  { id: 'single-arm-cable-curl', name: 'Single-Arm Curl (Cable)', muscle: 'biceps', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Low pulley in one hand, elbow pinned, strict curl — fix left/right imbalances.' },
  { id: 'single-arm-cable-lateral', name: 'Single-Arm Kickback (Cable)', muscle: 'triceps', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Hinge forward, no attachment needed — grip the ball of the cable, extend straight back.' },
  { id: 'cross-cable-tricep-extension', name: 'Crossover Tricep Extension (Cable)', muscle: 'triceps', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Two high pulleys crossed in front of you, extend both arms down and out simultaneously.' },
  { id: 'smith-close-grip-bench', name: 'Close-Grip Bench (Smith Machine)', muscle: 'triceps', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: 'Hands inside shoulder width on the fixed bar, elbows tucked, press through the triceps.' },

  // Core & misc
  { id: 'rotary-torso-machine', name: 'Rotary Torso (Machine)', muscle: 'core', type: 'isolation', equipment: 'machine', repRange: [12, 20], increment: 2.5, cue: 'Rotate through the trunk against the pad, slow and controlled both directions.' },
  { id: 'cable-side-bend', name: 'Side Bend (Cable)', muscle: 'core', type: 'isolation', equipment: 'cable', repRange: [12, 20], increment: 2.5, cue: 'Handle at your side from a low pulley, bend directly sideways and return — obliques only, no lean forward.' },
  { id: 'machine-back-extension', name: 'Back Extension (Machine)', muscle: 'back', type: 'isolation', equipment: 'machine', repRange: [10, 15], increment: 2.5, cue: 'Pad at the upper back, extend the spine against resistance, avoid overarching at the top.' },
  { id: 'cable-crunch-standing', name: 'Standing Crunch (Cable)', muscle: 'core', type: 'isolation', equipment: 'cable', repRange: [12, 20], increment: 2.5, cue: 'Rope at the top of your head facing away, crunch down flexing the spine — hips stay still.' },
  { id: 'gripper-machine', name: 'Grip (Machine)', muscle: 'forearms', type: 'isolation', equipment: 'machine', repRange: [12, 20], increment: 2.5, cue: 'Squeeze the handles fully closed, pause, control the release.' },

  // --- V5 additions: lifter-specific variations ---

  // Chest
  { id: 'larsen-press', name: 'Larsen Press (Barbell)', muscle: 'chest', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 5, cue: 'Bench press with feet up off the floor — no leg drive, pure upper-body pressing strictness.' },
  { id: 'spoto-press', name: 'Spoto Press (Barbell)', muscle: 'chest', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 5, cue: 'Pause the bar an inch above the chest each rep — kills momentum, builds control off the chest.' },
  { id: 'converging-chest-press', name: 'Converging Chest Press (Machine)', muscle: 'chest', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: 'Handles arc inward as you press — matches the pec fiber line better than a straight press.' },
  { id: 'decline-machine-press', name: 'Decline Press (Machine)', muscle: 'chest', type: 'compound', equipment: 'machine', repRange: [6, 10], increment: 5, cue: 'Press down-and-forward, elbows tracking about 45°, squeeze the lower chest at lockout.' },
  { id: 'deficit-push-up', name: 'Deficit Push-Up (Bodyweight)', muscle: 'chest', type: 'compound', equipment: 'bodyweight', repRange: [8, 12], increment: 5, cue: 'Hands on plates or handles, chest sinks below hand level for an extra stretch at the bottom.' },

  // Back
  { id: 'kroc-row', name: 'Kroc Row (Dumbbell)', muscle: 'back', type: 'compound', equipment: 'dumbbell', repRange: [10, 15], increment: 5, cue: 'Heavy one-arm row with controlled body english, high reps — grip and lats to the limit.' },
  { id: 'helms-row', name: 'Helms Row (Dumbbell)', muscle: 'back', type: 'compound', equipment: 'dumbbell', repRange: [8, 12], increment: 5, cue: 'Chest braced on an incline bench set upright, row dumbbells strict — zero momentum possible.' },
  { id: 'close-grip-lat-pulldown', name: 'Close-Grip Lat Pulldown (Cable)', muscle: 'back', type: 'compound', equipment: 'cable', repRange: [8, 12], increment: 5, cue: 'Narrow neutral handle, elbows tight in front, pull to the sternum with a big lat stretch up top.' },

  // Shoulders
  { id: 'powell-raise', name: 'Powell Raise (Dumbbell)', muscle: 'shoulders', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: 'Side-lying on a bench, raise the dumbbell from in front of your hip up over your shoulder — rear delt under stretch.' },
  { id: 'cable-external-rotation', name: 'External Rotation (Cable)', muscle: 'shoulders', type: 'isolation', equipment: 'cable', repRange: [12, 15], increment: 2.5, cue: 'Elbow pinned at your side, rotate the forearm outward against the cable — rotator cuff insurance.' },

  // Traps
  { id: 'snatch-grip-high-pull', name: 'Snatch-Grip High Pull (Barbell)', muscle: 'traps', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 5, cue: 'Wide grip, explosive pull to chest height driving the elbows up — traps do the finish.' },

  // Quads
  { id: 'paused-back-squat', name: 'Paused Back Squat (Barbell)', muscle: 'quads', type: 'compound', equipment: 'barbell', repRange: [5, 8], increment: 10, cue: 'Full 2-count pause in the hole without relaxing, then drive up — no stretch reflex to help.' },
  { id: 'pin-squat', name: 'Pin Squat (Barbell)', muscle: 'quads', type: 'compound', equipment: 'barbell', repRange: [5, 8], increment: 10, cue: 'Squat to pins set at your sticking point, dead-stop, then stand — teaches brutal position honesty.' },
  { id: 'front-foot-elevated-split-squat', name: 'Front-Foot Elevated Split Squat (Dumbbell)', muscle: 'quads', type: 'compound', equipment: 'dumbbell', repRange: [8, 12], increment: 5, cue: 'Front foot on a small plate or wedge — deeper knee flexion, more quad stretch than flat split squats.' },
  { id: 'walking-barbell-lunge', name: 'Walking Lunge (Barbell)', muscle: 'quads', type: 'compound', equipment: 'barbell', repRange: [6, 10], increment: 10, cue: 'Bar on your back, long controlled steps, torso tall — heavier than dumbbells once grip would limit you.' },
  { id: 'unilateral-leg-extension', name: 'Single-Leg Extension (Machine)', muscle: 'quads', type: 'isolation', equipment: 'machine', repRange: [10, 15], increment: 2.5, cue: 'One leg at a time — evens out left/right strength and lets you focus on the squeeze.' },

  // Glutes
  { id: 'b-stance-hip-thrust', name: 'B-Stance Hip Thrust (Barbell)', muscle: 'glutes', type: 'compound', equipment: 'barbell', repRange: [8, 12], increment: 5, cue: 'One heel planted, other foot on its heel as a kickstand — ~80% of the load on one glute.' },
  { id: 'reverse-hyperextension', name: 'Reverse Hyperextension (Machine)', muscle: 'glutes', type: 'isolation', equipment: 'machine', repRange: [10, 15], increment: 2.5, cue: 'Torso on the pad, swing the legs up behind you squeezing the glutes — spine stays unloaded.' },

  // Calves
  { id: 'hack-squat-calf-raise', name: 'Hack Squat Calf Raise (Machine)', muscle: 'calves', type: 'isolation', equipment: 'machine', repRange: [12, 20], increment: 2.5, cue: 'Balls of the feet on the platform edge of a hack squat, full stretch and full squeeze.' },

  // Biceps
  { id: 'incline-cable-curl', name: 'Incline Curl (Cable)', muscle: 'biceps', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Incline bench between low pulleys — the stretch of incline curls plus constant cable tension.' },
  { id: 'drag-curl', name: 'Drag Curl (Barbell)', muscle: 'biceps', type: 'isolation', equipment: 'barbell', repRange: [10, 15], increment: 2.5, cue: 'Drag the bar up your torso with elbows drifting back — no front delt, all biceps peak.' },
  { id: 'waiter-curl', name: 'Waiter Curl (Dumbbell)', muscle: 'biceps', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: 'Hold one dumbbell flat like a tray with both palms, curl keeping the plate face-up — constant peak tension.' },
  { id: 'zottman-curl', name: 'Zottman Curl (Dumbbell)', muscle: 'biceps', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: 'Curl palms-up, rotate to palms-down at the top, lower slow — biceps up, forearms down.' },

  // Triceps
  { id: 'tate-press', name: 'Tate Press (Dumbbell)', muscle: 'triceps', type: 'isolation', equipment: 'dumbbell', repRange: [10, 15], increment: 2.5, cue: 'Lying on a bench, dumbbells over your chest, drop the elbows out so the weights dive toward your chest, press back up.' },
  { id: 'rolling-tricep-extension', name: 'Rolling Tricep Extension (Dumbbell)', muscle: 'triceps', type: 'isolation', equipment: 'dumbbell', repRange: [8, 12], increment: 2.5, cue: 'Lower like a skull crusher, let the elbows drift back overhead, then punch back up — lat-assisted, elbow-friendly.' },
  { id: 'katana-extension', name: 'Katana Extension (Cable)', muscle: 'triceps', type: 'isolation', equipment: 'cable', repRange: [10, 15], increment: 2.5, cue: 'Facing away from a high pulley, arms overhead like drawing a sword — huge long-head stretch behind the head.' },
]

// V6 mass expansion + V7 exact-name injection live in separate modules.
import { EXTRA_EXERCISES } from './exercisesExtra'
import { EXACT_EXERCISES } from './exercisesExact'

export const ALL_EXERCISES: Exercise[] = [...EXERCISES, ...EXTRA_EXERCISES, ...EXACT_EXERCISES]

export function getExerciseById(id: string): Exercise | undefined {
  return ALL_EXERCISES.find((e) => e.id === id)
}
