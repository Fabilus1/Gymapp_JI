import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Plus } from 'lucide-react'
import { ALL_EXERCISES, getExerciseById } from '../data/exercises'
import { getMuscleTarget } from '../data/muscleDetail'
import { searchExercises } from '../logic/search'
import { useDebounced } from '../hooks/useDebounced'
import ExerciseImage from './ExerciseImage'
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
  const [previewId, setPreviewId] = useState<string | null>(null)

  // 300ms debounce + memo so keystrokes don't re-filter 370 exercises on
  // every input event (the source of the add-to-plan lag).
  const debouncedQuery = useDebounced(query, 300)
  const excludeKey = excludeIds.join(',')
  const results = useMemo(
    () => searchExercises(ALL_EXERCISES.filter((e) => !excludeIds.includes(e.id)), debouncedQuery),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedQuery, excludeKey]
  )

  const preview = previewId ? getExerciseById(previewId) : null
  const target = previewId ? getMuscleTarget(previewId) : undefined

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
              <button className="picker__item" onClick={() => setPreviewId(e.id)}>
                <ExerciseImage exerciseId={e.id} className="picker__thumb" />
                <span className="picker__item-main">
                  <span className="picker__item-name">{e.name}</span>
                  <span className="picker__muscle">{e.muscle}</span>
                </span>
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="picker__none">No matches</li>}
        </ul>

        <AnimatePresence>
          {preview && (
            <motion.div
              className="picker__preview"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 420, damping: 40 }}
            >
              <button className="picker__preview-back" onClick={() => setPreviewId(null)}>
                <ChevronLeft size={16} /> Back
              </button>

              <ExerciseImage exerciseId={preview.id} variant="hero" className="picker__preview-img" />

              <h2 className="picker__preview-name">{preview.name}</h2>
              <p className="picker__preview-meta">
                {preview.muscle} · {preview.type} · {preview.repRange[0]}–{preview.repRange[1]} reps
              </p>

              {target && (target.primary.length > 0 || target.secondary.length > 0) && (
                <div className="picker__chips">
                  {target.primary.map((m) => (
                    <span key={m} className="picker__chip picker__chip--primary">
                      {m}
                    </span>
                  ))}
                  {target.secondary.map((m) => (
                    <span key={m} className="picker__chip">
                      {m}
                    </span>
                  ))}
                </div>
              )}

              <p className="picker__preview-cue">{preview.cue}</p>

              <button className="picker__add-btn" onClick={() => onSelect(preview.id)}>
                <Plus size={17} /> Add to Plan
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
