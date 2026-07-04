import { readFileSync } from 'node:fs'

function parse(file) {
  const c = readFileSync(file, 'utf8')
  const ids = [...c.matchAll(/id: '([a-z0-9-]+)'/g)].map((m) => m[1])
  const names = [...c.matchAll(/name: (?:'((?:[^'\\]|\\')*)'|"([^"]*)")/g)].map((m) => m[1] ?? m[2])
  return { c, ids, names }
}

const base = parse('src/data/exercises.ts')
const extra = parse('src/data/exercisesExtra.ts')
const exact = parse('src/data/exercisesExact.ts')

const allIds = [...base.ids, ...extra.ids, ...exact.ids]
const allNames = [...base.names, ...extra.names, ...exact.names]

// duplicate ids across both files
const seen = new Set()
const dupes = []
for (const id of allIds) {
  if (seen.has(id)) dupes.push(id)
  seen.add(id)
}

// muscleDetail coverage (both maps)
const md = readFileSync('src/data/muscleDetail.ts', 'utf8')
const mdExtra = readFileSync('src/data/exercisesExtra.ts', 'utf8')
const mdExact = readFileSync('src/data/exercisesExact.ts', 'utf8')
const covered = new Set([
  ...[...md.matchAll(/'([a-z0-9-]+)': \{ primary/g)].map((m) => m[1]),
  ...[...mdExtra.matchAll(/'([a-z0-9-]+)': \{ primary/g)].map((m) => m[1]),
  ...[...mdExact.matchAll(/'([a-z0-9-]+)': \{ primary/g)].map((m) => m[1]),
])
const missing = allIds.filter((id) => !covered.has(id))

const noEquip = allNames.filter((n) => !/\(/.test(n))
const kettlebell = allNames.filter((n) => /kettlebell/i.test(n))

console.log('TOTAL exercises:', allIds.length, `(base ${base.ids.length} + extra ${extra.ids.length})`)
console.log('duplicate ids:', dupes.length ? dupes : 'none')
console.log('names without equipment parens:', noEquip.length ? noEquip : 'none')
console.log('kettlebell entries:', kettlebell.length ? kettlebell : 'none')
console.log('muscleDetail missing:', missing.length ? missing : 'none')
