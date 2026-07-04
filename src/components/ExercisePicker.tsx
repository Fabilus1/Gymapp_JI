import { useState } from 'react'
import { ALL_EXERCISES } from '../data/exercises'
import { searchExercises } from '../logic/search'
import './ExercisePicker.css'

export default function ExercisePicker({
  excludeIds,
  onSelect,
  onClose,
}: {
  excludeIds: string[]
  onSelect: (exerciseId: string) => void
  onClose: () => void
}) {
  const [query, setQuery] = useState('')

  const results = searchExercises(
    ALL_EXERCISES.filter((e) => !excludeIds.includes(e.id)),
    query
  )

  return (
    <div className="picker" onClick={onClose}>
      <div className="picker__sheet" onClick={(e) => e.stopPropagation()}>
        <div className="picker__bar">
          <input
            className="picker__search"
            type="text"
            placeholder="Search exercises"
            value={query}
            autoFocus
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="picker__close" onClick={onClose}>
            Close
          </button>
        </div>
        <ul className="picker__list">
          {results.map((e) => (
            <li key={e.id}>
              <button className="picker__item" onClick={() => onSelect(e.id)}>
                <span>{e.name}</span>
                <span className="picker__muscle">{e.muscle}</span>
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="picker__none">No matches</li>}
        </ul>
      </div>
    </div>
  )
}
