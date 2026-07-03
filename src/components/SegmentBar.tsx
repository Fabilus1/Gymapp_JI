import './SegmentBar.css'

/** Segmented mini progress bar (e.g. soreness 3/5, recovery 2/4). */
export default function SegmentBar({
  value,
  max,
  tone = 'accent',
}: {
  value: number
  max: number
  tone?: 'accent' | 'danger'
}) {
  return (
    <div className={`segbar segbar--${tone}`} role="img" aria-label={`${value} of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < value ? 'segbar__seg segbar__seg--on' : 'segbar__seg'} />
      ))}
    </div>
  )
}
