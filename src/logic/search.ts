import type { Exercise } from '../types'

/**
 * Tokenized match: the query is split on whitespace and every token must
 * appear somewhere in the exercise name (order-independent). So "lat machine"
 * matches "Lat Pulldown (Machine)" and "machine lat" matches it too.
 */
export function matchesQuery(name: string, query: string): boolean {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return true
  const haystack = name.toLowerCase()
  return tokens.every((t) => haystack.includes(t))
}

export function searchExercises(exercises: Exercise[], query: string): Exercise[] {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return exercises
  return exercises.filter((e) => {
    const haystack = e.name.toLowerCase()
    return tokens.every((t) => haystack.includes(t))
  })
}
