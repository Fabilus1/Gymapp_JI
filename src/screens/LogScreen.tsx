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
  Link2,
  List,
  Minus,
  Plus,
  Target,
  Weight,
} from 'lucide-react'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import ExercisePicker from '../components/ExercisePicker'
import ExerciseImage from '../components/ExerciseImage'
import PRCelebration from '../components/PRCelebration'
import PlateCalculator from '../components/PlateCalculator'
import FinishModal from '../components/FinishModal'
import Sparkline from '../components/Sparkline'
import { getExerciseById } from '../data/exercises'
import { coachInsight } from '../logic/coach'
import { e1rm } from '../logic/progression'
import {
  buildHistoryIndex,
  bestE1rmFromIndex,
  strengthTrendFromIndex,
} from '../logic/history'
import { vibrate } from '../logic/haptics'
import { displayWeightStr, fromDisplayWeight } from '../logic/units'
import { useApp } from '../context/AppDataContext'
import { recallSettingsNote } from '../hooks/useAppData'
import { useElapsed } from '../hooks/useElapsed'
import type { Exercise, SessionExercise, SetType, WorkoutSession } from '../types'
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

/** Group consecutive exercises linked by supersetNext into single focus cards. */
function buildGroups(exercises: SessionExercise[]): number[][] {
  const groups: number[][] = []
  let i = 0
  while (i < exercises.length) {
    const g = [i]
    let last = i
    while (exercises[last]?.supersetNext && last + 1 < exercises.length) {
      g.push(last + 1)
      last++
    }
    groups.push(g)
    i = last + 1
  }
  return groups
}

/** Barbell and Smith-machine lifts get the plate calculator. */
function usesBar(exercise: Exercise | undefined): boolean {
  if (!exercise) return false
  return exercise.equipment === 'barbell' || exercise.name.includes('Smith Machine')
}

