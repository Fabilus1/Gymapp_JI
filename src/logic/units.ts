import type { Settings } from '../types'

// All weights are STORED in pounds (source of truth). These helpers convert
// only for display and for interpreting user input, so switching units never
// rewrites history.

const LB_PER_KG = 2.2046226218

export type Units = Settings['units']

/** Pounds → the number shown in the chosen unit. lb is shown as-is (decimals
 * preserved); kg is rounded to the nearest 0.5 for clean plate math. */
export function toDisplayWeight(lb: number, units: Units): number {
  if (units === 'kg') return Math.round((lb / LB_PER_KG) * 2) / 2
  return lb
}

/** A number typed in the chosen unit → pounds for storage. */
export function fromDisplayWeight(value: number, units: Units): number {
  if (units === 'kg') return Math.round(value * LB_PER_KG * 100) / 100
  return value
}

/** e.g. "37.5 kg" — drops a trailing ".0". */
export function formatWeight(lb: number, units: Units): string {
  const n = toDisplayWeight(lb, units)
  const str = Number.isInteger(n) ? String(n) : String(n)
  return `${str} ${units}`
}

/** Just the numeric part in display units, as a string with no trailing .0. */
export function displayWeightStr(lb: number, units: Units): string {
  return String(toDisplayWeight(lb, units))
}

export function unitLabel(units: Units): string {
  return units
}
