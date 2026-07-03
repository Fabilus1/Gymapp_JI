import './LineChart.css'

export interface ChartPoint {
  date: string
  value: number
}

const W = 340
const H = 140
const PAD = 8

export default function LineChart({ points }: { points: ChartPoint[] }) {
  if (points.length === 0) return null

  const values = points.map((p) => p.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const coords = points.map((p, i) => {
    const x = points.length === 1 ? W / 2 : PAD + (i / (points.length - 1)) * (W - PAD * 2)
    const y = PAD + (1 - (p.value - min) / range) * (H - PAD * 2)
    return { x, y }
  })

  const path = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ')

  const first = new Date(points[0].date)
  const lastPoint = points[points.length - 1]
  const last = new Date(lastPoint.date)
  const fmt = (d: Date) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

  return (
    <div className="chart">
      <div className="chart__scale">
        <span>{max}</span>
        <span>{min}</span>
      </div>
      <div className="chart__plot">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          {coords.length === 1 && (
            <circle cx={coords[0].x} cy={coords[0].y} r="3" fill="var(--accent)" />
          )}
        </svg>
        <div className="chart__dates">
          <span>{fmt(first)}</span>
          {points.length > 1 && <span>{fmt(last)}</span>}
        </div>
      </div>
    </div>
  )
}
