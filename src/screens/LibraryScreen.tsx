import { useState } from 'react'
import { EXERCISES } from '../data/exercises'
import { findLastPerformance } from '../logic/progression'
import type { MuscleGroup, WorkoutSession } from '../types'
import './LibraryScreen.css'

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

function daysAgoLabel(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days}d ago`
}

export default function LibraryScreen({ sessions }: { sessions: WorkoutSession[] }) {
  const [muscle, setMuscle] = useState<MuscleGroup | null>(null)
  const [query, setQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const results = EXERCISES.filter(
    (e) =>
      (muscle === null || e.muscle === muscle) &&
      (query === '' || e.name.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div className="library">
      <input
        className="library__search"
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="library__filters">
        <button
          className={muscle === null ? 'library__filter library__filter--active' : 'library__filter'}
          onClick={() => setMuscle(null)}
        >
          All
        </button>
        {MUSCLES.map((m) => (
          <button
            key={m}
            className={muscle === m ? 'library__filter library__filter--active' : 'library__filter'}
            onClick={() => setMuscle(muscle === m ? null : m)}
          >
            {m}
          </button>
        ))}
      </div>

      <ul className="library__list">
        {results.map((e) => {
          const last = findLastPerformance(sessions, e.id)
          const expanded = expandedId === e.id
          return (
            <li key={e.id} className="library__item">
              <button
                className="library__row"
                onClick={() => setExpandedId(expanded ? null : e.id)}
              >
                <div className="library__row-main">
                  <span className="library__name">{e.name}</span>
                  <span className="library__meta">
                    {e.muscle} · {e.type} · {e.repRange[0]}–{e.repRange[1]} reps
                  </span>
                </div>
                <span className="library__last">
                  {last ? daysAgoLabel(last.session.date) : '—'}
                </span>
              </button>
              {expanded && (
                <div className="library__detail">
                  <p className="library__cue">{e.cue}</p>
                  {last && (
                    <p className="library__history">
                      Last: {Math.max(...last.sets.map((s) => s.weight))} lb ×{' '}
                      {last.sets.map((s) => s.reps).join(', ')}
                    </p>
                  )}
                </div>
              )}
            </li>
          )
        })}
        {results.length === 0 && <li className="library__none">No matches</li>}
      </ul>
    </div>
  )
}
