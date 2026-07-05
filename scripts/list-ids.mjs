import { readFileSync } from 'node:fs'
const files = ['src/data/exercises.ts', 'src/data/exercisesExtra.ts', 'src/data/exercisesExact.ts']
const out = []
for (const f of files) {
  const c = readFileSync(f, 'utf8')
  const re = /id: '([a-z0-9-]+)', name: (?:'((?:[^'\\]|\\')*)'|"([^"]*)")/g
  let m
  while ((m = re.exec(c))) out.push([m[1], (m[2] ?? m[3]).replace(/\\'/g, "'")])
}
const kw = [
  'stiff', 't-bar', 't bar', 'leg extension', 'leg curl', 'tricep', 'bicep curl',
  'bayesian', 'lateral raise', 'calf raise', 'calf press', 'ab crunch', 'crunch',
  'incline chest', 'seated row', 'hip ad', 'reverse fly', 'reverse pec', 'lat pulldown', 'reverse delt',
]
for (const [id, name] of out) {
  const n = name.toLowerCase()
  if (kw.some((k) => n.includes(k))) console.log(id.padEnd(42), name)
}
