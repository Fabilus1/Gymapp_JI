import { useCallback, useEffect, useState } from 'react'
import type { CustomPlan, Settings, WorkoutSession } from '../types'
import {
  getSettings,
  saveSettings,
  getAllSessions,
  saveSession,
  getInProgressSession,
  saveInProgressSession,
  getCustomPlans,
  saveCustomPlans,
  newId,
} from '../db/db'
import { getTodayPlan, advanceRotation } from '../logic/rotation'
import { suggestNext } from '../logic/progression'
import { getExerciseById } from '../data/exercises'

const DEFAULT_SET_COUNT = 3

/** Machine setup text from the most recent session containing this exercise. */
export function recallSettingsNote(
  sessions: WorkoutSession[],
  exerciseId: string
): string | undefined {
  for (const session of sessions) {
    const entry = session.exercises.find((e) => e.exerciseId === exerciseId)
    if (entry?.settingsNote) return entry.settingsNote
  }
  return undefined
}

export function useAppData() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [customPlans, setCustomPlans] = useState<CustomPlan[]>([])
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    Promise.all([getSettings(), getAllSessions(), getInProgressSession(), getCustomPlans()]).then(
      ([s, all, active, plans]) => {
        setSettings(s)
        setSessions(all)
        setActiveSession(active)
        setCustomPlans(plans)
        setLoaded(true)
      }
    )
  }, [])

  const updateSettings = useCallback(async (next: Settings) => {
    setSettings(next)
    await saveSettings(next)
  }, [])

  const updateCustomPlans = useCallback(async (plans: CustomPlan[]) => {
    setCustomPlans(plans)
    await saveCustomPlans(plans)
  }, [])

  /** Builds today's session, prefilled with suggestions where history exists. */
  const startWorkout = useCallback(async () => {
    if (!settings) return
    const plan = getTodayPlan(settings, customPlans)
    const day = plan.day ?? plan.nextDay // "start anyway" on rest days uses next scheduled day
    if (!day) return
    const session: WorkoutSession = {
      id: newId(),
      date: new Date().toISOString(),
      dayName: day.name,
      exercises: day.exerciseIds.map((exerciseId) => {
        const exercise = getExerciseById(exerciseId)
        const meta = day.exerciseMeta?.[exerciseId]
        const suggestion = exercise ? suggestNext(exercise, sessions, meta?.repRange) : null
        const hasHistory = suggestion !== null && suggestion.weight !== null
        const weight = hasHistory ? (suggestion.weight as number) : 0
        const reps = hasHistory ? suggestion.reps : 0
        const setCount = meta?.targetSets ?? DEFAULT_SET_COUNT
        return {
          exerciseId,
          sets: Array.from({ length: setCount }, () => ({ weight, reps })),
          settingsNote: recallSettingsNote(sessions, exerciseId),
          ...(meta?.supersetNext ? { supersetNext: true } : {}),
        }
      }),
    }
    setActiveSession(session)
    await saveInProgressSession(session)
  }, [settings, sessions, customPlans])

  const updateActiveSession = useCallback(async (session: WorkoutSession) => {
    setActiveSession(session)
    await saveInProgressSession(session)
  }, [])

  const finishWorkout = useCallback(async () => {
    if (!activeSession || !settings) return
    const cleaned: WorkoutSession = {
      ...activeSession,
      endedAt: new Date().toISOString(),
      // Only explicitly logged sets count — unconfirmed rows are discarded.
      exercises: activeSession.exercises
        .map((e) => ({ ...e, sets: e.sets.filter((s) => s.logged === true) }))
        .filter((e) => e.sets.length > 0),
    }
    if (cleaned.exercises.length > 0) {
      await saveSession(cleaned)
      setSessions(await getAllSessions())
    }
    const next = advanceRotation(settings, customPlans)
    setSettings(next)
    await saveSettings(next)
    setActiveSession(null)
    await saveInProgressSession(null)
  }, [activeSession, settings, customPlans])

  const cancelWorkout = useCallback(async () => {
    setActiveSession(null)
    await saveInProgressSession(null)
  }, [])

  return {
    loaded,
    settings,
    sessions,
    customPlans,
    activeSession,
    updateSettings,
    updateCustomPlans,
    startWorkout,
    updateActiveSession,
    finishWorkout,
    cancelWorkout,
  }
}
