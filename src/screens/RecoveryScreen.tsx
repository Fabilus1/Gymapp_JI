import { useEffect, useMemo, useState } from 'react'
import SegmentBar from '../components/SegmentBar'
import { addRecoveryEntry, getAllRecoveryEntries, newId } from '../db/db'
import { muscleRecovery, STATUS_LABELS } from '../logic/recovery'
import { useApp } from '../context/AppDataContext'
import type { MuscleGroup, RecoveryEntry, Soreness } from '../types'
import './RecoveryScreen.css'

const MUSCLES: MuscleGroup[] = [
  'chest',
  'back',
  'shoulders',
  'traps',
  'quads',
  'hamstrings',
  'glutes',
  'calves',
  'biceps',
  'triceps',
  'core',
  'forearms',
]

function daysSince(iso: string): string | null {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days === 0) return null // status already reads "Trained today"
  if (days === 1) return 'Trained 1 day ago'
  return `Trained ${days} days ago`
}

export default function RecoveryScreen() {
  const { sessions } = useApp()
  const [log, setLog] = useState<RecoveryEntry[]>([])
  const [logging, setLogging] = useState<MuscleGroup | null>(null)

  useEffect(() => {
    getAllRecoveryEntries().then(setLog)
  }, [])

  async function logSoreness(muscle: MuscleGroup, soreness: Soreness) {
    const entry: RecoveryEntry = { id: newId(), date: new Date().toISOString(), muscle, soreness }
    await addRecoveryEntry(entry)
    setLog(await getAllRecoveryEntries())
    setLogging(null)
  }

  // Compute all muscle statuses once per data change, not on every render.
  const recoveries = useMemo(
    () => new Map(MUSCLES.map((m) => [m, muscleRecovery(m, sessions, log)])),
    [sessions, log]
  )

  return (
    <div className="recovery">
      <ul className="recovery__list">
        {MUSCLES.map((muscle) => {
          const r = recoveries.get(muscle)!
          const isLogging = logging === muscle
          const readiness = { 'trained-today': 1, recovering: 2, 'almost-ready': 3, ready: 4 }[
            r.status
          ]
          const detail = r.lastTrained ? daysSince(r.lastTrained) : 'Not trained yet'
          return (
            <li key={muscle} className="recovery__item">
              <button
                className="recovery__row"
                onClick={() => setLogging(isLogging ? null : muscle)}
              >
                <div className="recovery__row-main">
                  <span className="recovery__muscle">{muscle}</span>
                  {detail && <span className="recovery__detail">{detail}</span>}
                  {r.soreness !== null && (
                    <span className="recovery__soreness-row">
                      <span className="recovery__mini-label">Soreness</span>
                      <SegmentBar value={r.soreness} max={5} tone="danger" />
                    </span>
                  )}
                </div>
                <div className="recovery__meter">
                  <SegmentBar value={readiness} max={4} />
                  <span
                    className={
                      r.status === 'ready'
                        ? 'recovery__status recovery__status--ready'
                        : 'recovery__status'
                    }
                  >
                    {STATUS_LABELS[r.status]}
                  </span>
                </div>
              </button>
              {isLogging && (
                <div className="recovery__soreness">
                  <span className="recovery__soreness-label">How sore?</span>
                  <div className="recovery__scale">
                    {([1, 2, 3, 4, 5] as Soreness[]).map((n) => (
                      <button
                        key={n}
                        className="recovery__scale-btn"
                        onClick={() => logSoreness(muscle, n)}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
      <p className="recovery__hint">
        Tap a muscle group to log soreness. Soreness of 4+ holds the status back a tier for 48 h.
      </p>
    </div>
  )
}
