import { useState } from 'react'
import Model from 'react-body-highlighter'
import type { IExerciseData, Muscle } from 'react-body-highlighter'
import type { MuscleGroup } from '../types'
import type { RecoveryStatus } from '../logic/recovery'
import './MuscleDiagram.css'

// Recovery heat map: the soft-poly body tinted rose by how recovered each
// muscle group is (like the reference chart) — fully recovered muscles stay
// slate. Uses the same frequency trick as MuscleDiagram: a group is emitted
// 1–3× so highlightedColors[frequency-1] picks the intensity tier.
//   trained-today → 3 (strong rose) · recovering → 2 · almost-ready → 1 (faint)
//   ready → not emitted (base slate)

const BODY_COLOR = '#3a3d49'
const HEAT_COLORS = [
  'rgba(244, 63, 94, 0.26)', // almost ready — faint
  'rgba(244, 63, 94, 0.55)', // recovering — mid
  '#f43f5e', // trained today — hot
]

const FREQ: Record<RecoveryStatus, number> = {
  'trained-today': 3,
  recovering: 2,
  'almost-ready': 1,
  ready: 0,
}

// Coarse MuscleGroup → package regions (both views covered where relevant).
const GROUP_TO_PACKAGE: Record<MuscleGroup, Muscle[]> = {
  chest: ['chest'],
  back: ['upper-back', 'lower-back'],
  shoulders: ['front-deltoids', 'back-deltoids'],
  traps: ['trapezius'],
  quads: ['quadriceps'],
  hamstrings: ['hamstring'],
  glutes: ['gluteal'],
  calves: ['calves', 'left-soleus', 'right-soleus'],
  biceps: ['biceps'],
  triceps: ['triceps'],
  core: ['abs', 'obliques'],
  forearms: ['forearm'],
}

export default function RecoveryBodyMap({
  statuses,
}: {
  statuses: Map<MuscleGroup, RecoveryStatus>
}) {
  const [view, setView] = useState<'front' | 'back'>('front')

  const data: IExerciseData[] = []
  for (const [group, status] of statuses) {
    const freq = FREQ[status]
    if (freq === 0) continue
    for (const muscle of GROUP_TO_PACKAGE[group]) {
      for (let i = 0; i < freq; i++) {
        data.push({ name: group, muscles: [muscle] })
      }
    }
  }

  return (
    <div className="mm">
      <div className="mm__toggle" role="tablist" aria-label="Body view">
        <button
          role="tab"
          aria-selected={view === 'front'}
          className={view === 'front' ? 'mm__tab mm__tab--on' : 'mm__tab'}
          onClick={() => setView('front')}
        >
          Front
        </button>
        <button
          role="tab"
          aria-selected={view === 'back'}
          className={view === 'back' ? 'mm__tab mm__tab--on' : 'mm__tab'}
          onClick={() => setView('back')}
        >
          Back
        </button>
      </div>

      <div className="mm__model">
        <Model
          type={view === 'front' ? 'anterior' : 'posterior'}
          data={data}
          bodyColor={BODY_COLOR}
          highlightedColors={HEAT_COLORS}
          svgStyle={{ width: '100%', height: 'auto' }}
        />
      </div>

      <div className="mm__legend">
        <span className="mm__legend-item">
          <span className="mm__swatch" style={{ background: HEAT_COLORS[2] }} />
          Trained today
        </span>
        <span className="mm__legend-item">
          <span className="mm__swatch" style={{ background: HEAT_COLORS[1] }} />
          Recovering
        </span>
        <span className="mm__legend-item">
          <span className="mm__swatch" style={{ background: BODY_COLOR }} />
          Ready
        </span>
      </div>
    </div>
  )
}
