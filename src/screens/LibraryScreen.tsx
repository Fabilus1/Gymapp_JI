import { useState } from 'react'
import { ALL_EXERCISES } from '../data/exercises'
import { EXERCISE_IMAGES } from '../data/exerciseImages'
import { getMuscleTarget } from '../data/muscleDetail'
import { findLastPerformance } from '../logic/progression'
import ExerciseDetail from '../components/ExerciseDetail'
import type { Exercise, MuscleGroup, WorkoutSession } from '../types'
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
  if (days === 1) return 'Yday'
  return `${days}d`
}

export default function LibraryScreen({ sessions }: { sessions: WorkoutSession[] }) {
  const [muscle, setMuscle] = useState<MuscleGroup | null>(null)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Exercise | null>(null)

  const results = ALL_EXERCISES.filter(
    (e) =>
      (muscle === null || e.muscle === muscle) &&
      (query === '' || e.name.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div className="library">
      <input
        className="library__search"
        type="text"
        placeholder={`Search ${ALL_EXERCISES.length} exercises`}
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
          const image = EXERCISE_IMAGES[e.id]
          const target = getMuscleTarget(e.id)
          return (
            <li key={e.id} className="library__item">
              <button className="library__row" onClick={() => setSelected(e)}>
                {image ? (
                  <img className="library__thumb" src={image} alt="" loading="lazy" />
                ) : (
                  <span className="library__thumb library__thumb--empty" aria-hidden="true">
                    {e.name.charAt(0)}
                  </span>
                )}
                <div className="library__row-main">
                  <span className="library__name">{e.name}</span>
                  <span className="library__meta">
                    {target ? target.primary.join(', ') : e.muscle} · {e.repRange[0]}–{e.repRange[1]}{' '}
                    reps
                  </span>
                </div>
                <span className="library__last">{last ? daysAgoLabel(last.session.date) : ''}</span>
              </button>
            </li>
          )
        })}
        {results.length === 0 && <li className="library__none">No matches</li>}
      </ul>

      {selected && (
        <ExerciseDetail exercise={selected} sessions={sessions} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
