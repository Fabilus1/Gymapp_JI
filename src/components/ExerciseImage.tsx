import { useState } from 'react'
import { Dumbbell } from 'lucide-react'
import { EXERCISE_IMAGES } from '../data/exerciseImages'
import './ExerciseImage.css'

/**
 * Resilient exercise image. Falls back to a dark zinc panel with a centered
 * Dumbbell icon when the exercise has no image, or when the image fails to
 * load (onError) — e.g. offline before the photo has been cached.
 */
export default function ExerciseImage({
  exerciseId,
  variant = 'thumb',
  className,
}: {
  exerciseId: string
  variant?: 'thumb' | 'hero'
  className?: string
}) {
  const src = EXERCISE_IMAGES[exerciseId]
  const [failed, setFailed] = useState(false)
  const base = variant === 'hero' ? 'eximg eximg--hero' : 'eximg eximg--thumb'
  const cls = className ? `${base} ${className}` : base

  if (!src || failed) {
    const iconSize = variant === 'hero' ? 40 : 22
    return (
      <div className={`${cls} eximg--fallback`} aria-hidden="true">
        <Dumbbell size={iconSize} strokeWidth={1.5} />
      </div>
    )
  }

  return (
    <img
      className={cls}
      src={src}
      alt=""
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
    />
  )
}
