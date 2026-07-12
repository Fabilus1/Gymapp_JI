import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import { notify } from '../logic/notify'
import { canonicalId } from '../data/aliases'
import {
  asSettings,
  asProfile,
  asBodyMetrics,
  asCustomPlans,
  asWorkoutSession,
  asWorkoutSessions,
  asBodyWeightEntries,
  asRecoveryEntries,
} from './validate'
import type {
  WorkoutSession,
  BodyWeightEntry,
  RecoveryEntry,
  Settings,
  CustomPlan,
  Profile,
  BodyMetric,
} from '../types'

interface IronLogDB extends DBSchema {
  sessions: { key: string; value: WorkoutSession; indexes: { 'by-date': string } }
  bodyWeight: { key: string; value: BodyWeightEntry; indexes: { 'by-date': string } }
  recovery: { key: string; value: RecoveryEntry; indexes: { 'by-date': string } }
  kv: { key: string; value: unknown }
}

const DB_NAME = 'ironlog'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<IronLogDB>> | null = null

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<IronLogDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const sessions = db.createObjectStore('sessions', { keyPath: 'id' })
        sessions.createIndex('by-date', 'date')
        const bodyWeight = db.createObjectStore('bodyWeight', { keyPath: 'id' })
        bodyWeight.createIndex('by-date', 'date')
        const recovery = db.createObjectStore('recovery', { keyPath: 'id' })
        recovery.createIndex('by-date', 'date')
        db.createObjectStore('kv')
      },
    })
  }
  return dbPromise
}

export function newId(): string {
  return crypto.randomUUID()
}

/**
 * Run an IndexedDB write with one retry, and surface a toast if it still
 * fails (quota exceeded, private mode, disk pressure) so a set is never
 * silently lost. Re-throws so callers can react too.
 */
async function guardedWrite<T>(op: () => Promise<T>, what: string): Promise<T> {
  try {
    return await op()
  } catch {
    try {
      await new Promise((r) => setTimeout(r, 150))
      return await op()
    } catch (err) {
      notify(`Couldn't save ${what}. Your last change may not be stored — free up space and re-open.`)
      throw err
    }
  }
}

// ---- Settings ----

export async function getSettings(): Promise<Settings> {
  const db = await getDb()
  return asSettings(await db.get('kv', 'settings'))
}

export async function saveSettings(settings: Settings): Promise<void> {
  const db = await getDb()
  await guardedWrite(() => db.put('kv', settings, 'settings'), 'settings')
}

// ---- In-progress session (survives reload) ----

export async function getInProgressSession(): Promise<WorkoutSession | null> {
  const db = await getDb()
  return asWorkoutSession(await db.get('kv', 'inProgressSession'))
}

export async function saveInProgressSession(session: WorkoutSession | null): Promise<void> {
  const db = await getDb()
  if (session) {
    await guardedWrite(() => db.put('kv', session, 'inProgressSession'), 'your workout')
  } else {
    await db.delete('kv', 'inProgressSession')
  }
}

// ---- Profile + body measurements (kv-backed, no schema change) ----

export async function getProfile(): Promise<Profile> {
  const db = await getDb()
  return asProfile(await db.get('kv', 'profile'))
}

export async function saveProfile(profile: Profile): Promise<void> {
  const db = await getDb()
  await guardedWrite(() => db.put('kv', profile, 'profile'), 'your profile')
}

export async function getBodyMetrics(): Promise<BodyMetric[]> {
  const db = await getDb()
  // newest first
  return asBodyMetrics(await db.get('kv', 'bodyMetrics')).sort((a, b) =>
    b.date.localeCompare(a.date)
  )
}

export async function addBodyMetric(entry: BodyMetric): Promise<void> {
  const db = await getDb()
  const existing = asBodyMetrics(await db.get('kv', 'bodyMetrics'))
  await guardedWrite(() => db.put('kv', [...existing, entry], 'bodyMetrics'), 'your measurements')
}

// ---- Custom plans (Planner) ----

export async function getCustomPlans(): Promise<CustomPlan[]> {
  const db = await getDb()
  return asCustomPlans(await db.get('kv', 'customPlans'))
}

export async function saveCustomPlans(plans: CustomPlan[]): Promise<void> {
  const db = await getDb()
  await db.put('kv', plans, 'customPlans')
}

// ---- Sessions ----

export async function getAllSessions(): Promise<WorkoutSession[]> {
  const db = await getDb()
  const all = await db.getAllFromIndex('sessions', 'by-date')
  return all.reverse() // most recent first
}

export async function saveSession(session: WorkoutSession): Promise<void> {
  const db = await getDb()
  await guardedWrite(() => db.put('sessions', session), 'your finished workout')
}

/**
 * One-time normalization: rewrite legacy/duplicate exercise ids in saved plans,
 * sessions and the in-progress workout to their canonical id, so history and
 * templates unify onto a single exercise. Idempotent.
 */
