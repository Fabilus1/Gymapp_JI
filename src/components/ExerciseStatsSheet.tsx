import { X } from 'lucide-react'
import { getExerciseById } from '../data/exercises'
import { computeExerciseStats, exerciseHistory } from '../logic/exerciseStats'
import { formatWeight, toDisplayWeight, type Units } from '../logic/units'
import type { WorkoutSession } from '../types'
import './ExerciseStatsSheet.css'

function dateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })
}

/**
 * Inline progress mini-dashboard for one exercise — slides up over the active
 * workout so you never have to leave it. Reads logged history for all-time and
 * recent PRs.
 */
export default function ExerciseStatsSheet({
  exerciseId,
  sessions,
  units,
  onClose,
}: {
  exerciseId: string
  sessions: WorkoutSession[]
  units: Units
  onClose: () => void
}) {
  const exercise = getExerciseById(exerciseId)
  const stats = computeExerciseStats(sessions, exerciseId)
  const history = exerciseHistory(sessions, exerciseId)
  const w = (lb: number) => (lb > 0 ? formatWeight(lb, units) : '—')

  const cards: { label: string; value: string }[] = [
    { label: 'Max weight · all-time', value: w(stats.maxWeightAllTime) },
    { label: 'Max weight · last 30d', value: w(stats.maxWeightRecent) },
    { label: 'Max reps', value: stats.maxReps > 0 ? String(stats.maxReps) : '—' },
    { label: 'Best set volume', value: w(stats.bestSetVolume) },
    { label: 'Best session volume', value: w(stats.bestSessionVolume) },
    { label: 'Times logged', value: String(stats.sessionCount) },
  ]

  return (
    <div className="xstats" onClick={onClose}>
      <div className="xstats__sheet" onClick={(e) => e.stopPropagation()}>
        <div className="xstats__head">
          <div>
            <p className="xstats__eyebrow">Progress</p>
            <h2 className="xstats__title">{exercise?.name ?? exerciseId}</h2>
          </div>
          <button className="xstats__close" aria-label="Close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {stats.sessionCount === 0 ? (
          <p className="xstats__empty">No history yet — log a set of this exercise to see PRs.</p>
        ) : (
          <>
            <div className="xstats__grid">
              {cards.map((c) => (
                <div key={c.label} className="xstats__card">
                  <span className="xstats__value">{c.value}</span>
                  <span className="xstats__label">{c.label}</span>
                </div>
              ))}
            </div>

            {/* full per-session log history, not just the top set */}
            <div className="xstats__history">
              <p className="xstats__eyebrow">History</p>
              <ul className="xstats__log-list">
                {history.map((log, i) => (
                  <li key={`${log.date}-${i}`} className="xstats__log">
                    <span className="xstats__log-date">{dateLabel(log.date)}</span>
                    <span className="xstats__log-sets">
                      {log.sets
                        .map((s) => `${toDisplayWeight(s.weight, units)}×${s.reps}`)
                        .join('  ')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
