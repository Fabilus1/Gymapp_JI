import { readFileSync } from 'node:fs'
const c = readFileSync('src/data/exercises.ts', 'utf8')
const ids = [...c.matchAll(/id: '([a-z0-9-]+)'/g)].map((m) => m[1])
// name is either single- or double-quoted
const names = [...c.matchAll(/name: (?:'((?:[^'\\]|\\')*)'|"([^"]*)")/g)].map((m) => m[1] ?? m[2])
const noEquip = names.filter((n) => !/\(/.test(n))
const dupeIds = ids.filter((id, i) => ids.indexOf(id) !== i)
console.log('total ids:', ids.length, '| total names:', names.length)
console.log('duplicate ids:', dupeIds.length ? dupeIds : 'none')
console.log('names WITHOUT equipment parens:', noEquip.length)
if (noEquip.length) console.log(noEquip.join('\n'))
