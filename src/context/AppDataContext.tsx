import { createContext, useContext } from 'react'
import type { CustomPlan, Settings, WorkoutSession } from '../types'
import type { Units } from '../logic/units'

/**
 * Read-only app data + its pure mutators, shared via context so screens don't
 * receive `sessions` / `settings` / `customPlans` as repeated props. Callbacks
 * that App decorates with navigation/timer side effects stay as props.
 */
export interface AppDataValue {
  settings: Settings
  units: Units
  sessions: WorkoutSession[]
  customPlans: CustomPlan[]
  activeSession: WorkoutSession | null
  updateSettings: (settings: Settings) => void
  updateCustomPlans: (plans: CustomPlan[]) => void
  updateActiveSession: (session: WorkoutSession) => void
}

const AppDataContext = createContext<AppDataValue | null>(null)

export const AppDataProvider = AppDataContext.Provider

export function useApp(): AppDataValue {
  const value = useContext(AppDataContext)
  if (value === null) {
    throw new Error('useApp must be used within an AppDataProvider')
  }
  return value
}
