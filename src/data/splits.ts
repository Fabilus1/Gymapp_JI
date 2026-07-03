import type { Split } from '../types'

export const SPLITS: Split[] = [
  {
    id: 'full-body',
    name: 'Full Body A/B/C',
    days: [
      {
        name: 'Full Body A',
        exerciseIds: [
          'back-squat',
          'barbell-bench-press',
          'barbell-row',
          'seated-dumbbell-shoulder-press',
          'seated-leg-curl',
          'barbell-curl',
          'cable-crunch',
        ],
      },
      {
        name: 'Full Body B',
        exerciseIds: [
          'conventional-deadlift',
          'incline-dumbbell-press',
          'lat-pulldown',
          'leg-press',
          'dumbbell-lateral-raise',
          'tricep-pushdown',
          'hanging-leg-raise',
        ],
      },
      {
        name: 'Full Body C',
        exerciseIds: [
          'front-squat',
          'machine-chest-press',
          'seated-cable-row',
          'romanian-deadlift',
          'cable-lateral-raise',
          'hammer-curl',
          'standing-calf-raise',
        ],
      },
    ],
  },
  {
    id: 'upper-lower',
    name: 'Upper A / Lower A / Upper B / Lower B',
    days: [
      {
        name: 'Upper A',
        exerciseIds: [
          'barbell-bench-press',
          'barbell-row',
          'seated-dumbbell-shoulder-press',
          'lat-pulldown',
          'dumbbell-lateral-raise',
          'barbell-curl',
          'tricep-pushdown',
        ],
      },
      {
        name: 'Lower A',
        exerciseIds: [
          'back-squat',
          'romanian-deadlift',
          'leg-press',
          'seated-leg-curl',
          'standing-calf-raise',
          'hanging-leg-raise',
        ],
      },
      {
        name: 'Upper B',
        exerciseIds: [
          'incline-dumbbell-press',
          'pull-up',
          'barbell-overhead-press',
          'chest-supported-dumbbell-row',
          'cable-lateral-raise',
          'hammer-curl',
          'skull-crushers',
        ],
      },
      {
        name: 'Lower B',
        exerciseIds: [
          'conventional-deadlift',
          'front-squat',
          'hip-thrust',
          'leg-extension',
          'seated-calf-raise',
          'cable-crunch',
        ],
      },
    ],
  },
  {
    id: 'push-pull-legs',
    name: 'Push / Pull / Legs',
    days: [
      {
        name: 'Push',
        exerciseIds: [
          'barbell-bench-press',
          'seated-dumbbell-shoulder-press',
          'incline-dumbbell-press',
          'cable-lateral-raise',
          'tricep-pushdown',
          'overhead-tricep-extension-dumbbell',
          'cable-crossover',
        ],
      },
      {
        name: 'Pull',
        exerciseIds: [
          'conventional-deadlift',
          'barbell-row',
          'lat-pulldown',
          'seated-cable-row',
          'face-pull',
          'barbell-curl',
          'hammer-curl',
        ],
      },
      {
        name: 'Legs',
        exerciseIds: [
          'back-squat',
          'romanian-deadlift',
          'leg-press',
          'seated-leg-curl',
          'standing-calf-raise',
          'hanging-leg-raise',
        ],
      },
    ],
  },
]

export function getSplitById(id: string) {
  return SPLITS.find((s) => s.id === id)
}
