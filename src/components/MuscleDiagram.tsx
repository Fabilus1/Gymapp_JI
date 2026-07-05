import { useState } from 'react'
import type { SpecificMuscle } from '../data/muscleDetail'
import './MuscleDiagram.css'

// Premium anatomical infographic. The dynamic highlight contract is unchanged
// (primary/secondary SpecificMuscle[]); presentation is upgraded: a bronze-slate
// gradient body lifted with a drop shadow, and active muscles lit by a
// volumetric mint glow (feGaussianBlur + feMerge). Right-half muscle paths are
// authored once and mirrored with <use>; centre muscles are drawn whole.

type Level = 'primary' | 'secondary' | 'none'

// Muscles whose best view is the back of the body.
const BACK_MUSCLES: SpecificMuscle[] = [
  'lats', 'upper back', 'traps', 'erectors', 'rear delts',
  'glutes', 'hamstrings', 'calves', 'triceps', 'forearm extensors',
]

const BODY_SILHOUETTE =
  'M100 8 C112 8 120 17 120 29 C120 36 117 42 113 46 C113 52 116 55 122 58 C136 63 148 66 152 76 L158 122 C160 134 158 144 155 154 L148 186 C146 193 140 194 136 189 L130 158 C128 172 130 182 133 194 C137 210 134 224 130 240 L126 296 C125 316 128 334 126 354 C125 372 122 392 122 404 L106 404 C106 388 104 370 103 352 L100 300 L97 352 C96 370 94 388 94 404 L78 404 C78 392 75 372 74 354 C72 334 75 316 74 296 L70 240 C66 224 63 210 67 194 C70 182 72 172 70 158 L64 189 C60 194 54 193 52 186 L45 154 C42 144 40 134 42 122 L48 76 C52 66 64 63 78 58 C84 55 87 52 87 46 C83 42 80 36 80 29 C80 17 88 8 100 8 Z'

// Right-half muscle paths (mirrored to the left via <use>).
const FRONT_RIGHT: { m: SpecificMuscle; d: string }[] = [
  { m: 'traps', d: 'M104 56 C112 58 124 63 132 70 L116 74 C110 67 106 61 104 56 Z' },
  { m: 'front delts', d: 'M118 76 C126 70 136 72 140 80 C138 88 130 92 122 90 C118 86 117 80 118 76 Z' },
  { m: 'side delts', d: 'M140 80 C146 72 152 74 154 84 C154 94 150 102 144 104 C141 96 140 88 140 80 Z' },
  { m: 'upper chest', d: 'M102 78 C112 76 126 78 136 88 L130 94 C120 86 110 84 102 86 Z' },
  { m: 'mid chest', d: 'M102 86 C112 84 122 88 130 94 C134 102 132 112 124 118 C112 122 104 116 102 108 Z' },
  { m: 'lower chest', d: 'M104 116 C112 121 122 120 128 114 C130 120 126 127 118 129 C110 128 105 122 104 116 Z' },
  { m: 'obliques', d: 'M113 132 C118 140 119 160 115 180 C113 186 111 188 111 182 C114 166 114 146 111 134 Z' },
  { m: 'biceps', d: 'M142 106 C150 102 156 108 156 120 C156 132 151 141 146 138 C141 131 139 114 142 106 Z' },
  { m: 'brachialis', d: 'M156 116 C160 114 162 122 160 132 C158 139 154 140 154 134 C155 128 156 122 156 116 Z' },
  { m: 'forearm flexors', d: 'M146 144 C154 140 160 148 158 164 C156 178 151 188 147 186 C142 176 142 154 146 144 Z' },
  { m: 'hip flexors', d: 'M104 196 C111 195 117 199 120 207 L111 212 C107 206 104 200 104 196 Z' },
  { m: 'adductors', d: 'M103 214 C109 212 113 219 113 232 C112 244 108 251 104 249 C101 238 101 222 103 214 Z' },
  { m: 'quads', d: 'M113 206 C124 202 133 211 133 232 C133 258 128 279 120 285 C113 283 108 264 108 238 C108 223 110 211 113 206 Z' },
  { m: 'tibialis', d: 'M115 302 C121 299 125 307 124 325 C123 341 119 351 116 349 C112 339 112 313 115 302 Z' },
]

