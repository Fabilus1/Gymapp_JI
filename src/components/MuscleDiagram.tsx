import type { SpecificMuscle } from '../data/muscleDetail'
import './MuscleDiagram.css'

// Stylized front/back muscle map. Each region is keyed by SpecificMuscle;
// primary targets fill with the accent, secondary with a dim accent.

type Level = 'primary' | 'secondary' | 'none'

function levelFor(
  muscle: SpecificMuscle,
  primary: SpecificMuscle[],
  secondary: SpecificMuscle[]
): Level {
  if (primary.includes(muscle)) return 'primary'
  if (secondary.includes(muscle)) return 'secondary'
  return 'none'
}

function cls(level: Level): string {
  return level === 'none' ? 'md__m' : `md__m md__m--${level}`
}

const SILHOUETTE =
  'M60 10a11 11 0 0 1 11 11 11 11 0 0 1-4 8.5c1 3 4.5 5 9 6.5 8 2.5 12 5 13 12l4 34c1.5 5-1 8-4 13l-7 13c-1.5 3-6 3-7.5 0l-1-2c-1.5 4-3 6-3 10l3 30c.5 6 .5 12-1 18l-4 42c-.5 5 1 8 1 12 0 5-2 8-2 12h-11c-1-4-2-7-2-12l-1.5-27-2-25-2 25-1.5 27c0 5-1 8-2 12h-11c0-4-2-7-2-12 0-4 1.5-7 1-12l-4-42c-1.5-6-1.5-12-1-18l3-30c0-4-1.5-6-3-10l-1 2c-1.5 3-6 3-7.5 0l-7-13c-3-5-5.5-8-4-13l4-34c1-7 5-9.5 13-12 4.5-1.5 8-3.5 9-6.5a11 11 0 0 1-4-8.5A11 11 0 0 1 60 10Z'

export default function MuscleDiagram({
  primary,
  secondary,
}: {
  primary: SpecificMuscle[]
  secondary: SpecificMuscle[]
}) {
  const L = (m: SpecificMuscle) => cls(levelFor(m, primary, secondary))

  return (
    <div className="md">
      {/* FRONT */}
      <svg viewBox="0 0 120 250" className="md__view" aria-label="Front muscles">
        <path d={SILHOUETTE} className="md__body" />
        {/* front delts */}
        <ellipse cx="38" cy="62" rx="5" ry="6.5" className={L('front delts')} />
        <ellipse cx="82" cy="62" rx="5" ry="6.5" className={L('front delts')} />
        {/* side delts */}
        <ellipse cx="29.5" cy="65" rx="4.5" ry="7.5" className={L('side delts')} />
        <ellipse cx="90.5" cy="65" rx="4.5" ry="7.5" className={L('side delts')} />
        {/* chest bands */}
        <rect x="44" y="56" width="32" height="9" rx="4" className={L('upper chest')} />
        <rect x="44" y="66.5" width="32" height="12" rx="5" className={L('mid chest')} />
        <rect x="44" y="80" width="32" height="8" rx="4" className={L('lower chest')} />
        {/* biceps + brachialis (outer strip) */}
        <ellipse cx="28" cy="93" rx="4.6" ry="11" className={L('biceps')} />
        <ellipse cx="92" cy="93" rx="4.6" ry="11" className={L('biceps')} />
        <ellipse cx="23.4" cy="96" rx="2.2" ry="8" className={L('brachialis')} />
        <ellipse cx="96.6" cy="96" rx="2.2" ry="8" className={L('brachialis')} />
        {/* forearm flexors */}
        <ellipse cx="21" cy="124" rx="4.2" ry="13" className={L('forearm flexors')} />
        <ellipse cx="99" cy="124" rx="4.2" ry="13" className={L('forearm flexors')} />
        {/* abs + obliques */}
        <rect x="51.5" y="93" width="17" height="40" rx="7" className={L('abs')} />
        <rect x="43" y="96" width="6.5" height="34" rx="3" className={L('obliques')} />
        <rect x="70.5" y="96" width="6.5" height="34" rx="3" className={L('obliques')} />
        {/* hip flexors */}
        <rect x="46" y="136" width="11" height="8" rx="4" className={L('hip flexors')} />
        <rect x="63" y="136" width="11" height="8" rx="4" className={L('hip flexors')} />
        {/* quads + adductors */}
        <ellipse cx="46.5" cy="172" rx="8" ry="25" className={L('quads')} />
        <ellipse cx="73.5" cy="172" rx="8" ry="25" className={L('quads')} />
        <ellipse cx="56.5" cy="160" rx="3.6" ry="15" className={L('adductors')} />
        <ellipse cx="63.5" cy="160" rx="3.6" ry="15" className={L('adductors')} />
        {/* tibialis */}
        <ellipse cx="49" cy="224" rx="3.8" ry="15" className={L('tibialis')} />
        <ellipse cx="71" cy="224" rx="3.8" ry="15" className={L('tibialis')} />
      </svg>

      {/* BACK */}
      <svg viewBox="0 0 120 250" className="md__view" aria-label="Back muscles">
        <path d={SILHOUETTE} className="md__body" />
        {/* traps */}
        <path
          d="M60 40 L80 56 L72 74 L60 68 L48 74 L40 56 Z"
          className={L('traps')}
        />
        {/* rear delts */}
        <ellipse cx="30" cy="65" rx="4.8" ry="7" className={L('rear delts')} />
        <ellipse cx="90" cy="65" rx="4.8" ry="7" className={L('rear delts')} />
        {/* upper back (rhomboids) */}
        <rect x="46" y="74" width="12" height="15" rx="4" className={L('upper back')} />
        <rect x="62" y="74" width="12" height="15" rx="4" className={L('upper back')} />
        {/* lats */}
        <path d="M42 82 Q38 100 52 122 L56 120 Q52 100 50 84 Z" className={L('lats')} />
        <path d="M78 82 Q82 100 68 122 L64 120 Q68 100 70 84 Z" className={L('lats')} />
        {/* erectors */}
        <rect x="54" y="94" width="5" height="42" rx="2.5" className={L('erectors')} />
        <rect x="61" y="94" width="5" height="42" rx="2.5" className={L('erectors')} />
        {/* triceps */}
        <ellipse cx="28" cy="94" rx="4.6" ry="11.5" className={L('triceps')} />
        <ellipse cx="92" cy="94" rx="4.6" ry="11.5" className={L('triceps')} />
        {/* forearm extensors */}
        <ellipse cx="21" cy="124" rx="4.2" ry="13" className={L('forearm extensors')} />
        <ellipse cx="99" cy="124" rx="4.2" ry="13" className={L('forearm extensors')} />
        {/* glutes */}
        <ellipse cx="50" cy="148" rx="9" ry="11" className={L('glutes')} />
        <ellipse cx="70" cy="148" rx="9" ry="11" className={L('glutes')} />
        {/* hamstrings */}
        <ellipse cx="47" cy="186" rx="7.5" ry="21" className={L('hamstrings')} />
        <ellipse cx="73" cy="186" rx="7.5" ry="21" className={L('hamstrings')} />
        {/* calves */}
        <ellipse cx="48.5" cy="226" rx="5.2" ry="14" className={L('calves')} />
        <ellipse cx="71.5" cy="226" rx="5.2" ry="14" className={L('calves')} />
      </svg>
    </div>
  )
}
