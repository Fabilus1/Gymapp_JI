import { useMemo, useState } from 'react'
import { Star } from 'lucide-react'
import { ALL_EXERCISES } from '../data/exercises'
import { getMuscleTarget } from '../data/muscleDetail'
import { buildHistoryIndex, lastPerformanceFromIndex } from '../logic/history'
import { searchExercises } from '../logic/search'
import ExerciseDetail from '../components/ExerciseDetail'
import ExerciseImage from '../components/ExerciseImage'
import { useApp } from '../context/AppDataContext'
import type { Exercise, MuscleGroup } from '../types'
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

// "smith" is a pseudo-type: those exercises store equipment 'machine' but
// carry "(Smith Machine)" in the strict name. Plain "machine" excludes them.
type EquipFilter = 'barbell' | 'dumbbell' | 'machine' | 'smith' | 'cable' | 'bodyweight'

const EQUIP_FILTERS: { value: EquipFilter; label: string }[] = [
  { value: 'barbell', label: 'Barbell' },
  { value: 'dumbbell', label: 'Dumbbell' },
  { value: 'machine', label: 'Machine' },
  { value: 'smith', label: 'Smith machine' },
  { value: 'cable', label: 'Cable' },
  { value: 'bodyweight', label: 'Bodyweight' },
]

function matchesEquip(e: Exercise, filter: EquipFilter): boolean {
  const isSmith = e.name.includes('(Smith')
  if (filter === 'smith') return isSmith
  if (filter === 'machine') return e.equipment === 'machine' && !isSmith
  return e.equipment === filter
}

function daysAgoLabel(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yday'
  return `${days}d`
}

export default function LibraryScreen() {
  const { sessions } = useApp()
  const [muscle, setMuscle] = useState<MuscleGroup | null>(null)
  const [equip, setEquip] = useState<EquipFilter | null>(null)
  const [frequent, setFrequent] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Exercise | null>(null)

  // One pass over history instead of rescanning it per exercise row.
  const historyIndex = useMemo(() => buildHistoryIndex(sessions), [sessions])

  const results = useMemo(() => {
    let list = ALL_EXERCISES
    if (muscle !== null) list = list.filter((e) => e.muscle === muscle)
    if (equip !== null) list = list.filter((e) => matchesEquip(e, equip))
    list = searchExercises(list, query)
    if (frequent) {
      // only exercises you've actually done, most-performed first
      list = list
        .filter((e) => (historyIndex.get(e.id)?.length ?? 0) > 0)
        .sort(
          (a, b) => (historyIndex.get(b.id)?.length ?? 0) - (historyIndex.get(a.id)?.length ?? 0)
        )
    }
    return list
  }, [muscle, equip, query, frequent, historyIndex])

  return (
    <div className="library">
      <input
        className="library__search"
        type="text"
        placeholder={`Search ${ALL_EXERCISES.length} exercises`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* muscle row, with Frequent pinned first */}
      <div className="library__filters">
        <button
          className={
            frequent ? 'library__filter library__filter--active' : 'library__filter'
          }
          onClick={() => setFrequent((v) => !v)}
        >
          <Star size={12} className="library__star" /> Frequent
        </button>
        <button
          className={
            muscle === null && !frequent
              ? 'library__filter library__filter--active'
              : 'library__filter'
          }
          onClick={() => {
            setMuscle(null)
            setFrequent(false)
          }}
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

      {/* equipment row */}
      <div className="library__filters library__filters--equip">
        <button
          className={equip === null ? 'library__filter library__filter--active' : 'library__filter'}
          onClick={() => setEquip(null)}
        >
          Any equipment
        </button>
        {EQUIP_FILTERS.map((f) => (
          <button
            key={f.value}
            className={
              equip === f.value ? 'library__filter library__filter--active' : 'library__filter'
            }
            onClick={() => setEquip(equip === f.value ? null : f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="library__list">
        {results.map((e) => {
          const last = lastPerformanceFromIndex(historyIndex, e.id)
          const target = getMuscleTarget(e.id)
          const count = historyIndex.get(e.id)?.length ?? 0
          return (
            <li key={e.id} className="library__item">
              <button className="library__row" onClick={() => setSelected(e)}>
                <ExerciseImage exerciseId={e.id} variant="thumb" />
                <div className="library__row-main">
                  <span className="library__name">{e.name}</span>
                  <span className="library__meta">
                    {target ? target.primary.join(', ') : e.muscle} · {e.repRange[0]}–{e.repRange[1]}{' '}
                    reps
                  </span>
                </div>
                <span className="library__last">
                  {frequent && count > 0 ? `${count}×` : last ? daysAgoLabel(last.date) : ''}
                </span>
              </button>
            </li>
          )
        })}
        {results.length === 0 && (
          <li className="library__none">
            {frequent ? 'Nothing logged yet — finish a workout first.' : 'No matches'}
          </li>
        )}
      </ul>

      {selected && (
        <ExerciseDetail exercise={selected} sessions={sessions} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
