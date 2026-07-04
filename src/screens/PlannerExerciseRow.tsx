import { Reorder, useDragControls } from 'framer-motion'
import { GripVertical, Link2, Minus, Plus } from 'lucide-react'
import { getExerciseById } from '../data/exercises'
import type { ExerciseMeta } from '../types'

/**
 * One draggable exercise row in the template editor. Drag is gated to the
 * grip handle (dragListener={false}) so the sets/reps inputs stay usable.
 */
export default function PlannerExerciseRow({
  id,
  isLast,
  meta,
  onPatchMeta,
  onSetRepRange,
  onRemove,
}: {
  id: string
  isLast: boolean
  meta: ExerciseMeta | undefined
  onPatchMeta: (patch: Partial<ExerciseMeta>) => void
  onSetRepRange: (which: 0 | 1, raw: string) => void
  onRemove: () => void
}) {
  const controls = useDragControls()
  const exercise = getExerciseById(id)
  const sets = meta?.targetSets ?? 3
  const range = meta?.repRange

  return (
    <Reorder.Item
      value={id}
      dragListener={false}
      dragControls={controls}
      className="planner__exercise"
    >
      <div className="planner__exercise-top">
        <button
          className="planner__grip"
          aria-label="Drag to reorder"
          onPointerDown={(e) => controls.start(e)}
          style={{ touchAction: 'none' }}
        >
          <GripVertical size={16} />
        </button>
        <span className="planner__exercise-name">{exercise?.name ?? id}</span>
        <button className="planner__icon-btn" aria-label="Remove exercise" onClick={onRemove}>
          ×
        </button>
      </div>
      <div className="planner__exercise-config">
        <div className="planner__stepper">
          <button
            className="planner__step"
            aria-label="Fewer sets"
            disabled={sets <= 1}
            onClick={() => onPatchMeta({ targetSets: sets - 1 === 3 ? undefined : sets - 1 })}
          >
            <Minus size={12} />
          </button>
          <span className="planner__step-value">{sets} sets</span>
          <button
            className="planner__step"
            aria-label="More sets"
            disabled={sets >= 10}
            onClick={() => onPatchMeta({ targetSets: sets + 1 === 3 ? undefined : sets + 1 })}
          >
            <Plus size={12} />
          </button>
        </div>
        <div className="planner__range">
          <input
            className="planner__range-input"
            type="text"
            inputMode="numeric"
            value={range ? String(range[0]) : ''}
            placeholder={String(exercise?.repRange[0] ?? 8)}
            onChange={(e) => onSetRepRange(0, e.target.value)}
          />
          <span className="planner__range-sep">–</span>
          <input
            className="planner__range-input"
            type="text"
            inputMode="numeric"
            value={range ? String(range[1]) : ''}
            placeholder={String(exercise?.repRange[1] ?? 12)}
            onChange={(e) => onSetRepRange(1, e.target.value)}
          />
          <span className="planner__range-label">reps</span>
        </div>
      </div>
      {!isLast && (
        <button
          className={
            meta?.supersetNext ? 'planner__superset planner__superset--on' : 'planner__superset'
          }
          onClick={() => onPatchMeta({ supersetNext: !meta?.supersetNext })}
        >
          <Link2 size={13} />
          {meta?.supersetNext ? 'Supersetted with next' : 'Superset with next'}
        </button>
      )}
    </Reorder.Item>
  )
}
