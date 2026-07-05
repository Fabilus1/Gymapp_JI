import { writeFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'

// 3 sets everywhere (1 warmup + 2 failure). Tricep moves carry explicit counts.
const s3 = { targetSets: 3 }
const s1 = { targetSets: 1 }

const planId = `fullbody-abc-${randomUUID()}`

const plan = {
  id: planId,
  name: 'Full Body A/B/C',
  days: [
    {
      name: 'Full Body A',
      exerciseIds: [
        'x-smith-machine-stiff-leg-deadlift',
        'x-t-bar-row',
        'x-machine-leg-extension',
        'x-cable-one-arm-tricep-extension',
        'x-cable-one-arm-tricep-pushdown',
        'x-cable-bicep-curl',
        'x-cable-lateral-raise',
        'standing-calf-raise-machine',
        'x-machine-ab-crunch',
      ],
      exerciseMeta: {
        'x-cable-one-arm-tricep-extension': s3,
        'x-cable-one-arm-tricep-pushdown': s1,
      },
    },
    {
      name: 'Full Body B',
      exerciseIds: [
        'x-machine-incline-chest-press',
        'x-machine-seated-row',
        'x-machine-leg-extension',
        'x-machine-seated-leg-curl',
        'x-machine-hip-adduction',
        'x-cable-one-arm-tricep-pushdown',
        'x-cable-one-arm-tricep-extension',
        'x-cable-bayesian-curl',
        'reverse-pec-deck',
        'standing-calf-raise-machine',
        'x-machine-ab-crunch',
      ],
      exerciseMeta: {
        'x-cable-one-arm-tricep-pushdown': s3,
        'x-cable-one-arm-tricep-extension': s1,
      },
    },
    {
      name: 'Full Body C',
      exerciseIds: [
        'x-smith-machine-stiff-leg-deadlift',
        'lat-pulldown',
        'x-machine-leg-extension',
        'x-machine-seated-leg-curl',
        'x-cable-one-arm-tricep-extension',
        'x-cable-one-arm-tricep-pushdown',
        'x-cable-bayesian-curl',
        'x-cable-lateral-raise',
        'standing-calf-raise-machine',
        'x-machine-ab-crunch',
      ],
      exerciseMeta: {
        'x-cable-one-arm-tricep-extension': s3,
        'x-cable-one-arm-tricep-pushdown': s1,
      },
    },
  ],
}

// Full IronLog backup wrapper (this is what Settings → Import expects).
const backup = {
  exportVersion: 1,
  exportedAt: new Date().toISOString(),
  settings: {
    split: planId, // makes this program active on import
    units: 'lb',
    rotationIndex: 0,
    weekSchedule: [0, null, 1, null, 2, null, null], // Mon A / Wed B / Fri C
  },
  sessions: [],
  bodyWeight: [],
  recovery: [],
  customPlans: [plan],
  profile: {},
  bodyMetrics: [],
}

const dl = 'C:/Users/jacqu/Downloads/ironlog-fullbody-abc.json'
writeFileSync(dl, JSON.stringify(backup, null, 2))
// Also emit just the plan array for the safe merge path.
writeFileSync(
  'C:/Users/jacqu/Downloads/ironlog-fullbody-abc-PLAN-ONLY.json',
  JSON.stringify([plan], null, 2)
)
console.log('wrote', dl)
console.log('planId', planId)
