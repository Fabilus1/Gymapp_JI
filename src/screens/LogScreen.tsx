import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import ExercisePicker from '../components/ExercisePicker'
import Sparkline from '../components/Sparkline'
import { getExerciseById } from '../data/exercises'
import { coachInsight } from '../logic/coach'
import { strengthTrend } from '../logic/progression'
import type { WorkoutSession } from '../types'
import './LogScreen.css'

function elapsedLabel(startIso: string): string {
  const secs = Math.max(0, Math.floor((Date.now() - new Date(startIso).getTime()) / 1000))
  const m = Math.floor(secs / 60)
  const s = secs % 60
  if (m >= 60) return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function LogScreen({
  session,
  sessions,
  onChange,
  onFinish,
  onCancel,
  onGoToday,
}: {
  session: WorkoutSession | null
  sessions: WorkoutSession[]
  onChange: (session: WorkoutSession) => void
  onFinish: () => void
  onCancel: () => void
  onGoToday: () => void
}) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [, setTick] = useState(0)

  // Re-render every second while a session is live so the elapsed clock ticks.
  useEffect(() => {
    if (!session) return
    const id = window.setInterval(() => setTick((t) => t + 1), 1000)
    return () => window.clearInterval(id)
  }, [session?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!session) {
    return (
      <EmptyState
        title="No active session"
        description="Start a workout from the Today tab to begin logging sets."
        action={
          <Button variant="secondary" onClick={onGoToday}>
            Go to Today
          </Button>
        }
      />
    )
  }

  function setValue(exIndex: number, setIndex: number, field: 'weight' | 'reps', raw: string) {
    if (!session) return
    const value = raw === '' ? 0 : Number(raw)
    if (Number.isNaN(value) || value < 0) return
    const next = structuredClone(session)
    next.exercises[exIndex].sets[setIndex][field] = value
    onChange(next)
  }

  function addSet(exIndex: number) {
    if (!session) return
    const next = structuredClone(session)
    const sets = next.exercises[exIndex].sets
    const template = sets[sets.length - 1] ?? { weight: 0, reps: 0 }
    sets.push({ ...template })
    onChange(next)
  }

  function removeSet(exIndex: number, setIndex: number) {
    if (!session) return
    const next = structuredClone(session)
    next.exercises[exIndex].sets.splice(setIndex, 1)
    onChange(next)
  }

  function removeExercise(exIndex: number) {
    if (!session) return
    const next = structuredClone(session)
    next.exercises.splice(exIndex, 1)
    onChange(next)
  }

  function addExercise(exerciseId: string) {
    if (!session) return
    const next = structuredClone(session)
    if (!next.exercises.some((e) => e.exerciseId === exerciseId)) {
      next.exercises.push({ exerciseId, sets: [{ weight: 0, reps: 0 }] })
    }
    onChange(next)
    setPickerOpen(false)
  }

  function handleFinish() {
    const logged = session?.exercises.some((e) => e.sets.some((s) => s.weight > 0 || s.reps > 0))
    if (!logged) {
      if (!window.confirm('No sets logged yet. Finish anyway? This will advance your rotation.')) {
        return
      }
    }
    onFinish()
  }

  function handleCancel() {
    if (window.confirm('Discard this workout? Logged sets will be lost.')) {
      onCancel()
    }
  }

  return (
    <div className="log">
      <div className="log__header">
        <div>
          <h2 className="log__day">{session.dayName}</h2>
          <span className="log__elapsed">
            <Clock size={13} /> {elapsedLabel(session.date)}
          </span>
        </div>
        <button className="log__discard" onClick={handleCancel}>
          Discard
        </button>
      </div>

      {session.exercises.map((entry, exIndex) => {
        const exercise = getExerciseById(entry.exerciseId)
        const target = exercise ? coachInsight(exercise, sessions).target : null
        const trend = strengthTrend(sessions, entry.exerciseId)
          .slice(-8)
          .map((p) => p.weight)
        return (
          <section key={`${entry.exerciseId}-${exIndex}`} className="log__exercise">
            <div className="log__exercise-head">
              <div className="log__exercise-title">
                <h3 className="log__exercise-name">{exercise?.name ?? entry.exerciseId}</h3>
                {exercise && (
                  <p className="log__exercise-range">
                    {target ?? `Target ${exercise.repRange[0]}–${exercise.repRange[1]} reps`}
                  </p>
                )}
              </div>
              <div className="log__exercise-side">
                <Sparkline values={trend} />
                <button className="log__remove-exercise" onClick={() => removeExercise(exIndex)}>
                  Remove
                </button>
              </div>
            </div>

            <div className="log__sets">
              <div className="log__set-labels">
                <span>Set</span>
                <span>lb</span>
                <span>Reps</span>
                <span />
              </div>
              {entry.sets.map((set, setIndex) => (
                <div key={setIndex} className="log__set">
                  <span className="log__set-num">{setIndex + 1}</span>
                  <input
                    className="log__input"
                    type="text"
                    inputMode="decimal"
                    value={set.weight === 0 ? '' : String(set.weight)}
                    placeholder="0"
                    onChange={(e) => setValue(exIndex, setIndex, 'weight', e.target.value)}
                  />
                  <input
                    className="log__input"
                    type="text"
                    inputMode="numeric"
                    value={set.reps === 0 ? '' : String(set.reps)}
                    placeholder="0"
                    onChange={(e) => setValue(exIndex, setIndex, 'reps', e.target.value)}
                  />
                  <button className="log__remove-set" onClick={() => removeSet(exIndex, setIndex)}>
                    ×
                  </button>
                </div>
              ))}
              <button className="log__add-set" onClick={() => addSet(exIndex)}>
                Add set
              </button>
            </div>
          </section>
        )
      })}

      <button className="log__add-exercise" onClick={() => setPickerOpen(true)}>
        Add exercise
      </button>

      <div className="log__finish">
        <Button onClick={handleFinish}>Finish Workout</Button>
      </div>

      {pickerOpen && (
        <ExercisePicker
          excludeIds={session.exercises.map((e) => e.exerciseId)}
          onSelect={addExercise}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  )
}
