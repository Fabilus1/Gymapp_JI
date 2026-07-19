import { useMemo } from 'react'
import MuscleDiagram from './MuscleDiagram'
import LineChart from './LineChart'
import { EXERCISE_IMAGES } from '../data/exerciseImages'
import { getMuscleTarget } from '../data/muscleDetail'
import { strengthTrend } from '../logic/progression'
import { exerciseHistory } from '../logic/exerciseStats'
import { toDisplayWeight } from '../logic/units'
import { useApp } from '../context/AppDataContext'
import type { Exercise, WorkoutSession } from '../types'
import './ExerciseDetail.css'

function dateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })
}

export default function ExerciseDetail({
  exercise,
  sessions,
  onClose,
}: {
  exercise: Exercise
  sessions: WorkoutSession[]
  onClose: () => void
}) {
  const { units } = useApp()
  const image = EXERCISE_IMAGES[exercise.id]
  const target = getMuscleTarget(exercise.id)
  const history = useMemo(() => exerciseHistory(sessions, exercise.id), [sessions, exercise.id])
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

          {history.length > 0 && (
            <section className="detail__section">
              <h3 className="eyebrow">History</h3>
              <ul className="detail__log-list">
                {history.map((log, i) => (
                  <li key={`${log.date}-${i}`} className="detail__log">
                    <span className="detail__log-date">{dateLabel(log.date)}</span>
                    <span className="detail__log-sets">
                      {log.sets.map((s) => `${toDisplayWeight(s.weight, units)}×${s.reps}`).join('  ')}
                    </span>
                  </li>
                ))}
              </ul>
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
