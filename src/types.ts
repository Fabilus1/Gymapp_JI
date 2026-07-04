export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'traps'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'biceps'
  | 'triceps'
  | 'core'
  | 'forearms'

export type EquipmentType = 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight'

export type ExerciseCategory = 'compound' | 'isolation'

export interface Exercise {
  id: string
  name: string
  muscle: MuscleGroup
  type: ExerciseCategory
  equipment: EquipmentType
  /** [low, high] target reps for hypertrophy */
  repRange: [number, number]
  /** weight to add (in lb) once every set hits the top of repRange */
  increment: number
  cue: string
}

/** Intensity tag per set: warmup / regular / failure / partials / myo-reps. */
export type SetType = 'W' | 'R' | 'F' | 'P' | 'M'

export interface SetEntry {
  weight: number
  reps: number
  /** Reps in Reserve — proximity to failure (0 = to failure). Optional. */
  rir?: number
  /** Intensity tag; undefined = regular. Warmups are excluded from analytics. */
  type?: SetType
  /** Explicitly confirmed via the Log button; unlogged sets are dropped on finish. */
  logged?: boolean
}

export interface SessionExercise {
  exerciseId: string
  sets: SetEntry[]
  /** Free-text machine setup, e.g. "Seat 4, Pin 12" — recalled next session. */
  settingsNote?: string
  /** When true, this exercise is supersetted with the one after it in the list. */
  supersetNext?: boolean
}

export interface WorkoutSession {
  id: string
  date: string // ISO 8601 — when the workout started
  endedAt?: string // ISO 8601 — set when Finish is tapped
  dayName: string
  exercises: SessionExercise[]
  /** Session exhaustion / RPE (1–10), captured in the finish modal. */
  rpe?: number
}

export type BiologicalSex = 'male' | 'female' | 'other'

/** Static-ish profile fields (weight lives in the bodyWeight log). */
export interface Profile {
  sex?: BiologicalSex
  age?: number
  /** height in inches — imperial BMI = 703 × lb / in² */
  heightIn?: number
}

/** A dated set of body measurements (inches). All fields optional. */
export interface BodyMetric {
  id: string
  date: string // ISO 8601
  biceps?: number
  chest?: number
  waist?: number
  thighs?: number
}

export interface BodyWeightEntry {
  id: string
  date: string // ISO 8601
  weight: number
}

export type Soreness = 1 | 2 | 3 | 4 | 5

export interface RecoveryEntry {
  id: string
  date: string // ISO 8601
  muscle: MuscleGroup
  soreness: Soreness
}

export type SplitId = 'full-body' | 'upper-lower' | 'push-pull-legs'

export interface Settings {
  /** id of a built-in split or a custom plan */
  split: string
  units: 'lb' | 'kg'
  rotationIndex: number
  /**
   * Optional weekday schedule for the active split: index 0 = Monday … 6 = Sunday,
   * value = day index within the split, or null for a rest day.
   * When present (any non-null), Today follows the calendar instead of the rotation.
   */
  weekSchedule?: (number | null)[]
}

/** User-created program from the Planner (e.g. "Full Body" with Day 1/2/3). */
export interface CustomPlan {
  id: string
  name: string
  days: SplitDay[]
}

/** Per-exercise template overrides set in the Planner's day editor. */
export interface ExerciseMeta {
  /** prefilled set count for new sessions (default 3) */
  targetSets?: number
  /** overrides the exercise's default hypertrophy rep range */
  repRange?: [number, number]
  /** superset this exercise with the next one in the day */
  supersetNext?: boolean
}

/** A day within a split template, e.g. "Full Body A" */
export interface SplitDay {
  name: string
  exerciseIds: string[]
  /** keyed by exerciseId; only present on custom plans edited in the Planner */
  exerciseMeta?: Record<string, ExerciseMeta>
}

export interface Split {
  id: SplitId
  name: string
  days: SplitDay[]
}
