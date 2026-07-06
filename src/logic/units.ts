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

// ---- Lengths (heights & body measurements, stored in inches) ----

const CM_PER_IN = 2.54

/** 70.5in → { ft: 5, inches: 10.5 } */
export function inchesToFtIn(totalIn: number): { ft: number; inches: number } {
  const ft = Math.floor(totalIn / 12)
  const inches = Math.round((totalIn - ft * 12) * 10) / 10
  return { ft, inches }
}

export function ftInToInches(ft: number, inches: number): number {
  return ft * 12 + inches
}

/** inches → meters, 2 decimals (e.g. 69 → 1.75) */
export function inchesToMeters(totalIn: number): number {
  return Math.round(totalIn * CM_PER_IN) / 100
}

export function metersToInches(m: number): number {
  return Math.round(((m * 100) / CM_PER_IN) * 10) / 10
}

/** Body measurement display: inches as-is, or cm (1 decimal) in metric mode. */
export function toDisplayLength(inches: number, units: Units): number {
  if (units === 'kg') return Math.round(inches * CM_PER_IN * 10) / 10
  return inches
}

export function fromDisplayLength(value: number, units: Units): number {
  if (units === 'kg') return Math.round((value / CM_PER_IN) * 100) / 100
  return value
}

export function lengthUnitLabel(units: Units): string {
  return units === 'kg' ? 'cm' : 'in'
}
