import { useEffect, useState } from 'react'
import { Moon } from 'lucide-react'
import Button from '../components/Button'
import { getExerciseById } from '../data/exercises'
import { getTodayPlan } from '../logic/rotation'
import { suggestNext } from '../logic/progression'
import { coachInsight, sessionSummary } from '../logic/coach'
import { getAllBodyWeightEntries } from '../db/db'
import type { CustomPlan, Settings, WorkoutSession } from '../types'
import './TodayScreen.css'

const WEEK_MS = 7 * 86400000

export default function TodayScreen({
  settings,
  customPlans,
  sessions,
  hasActiveSession,
  onStartWorkout,
  onResumeWorkout,
  onGoProgress,
}: {
  settings: Settings
  customPlans: CustomPlan[]
  sessions: WorkoutSession[]
  hasActiveSession: boolean
  onStartWorkout: () => void
  onResumeWorkout: () => void
  onGoProgress: () => void
}) {
  const plan = getTodayPlan(settings, customPlans)
  const [weightDue, setWeightDue] = useState(false)

  useEffect(() => {
    getAllBodyWeightEntries().then((entries) => {
      const latest = entries[0]
      setWeightDue(!latest || Date.now() - new Date(latest.date).getTime() > WEEK_MS)
    })
  }, [])

  const day = plan.day ?? plan.nextDay
  const isRest = plan.followsSchedule && plan.day === null

  const exercises = (day?.exerciseIds ?? [])
    .map((id) => getExerciseById(id))
    .filter((e): e is NonNullable<typeof e> => e !== undefined)
  const summary = sessionSummary(exercises, sessions)

  return (
    <div className="today">
      <div className="today__intro">
        <p className="eyebrow">{isRest ? 'Scheduled today' : 'Next workout'}</p>
        {isRest ? (
          <>
            <h2 className="today__day">
              Rest day <Moon size={22} className="today__moon" />
            </h2>
            {day && <p className="today__coach">Next up: {day.name}. Preview below.</p>}
          </>
        ) : (
          <>
            <h2 className="today__day">{day?.name ?? '—'}</h2>
            {summary && <p className="today__coach">{summary}</p>}
          </>
        )}
      </div>

      {weightDue && (
        <button className="today__checkin" onClick={onGoProgress}>
          <span className="today__checkin-dot" />
          Weekly check-in due — log your body weight
        </button>
      )}

      <ul className="today__list">
        {exercises.map((exercise) => {
          const s = suggestNext(exercise, sessions)
          const insight = coachInsight(exercise, sessions)
          return (
            <li key={exercise.id} className="today__row">
              <div className="today__row-top">
                <span className="today__exercise">{exercise.name}</span>
                <span className="today__target">
                  {s.weight !== null ? (
                    <>
                      <span
                        className={s.increased ? 'today__weight today__weight--up' : 'today__weight'}
                      >
                        {s.weight}
                      </span>
                      <span className="today__reps"> lb × {s.reps}</span>
                    </>
                  ) : (
                    <span className="today__reps">
                      {exercise.repRange[0]}–{exercise.repRange[1]} reps
                    </span>
                  )}
                </span>
              </div>
              <p className={`today__hint today__hint--${insight.kind}`}>{insight.message}</p>
            </li>
          )
        })}
      </ul>

      <div className="today__action">
        {hasActiveSession ? (
          <Button onClick={onResumeWorkout}>Resume Workout</Button>
        ) : isRest ? (
          <Button variant="secondary" onClick={onStartWorkout}>
            Train anyway — start {day?.name}
          </Button>
        ) : (
          <Button onClick={onStartWorkout}>Start Workout</Button>
        )}
      </div>
    </div>
  )
}
