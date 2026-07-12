import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, Flame } from 'lucide-react'
import { getExerciseById } from '../data/exercises'
import { sessionMuscles } from '../logic/sessionMuscles'
import { formatWeight } from '../logic/units'
import MuscleDiagram from './MuscleDiagram'
import type { Units } from '../logic/units'
import type { WorkoutSession } from '../types'
import './WorkoutCalendar.css'

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function dateKey(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`
}

function durationLabel(session: WorkoutSession): string | null {
  if (!session.endedAt) return null
  const mins = Math.round((new Date(session.endedAt).getTime() - new Date(session.date).getTime()) / 60000)
  if (mins < 1) return null
  if (mins < 60) return `${mins} min`
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}

export default function WorkoutCalendar({
  sessions,
  units,
}: {
  sessions: WorkoutSession[]
  units: Units
}) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  const byDay = useMemo(() => {
    const map = new Map<string, WorkoutSession[]>()
    for (const s of sessions) {
      const key = dateKey(s.date)
      map.set(key, [...(map.get(key) ?? []), s])
    }
    return map
  }, [sessions])

  const monthLabel = cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate()
  const firstWeekday = (new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay() + 6) % 7 // Mon-first
  const todayKey = dateKey(new Date().toISOString())

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const selectedSessions = selectedKey ? byDay.get(selectedKey) ?? [] : []

  return (
    <div className="wcal">
      <div className="wcal__head">
        <button
          className="wcal__nav"
          aria-label="Previous month"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
        >
          <ChevronLeft size={18} />
        </button>
        <span className="wcal__month">{monthLabel}</span>
        <button
          className="wcal__nav"
          aria-label="Next month"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="wcal__grid">
        {DAY_LABELS.map((l, i) => (
          <span key={`${l}-${i}`} className="wcal__daylabel">
            {l}
          </span>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <span key={`pad-${i}`} />
          const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const worked = byDay.has(key)
          const classes = [
            'wcal__day',
            worked && 'wcal__day--worked',
            key === todayKey && 'wcal__day--today',
            key === selectedKey && 'wcal__day--selected',
          ]
            .filter(Boolean)
            .join(' ')
          return (
            <button
              key={key}
              className={classes}
              onClick={() => setSelectedKey(worked ? key : null)}
            >
              {day}
            </button>
          )
        })}
      </div>

      {selectedSessions.length > 0 && (
        <div className="wcal__detail card">
          {selectedSessions.map((s) => {
            const duration = durationLabel(s)
            const muscles = sessionMuscles(s)
            const hasMuscles = muscles.primary.length > 0 || muscles.secondary.length > 0
            return (
              <div key={s.id} className="wcal__session">
                <div className="wcal__session-head">
                  <span className="wcal__session-name">{s.dayName}</span>
                  <span className="wcal__session-tags">
                    {s.rpe && (
                      <span className="wcal__session-rpe" title="Session RPE">
                        <Flame size={12} /> RPE {s.rpe}
                      </span>
                    )}
                    {duration && (
                      <span className="wcal__session-duration">
                        <Clock size={12} /> {duration}
                      </span>
                    )}
                  </span>
                </div>

                {hasMuscles && (
                  <div className="wcal__session-map">
                    <MuscleDiagram primary={muscles.primary} secondary={muscles.secondary} />
                  </div>
                )}

                <ul className="wcal__session-list">
                  {s.exercises.map((e, i) => {
                    const sets = e?.sets ?? []
                    // guard against empty/legacy sets → no Math.max(...[]) = -Infinity
                    const topWeight = sets.length ? Math.max(...sets.map((x) => x?.weight ?? 0)) : 0
                    return (
                      <li key={`${e.exerciseId}-${i}`} className="wcal__session-ex">
                        <span className="wcal__session-ex-name">
                          {getExerciseById(e.exerciseId)?.name ?? e.exerciseId}
                        </span>
                        <span className="wcal__session-ex-sets">
                          {formatWeight(topWeight, units)} × {sets.map((x) => x?.reps ?? 0).join(', ')}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
