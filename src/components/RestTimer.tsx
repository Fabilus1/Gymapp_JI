import type { RestTimer as RestTimerState } from '../hooks/useRestTimer'
import './RestTimer.css'

const PRESETS = [
  { label: '1:00', seconds: 60 },
  { label: '1:30', seconds: 90 },
  { label: '2:00', seconds: 120 },
  { label: '3:00', seconds: 180 },
]

function fmt(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

export default function RestTimer({
  timer,
  showPresets,
}: {
  timer: RestTimerState
  showPresets: boolean
}) {
  if (timer.done) {
    return (
      <div className="rest rest--done" onClick={timer.cancel}>
        <span className="rest__go">GO — rest over</span>
      </div>
    )
  }

  if (timer.remaining !== null) {
    return (
      <div className="rest">
        <span className="rest__label">Rest</span>
        <button
          className="rest__adjust"
          onClick={() => timer.adjust(-30)}
          aria-label="Subtract 30 seconds"
        >
          −30
        </button>
        <span className="rest__count">{fmt(timer.remaining)}</span>
        <button
          className="rest__adjust"
          onClick={() => timer.adjust(30)}
          aria-label="Add 30 seconds"
        >
          +30
        </button>
        <button className="rest__skip" onClick={timer.cancel}>
          Skip
        </button>
      </div>
    )
  }

  if (!showPresets) return null

  return (
    <div className="rest rest--idle">
      <span className="rest__label">Rest</span>
      <div className="rest__presets">
        {PRESETS.map((p) => (
          <button key={p.label} className="rest__preset" onClick={() => timer.start(p.seconds)}>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}
