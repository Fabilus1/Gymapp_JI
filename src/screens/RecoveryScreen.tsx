import { useEffect, useState } from 'react'
import { addRecoveryEntry, getAllRecoveryEntries, newId } from '../db/db'
import { muscleRecovery, STATUS_LABELS } from '../logic/recovery'
import type { MuscleGroup, RecoveryEntry, Soreness, WorkoutSession } from '../types'
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

export default function RecoveryScreen({ sessions }: { sessions: WorkoutSession[] }) {
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

  return (
    <div className="recovery">
      <ul className="recovery__list">
        {MUSCLES.map((muscle) => {
          const r = muscleRecovery(muscle, sessions, log)
          const isLogging = logging === muscle
          const detail = [
            r.lastTrained ? daysSince(r.lastTrained) : 'Not trained yet',
            r.soreness !== null ? `Soreness ${r.soreness}/5` : null,
          ]
            .filter(Boolean)
            .join(' · ')
          return (
            <li key={muscle} className="recovery__item">
              <button
                className="recovery__row"
                onClick={() => setLogging(isLogging ? null : muscle)}
              >
                <div className="recovery__row-main">
                  <span className="recovery__muscle">{muscle}</span>
                  {detail && <span className="recovery__detail">{detail}</span>}
                </div>
                <span
                  className={
                    r.status === 'ready'
                      ? 'recovery__status recovery__status--ready'
                      : 'recovery__status'
                  }
                >
                  {STATUS_LABELS[r.status]}
                </span>
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
