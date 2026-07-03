import { useEffect, useMemo, useState } from 'react'
import LineChart from '../components/LineChart'
import ExercisePicker from '../components/ExercisePicker'
import { addBodyWeightEntry, getAllBodyWeightEntries, newId } from '../db/db'
import { getExerciseById, EXERCISES } from '../data/exercises'
import { strengthTrend } from '../logic/progression'
import type { BodyWeightEntry, WorkoutSession } from '../types'
import './ProgressScreen.css'

export default function ProgressScreen({ sessions }: { sessions: WorkoutSession[] }) {
  const [entries, setEntries] = useState<BodyWeightEntry[]>([])
  const [weightInput, setWeightInput] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [exerciseId, setExerciseId] = useState<string | null>(null)

  useEffect(() => {
    getAllBodyWeightEntries().then(setEntries)
  }, [])

  // Default the strength chart to the first exercise that actually has history.
  useEffect(() => {
    if (exerciseId !== null || sessions.length === 0) return
    for (const e of EXERCISES) {
      if (strengthTrend(sessions, e.id).length > 0) {
        setExerciseId(e.id)
        return
      }
    }
  }, [sessions, exerciseId])

  async function logWeight() {
    const value = Number(weightInput)
    if (Number.isNaN(value) || value <= 0) return
    const entry: BodyWeightEntry = { id: newId(), date: new Date().toISOString(), weight: value }
    await addBodyWeightEntry(entry)
    setEntries(await getAllBodyWeightEntries())
    setWeightInput('')
  }

  const weightPoints = useMemo(
    () =>
      [...entries]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((e) => ({ date: e.date, value: e.weight })),
    [entries]
  )

  const latest = weightPoints.length > 0 ? weightPoints[weightPoints.length - 1].value : null
  const exercise = exerciseId ? getExerciseById(exerciseId) : null
  const trendPoints = useMemo(
    () =>
      exerciseId
        ? strengthTrend(sessions, exerciseId).map((p) => ({ date: p.date, value: p.weight }))
        : [],
    [sessions, exerciseId]
  )

  return (
    <div className="progress">
      <section className="progress__section">
        <h2 className="progress__heading">Body weight</h2>
        {latest !== null && (
          <p className="progress__big-number">
            {latest}
            <span className="progress__unit"> lb</span>
          </p>
        )}
        <div className="progress__entry">
          <input
            className="progress__input"
            type="text"
            inputMode="decimal"
            placeholder="Today's weight"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
          />
          <button className="progress__log" onClick={logWeight}>
            Log
          </button>
        </div>
        {weightPoints.length > 0 ? (
          <LineChart points={weightPoints} />
        ) : (
          <p className="progress__none">Log your weight to start the chart.</p>
        )}
      </section>

      <section className="progress__section">
        <h2 className="progress__heading">Strength trend</h2>
        <button className="progress__exercise-select" onClick={() => setPickerOpen(true)}>
          {exercise ? exercise.name : 'Choose exercise'}
        </button>
        {trendPoints.length > 0 ? (
          <>
            <p className="progress__big-number">
              {trendPoints[trendPoints.length - 1].value}
              <span className="progress__unit"> lb top set</span>
            </p>
            <LineChart points={trendPoints} />
          </>
        ) : (
          <p className="progress__none">
            {exercise
              ? 'No sessions logged for this exercise yet.'
              : 'Finish a workout to see strength trends.'}
          </p>
        )}
      </section>

      {pickerOpen && (
        <ExercisePicker
          excludeIds={[]}
          onSelect={(id) => {
            setExerciseId(id)
            setPickerOpen(false)
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  )
}
