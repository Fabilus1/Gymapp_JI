// DB integrity: unique ids, unique names, strict-name format, full
// muscleDetail coverage, and valid split references.
import { readFileSync } from 'node:fs'

const src = readFileSync('src/data/exercises.ts', 'utf8')
const entryRe = /\{ id: '([a-z0-9-]+)', name: (?:'((?:[^'\\]|\\')*)'|"([^"]*)")/g
const entries = [...src.matchAll(entryRe)].map((m) => ({
  id: m[1],
  name: (m[2] ?? m[3]).replace(/\\'/g, "'"),
}))

const ids = entries.map((e) => e.id)
const names = entries.map((e) => e.name)
const dupIds = ids.filter((x, i) => ids.indexOf(x) !== i)
const dupNames = names.filter((x, i) => names.indexOf(x) !== i)
const badFormat = names.filter(
  (n) => !/\((Barbell|Dumbbell|Cable|Machine|Bodyweight|Smith Machine)(, [^)]+)?\)$/.test(n)
)

const md = readFileSync('src/data/muscleDetail.ts', 'utf8')
const covered = new Set([...md.matchAll(/'([a-z0-9-]+)': \{ primary/g)].map((m) => m[1]))
const missingDetail = ids.filter((id) => !covered.has(id))
const orphanDetail = [...covered].filter((id) => !ids.includes(id))

const splits = readFileSync('src/data/splits.ts', 'utf8')
const refs = [...splits.matchAll(/'([a-z0-9-]+)'/g)]
  .map((m) => m[1])
  .filter((s) => s.includes('-') && !['full-body', 'upper-lower', 'push-pull-legs'].includes(s))
const missingRefs = refs.filter((r) => !ids.includes(r))

console.log('exercises:', entries.length)
console.log('dup ids:', dupIds.length ? dupIds : 'none')
console.log('dup names:', dupNames.length ? dupNames : 'none')
console.log('bad name format:', badFormat.length ? badFormat : 'none')
console.log('missing muscleDetail:', missingDetail.length ? missingDetail : 'none')
console.log('orphan muscleDetail:', orphanDetail.length ? orphanDetail : 'none')
console.log('bad split refs:', missingRefs.length ? missingRefs : 'none')

const ok =
  !dupIds.length && !dupNames.length && !badFormat.length && !missingDetail.length && !missingRefs.length
process.exit(ok ? 0 : 1)
