import Button from '../components/Button'
import { getExerciseById } from '../data/exercises'
import { getCurrentSplitDay } from '../logic/rotation'
import { suggestNext } from '../logic/progression'
import type { Settings, WorkoutSession } from '../types'
import './TodayScreen.css'

export default function TodayScreen({
  settings,
  sessions,
  hasActiveSession,
  onStartWorkout,
  onResumeWorkout,
}: {
  settings: Settings
  sessions: WorkoutSession[]
  hasActiveSession: boolean
  onStartWorkout: () => void
  onResumeWorkout: () => void
}) {
  const day = getCurrentSplitDay(settings)

  return (
    <div className="today">
      <div className="today__intro">
        <p className="today__label">Next workout</p>
        <h2 className="today__day">{day.name}</h2>
      </div>

      <ul className="today__list">
        {day.exerciseIds.map((id) => {
          const exercise = getExerciseById(id)
          if (!exercise) return null
          const s = suggestNext(exercise, sessions)
          return (
            <li key={id} className="today__row">
              <div className="today__row-main">
                <span className="today__exercise">{exercise.name}</span>
                {s.lastSets && (
                  <span className="today__last">
                    Last: {Math.max(...s.lastSets.map((x) => x.weight))} lb ×{' '}
                    {s.lastSets.map((x) => x.reps).join(', ')}
                  </span>
                )}
              </div>
              <div className="today__target">
                {s.weight !== null ? (
                  <>
                    <span className={s.increased ? 'today__weight today__weight--up' : 'today__weight'}>
                      {s.weight} lb
                    </span>
                    <span className="today__reps">× {s.reps}</span>
                  </>
                ) : (
                  <span className="today__reps">
                    {exercise.repRange[0]}–{exercise.repRange[1]} reps
                  </span>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <div className="today__action">
        {hasActiveSession ? (
          <Button onClick={onResumeWorkout}>Resume Workout</Button>
        ) : (
          <Button onClick={onStartWorkout}>Start Workout</Button>
        )}
      </div>
    </div>
  )
}
