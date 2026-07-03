import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { WorkoutSession, BodyWeightEntry, RecoveryEntry, Settings, CustomPlan } from '../types'

interface IronLogDB extends DBSchema {
  sessions: { key: string; value: WorkoutSession; indexes: { 'by-date': string } }
  bodyWeight: { key: string; value: BodyWeightEntry; indexes: { 'by-date': string } }
  recovery: { key: string; value: RecoveryEntry; indexes: { 'by-date': string } }
  kv: { key: string; value: unknown }
}

const DB_NAME = 'ironlog'
const DB_VERSION = 1

const DEFAULT_SETTINGS: Settings = { split: 'full-body', units: 'lb', rotationIndex: 0 }

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

// ---- Settings ----

export async function getSettings(): Promise<Settings> {
  const db = await getDb()
  const stored = await db.get('kv', 'settings')
  return stored ? { ...DEFAULT_SETTINGS, ...(stored as Settings) } : DEFAULT_SETTINGS
}

export async function saveSettings(settings: Settings): Promise<void> {
  const db = await getDb()
  await db.put('kv', settings, 'settings')
}

// ---- In-progress session (survives reload) ----

export async function getInProgressSession(): Promise<WorkoutSession | null> {
  const db = await getDb()
  const stored = await db.get('kv', 'inProgressSession')
  return (stored as WorkoutSession | undefined) ?? null
}

export async function saveInProgressSession(session: WorkoutSession | null): Promise<void> {
  const db = await getDb()
  if (session) {
    await db.put('kv', session, 'inProgressSession')
  } else {
    await db.delete('kv', 'inProgressSession')
  }
}

// ---- Custom plans (Planner) ----

export async function getCustomPlans(): Promise<CustomPlan[]> {
  const db = await getDb()
  const stored = await db.get('kv', 'customPlans')
  return (stored as CustomPlan[] | undefined) ?? []
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
  await db.put('sessions', session)
}

// ---- Body weight ----

export async function getAllBodyWeightEntries(): Promise<BodyWeightEntry[]> {
  const db = await getDb()
  const all = await db.getAllFromIndex('bodyWeight', 'by-date')
  return all.reverse()
}

export async function addBodyWeightEntry(entry: BodyWeightEntry): Promise<void> {
  const db = await getDb()
  await db.put('bodyWeight', entry)
}

// ---- Recovery / soreness log ----

export async function getAllRecoveryEntries(): Promise<RecoveryEntry[]> {
  const db = await getDb()
  const all = await db.getAllFromIndex('recovery', 'by-date')
  return all.reverse()
}

export async function addRecoveryEntry(entry: RecoveryEntry): Promise<void> {
  const db = await getDb()
  await db.put('recovery', entry)
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
}

export async function exportAllData(): Promise<string> {
  const [settings, sessions, bodyWeight, recovery, customPlans] = await Promise.all([
    getSettings(),
    getAllSessions(),
    getAllBodyWeightEntries(),
    getAllRecoveryEntries(),
    getCustomPlans(),
  ])
  const payload: ExportPayload = {
    exportVersion: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    settings,
    sessions,
    bodyWeight,
    recovery,
    customPlans,
  }
  return JSON.stringify(payload, null, 2)
}

/** Overwrites all local data with the contents of a previously exported JSON backup. */
export async function importAllData(json: string): Promise<void> {
  const payload = JSON.parse(json) as Partial<ExportPayload>
  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.sessions)) {
    throw new Error('This file does not look like an IronLog backup.')
  }

  const db = await getDb()
  const tx = db.transaction(['sessions', 'bodyWeight', 'recovery', 'kv'], 'readwrite')

  await tx.objectStore('sessions').clear()
  for (const session of payload.sessions ?? []) {
    await tx.objectStore('sessions').put(session)
  }

  await tx.objectStore('bodyWeight').clear()
  for (const entry of payload.bodyWeight ?? []) {
    await tx.objectStore('bodyWeight').put(entry)
  }

  await tx.objectStore('recovery').clear()
  for (const entry of payload.recovery ?? []) {
    await tx.objectStore('recovery').put(entry)
  }

  if (payload.settings) {
    await tx.objectStore('kv').put(payload.settings, 'settings')
  }
  await tx.objectStore('kv').put(payload.customPlans ?? [], 'customPlans')

  await tx.done
}
