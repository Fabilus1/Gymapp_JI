import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { onNotify } from '../logic/notify'
import './Toast.css'

/** Listens for storage-layer notifications and shows a transient toast. */
export default function Toast() {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    return onNotify((msg) => {
      setMessage(msg)
      window.setTimeout(() => setMessage((m) => (m === msg ? null : m)), 5000)
    })
  }, [])

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="toast"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={() => setMessage(null)}
        >
          <AlertTriangle size={16} className="toast__icon" />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