const BACK_RIGHT: { m: SpecificMuscle; d: string }[] = [
  { m: 'rear delts', d: 'M138 76 C147 72 154 78 154 88 C153 97 147 103 141 101 C137 93 136 82 138 76 Z' },
  { m: 'upper back', d: 'M106 92 C114 86 126 84 134 90 C132 100 124 108 112 111 C108 105 105 97 106 92 Z' },
  { m: 'lats', d: 'M105 118 C116 112 128 104 135 97 C140 112 137 132 128 148 C119 160 109 164 105 158 C103 146 103 130 105 118 Z' },
  { m: 'triceps', d: 'M144 102 C152 98 158 106 157 121 C156 134 150 142 146 138 C141 130 141 111 144 102 Z' },
  { m: 'forearm extensors', d: 'M146 144 C154 140 160 148 158 164 C156 178 151 188 147 186 C142 176 142 154 146 144 Z' },
  { m: 'glutes', d: 'M103 196 C116 191 129 199 129 215 C129 231 118 240 107 236 C100 230 99 207 103 196 Z' },
  { m: 'hamstrings', d: 'M109 242 C121 238 131 246 129 268 C127 288 121 302 113 304 C107 300 105 280 105 260 C105 250 107 244 109 242 Z' },
  { m: 'calves', d: 'M111 314 C121 309 128 319 126 338 C124 353 118 361 114 359 C108 350 107 325 111 314 Z' },
]

const FRONT_LABELS = [
  { text: 'Deltoids', x: 234, y: 120, cx: 198, tx: 182, ty: 128 },
  { text: 'Pectorals', x: 26, y: 150, cx: 62, tx: 150, ty: 146 },
  { text: 'Biceps', x: 234, y: 170, cx: 198, tx: 186, ty: 166 },
  { text: 'Abs', x: 26, y: 206, cx: 62, tx: 126, ty: 198 },
  { text: 'Obliques', x: 234, y: 218, cx: 198, tx: 150, ty: 208 },
  { text: 'Quads', x: 26, y: 300, cx: 62, tx: 150, ty: 288 },
]

const BACK_LABELS = [
  { text: 'Trapezius', x: 26, y: 122, cx: 62, tx: 126, ty: 122 },
  { text: 'Latissimus', x: 234, y: 176, cx: 198, tx: 158, ty: 176 },
  { text: 'Erectors', x: 26, y: 222, cx: 62, tx: 128, ty: 222 },
  { text: 'Glutes', x: 234, y: 258, cx: 198, tx: 150, ty: 258 },
  { text: 'Hamstrings', x: 26, y: 312, cx: 62, tx: 140, ty: 306 },
  { text: 'Calves', x: 234, y: 378, cx: 198, tx: 150, ty: 376 },
]

