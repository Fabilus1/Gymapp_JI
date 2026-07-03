import { useEffect, useMemo, useState } from 'react'
import LineChart from '../components/LineChart'
import ExercisePicker from '../components/ExercisePicker'
import WorkoutCalendar from '../components/WorkoutCalendar'
import { addBodyWeightEntry, getAllBodyWeightEntries, newId } from '../db/db'
import { getExerciseById, EXERCISES } from '../data/exercises'
import { strengthTrend } from '../logic/progression'
import type { BodyWeightEntry, WorkoutSession } from '../types'
import './ProgressScreen.css'

const WEEK_MS = 7 * 86400000

export default function ProgressScreen({ sessions }: { sessions: WorkoutSession[] }) {
  const [entries, setEntries] = useState<BodyWeightEntry[]>([])
  const [mode, setMode] = useState<'slider' | 'type'>('slider')
  const [weightInput, setWeightInput] = useState('')
  const [sliderValue, setSliderValue] = useState<number | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [exerciseId, setExerciseId] = useState<string | null>(null)
  const [justLogged, setJustLogged] = useState(false)

  useEffect(() => {
    getAllBodyWeightEntries().then(setEntries)
  }, [])

  useEffect(() => {
    if (exerciseId !== null || sessions.length === 0) return
    for (const e of EXERCISES) {
      if (strengthTrend(sessions, e.id).length > 0) {
        setExerciseId(e.id)
        return
      }
    }
  }, [sessions, exerciseId])

  const latest = entries.length > 0 ? entries[0] : null
  const loggedThisWeek =
    latest !== null && Date.now() - new Date(latest.date).getTime() <= WEEK_MS

  // Slider centers on the last known weight (sane default range otherwise).
  const sliderCenter = latest?.weight ?? 175
  const sliderMin = Math.max(60, Math.round(sliderCenter - 25))
  const sliderMax = Math.round(sliderCenter + 25)
  const sliderCurrent = sliderValue ?? sliderCenter

  async function logWeight(value: number) {
    if (Number.isNaN(value) || value <= 0) return
    const entry: BodyWeightEntry = { id: newId(), date: new Date().toISOString(), weight: value }
    await addBodyWeightEntry(entry)
    setEntries(await getAllBodyWeightEntries())
    setWeightInput('')
    setSliderValue(null)
    setJustLogged(true)
    window.setTimeout(() => setJustLogged(false), 2500)
  }

  const weightPoints = useMemo(
    () =>
      [...entries]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((e) => ({ date: e.date, value: e.weight })),
    [entries]
  )

  const exercise = exerciseId ? getExerciseById(exerciseId) : null
  const trendPoints = useMemo(
    () =>
      exerciseId
        ? strengthTrend(sessions, exerciseId).map((p) => ({ date: p.date, value: p.weight }))
        : [],
    [sessions, exerciseId]
  )

  const delta =
    weightPoints.length >= 2
      ? weightPoints[weightPoints.length - 1].value - weightPoints[0].value
      : null

  return (
    <div className="progress">
      <section className="progress__section">
        <h2 className="eyebrow">History</h2>
        <WorkoutCalendar sessions={sessions} />
      </section>

      <section className="progress__section">
        <div className="progress__head">
          <h2 className="eyebrow">Body weight</h2>
          <span className="progress__cadence">
            {justLogged ? 'Logged ✓' : loggedThisWeek ? 'Logged this week' : 'Weekly check-in due'}
          </span>
        </div>

        {latest && (
          <p className="progress__big-number">
            {latest.weight}
            <span className="progress__unit"> lb</span>
            {delta !== null && delta !== 0 && (
              <span className="progress__delta">
                {' '}
                {delta > 0 ? '+' : ''}
                {Math.round(delta * 10) / 10} all-time
              </span>
            )}
          </p>
        )}

        <div className="progress__modes" role="tablist">
          <button
            role="tab"
            aria-selected={mode === 'slider'}
            className={mode === 'slider' ? 'progress__mode progress__mode--on' : 'progress__mode'}
            onClick={() => setMode('slider')}
          >
            Slider
          </button>
          <button
            role="tab"
            aria-selected={mode === 'type'}
            className={mode === 'type' ? 'progress__mode progress__mode--on' : 'progress__mode'}
            onClick={() => setMode('type')}
          >
            Type it
          </button>
        </div>

        {mode === 'slider' ? (
          <div className="progress__slider-block">
            <p className="progress__slider-value">
              {sliderCurrent}
              <span className="progress__unit"> lb</span>
            </p>
            <input
              className="progress__slider"
              type="range"
              min={sliderMin}
              max={sliderMax}
              step={0.5}
              value={sliderCurrent}
              style={{ '--fill': `${((sliderCurrent - sliderMin) / (sliderMax - sliderMin)) * 100}%` } as React.CSSProperties}
              onChange={(e) => setSliderValue(Number(e.target.value))}
            />
            <div className="progress__slider-range">
              <span>{sliderMin}</span>
              <span>{sliderMax}</span>
            </div>
            <button className="progress__log" onClick={() => logWeight(sliderCurrent)}>
              Log {sliderCurrent} lb
            </button>
          </div>
        ) : (
          <div className="progress__entry">
            <input
              className="progress__input"
              type="text"
              inputMode="decimal"
              placeholder="Weight in lb"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
            />
            <button className="progress__log" onClick={() => logWeight(Number(weightInput))}>
              Log
            </button>
          </div>
        )}

        {weightPoints.length > 1 ? (
          <LineChart points={weightPoints} />
        ) : (
          <p className="progress__none">
            {weightPoints.length === 1
              ? 'One entry down — the chart starts with your next weekly check-in.'
              : 'Log your weight to start the chart.'}
          </p>
        )}
      </section>

      <section className="progress__section">
        <h2 className="eyebrow">Strength trend</h2>
        <button className="progress__exercise-select" onClick={() => setPickerOpen(true)}>
          {exercise ? exercise.name : 'Choose exercise'}
          <span className="progress__exercise-chevron">›</span>
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