export async function migrateExerciseAliases(): Promise<void> {
  const plans = await getCustomPlans()
  let plansChanged = false
  for (const plan of plans) {
    for (const day of plan.days) {
      const mapped = day.exerciseIds.map(canonicalId)
      if (mapped.join() !== day.exerciseIds.join()) plansChanged = true
      day.exerciseIds = mapped
      if (day.exerciseMeta) {
        const meta: NonNullable<typeof day.exerciseMeta> = {}
        for (const [k, v] of Object.entries(day.exerciseMeta)) meta[canonicalId(k)] = v
        day.exerciseMeta = meta
      }
    }
  }
  if (plansChanged) await saveCustomPlans(plans)

  const db = await getDb()
  for (const session of await getAllSessions()) {
    let changed = false
    for (const e of session.exercises) {
      const c = canonicalId(e.exerciseId)
      if (c !== e.exerciseId) {
        e.exerciseId = c
        changed = true
      }
    }
    if (changed) await db.put('sessions', session)
  }

  const active = await getInProgressSession()
  if (active) {
    let changed = false
    for (const e of active.exercises) {
      const c = canonicalId(e.exerciseId)
      if (c !== e.exerciseId) {
        e.exerciseId = c
        changed = true
      }
    }
    if (changed) await saveInProgressSession(active)
  }
}

// ---- Body weight ----

export async function getAllBodyWeightEntries(): Promise<BodyWeightEntry[]> {
  const db = await getDb()
  const all = await db.getAllFromIndex('bodyWeight', 'by-date')
  return all.reverse()
}

export async function addBodyWeightEntry(entry: BodyWeightEntry): Promise<void> {
  const db = await getDb()
  await guardedWrite(() => db.put('bodyWeight', entry), 'your body weight')
}

// ---- Recovery / soreness log ----

export async function getAllRecoveryEntries(): Promise<RecoveryEntry[]> {
  const db = await getDb()
  const all = await db.getAllFromIndex('recovery', 'by-date')
  return all.reverse()
}

export async function addRecoveryEntry(entry: RecoveryEntry): Promise<void> {
  const db = await getDb()
  await guardedWrite(() => db.put('recovery', entry), 'your soreness entry')
}

// ---- Export / import (JSON backup) ----

const EXPORT_VERSION = 1

interface ExportPayload {
  exportVersion: number
  exportedAt: string
  settings: Settings
  sessions: WorkoutSession[]
  bodyWeight: BodyWeightEntry[]
  recovery: RecoveryEntry[]
  customPlans?: CustomPlan[]
  profile?: Profile
  bodyMetrics?: BodyMetric[]
}

export async function exportAllData(): Promise<string> {
  const [settings, sessions, bodyWeight, recovery, customPlans, profile, bodyMetrics] =
    await Promise.all([
      getSettings(),
      getAllSessions(),
      getAllBodyWeightEntries(),
      getAllRecoveryEntries(),
      getCustomPlans(),
      getProfile(),
      getBodyMetrics(),
    ])
  const payload: ExportPayload = {
    exportVersion: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    settings,
    sessions,
    bodyWeight,
    recovery,
    customPlans,
    profile,
    bodyMetrics,
  }
  return JSON.stringify(payload, null, 2)
}

/** Overwrites all local data with the contents of a previously exported JSON backup. */
export async function importAllData(json: string): Promise<void> {
  const payload = JSON.parse(json) as Partial<ExportPayload>
  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.sessions)) {
    throw new Error('This file does not look like an IronLog backup.')
  }

  // Sanitize every record from the (untrusted) backup before writing, so a
  // hand-edited or corrupt file can't poison the store with malformed data.
  const sessions = asWorkoutSessions(payload.sessions)
  const bodyWeight = asBodyWeightEntries(payload.bodyWeight)
  const recovery = asRecoveryEntries(payload.recovery)
  const settings = asSettings(payload.settings)
  const customPlans = asCustomPlans(payload.customPlans)
  const profile = asProfile(payload.profile)
  const bodyMetrics = asBodyMetrics(payload.bodyMetrics)

  const db = await getDb()
  const tx = db.transaction(['sessions', 'bodyWeight', 'recovery', 'kv'], 'readwrite')

  await tx.objectStore('sessions').clear()
  for (const session of sessions) await tx.objectStore('sessions').put(session)

  await tx.objectStore('bodyWeight').clear()
  for (const entry of bodyWeight) await tx.objectStore('bodyWeight').put(entry)

  await tx.objectStore('recovery').clear()
  for (const entry of recovery) await tx.objectStore('recovery').put(entry)

  await tx.objectStore('kv').put(settings, 'settings')
  await tx.objectStore('kv').put(customPlans, 'customPlans')
  await tx.objectStore('kv').put(profile, 'profile')
  await tx.objectStore('kv').put(bodyMetrics, 'bodyMetrics')
  // Clear any half-finished workout from before the import so it can't
  // resurface pointing at the replaced data set.
  await tx.objectStore('kv').delete('inProgressSession')

  await tx.done
}
