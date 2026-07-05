import { useState } from 'react'
import Model from 'react-body-highlighter'
import type { SpecificMuscle } from '../data/muscleDetail'
import { buildHighlighterData } from '../logic/bodyHighlighter'
import './MuscleDiagram.css'

// Muscle map built on react-body-highlighter's pre-made anterior/posterior
// models (replacing the hand-drawn SVG). Same {primary, secondary} contract;
// we translate our granular muscles to the package's enum in bodyHighlighter.ts.
//
// Data-mapping conflicts (our muscle → package): the package's vocabulary is
// coarser, so these collapse or drop:
//   • upper/mid/lower chest → one "chest"
//   • side delts → "front-deltoids" (no lateral-delt region)
//   • lats → "upper-back" (no distinct lats)
//   • brachialis → "biceps"; forearm flexors/extensors → "forearm"
//   • erectors → "lower-back"
//   • tibialis, hip flexors → dropped (no matching region)

// The premium "armor" treatment lives in MuscleDiagram.css: every polygon
// gets a seam stroke (negative space between blocks) and alternate facets
// get a brightness lift, which turns the package's flat polygons into a
// deliberate low-poly relief — on both the slate base and the mint.
const BODY_COLOR = '#2e2e36' // slate facet base
const SECONDARY_COLOR = 'rgba(52, 211, 153, 0.38)' // faded mint (frequency 1)
const PRIMARY_COLOR = '#34d399' // solid mint (frequency 2)

// Muscles whose best view is the back of the body — used to pick a default tab.
const BACK_MUSCLES: SpecificMuscle[] = [
  'lats',
  'upper back',
  'traps',
  'erectors',
  'rear delts',
  'glutes',
  'hamstrings',
  'calves',
  'triceps',
  'forearm extensors',
]

export default function MuscleDiagram({
  primary,
  secondary,
}: {
  primary: SpecificMuscle[]
  secondary: SpecificMuscle[]
}) {
  const defaultView: 'front' | 'back' = primary.some((m) => BACK_MUSCLES.includes(m))
    ? 'back'
    : 'front'
  const [view, setView] = useState<'front' | 'back'>(defaultView)

  const data = buildHighlighterData(primary, secondary)

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
          highlightedColors={[SECONDARY_COLOR, PRIMARY_COLOR]}
          svgStyle={{ width: '100%', height: 'auto' }}
        />
      </div>

      <div className="mm__legend">
        <span className="mm__legend-item">
          <span className="mm__swatch" style={{ background: PRIMARY_COLOR }} />
          Primary
        </span>
        <span className="mm__legend-item">
          <span className="mm__swatch" style={{ background: SECONDARY_COLOR }} />
          Secondary
        </span>
      </div>
    </div>
  )
}
