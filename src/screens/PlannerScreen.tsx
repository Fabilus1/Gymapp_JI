import { useState } from 'react'
import { Plus, Trash2, GripVertical, Check } from 'lucide-react'
import ExercisePicker from '../components/ExercisePicker'
import { SPLITS } from '../data/splits'
import { getExerciseById } from '../data/exercises'
import { newId } from '../db/db'
import { resolveProgram, mondayIndex } from '../logic/rotation'
import type { CustomPlan, Settings, SplitDay } from '../types'
import './PlannerScreen.css'

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function PlannerScreen({
  settings,
  customPlans,
  onSettingsChange,
  onPlansChange,
}: {
  settings: Settings
  customPlans: CustomPlan[]
  onSettingsChange: (settings: Settings) => void
  onPlansChange: (plans: CustomPlan[]) => void
}) {
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

            <ul className="planner__exercises">
              {day.exerciseIds.map((id, i) => (
                <li key={`${id}-${i}`} className="planner__exercise">
                  <GripVertical size={14} className="planner__grip" />
                  <span className="planner__exercise-name">
                    {getExerciseById(id)?.name ?? id}
                  </span>
                  <button
                    className="planner__icon-btn"
                    aria-label="Remove exercise"
                    onClick={() =>
                      updateDay(dayIndex, (d) => ({
                        ...d,
                        exerciseIds: d.exerciseIds.filter((_, j) => j !== i),
                      }))
                    }
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>

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
              <select
                className="planner__select"
                value={schedule[i] === null ? 'rest' : String(schedule[i])}
                onChange={(e) => setScheduleDay(i, e.target.value)}
              >
                <option value="rest">Rest</option>
                {program.days.map((d, di) => (
                  <option key={di} value={di}>
                    {d.name}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
