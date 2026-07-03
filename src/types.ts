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

export interface SetEntry {
  weight: number
  reps: number
  /** Reps in Reserve — proximity to failure (0 = to failure). Optional. */
  rir?: number
}

export interface SessionExercise {
  exerciseId: string
  sets: SetEntry[]
  /** Free-text machine setup, e.g. "Seat 4, Pin 12" — recalled next session. */
  settingsNote?: string
}

export interface WorkoutSession {
  id: string
  date: string // ISO 8601 — when the workout started
  endedAt?: string // ISO 8601 — set when Finish is tapped
  dayName: string
  exercises: SessionExercise[]
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

/** A day within a split template, e.g. "Full Body A" */
export interface SplitDay {
  name: string
  exerciseIds: string[]
}

export interface Split {
  id: SplitId
  name: string
  days: SplitDay[]
}
