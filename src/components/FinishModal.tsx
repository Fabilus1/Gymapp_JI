import { useState } from 'react'
import { Flag, X } from 'lucide-react'
import './FinishModal.css'

const LABELS: Record<number, string> = {
  1: 'Barely trained',
  3: 'Easy',
  5: 'Moderate',
  7: 'Hard',
  9: 'Brutal',
  10: 'All-out',
}

function nearestLabel(v: number): string {
  const keys = Object.keys(LABELS).map(Number)
  const k = keys.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a))
  return LABELS[k]
}

export default function FinishModal({
  onConfirm,
  onClose,
}: {
  onConfirm: (rpe: number) => void
  onClose: () => void
}) {
  const [rpe, setRpe] = useState(7)

  return (
    <div className="finish" onClick={onClose}>
      <div className="finish__sheet" onClick={(e) => e.stopPropagation()}>
        <div className="finish__head">
          <div>
            <h2 className="finish__title">How was that session?</h2>
            <p className="finish__sub">Rate your exhaustion — it tunes your recovery estimates.</p>
          </div>
          <button className="finish__close" aria-label="Close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="finish__meter">
          <span className="finish__value">{rpe}</span>
          <span className="finish__label">{nearestLabel(rpe)}</span>
        </div>

        <input
          className="finish__slider"
          type="range"
          min={1}
          max={10}
          step={1}
          value={rpe}
          style={{ '--fill': `${((rpe - 1) / 9) * 100}%` } as React.CSSProperties}
          onChange={(e) => setRpe(Number(e.target.value))}
        />
        <div className="finish__scale">
          <span>1</span>
          <span>10</span>
        </div>

        <button className="finish__confirm" onClick={() => onConfirm(rpe)}>
          <Flag size={16} /> Finish &amp; Save
        </button>
      </div>
    </div>
  )
}
