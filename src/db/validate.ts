import type {
  Settings,
  Profile,
  BodyMetric,
  CustomPlan,
  SplitDay,
  WorkoutSession,
  SessionExercise,
  SetEntry,
  BodyWeightEntry,
  RecoveryEntry,
  MeasureKey,
  MuscleGroup,
  Soreness,
} from '../types'

// Defensive coercion for everything read from IndexedDB / imported JSON.
// The kv store and import files are untrusted (old versions, hand-edits,
// corrupt backups), so we sanitize rather than blind-cast — malformed values
// are dropped or clamped instead of propagating NaN/garbage into the UI.

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)
const isStr = (v: unknown): v is string => typeof v === 'string'
const optNum = (v: unknown): number | undefined => (isNum(v) && v >= 0 ? v : undefined)

const MUSCLES: MuscleGroup[] = [
  'chest', 'back', 'shoulders', 'traps', 'quads', 'hamstrings',
  'glutes', 'calves', 'biceps', 'triceps', 'core', 'forearms',
]

export const DEFAULT_SETTINGS: Settings = { split: 'full-body', units: 'lb', rotationIndex: 0 }

export function asSettings(v: unknown): Settings {
  if (!isObj(v)) return DEFAULT_SETTINGS
  const units = v.units === 'kg' ? 'kg' : 'lb'
  const split = isStr(v.split) ? v.split : DEFAULT_SETTINGS.split
  const rotationIndex = isNum(v.rotationIndex) ? Math.max(0, Math.floor(v.rotationIndex)) : 0
  const settings: Settings = { split, units, rotationIndex }
  if (Array.isArray(v.weekSchedule) && v.weekSchedule.length === 7) {
    settings.weekSchedule = v.weekSchedule.map((d) => (isNum(d) ? Math.floor(d) : null))
  }
  return settings
}

export const MEASURE_KEYS: MeasureKey[] = [
  'biceps', 'chest', 'waist', 'thighs', 'forearms', 'calves', 'shoulders', 'hips', 'neck',
]

export function asProfile(v: unknown): Profile {
  if (!isObj(v)) return {}
  const p: Profile = {}
  if (v.sex === 'male' || v.sex === 'female' || v.sex === 'other') p.sex = v.sex
  const age = optNum(v.age)
  if (age !== undefined) p.age = age
  const height = optNum(v.heightIn)
  if (height !== undefined) p.heightIn = height
  if (Array.isArray(v.measureFields)) {
    const fields = v.measureFields.filter((f): f is MeasureKey =>
      MEASURE_KEYS.includes(f as MeasureKey)
    )
    if (fields.length > 0) p.measureFields = fields
  }
  return p
}

export function asBodyMetrics(v: unknown): BodyMetric[] {
  if (!Array.isArray(v)) return []
  const out: BodyMetric[] = []
  for (const m of v) {
    if (!isObj(m) || !isStr(m.id) || !isStr(m.date)) continue
    const entry: BodyMetric = { id: m.id, date: m.date }
    for (const k of MEASURE_KEYS) {
      const n = optNum(m[k])
      if (n !== undefined) entry[k] = n
    }
    out.push(entry)
  }
  return out
}

function asSet(v: unknown): SetEntry | null {
  if (!isObj(v)) return null
  const set: SetEntry = {
    weight: isNum(v.weight) ? Math.max(0, v.weight) : 0,
    reps: isNum(v.reps) ? Math.max(0, Math.floor(v.reps)) : 0,
  }
  if (isNum(v.rir) && v.rir >= 0) set.rir = Math.floor(v.rir)
  if (v.type === 'W' || v.type === 'F' || v.type === 'P' || v.type === 'M') set.type = v.type
  if (v.logged === true) set.logged = true
  return set
}

function asSessionExercise(v: unknown): SessionExercise | null {
  if (!isObj(v) || !isStr(v.exerciseId) || !Array.isArray(v.sets)) return null
  const sets = v.sets.map(asSet).filter((s): s is SetEntry => s !== null)
  const entry: SessionExercise = { exerciseId: v.exerciseId, sets }
  if (isStr(v.settingsNote)) entry.settingsNote = v.settingsNote
  if (v.supersetNext === true) entry.supersetNext = true
  return entry
}

export function asWorkoutSession(v: unknown): WorkoutSession | null {
  if (!isObj(v) || !isStr(v.id) || !isStr(v.date) || !Array.isArray(v.exercises)) return null
  const exercises = v.exercises
    .map(asSessionExercise)
    .filter((e): e is SessionExercise => e !== null)
  const session: WorkoutSession = {
    id: v.id,
    date: v.date,
    dayName: isStr(v.dayName) ? v.dayName : 'Workout',
    exercises,
  }
  if (isStr(v.endedAt)) session.endedAt = v.endedAt
  if (isNum(v.rpe)) session.rpe = Math.min(10, Math.max(1, Math.round(v.rpe)))
  return session
}

export function asWorkoutSessions(v: unknown): WorkoutSession[] {
  if (!Array.isArray(v)) return []
  return v.map(asWorkoutSession).filter((s): s is WorkoutSession => s !== null)
}

export function asBodyWeightEntries(v: unknown): BodyWeightEntry[] {
  if (!Array.isArray(v)) return []
  const out: BodyWeightEntry[] = []
  for (const e of v) {
    if (isObj(e) && isStr(e.id) && isStr(e.date) && isNum(e.weight) && e.weight > 0) {
      out.push({ id: e.id, date: e.date, weight: e.weight })
    }
  }
  return out
}

export function asRecoveryEntries(v: unknown): RecoveryEntry[] {
  if (!Array.isArray(v)) return []
  const out: RecoveryEntry[] = []
  for (const e of v) {
    if (!isObj(e) || !isStr(e.id) || !isStr(e.date) || !isStr(e.muscle) || !isNum(e.soreness)) continue
    if (!MUSCLES.includes(e.muscle as MuscleGroup)) continue
    const soreness = Math.min(5, Math.max(1, Math.round(e.soreness))) as Soreness
    out.push({ id: e.id, date: e.date, muscle: e.muscle as MuscleGroup, soreness })
  }
  return out
}

function asSplitDay(v: unknown): SplitDay | null {
  if (!isObj(v) || !Array.isArray(v.exerciseIds)) return null
  const exerciseIds = v.exerciseIds.filter(isStr)
  const day: SplitDay = { name: isStr(v.name) ? v.name : 'Day', exerciseIds }
  if (isObj(v.exerciseMeta)) day.exerciseMeta = v.exerciseMeta as SplitDay['exerciseMeta']
  return day
}

export function asCustomPlans(v: unknown): CustomPlan[] {
  if (!Array.isArray(v)) return []
  const out: CustomPlan[] = []
  for (const p of v) {
    if (!isObj(p) || !isStr(p.id) || !Array.isArray(p.days)) continue
    const days = p.days.map(asSplitDay).filter((d): d is SplitDay => d !== null)
    out.push({ id: p.id, name: isStr(p.name) ? p.name : 'Program', days })
  }
  return out
}
