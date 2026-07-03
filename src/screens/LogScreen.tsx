import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock, Flag, Plus, Target } from 'lucide-react'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import ExercisePicker from '../components/ExercisePicker'
import Sparkline from '../components/Sparkline'
import { getExerciseById } from '../data/exercises'
import { EXERCISE_IMAGES } from '../data/exerciseImages'
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

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 340 : -340, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -340 : 340, opacity: 0 }),
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
  const [[index, direction], setNav] = useState<[number, number]>([0, 0])
  const [, setTick] = useState(0)

  const count = session?.exercises.length ?? 0
  const safeIndex = Math.min(index, Math.max(0, count - 1))

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

  function go(dir: number) {
    const next = safeIndex + dir
    if (next < 0 || next >= count) return
    setNav([next, dir])
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
    setNav([Math.max(0, Math.min(exIndex, next.exercises.length - 1)), -1])
  }

  function addExercise(exerciseId: string) {
    if (!session) return
    const next = structuredClone(session)
    if (!next.exercises.some((e) => e.exerciseId === exerciseId)) {
      next.exercises.push({ exerciseId, sets: [{ weight: 0, reps: 0 }] })
    }
    onChange(next)
    setPickerOpen(false)
    setNav([next.exercises.length - 1, 1])
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

  const entry = session.exercises[safeIndex]
  const exercise = entry ? getExerciseById(entry.exerciseId) : undefined
  const insight = exercise ? coachInsight(exercise, sessions) : null
  const image = entry ? EXERCISE_IMAGES[entry.exerciseId] : undefined
  const trend = entry
    ? strengthTrend(sessions, entry.exerciseId)
        .slice(-8)
        .map((p) => p.weight)
    : []

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

      {count > 0 && entry ? (
        <>
          <div className="log__deck">
            <AnimatePresence mode="popLayout" custom={direction} initial={false}>
              <motion.section
                key={`${entry.exerciseId}-${safeIndex}`}
                className="log__card card"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.55}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -70) go(1)
                  else if (info.offset.x > 70) go(-1)
                }}
              >
                <div className="log__hero">
                  {image && <img className="log__hero-img" src={image} alt="" draggable={false} />}
                  <div className="log__hero-shade" />
                  <div className="log__hero-text">
                    <h3 className="log__exercise-name">{exercise?.name ?? entry.exerciseId}</h3>
                    {insight && (
                      <p className="log__goal">
                        <Target size={13} />
                        {insight.target ??
                          `Target ${exercise?.repRange[0]}–${exercise?.repRange[1]} reps`}
                      </p>
                    )}
                  </div>
                  {trend.length >= 2 && (
                    <div className="log__hero-spark">
                      <Sparkline values={trend} />
                    </div>
                  )}
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
                        onChange={(e) => setValue(safeIndex, setIndex, 'weight', e.target.value)}
                      />
                      <input
                        className="log__input"
                        type="text"
                        inputMode="numeric"
                        value={set.reps === 0 ? '' : String(set.reps)}
                        placeholder="0"
                        onChange={(e) => setValue(safeIndex, setIndex, 'reps', e.target.value)}
                      />
                      <button
                        className="log__remove-set"
                        onClick={() => removeSet(safeIndex, setIndex)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button className="log__add-set" onClick={() => addSet(safeIndex)}>
                    <Plus size={13} /> Add set
                  </button>
                </div>

                <button className="log__remove-exercise" onClick={() => removeExercise(safeIndex)}>
                  Remove exercise
                </button>
              </motion.section>
            </AnimatePresence>
          </div>

          <div className="log__nav">
            <button
              className="log__nav-btn"
              disabled={safeIndex === 0}
              aria-label="Previous exercise"
              onClick={() => go(-1)}
            >
              <ChevronLeft size={20} />
            </button>
            <div className="log__dots">
              {session.exercises.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Exercise ${i + 1}`}
                  className={i === safeIndex ? 'log__dot log__dot--on' : 'log__dot'}
                  onClick={() => setNav([i, i > safeIndex ? 1 : -1])}
                />
              ))}
            </div>
            <button
              className="log__nav-btn"
              disabled={safeIndex === count - 1}
              aria-label="Next exercise"
              onClick={() => go(1)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </>
      ) : (
        <p className="log__empty-deck">All exercises removed — add one below.</p>
      )}

      <button className="log__add-exercise" onClick={() => setPickerOpen(true)}>
        <Plus size={14} /> Add exercise
      </button>

      <div className="log__finish">
        <Button onClick={handleFinish}>
          <Flag size={16} /> Finish Workout
        </Button>
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
