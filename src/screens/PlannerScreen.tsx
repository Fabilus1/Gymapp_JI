import { useState } from 'react'
import { Reorder } from 'framer-motion'
import { Plus, Trash2, Check } from 'lucide-react'
import ExercisePicker from '../components/ExercisePicker'
import Dropdown from '../components/Dropdown'
import PlannerExerciseRow from './PlannerExerciseRow'
import { SPLITS } from '../data/splits'
import { getExerciseById } from '../data/exercises'
import { newId } from '../db/db'
import { resolveProgram, mondayIndex } from '../logic/rotation'
import { useApp } from '../context/AppDataContext'
import type { CustomPlan, ExerciseMeta, SplitDay } from '../types'
import './PlannerScreen.css'

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function PlannerScreen() {
  const {
    settings,
    customPlans,
    updateSettings: onSettingsChange,
    updateCustomPlans: onPlansChange,
  } = useApp()
  const [editingPlan, setEditingPlan] = useState<CustomPlan | null>(null)
  const [pickerForDay, setPickerForDay] = useState<number | null>(null)

  const program = resolveProgram(settings, customPlans)
  const schedule: (number | null)[] =
    settings.weekSchedule && settings.weekSchedule.length === 7
      ? settings.weekSchedule
      : [null, null, null, null, null, null, null]

  function activateProgram(id: string) {
    // Clear the weekday schedule when switching programs — day indexes won't line up.
    onSettingsChange({ ...settings, split: id, rotationIndex: 0, weekSchedule: undefined })
  }

  function setScheduleDay(weekday: number, value: string) {
    const next = [...schedule]
    next[weekday] = value === 'rest' ? null : Number(value)
    onSettingsChange({ ...settings, weekSchedule: next })
  }

  function clearSchedule() {
    onSettingsChange({ ...settings, weekSchedule: undefined })
  }

  // ---- plan editing ----

  function newPlan() {
    const plan: CustomPlan = {
      id: newId(),
      name: 'My Program',
      days: [{ name: 'Day 1', exerciseIds: [] }],
    }
    setEditingPlan(plan)
  }

  function savePlan() {
    if (!editingPlan) return
    const cleaned: CustomPlan = {
      ...editingPlan,
      name: editingPlan.name.trim() || 'My Program',
      days: editingPlan.days.filter((d) => d.exerciseIds.length > 0),
    }
    if (cleaned.days.length === 0) {
      window.alert('Add at least one exercise to a day before saving.')
      return
    }
    const others = customPlans.filter((p) => p.id !== cleaned.id)
    onPlansChange([...others, cleaned])
    activateProgram(cleaned.id)
    setEditingPlan(null)
  }

  function deletePlan(id: string) {
    if (!window.confirm('Delete this program?')) return
    onPlansChange(customPlans.filter((p) => p.id !== id))
    if (settings.split === id) {
      onSettingsChange({ ...settings, split: SPLITS[0].id, rotationIndex: 0, weekSchedule: undefined })
    }
  }

  function updateDay(index: number, updater: (day: SplitDay) => SplitDay) {
    if (!editingPlan) return
    const days = editingPlan.days.map((d, i) => (i === index ? updater(d) : d))
    setEditingPlan({ ...editingPlan, days })
  }

  function patchMeta(dayIndex: number, exerciseId: string, patch: Partial<ExerciseMeta>) {
    updateDay(dayIndex, (d) => {
      const current = d.exerciseMeta?.[exerciseId] ?? {}
      const merged: ExerciseMeta = { ...current, ...patch }
      if (merged.targetSets === undefined) delete merged.targetSets
      if (merged.repRange === undefined) delete merged.repRange
      if (!merged.supersetNext) delete merged.supersetNext
      const exerciseMeta = { ...d.exerciseMeta, [exerciseId]: merged }
      if (Object.keys(merged).length === 0) delete exerciseMeta[exerciseId]
      return { ...d, exerciseMeta }
    })
  }

  function setRepRange(dayIndex: number, exerciseId: string, which: 0 | 1, raw: string) {
    const exercise = getExerciseById(exerciseId)
    if (!exercise) return
    const current = editingPlan?.days[dayIndex]?.exerciseMeta?.[exerciseId]?.repRange ?? [
      ...exercise.repRange,
    ]
    if (raw === '') {
      patchMeta(dayIndex, exerciseId, { repRange: undefined })
      return
    }
    const value = Number(raw)
    if (Number.isNaN(value) || value < 1 || value > 50) return
    const next: [number, number] = [current[0], current[1]]
    next[which] = value
    if (next[0] > next[1]) next[which === 0 ? 1 : 0] = value
    patchMeta(dayIndex, exerciseId, { repRange: next })
  }

  // ---- editor view ----

  if (editingPlan) {
    return (
      <div className="planner">
        <input
          className="planner__name field"
          value={editingPlan.name}
          placeholder="Program name (e.g. Full Body)"
          onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
        />

        {editingPlan.days.map((day, dayIndex) => (
          <section key={dayIndex} className="planner__day card">
            <div className="planner__day-head">
              <input
                className="planner__day-name field"
                value={day.name}
                onChange={(e) => updateDay(dayIndex, (d) => ({ ...d, name: e.target.value }))}
              />
              <button
                className="planner__icon-btn"
                aria-label="Delete day"
                onClick={() =>
                  setEditingPlan({
                    ...editingPlan,
                    days: editingPlan.days.filter((_, i) => i !== dayIndex),
                  })
                }
              >
                <Trash2 size={16} />
              </button>
            </div>

            <Reorder.Group
              axis="y"
              values={day.exerciseIds}
              onReorder={(ids) => updateDay(dayIndex, (d) => ({ ...d, exerciseIds: ids }))}
              className="planner__exercises"
            >
              {day.exerciseIds.map((id, i) => (
                <PlannerExerciseRow
                  key={id}
                  id={id}
                  isLast={i === day.exerciseIds.length - 1}
                  meta={day.exerciseMeta?.[id]}
                  onPatchMeta={(patch) => patchMeta(dayIndex, id, patch)}
                  onSetRepRange={(which, raw) => setRepRange(dayIndex, id, which, raw)}
                  onRemove={() =>
                    updateDay(dayIndex, (d) => {
                      const exerciseMeta = { ...d.exerciseMeta }
                      delete exerciseMeta[id]
                      return {
                        ...d,
                        exerciseIds: d.exerciseIds.filter((x) => x !== id),
                        exerciseMeta,
                      }
                    })
                  }
                />
              ))}
            </Reorder.Group>

            <button className="planner__add" onClick={() => setPickerForDay(dayIndex)}>
              <Plus size={14} /> Add exercise
            </button>
          </section>
        ))}

        <button
          className="planner__add planner__add--day"
          onClick={() =>
            setEditingPlan({
              ...editingPlan,
              days: [
                ...editingPlan.days,
                { name: `Day ${editingPlan.days.length + 1}`, exerciseIds: [] },
              ],
            })
          }
        >
          <Plus size={14} /> Add day
        </button>

        <div className="planner__editor-actions">
          <button className="planner__save" onClick={savePlan}>
            <Check size={16} /> Save program
          </button>
          <button className="planner__cancel" onClick={() => setEditingPlan(null)}>
            Cancel
          </button>
        </div>

        {pickerForDay !== null && (
          <ExercisePicker
            excludeIds={editingPlan.days[pickerForDay]?.exerciseIds ?? []}
            onSelect={(id) => {
              updateDay(pickerForDay, (d) => ({ ...d, exerciseIds: [...d.exerciseIds, id] }))
              setPickerForDay(null)
            }}
            onClose={() => setPickerForDay(null)}
          />
        )}
      </div>
    )
  }

  // ---- overview ----

  return (
    <div className="planner">
      <section className="planner__section">
        <h2 className="eyebrow">Programs</h2>
        <ul className="planner__programs">
          {SPLITS.map((s) => (
            <li key={s.id}>
              <button
                className={
                  settings.split === s.id
                    ? 'planner__program planner__program--active'
                    : 'planner__program'
                }
                onClick={() => activateProgram(s.id)}
              >
                <span>{s.name}</span>
                <span className="planner__program-meta">
                  {s.days.length} days{settings.split === s.id && ' · active'}
                </span>
              </button>
            </li>
          ))}
          {customPlans.map((p) => (
            <li key={p.id} className="planner__custom-row">
              <button
                className={
                  settings.split === p.id
                    ? 'planner__program planner__program--active'
                    : 'planner__program'
                }
                onClick={() => activateProgram(p.id)}
              >
                <span>{p.name}</span>
                <span className="planner__program-meta">
                  {p.days.length} days{settings.split === p.id && ' · active'}
                </span>
              </button>
              <button className="planner__icon-btn" onClick={() => setEditingPlan(p)}>
                Edit
              </button>
              <button
                className="planner__icon-btn"
                aria-label="Delete program"
                onClick={() => deletePlan(p.id)}
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
        <button className="planner__add" onClick={newPlan}>
          <Plus size={14} /> New program
        </button>
      </section>

      <section className="planner__section">
        <div className="planner__schedule-head">
          <h2 className="eyebrow">Week schedule</h2>
          {settings.weekSchedule && (
            <button className="planner__clear" onClick={clearSchedule}>
              Switch to rotation
            </button>
          )}
        </div>
        <p className="planner__hint">
          Assign {program.name} days to weekdays, or leave everything on Rest to cycle through
          days in order each time you finish a workout.
        </p>
        <ul className="planner__week">
          {WEEKDAYS.map((label, i) => (
            <li
              key={label}
              className={i === mondayIndex() ? 'planner__weekday planner__weekday--today' : 'planner__weekday'}
            >
              <span className="planner__weekday-label">{label}</span>
              <Dropdown
                value={schedule[i] === null ? 'rest' : String(schedule[i])}
                onChange={(v) => setScheduleDay(i, v)}
                options={[
                  { value: 'rest', label: 'Rest' },
                  ...program.days.map((d, di) => ({ value: String(di), label: d.name })),
                ]}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
