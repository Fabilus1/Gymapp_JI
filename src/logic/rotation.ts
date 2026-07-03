import type { CustomPlan, Settings, SplitDay } from '../types'
import { getSplitById, SPLITS } from '../data/splits'

export interface ActiveProgram {
  id: string
  name: string
  days: SplitDay[]
}

/** Resolve the active program — a built-in split or a custom plan. */
export function resolveProgram(settings: Settings, plans: CustomPlan[]): ActiveProgram {
  const custom = plans.find((p) => p.id === settings.split)
  if (custom && custom.days.length > 0) return custom
  const builtIn = getSplitById(settings.split) ?? SPLITS[0]
  return builtIn
}

/** Monday-first weekday index (0 = Monday … 6 = Sunday) for a date. */
export function mondayIndex(date: Date = new Date()): number {
  return (date.getDay() + 6) % 7
}

function scheduleActive(settings: Settings): boolean {
  return settings.weekSchedule !== undefined && settings.weekSchedule.some((d) => d !== null)
}

export interface TodayPlan {
  day: SplitDay | null // null = scheduled rest day
  /** When resting, the next scheduled day (for "next up" display). */
  nextDay: SplitDay | null
  followsSchedule: boolean
}

export function getTodayPlan(settings: Settings, plans: CustomPlan[]): TodayPlan {
  const program = resolveProgram(settings, plans)

  if (scheduleActive(settings)) {
    const schedule = settings.weekSchedule as (number | null)[]
    const todayIdx = schedule[mondayIndex()] ?? null
    const day =
      todayIdx !== null && todayIdx < program.days.length ? program.days[todayIdx] : null

    // find the next non-rest day in the coming week for display
    let nextDay: SplitDay | null = null
    for (let offset = 1; offset <= 7; offset++) {
      const idx = schedule[(mondayIndex() + offset) % 7]
      if (idx !== null && idx < program.days.length) {
        nextDay = program.days[idx]
        break
      }
    }
    return { day, nextDay, followsSchedule: true }
  }

  const day = program.days[settings.rotationIndex % program.days.length]
  return { day, nextDay: null, followsSchedule: false }
}

export function advanceRotation(settings: Settings, plans: CustomPlan[]): Settings {
  const program = resolveProgram(settings, plans)
  return { ...settings, rotationIndex: (settings.rotationIndex + 1) % program.days.length }
}