export default function LogScreen({
  onFinish,
  onCancel,
  onGoToday,
  onSetLogged,
}: {
  onFinish: (rpe?: number) => void
  onCancel: () => void
  onGoToday: () => void
  /** fired when a set is confirmed, so the parent can auto-start the rest timer */
  onSetLogged: (isCompound: boolean) => void
}) {
  const { activeSession: session, sessions, units, updateActiveSession: onChange } = useApp()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [legendOpen, setLegendOpen] = useState(false)
  const [finishOpen, setFinishOpen] = useState(false)
  // Raw text of the weight field being typed, so "37." survives re-render
  // (the input stores lb but shows the display unit). Keyed "exIdx:setIdx".
  const [weightDrafts, setWeightDrafts] = useState<Record<string, string>>({})
  const [viewMode, setViewMode] = useState<'focus' | 'overview'>('focus')
  const [[groupIdx, direction], setNav] = useState<[number, number]>([0, 0])
  const [pr, setPr] = useState<{ id: number; value: number; name: string } | null>(null)
  const [plateWeight, setPlateWeight] = useState<number | null>(null)
  const elapsed = useElapsed(session?.date ?? null)

  // Build the per-exercise history once, then pull bests/trends from it.
  const historyIndex = useMemo(() => buildHistoryIndex(sessions), [sessions])

  const historicalBests = useMemo(() => {
    const map = new Map<string, number>()
    for (const e of session?.exercises ?? []) {
      map.set(e.exerciseId, bestE1rmFromIndex(historyIndex, e.exerciseId))
    }
    return map
  }, [historyIndex, session?.exercises])

  const groups = useMemo(() => buildGroups(session?.exercises ?? []), [session?.exercises])

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

  const count = session.exercises.length
  const groupCount = groups.length
  const safeGroup = Math.min(groupIdx, Math.max(0, groupCount - 1))
  const currentGroup = groups[safeGroup] ?? []

  function go(dir: number) {
    const next = safeGroup + dir
    if (next < 0 || next >= groupCount) return
    setNav([next, dir])
  }

  function focusExercise(exIndex: number) {
    const gi = groups.findIndex((g) => g.includes(exIndex))
    if (gi >= 0) {
      setNav([gi, gi > safeGroup ? 1 : -1])
      setViewMode('focus')
    }
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
    // Weights are typed in the display unit but stored in lb.
    const stored = field === 'weight' ? fromDisplayWeight(value, units) : value
    mutate((d) => {
      d.exercises[exIndex].sets[setIndex][field] = stored
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
      if (set.logged) return
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
    const exercise = getExerciseById(entry.exerciseId)
    let isPr = false

    if (turningOn && (set.type ?? 'R') !== 'W') {
      const historical = historicalBests.get(entry.exerciseId) ?? 0
      const sessionPrior = Math.max(
        0,
        ...entry.sets
          .filter((s, i) => i !== setIndex && s.logged && s.type !== 'W')
          .map((s) => e1rm(s.weight, s.reps))
      )
      const est = e1rm(set.weight, set.reps)
      if (historical > 0 && est > historical && est > sessionPrior) {
        isPr = true
        setPr({ id: Date.now(), value: Math.round(est), name: exercise?.name ?? '' })
        window.setTimeout(() => setPr((p) => (p && Date.now() - p.id >= 2100 ? null : p)), 2200)
      }
    }

    if (turningOn) {
      vibrate(isPr ? [100, 50, 100, 50, 200] : 50)
      // Auto-start the rest timer keyed to the movement's mechanic.
      onSetLogged(exercise?.type === 'compound')
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
    // A removed exercise shouldn't leave a dangling superset link on its predecessor.
    if (exIndex > 0 && next.exercises[exIndex - 1]?.supersetNext) {
      delete next.exercises[exIndex - 1].supersetNext
    }
    next.exercises.splice(exIndex, 1)
    onChange(next)
    setNav([Math.max(0, safeGroup - 1), -1])
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
    setNav([9999, 1]) // clamps to the last group on re-render
    setViewMode('focus')
  }

  function handleFinish() {
    const logged = session?.exercises.some((e) => e.sets.some((s) => s.logged))
    if (!logged) {
      if (
        window.confirm(
          'No sets confirmed with the ✓ button yet — nothing will be saved. Finish anyway? This advances your rotation.'
        )
      ) {
        onFinish() // nothing to save, skip the RPE prompt
      }
      return
    }
    setFinishOpen(true) // ask for exhaustion/RPE before saving
  }

  function handleCancel() {
    if (window.confirm('Discard this workout? Logged sets will be lost.')) {
      onCancel()
    }
  }

  function renderExerciseBody(exIndex: number, superset: boolean) {
    const entry = session!.exercises[exIndex]
    const exercise = getExerciseById(entry.exerciseId)
    const insight = exercise ? coachInsight(exercise, sessions) : null
    const trend = strengthTrendFromIndex(historyIndex, entry.exerciseId)
      .slice(-8)
      .map((p) => p.weight)
    const topWeight = Math.max(0, ...entry.sets.map((s) => s.weight))

    return (
      <div className="log__ex" key={`${entry.exerciseId}-${exIndex}`}>
        <div className="log__hero">
          <ExerciseImage exerciseId={entry.exerciseId} variant="hero" />
          <div className="log__hero-shade" />
          <div className="log__hero-text">
            {superset && (
              <span className="log__superset-tag">
                <Link2 size={11} /> Superset
              </span>
            )}
            <h3 className="log__exercise-name">{exercise?.name ?? entry.exerciseId}</h3>
            {insight && (
              <p className="log__goal">
                <Target size={13} />
                {insight.target ?? `Target ${exercise?.repRange[0]}–${exercise?.repRange[1]} reps`}
              </p>
            )}
          </div>
          {trend.length >= 2 && (
            <div className="log__hero-spark">
              <Sparkline values={trend} />
            </div>
          )}
        </div>

        <div className="log__toolbar">
          <input
            className="log__settings-note"
            type="text"
            value={entry.settingsNote ?? ''}
            placeholder="Machine setup — e.g. Seat 4, Pin 12"
            onChange={(e) => {
              const raw = e.target.value
              mutate((d) => {
                if (raw === '') delete d.exercises[exIndex].settingsNote
                else d.exercises[exIndex].settingsNote = raw
              })
            }}
          />
          {usesBar(exercise) && (
            <button
              className="log__plate-btn"
              aria-label="Plate calculator"
              onClick={() => setPlateWeight(topWeight >= 45 ? topWeight : 45)}
            >
              <Weight size={16} />
            </button>
          )}
        </div>

        <div className="log__sets">
          <div className="log__set-labels">
            <span>Type</span>
            <span>{units}</span>
            <span>Reps</span>
            <span title="Reps in Reserve">RIR</span>
            <span>Log</span>
            <span />
          </div>
          {entry.sets.map((set, setIndex) => {
            const type = set.type ?? 'R'
            const locked = set.logged === true
            return (
              <div key={setIndex} className={locked ? 'log__set log__set--locked' : 'log__set'}>
                <button
                  className={`st st--${type}`}
                  aria-label={`Set type: ${SET_TYPE_INFO[type].label}`}
                  onClick={() => cycleSetType(exIndex, setIndex)}
                >
                  {type}
                </button>
                <input
                  className="log__input"
                  type="text"
                  inputMode="decimal"
                  value={
                    weightDrafts[`${exIndex}:${setIndex}`] ??
                    (set.weight === 0 ? '' : displayWeightStr(set.weight, units))
                  }
                  placeholder="0"
                  readOnly={locked}
                  onChange={(e) => {
                    const raw = e.target.value
                    if (!/^\d*\.?\d*$/.test(raw)) return
                    setWeightDrafts((d) => ({ ...d, [`${exIndex}:${setIndex}`]: raw }))
                    setValue(exIndex, setIndex, 'weight', raw)
                  }}
                  onBlur={() =>
                    setWeightDrafts((d) => {
                      const next = { ...d }
                      delete next[`${exIndex}:${setIndex}`]
                      return next
                    })
                  }
                />
                <input
                  className="log__input"
                  type="text"
                  inputMode="numeric"
                  value={set.reps === 0 ? '' : String(set.reps)}
                  placeholder="0"
                  readOnly={locked}
                  onChange={(e) => setValue(exIndex, setIndex, 'reps', e.target.value)}
                />
                <input
                  className="log__input log__input--rir"
                  type="text"
                  inputMode="numeric"
                  value={set.rir === undefined ? '' : String(set.rir)}
                  placeholder="–"
                  readOnly={locked}
                  onChange={(e) => setRir(exIndex, setIndex, e.target.value)}
                />
                <button
                  className={locked ? 'log__check log__check--on' : 'log__check'}
                  aria-label={locked ? 'Unlock set' : 'Log set'}
                  onClick={() => toggleLogged(exIndex, setIndex)}
                >
                  <Check size={15} />
                </button>
                <button className="log__remove-set" onClick={() => removeSet(exIndex, setIndex)}>
                  ×
                </button>
              </div>
            )
          })}
          <button className="log__add-set" onClick={() => addSet(exIndex)}>
            <Plus size={13} /> Add set
          </button>
        </div>

        <button className="log__remove-exercise" onClick={() => removeExercise(exIndex)}>
          Remove exercise
        </button>
      </div>
    )
  }

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
              <li key={`${e.exerciseId}-${i}`} className="log__overview-row">
                <button className="log__overview-main-btn" onClick={() => focusExercise(i)}>
                  <span className="log__overview-name">
                    {ex?.name ?? e.exerciseId}
                    {e.supersetNext && <Link2 size={12} className="log__overview-link" />}
                  </span>
                  <span className="log__overview-muscle">{ex?.muscle}</span>
                </button>
                {/* edit target sets without leaving the overview */}
                <div className="log__overview-stepper">
                  <button
                    className="log__ov-step"
                    aria-label="Remove a set"
                    disabled={e.sets.length <= 1}
                    onClick={() => removeSet(i, e.sets.length - 1)}
                  >
                    <Minus size={13} />
                  </button>
                  <span
                    className={
                      complete
                        ? 'log__overview-progress log__overview-progress--done'
                        : 'log__overview-progress'
                    }
                  >
                    {complete && <Check size={12} />}
                    {done}/{e.sets.length}
                  </span>
                  <button
                    className="log__ov-step"
                    aria-label="Add a set"
                    onClick={() => addSet(i)}
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {viewMode === 'focus' && currentGroup.length > 0 && (
        <>
          <div className="log__deck">
            <AnimatePresence mode="popLayout" custom={direction} initial={false}>
              <motion.section
                key={currentGroup.join('-')}
                className={
                  currentGroup.length > 1 ? 'log__card card log__card--superset' : 'log__card card'
                }
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
                {currentGroup.map((exIndex) => renderExerciseBody(exIndex, currentGroup.length > 1))}
              </motion.section>
            </AnimatePresence>
          </div>

          <div className="log__nav">
            <button
              className="log__nav-btn"
              disabled={safeGroup === 0}
              aria-label="Previous exercise"
              onClick={() => go(-1)}
            >
              <ChevronLeft size={20} />
            </button>
            <div className="log__dots">
              {groups.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Card ${i + 1}`}
                  className={i === safeGroup ? 'log__dot log__dot--on' : 'log__dot'}
                  onClick={() => setNav([i, i > safeGroup ? 1 : -1])}
                />
              ))}
            </div>
            <button
              className="log__nav-btn"
              disabled={safeGroup === groupCount - 1}
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

      {plateWeight !== null && (
        <PlateCalculator
          weight={plateWeight}
          units={units}
          onClose={() => setPlateWeight(null)}
        />
      )}

      {finishOpen && (
        <FinishModal
          onConfirm={(rpe) => {
            setFinishOpen(false)
            onFinish(rpe)
          }}
          onClose={() => setFinishOpen(false)}
        />
      )}

      <AnimatePresence>
        {pr && <PRCelebration key={pr.id} value={pr.value} name={pr.name} />}
      </AnimatePresence>
    </div>
  )
}
