import { X } from 'lucide-react'
import './PlateCalculator.css'

const BAR_LB = 45
const PLATES = [45, 35, 25, 10, 5, 2.5]
const PLATE_COLOR: Record<number, string> = {
  45: '#3b82f6',
  35: '#eab308',
  25: '#22c55e',
  10: '#f4f4f5',
  5: '#a855f7',
  2.5: '#f97316',
}

/** Greedy per-side plate breakdown for a target weight on a 45 lb bar. */
function computePlates(target: number): { plate: number; count: number }[] {
  let perSide = (target - BAR_LB) / 2
  if (perSide <= 0) return []
  const out: { plate: number; count: number }[] = []
  for (const p of PLATES) {
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
  onClose,
}: {
  weight: number
  onClose: () => void
}) {
  const plates = computePlates(weight)
  const perSide = Math.max(0, (weight - BAR_LB) / 2)
  const leftover =
    perSide - plates.reduce((s, p) => s + p.plate * p.count, 0)

  return (
    <div className="plate" onClick={onClose}>
      <div className="plate__sheet" onClick={(e) => e.stopPropagation()}>
        <div className="plate__bar-head">
          <div>
            <h2 className="plate__title">Plate calculator</h2>
            <p className="plate__sub">
              {weight} lb · 45 lb bar · {perSide % 1 === 0 ? perSide : perSide.toFixed(1)} lb per side
            </p>
          </div>
          <button className="plate__close" aria-label="Close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {weight < BAR_LB ? (
          <p className="plate__note">Below the bar weight — no plates needed.</p>
        ) : plates.length === 0 ? (
          <p className="plate__note">Just the empty 45 lb bar.</p>
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
                      background: PLATE_COLOR[plate],
                      height: `${44 + PLATES.indexOf(plate) * -4 + (plate >= 25 ? 20 : 0)}px`,
                      color: plate === 10 ? '#18181b' : '#fff',
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
                  <span className="plate__swatch" style={{ background: PLATE_COLOR[plate] }} />
                  <span className="plate__plate-lb">{plate} lb</span>
                  <span className="plate__count">× {count} per side</span>
                </li>
              ))}
            </ul>
            {leftover > 0.01 && (
              <p className="plate__note">
                Can't make the last {leftover.toFixed(1)} lb/side with standard plates.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