function paint(level: Level) {
  if (level === 'primary') {
    return { fill: 'url(#mmActive)', filter: 'url(#mmGlow)' }
  }
  if (level === 'secondary') {
    return { fill: '#34d399', fillOpacity: 0.34 }
  }
  return { fill: 'url(#mmMuscle)', stroke: 'rgba(255,255,255,0.05)', strokeWidth: 0.5 }
}

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

  const level = (m: SpecificMuscle): Level =>
    primary.includes(m) ? 'primary' : secondary.includes(m) ? 'secondary' : 'none'

  const rightPaths = view === 'front' ? FRONT_RIGHT : BACK_RIGHT
  const labels = view === 'front' ? FRONT_LABELS : BACK_LABELS
  const groupId = view === 'front' ? 'mmFrontRight' : 'mmBackRight'

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

      <svg
        viewBox="0 0 260 504"
        className="mm__svg"
        preserveAspectRatio="xMidYMid meet"
        aria-label={`${view} muscle map`}
      >
        <defs>
          {/* bronze-slate metallic body */}
          <linearGradient id="mmBody" x1="0.2" y1="0" x2="0.85" y2="1">
            <stop offset="0" stopColor="#3b3730" />
            <stop offset="0.45" stopColor="#20222a" />
            <stop offset="1" stopColor="#0c0d11" />
          </linearGradient>
          <radialGradient id="mmSheen" cx="0.34" cy="0.2" r="0.9">
            <stop offset="0" stopColor="#4a4640" stopOpacity="0.55" />
            <stop offset="0.55" stopColor="#2a2c33" stopOpacity="0" />
          </radialGradient>
          {/* resting muscle bellies — subtle raised slate */}
          <linearGradient id="mmMuscle" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0" stopColor="#34373f" />
            <stop offset="1" stopColor="#20222a" />
          </linearGradient>
          {/* active muscle — bright volumetric mint */}
          <radialGradient id="mmActive" cx="0.4" cy="0.35" r="0.85">
            <stop offset="0" stopColor="#a7f3d0" />
            <stop offset="0.5" stopColor="#34d399" />
            <stop offset="1" stopColor="#0f9d6f" />
          </radialGradient>

          {/* neon glow for active muscles */}
          <filter id="mmGlow" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* lift the figure off the background */}
          <filter id="mmShadow" x="-25%" y="-15%" width="150%" height="130%">
            <feDropShadow dx="0" dy="7" stdDeviation="8" floodColor="#000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* header */}
        <text x="130" y="22" className="mm__header" textAnchor="middle">
          WORKOUT TARGETED MUSCLE FOCUS
        </text>

        {/* framing labels + connector lines */}
        <g className="mm__labels">
          {labels.map((l) => (
            <g key={l.text}>
              <line x1={l.cx} y1={l.y - 3} x2={l.tx} y2={l.ty} className="mm__leader" />
              <circle cx={l.tx} cy={l.ty} r="1.4" className="mm__leader-dot" />
              <text
                x={l.x}
                y={l.y}
                className="mm__label"
                textAnchor={l.x < 130 ? 'start' : 'end'}
              >
                {l.text}
              </text>
            </g>
          ))}
        </g>

        {/* the figure */}
        <g transform="translate(30 44)" filter="url(#mmShadow)">
          <path d={BODY_SILHOUETTE} fill="url(#mmBody)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <path d={BODY_SILHOUETTE} fill="url(#mmSheen)" />

          {view === 'front' ? (
            <>
              <path d="M90 128 C96 124 104 124 110 128 C113 146 113 168 110 186 C106 196 94 196 90 186 C87 168 87 146 90 128 Z" {...paint(level('abs'))} />
              <path
                className="mm__stria"
                d="M89 144 L111 144 M89 159 L111 159 M89 173 L111 173 M100 127 L100 190"
              />
            </>
          ) : (
            <>
              <path d="M100 52 C108 56 122 63 136 74 C124 80 110 92 104 116 L100 122 L96 116 C90 92 76 80 64 74 C78 63 92 56 100 52 Z" {...paint(level('traps'))} />
              <path d="M93 140 C96 138 98 138 98 142 L98 192 C98 197 93 197 92 192 C90 175 90 154 93 140 Z M107 140 C104 138 102 138 102 142 L102 192 C102 197 107 197 108 192 C110 175 110 154 107 140 Z" {...paint(level('erectors'))} />
            </>
          )}

          <g id={groupId}>
            {rightPaths.map(({ m, d }) => (
              <path key={m} d={d} {...paint(level(m))} />
            ))}
          </g>
          <use href={`#${groupId}`} transform="translate(200 0) scale(-1 1)" />
        </g>

        {/* legend */}
        <g className="mm__legend-g">
          <rect x="86" y="482" width="14" height="8" rx="4" fill="url(#mmActive)" filter="url(#mmGlow)" />
          <text x="106" y="489" className="mm__legend-t">
            Target Muscle Group
          </text>
        </g>
      </svg>
    </div>
  )
}
