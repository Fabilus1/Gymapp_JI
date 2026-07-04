import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  Info,
  Layers,
  List,
  Plus,
  Target,
} from 'lucide-react'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import ExercisePicker from '../components/ExercisePicker'
import PRCelebration from '../components/PRCelebration'
import Sparkline from '../components/Sparkline'
import { getExerciseById } from '../data/exercises'
import { EXERCISE_IMAGES } from '../data/exerciseImages'
import { coachInsight } from '../logic/coach'
import { bestE1rm, e1rm, strengthTrend } from '../logic/progression'
import { recallSettingsNote } from '../hooks/useAppData'
import { useElapsed } from '../hooks/useElapsed'
import type { SetType, WorkoutSession } from '../types'
import './LogScreen.css'

const SET_TYPE_ORDER: SetType[] = ['R', 'W', 'F', 'P', 'M']

const SET_TYPE_INFO: Record<SetType, { label: string; hint: string }> = {
  W: { label: 'Warmup', hint: 'Not counted toward progression, PRs, or volume' },
  R: { label: 'Regular', hint: 'A normal working set' },
  F: { label: 'Failure', hint: 'Taken all the way to muscular failure' },
  P: { label: 'Partials', hint: 'Partial range reps, usually after failure' },
  M: { label: 'Myo-reps', hint: 'Short-rest mini-sets after an activation set' },
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
  const [legendOpen, setLegendOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'focus' | 'overview'>('focus')
  const [[index, direction], setNav] = useState<[number, number]>([0, 0])
  const [pr, setPr] = useState<{ id: number; value: number; name: string } | null>(null)
  const elapsed = useElapsed(session?.date ?? null)

  // Historical bests (this session excluded — it isn't in `sessions` until finished).
  const historicalBests = useMemo(() => {
    const map = new Map<string, number>()
    for (const e of session?.exercises ?? []) {
      map.set(e.exerciseId, bestE1rm(sessions, e.exerciseId))
    }
    return map
  }, [sessions, session?.exercises])

  const count = session?.exercises.length ?? 0
  const safeIndex = Math.min(index, Math.max(0, count - 1))

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

  function mutate(fn: (draft: WorkoutSession) => void) {
    if (!session) return
    const next = structuredClone(session)
    fn(next)
    onChange(next)
  }

  function setValue(exIndex: number, setIndex: number, field: 'weight' | 'reps', raw: string) {
    const value = raw === '' ? 0 : Number(raw)
    if (Number.isNaN(value) || value < 0) return
    mutate((d) => {
      d.exercises[exIndex].sets[setIndex][field] = value
    })
  }

  function setRir(exIndex: number, setIndex: number, raw: string) {
    mutate((d) => {
      if (raw === '') {
        delete d.exercises[exIndex].sets[setIndex].rir
      } else {
        const value = Number(raw)
        if (Number.isNaN(value) || value < 0 || value > 9) return
        d.exercises[exIndex].sets[setIndex].rir = value
      }
    })
  }

  function cycleSetType(exIndex: number, setIndex: number) {
    mutate((d) => {
      const set = d.exercises[exIndex].sets[setIndex]
      if (set.logged) return // locked rows don't change type
      const current = set.type ?? 'R'
      const next = SET_TYPE_ORDER[(SET_TYPE_ORDER.indexOf(current) + 1) % SET_TYPE_ORDER.length]
      if (next === 'R') delete set.type
      else set.type = next
    })
  }

  function toggleLogged(exIndex: number, setIndex: number) {
    if (!session) return
    const entry = session.exercises[exIndex]
    const set = entry.sets[setIndex]
    const turningOn = set.logged !== true

    if (turningOn && (set.type ?? 'R') !== 'W') {
      const historical = historicalBests.get(entry.exerciseId) ?? 0
      const sessionPrior = Math.max(
        0,
        ...entry.sets
          .filter((s, i) => i !== setIndex && s.logged && s.type !== 'W')
          .map((s) => e1rm(s.weight, s.reps))
      )
      const est = e1rm(set.weight, set.reps)
      // Only celebrate genuine improvements over an existing history —
      // a first-ever session would otherwise "PR" on every set.
      if (historical > 0 && est > historical && est > sessionPrior) {
        const exercise = getExerciseById(entry.exerciseId)
        setPr({ id: Date.now(), value: Math.round(est), name: exercise?.name ?? '' })
        window.setTimeout(() => setPr((p) => (p && Date.now() - p.id >= 2100 ? null : p)), 2200)
      }
    }

    mutate((d) => {
      d.exercises[exIndex].sets[setIndex].logged = turningOn
    })
  }

  function addSet(exIndex: number) {
    mutate((d) => {
      const sets = d.exercises[exIndex].sets
      const template = sets[sets.length - 1] ?? { weight: 0, reps: 0 }
      sets.push({ weight: template.weight, reps: template.reps })
    })
  }

  function removeSet(exIndex: number, setIndex: number) {
    mutate((d) => {
      d.exercises[exIndex].sets.splice(setIndex, 1)
    })
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
      next.exercises.push({
        exerciseId,
        sets: [{ weight: 0, reps: 0 }],
        settingsNote: recallSettingsNote(sessions, exerciseId),
      })
    }
    onChange(next)
    setPickerOpen(false)
    setNav([next.exercises.length - 1, 1])
    setViewMode('focus')
  }

  function handleFinish() {
    const logged = session?.exercises.some((e) => e.sets.some((s) => s.logged))
    if (!logged) {
      if (
        !window.confirm(
          'No sets confirmed with the ✓ button yet — nothing will be saved. Finish anyway? This advances your rotation.'
        )
      ) {
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
            <Clock size={13} /> {elapsed}
          </span>
        </div>
        <div className="log__header-actions">
          <button
            className="log__legend-btn"
            aria-label="Set type legend"
            onClick={() => setLegendOpen((o) => !o)}
          >
            <Info size={16} />
          </button>
          <button className="log__discard" onClick={handleCancel}>
            Discard
          </button>
        </div>
      </div>

      {legendOpen && (
        <div className="log__legend">
          {SET_TYPE_ORDER.map((t) => (
            <div key={t} className="log__legend-row">
              <span className={`st st--${t}`}>{t}</span>
              <span className="log__legend-label">{SET_TYPE_INFO[t].label}</span>
              <span className="log__legend-hint">{SET_TYPE_INFO[t].hint}</span>
            </div>
          ))}
          <div className="log__legend-row">
            <span className="st st--check">
              <Check size={11} />
            </span>
            <span className="log__legend-label">Log</span>
            <span className="log__legend-hint">
              Confirms a set. Only ✓-logged sets are saved when you finish.
            </span>
          </div>
        </div>
      )}

      <div className="log__viewswitch" role="tablist" aria-label="Workout view">
        <button
          role="tab"
          aria-selected={viewMode === 'focus'}
          className={viewMode === 'focus' ? 'log__view log__view--on' : 'log__view'}
          onClick={() => setViewMode('focus')}
        >
          <Layers size={13} /> Focus
        </button>
        <button
          role="tab"
          aria-selected={viewMode === 'overview'}
          className={viewMode === 'overview' ? 'log__view log__view--on' : 'log__view'}
          onClick={() => setViewMode('overview')}
        >
          <List size={13} /> Overview
        </button>
      </div>

      {count === 0 && <p className="log__empty-deck">All exercises removed — add one below.</p>}

      {viewMode === 'overview' && count > 0 && (
        <ul className="log__overview">
          {session.exercises.map((e, i) => {
            const ex = getExerciseById(e.exerciseId)
            const done = e.sets.filter((s) => s.logged).length
            const complete = done === e.sets.length && e.sets.length > 0
            return (
              <li key={`${e.exerciseId}-${i}`}>
                <button
                  className="log__overview-row"
                  onClick={() => {
                    setNav([i, i > safeIndex ? 1 : -1])
                    setViewMode('focus')
                  }}
                >
                  <div className="log__overview-main">
                    <span className="log__overview-name">{ex?.name ?? e.exerciseId}</span>
                    <span className="log__overview-muscle">{ex?.muscle}</span>
                  </div>
                  <span
                    className={
                      complete
                        ? 'log__overview-progress log__overview-progress--done'
                        : 'log__overview-progress'
                    }
                  >
                    {complete && <Check size={13} />}
                    {done}/{e.sets.length} sets
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {viewMode === 'focus' && count > 0 && entry && (
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

                <input
                  className="log__settings-note"
                  type="text"
                  value={entry.settingsNote ?? ''}
                  placeholder="Machine setup — e.g. Seat 4, Pin 12"
                  onChange={(e) => {
                    const raw = e.target.value
                    mutate((d) => {
                      if (raw === '') delete d.exercises[safeIndex].settingsNote
                      else d.exercises[safeIndex].settingsNote = raw
                    })
                  }}
                />

                <div className="log__sets">
                  <div className="log__set-labels">
                    <span>Type</span>
                    <span>lb</span>
                    <span>Reps</span>
                    <span title="Reps in Reserve">RIR</span>
                    <span>Log</span>
                    <span />
                  </div>
                  {entry.sets.map((set, setIndex) => {
                    const type = set.type ?? 'R'
                    const locked = set.logged === true
                    return (
                      <div
                        key={setIndex}
                        className={locked ? 'log__set log__set--locked' : 'log__set'}
                      >
                        <button
                          className={`st st--${type}`}
                          aria-label={`Set type: ${SET_TYPE_INFO[type].label}`}
                          onClick={() => cycleSetType(safeIndex, setIndex)}
                        >
                          {type}
                        </button>
                        <input
                          className="log__input"
                          type="text"
                          inputMode="decimal"
                          value={set.weight === 0 ? '' : String(set.weight)}
                          placeholder="0"
                          readOnly={locked}
                          onChange={(e) => setValue(safeIndex, setIndex, 'weight', e.target.value)}
                        />
                        <input
                          className="log__input"
                          type="text"
                          inputMode="numeric"
                          value={set.reps === 0 ? '' : String(set.reps)}
                          placeholder="0"
                          readOnly={locked}
                          onChange={(e) => setValue(safeIndex, setIndex, 'reps', e.target.value)}
                        />
                        <input
                          className="log__input log__input--rir"
                          type="text"
                          inputMode="numeric"
                          value={set.rir === undefined ? '' : String(set.rir)}
                          placeholder="–"
                          readOnly={locked}
                          onChange={(e) => setRir(safeIndex, setIndex, e.target.value)}
                        />
                        <button
                          className={locked ? 'log__check log__check--on' : 'log__check'}
                          aria-label={locked ? 'Unlock set' : 'Log set'}
                          onClick={() => toggleLogged(safeIndex, setIndex)}
                        >
                          <Check size={15} />
                        </button>
                        <button
                          className="log__remove-set"
                          onClick={() => removeSet(safeIndex, setIndex)}
                        >
                          ×
                        </button>
                      </div>
                    )
                  })}
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

      <AnimatePresence>
        {pr && <PRCelebration key={pr.id} value={pr.value} name={pr.name} />}
      </AnimatePresence>
    </div>
  )
}
