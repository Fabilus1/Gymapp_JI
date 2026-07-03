import { motion } from 'framer-motion'
import { Dumbbell } from 'lucide-react'
import './Splash.css'

export default function Splash() {
  return (
    <motion.div
      className="splash"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45, ease: 'easeInOut' } }}
    >
      <motion.div
        className="splash__icon"
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Dumbbell size={46} strokeWidth={1.4} />
      </motion.div>
      <p className="splash__word">IRONLOG</p>
    </motion.div>
  )
}
