import { X } from 'lucide-react'
import { toDisplayWeight, type Units } from '../logic/units'
import './PlateCalculator.css'

// Per-unit bar weight and available plates.
const CONFIG: Record<Units, { bar: number; plates: number[]; colors: Record<number, string> }> = {
  lb: {
    bar: 45,
    plates: [45, 35, 25, 10, 5, 2.5],
    colors: { 45: '#3b82f6', 35: '#eab308', 25: '#22c55e', 10: '#f4f4f5', 5: '#a855f7', 2.5: '#f97316' },
  },
  kg: {
    bar: 20,
    plates: [25, 20, 15, 10, 5, 2.5, 1.25],
    // IWF-style plate colours
    colors: { 25: '#ef4444', 20: '#3b82f6', 15: '#eab308', 10: '#22c55e', 5: '#f4f4f5', 2.5: '#ef4444', 1.25: '#c0c0c0' },
  },
}

/** Greedy per-side plate breakdown for a target on the given bar. */
function computePlates(target: number, bar: number, plates: number[]): { plate: number; count: number }[] {
  let perSide = (target - bar) / 2
  if (perSide <= 0) return []
  const out: { plate: number; count: number }[] = []
  for (const p of plates) {
    const count = Math.floor(perSide / p)
    if (count > 0) {
      out.push({ plate: p, count })
      perSide = Math.round((perSide - count * p) * 100) / 100
    }
  }
  return out
}

export default function PlateCalculator({
  weight,
  units,
  onClose,
}: {
  /** stored weight in lb */
  weight: number
  units: Units
  onClose: () => void
}) {
  const cfg = CONFIG[units]
  // Convert the stored lb weight into the working unit before computing plates.
  const target = toDisplayWeight(weight, units)
  const plates = computePlates(target, cfg.bar, cfg.plates)
  const perSide = Math.max(0, (target - cfg.bar) / 2)
  const leftover = perSide - plates.reduce((s, p) => s + p.plate * p.count, 0)
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0$/, ''))

  return (
    <div className="plate" onClick={onClose}>
      <div className="plate__sheet" onClick={(e) => e.stopPropagation()}>
        <div className="plate__bar-head">
          <div>
            <h2 className="plate__title">Plate calculator</h2>
            <p className="plate__sub">
              {fmt(target)} {units} · {cfg.bar} {units} bar · {fmt(perSide)} {units} per side
            </p>
          </div>
          <button className="plate__close" aria-label="Close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {target < cfg.bar ? (
          <p className="plate__note">Below the bar weight — no plates needed.</p>
        ) : plates.length === 0 ? (
          <p className="plate__note">Just the empty {cfg.bar} {units} bar.</p>
        ) : (
          <>
            <div className="plate__viz" aria-hidden="true">
              <span className="plate__bar" />
              {plates.flatMap(({ plate, count }) =>
                Array.from({ length: count }, (_, i) => (
                  <span
                    key={`${plate}-${i}`}
                    className="plate__disc"
                    style={{
                      background: cfg.colors[plate],
                      height: `${44 + cfg.plates.indexOf(plate) * -4 + (plate >= cfg.plates[2] ? 20 : 0)}px`,
                      color: cfg.colors[plate] === '#f4f4f5' || cfg.colors[plate] === '#c0c0c0' ? '#18181b' : '#fff',
                    }}
                  >
                    {plate}
                  </span>
                ))
              )}
              <span className="plate__collar" />
            </div>

            <ul className="plate__list">
              {plates.map(({ plate, count }) => (
                <li key={plate} className="plate__row">
                  <span className="plate__swatch" style={{ background: cfg.colors[plate] }} />
                  <span className="plate__plate-lb">{plate} {units}</span>
                  <span className="plate__count">× {count} per side</span>
                </li>
              ))}
            </ul>
            {leftover > 0.01 && (
              <p className="plate__note">
                Can't make the last {fmt(leftover)} {units}/side with standard plates.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
