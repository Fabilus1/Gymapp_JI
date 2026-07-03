import './Sparkline.css'

/** Tiny minimalist trend line — no axes, just the shape of progress. */
export default function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null

  const W = 64
  const H = 22
  const PAD = 2
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const pts = values
    .map((v, i) => {
      const x = PAD + (i / (values.length - 1)) * (W - PAD * 2)
      const y = PAD + (1 - (v - min) / range) * (H - PAD * 2)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  const rising = values[values.length - 1] > values[0]

  return (
    <svg
      className={rising ? 'spark spark--up' : 'spark'}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
    >
      <polyline points={pts} />
    </svg>
  )
}
