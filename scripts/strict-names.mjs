// One-time pass: rewrite every exercise name to the strict
// "Movement (Equipment[, Qualifier])" format. IDs are untouched,
// so history, images, muscle detail, and splits all keep working.
// Run: node scripts/strict-names.mjs
import { readFileSync, writeFileSync } from 'node:fs'

const FILE = 'src/data/exercises.ts'
const src = readFileSync(FILE, 'utf8')

const EQUIP_LABEL = {
  barbell: 'Barbell',
  dumbbell: 'Dumbbell',
  cable: 'Cable',
  machine: 'Machine',
  bodyweight: 'Bodyweight',
}

// Full-word equipment tokens to strip from the base name (Smith Machine first).
const STRIP_PATTERNS = [
  /\bSmith Machine\b/g,
  /\bBarbell\b/g,
  /\bDumbbell\b/g,
  /\bCable\b/g,
  /\bMachine\b/g,
  /\bBodyweight\b/g,
]

// Hand overrides where the mechanical transform reads poorly.
const OVERRIDES = {
  'push-up-weighted': 'Push-Up, Weighted (Bodyweight)',
  'jm-press': 'JM Press (Barbell)',
  'cable-deadlift': 'Pull-Through Deadlift (Cable)',
  'single-arm-cable-lateral': 'Single-Arm Kickback (Cable)',
}

function transform(id, rawName, equipment) {
  if (OVERRIDES[id]) return OVERRIDES[id]

  let name = rawName
  const isSmith = /smith/i.test(rawName) || /smith/i.test(id)
  const equipLabel = isSmith ? 'Smith Machine' : EQUIP_LABEL[equipment]

  // Pull an existing parenthetical qualifier out (drop it if it's just the equipment).
  let qualifier = ''
  const paren = name.match(/\(([^)]*)\)/)
  if (paren) {
    name = name.replace(/\s*\([^)]*\)/, '')
    const inner = paren[1].trim()
    const isEquipWord = Object.values(EQUIP_LABEL).some(
      (l) => l.toLowerCase() === inner.toLowerCase()
    )
    if (!isEquipWord && inner.toLowerCase() !== 'smith machine') qualifier = inner
  }

  let base = name
  for (const p of STRIP_PATTERNS) base = base.replace(p, ' ')
  base = base
    .replace(/\s{2,}/g, ' ')
    .replace(/^\s*[-–]\s*/, '')
    .replace(/\s*[-–]\s*$/, '')
    .trim()
  if (base === '') base = name.trim() // safety: never emit an empty base

  return qualifier ? `${base} (${equipLabel}, ${qualifier})` : `${base} (${equipLabel})`
}

let out = src
const entryRe = /(\{ id: '([a-z0-9-]+)', name: )('((?:[^'\\]|\\')*)'|"([^"]*)")(, muscle: '[a-z]+', type: '(?:compound|isolation)', equipment: '([a-z]+)')/g

const seen = []
out = out.replace(entryRe, (full, pre, id, _q, single, dbl, post, equipment) => {
  const rawName = (single ?? dbl).replace(/\\'/g, "'")
  const next = transform(id, rawName, equipment)
  seen.push(`${rawName}  →  ${next}`)
  const quoted = next.includes("'") ? `"${next}"` : `'${next}'`
  return `${pre}${quoted}${post}`
})

console.log(`renamed ${seen.length} exercises`)
seen.forEach((s) => console.log('  ' + s))
writeFileSync(FILE, out)
console.log('wrote', FILE)
