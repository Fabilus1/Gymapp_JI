import { useEffect, useState } from 'react'

function format(startIso: string): string {
  const secs = Math.max(0, Math.floor((Date.now() - new Date(startIso).getTime()) / 1000))
  const m = Math.floor(secs / 60)
  const s = secs % 60
  if (m >= 60) {
    return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Live "elapsed since" label, ticking once per second while start is non-null. */
export function useElapsed(startIso: string | null): string {
  const [label, setLabel] = useState(() => (startIso ? format(startIso) : '0:00'))

  useEffect(() => {
    if (!startIso) return
    setLabel(format(startIso))
    const id = window.setInterval(() => setLabel(format(startIso)), 1000)
    return () => window.clearInterval(id)
  }, [startIso])

  return label
}
