import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import './PRCelebration.css'

// Confetti particle directions, precomputed so renders are stable.
const PARTICLES = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2
  const dist = 46 + (i % 3) * 18
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist - 10,
    rotate: (i % 2 === 0 ? 1 : -1) * (120 + i * 20),
    delay: (i % 4) * 0.03,
    color: ['#34d399', '#eab308', '#f97316', '#a855f7'][i % 4],
  }
})

export default function PRCelebration({ value, name }: { value: number; name: string }) {
  return (
    <div className="prc" aria-live="polite">
      <div className="prc__anchor">
        {PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="prc__particle"
            style={{ background: p.color }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
            animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rotate, scale: 0.4 }}
            transition={{ duration: 0.9, delay: p.delay, ease: 'easeOut' }}
          />
        ))}
        <motion.div
          className="prc__badge"
          initial={{ scale: 0.4, opacity: 0, y: 8 }}
          animate={{ scale: [0.4, 1.12, 1], opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <Trophy size={15} />
          <span>
            New PR — {value} lb e1RM
            <em className="prc__name">{name}</em>
          </span>
        </motion.div>
      </div>
    </div>
  )
}
