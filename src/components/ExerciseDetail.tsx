import { useMemo } from 'react'
import MuscleDiagram from './MuscleDiagram'
import LineChart from './LineChart'
import { EXERCISE_IMAGES } from '../data/exerciseImages'
import { getMuscleTarget } from '../data/muscleDetail'
import { strengthTrend, findLastPerformance } from '../logic/progression'
import type { Exercise, WorkoutSession } from '../types'
import './ExerciseDetail.css'

export default function ExerciseDetail({
  exercise,
  sessions,
  onClose,
}: {
  exercise: Exercise
  sessions: WorkoutSession[]
  onClose: () => void
}) {
  const image = EXERCISE_IMAGES[exercise.id]
  const target = getMuscleTarget(exercise.id)
  const last = findLastPerformance(sessions, exercise.id)
  const trend = useMemo(
    () => strengthTrend(sessions, exercise.id).map((p) => ({ date: p.date, value: p.weight })),
    [sessions, exercise.id]
  )

  return (
    <div className="detail" onClick={onClose}>
      <div className="detail__sheet" onClick={(e) => e.stopPropagation()}>
        <div className="detail__bar">
          <h2 className="detail__name">{exercise.name}</h2>
          <button className="detail__close" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="detail__scroll">
          {image && (
            <img
              className="detail__image"
              src={image}
              alt={`${exercise.name} demonstration`}
              loading="lazy"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          )}

          <p className="detail__meta">
            <span className="detail__meta-item">{exercise.equipment}</span>
            <span className="detail__meta-item">{exercise.type}</span>
            <span className="detail__meta-item">
              {exercise.repRange[0]}–{exercise.repRange[1]} reps
            </span>
            <span className="detail__meta-item">+{exercise.increment} lb steps</span>
          </p>

          <section className="detail__section">
            <h3 className="eyebrow">Muscles worked</h3>
            {target && (
              <>
                <MuscleDiagram primary={target.primary} secondary={target.secondary} />
                <p className="detail__muscles">
                  <span className="detail__muscles-primary">{target.primary.join(', ')}</span>
                  {target.secondary.length > 0 && (
                    <span className="detail__muscles-secondary">
                      {' '}
                      · assisted by {target.secondary.join(', ')}
                    </span>
                  )}
                </p>
              </>
            )}
          </section>

          <section className="detail__section">
            <h3 className="eyebrow">How to do it</h3>
            <p className="detail__cue">{exercise.cue}</p>
          </section>

          {last && (
            <section className="detail__section">
              <h3 className="eyebrow">Last session</h3>
              <p className="detail__last">
                {Math.max(...last.sets.map((s) => s.weight))} lb ×{' '}
                {last.sets.map((s) => s.reps).join(', ')}
              </p>
            </section>
          )}

          {trend.length > 1 && (
            <section className="detail__section">
              <h3 className="eyebrow">Top set trend</h3>
              <LineChart points={trend} />
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
