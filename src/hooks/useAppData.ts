import { useCallback, useEffect, useState } from 'react'
import type { Settings, WorkoutSession } from '../types'
import {
  getSettings,
  saveSettings,
  getAllSessions,
  saveSession,
  getInProgressSession,
  saveInProgressSession,
  newId,
} from '../db/db'
import { getCurrentSplitDay, advanceRotation } from '../logic/rotation'
import { suggestNext } from '../logic/progression'
import { getExerciseById } from '../data/exercises'

const DEFAULT_SET_COUNT = 3

export function useAppData() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    Promise.all([getSettings(), getAllSessions(), getInProgressSession()]).then(
      ([s, all, active]) => {
        setSettings(s)
        setSessions(all)
        setActiveSession(active)
        setLoaded(true)
      }
    )
  }, [])

  const updateSettings = useCallback(async (next: Settings) => {
    setSettings(next)
    await saveSettings(next)
  }, [])

  /** Builds today's session from the current split day, prefilled with suggested weights/reps. */
  const startWorkout = useCallback(async () => {
    if (!settings) return
    const day = getCurrentSplitDay(settings)
    const session: WorkoutSession = {
      id: newId(),
      date: new Date().toISOString(),
      dayName: day.name,
      exercises: day.exerciseIds.map((exerciseId) => {
        const exercise = getExerciseById(exerciseId)
        const suggestion = exercise ? suggestNext(exercise, sessions) : null
        // Only prefill when there's real history — otherwise untouched sets
        // stay 0/0 and are dropped on finish instead of polluting history.
        const hasHistory = suggestion?.weight !== null && suggestion !== null
        const weight = hasHistory ? (suggestion.weight as number) : 0
        const reps = hasHistory ? suggestion.reps : 0
        return {
          exerciseId,
          sets: Array.from({ length: DEFAULT_SET_COUNT }, () => ({ weight, reps })),
        }
      }),
    }
    setActiveSession(session)
    await saveInProgressSession(session)
  }, [settings, sessions])

  const updateActiveSession = useCallback(async (session: WorkoutSession) => {
    setActiveSession(session)
    await saveInProgressSession(session)
  }, [])

  const finishWorkout = useCallback(async () => {
    if (!activeSession || !settings) return
    // Drop sets never filled in (weight and reps both 0) and exercises left empty.
    const cleaned: WorkoutSession = {
      ...activeSession,
      exercises: activeSession.exercises
        .map((e) => ({ ...e, sets: e.sets.filter((s) => s.weight > 0 || s.reps > 0) }))
        .filter((e) => e.sets.length > 0),
    }
    if (cleaned.exercises.length > 0) {
      await saveSession(cleaned)
      setSessions(await getAllSessions())
    }
    const next = advanceRotation(settings)
    setSettings(next)
    await saveSettings(next)
    setActiveSession(null)
    await saveInProgressSession(null)
  }, [activeSession, settings])

  const cancelWorkout = useCallback(async () => {
    setActiveSession(null)
    await saveInProgressSession(null)
  }, [])

  return {
    loaded,
    settings,
    sessions,
    activeSession,
    updateSettings,
    startWorkout,
    updateActiveSession,
    finishWorkout,
    cancelWorkout,
  }
}
