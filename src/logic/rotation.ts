import type { Settings, SplitDay } from '../types'
import { getSplitById, SPLITS } from '../data/splits'

export function getCurrentSplitDay(settings: Settings): SplitDay {
  const split = getSplitById(settings.split) ?? SPLITS[0]
  return split.days[settings.rotationIndex % split.days.length]
}

export function advanceRotation(settings: Settings): Settings {
  const split = getSplitById(settings.split) ?? SPLITS[0]
  return { ...settings, rotationIndex: (settings.rotationIndex + 1) % split.days.length }
}
