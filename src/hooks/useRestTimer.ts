import { useCallback, useEffect, useRef, useState } from 'react'

export interface RestTimer {
  /** seconds remaining; null = idle */
  remaining: number | null
  /** true for a few seconds after the countdown hits zero */
  done: boolean
  start: (seconds: number) => void
  /** add/subtract seconds from a running timer (clamped ≥ 5s) */
  adjust: (delta: number) => void
  cancel: () => void
}

function beep() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5)
    osc.start()
    osc.stop(ctx.currentTime + 0.5)
    osc.onended = () => ctx.close()
  } catch {
    // audio unavailable — the visual "GO" state still shows
  }
}

export function useRestTimer(): RestTimer {
  const [remaining, setRemaining] = useState<number | null>(null)
  const [done, setDone] = useState(false)
  const endRef = useRef<number | null>(null)
  const doneTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (endRef.current === null) return
    const id = window.setInterval(() => {
      if (endRef.current === null) return
      const left = Math.max(0, Math.round((endRef.current - Date.now()) / 1000))
      setRemaining(left)
      if (left === 0) {
        endRef.current = null
        setRemaining(null)
        setDone(true)
        beep()
        if (navigator.vibrate) navigator.vibrate([200, 100, 200])
        doneTimeoutRef.current = window.setTimeout(() => setDone(false), 4000)
      }
    }, 250)
    return () => window.clearInterval(id)
  }, [remaining !== null]) // eslint-disable-line react-hooks/exhaustive-deps

  const start = useCallback((seconds: number) => {
    if (doneTimeoutRef.current) window.clearTimeout(doneTimeoutRef.current)
    setDone(false)
    endRef.current = Date.now() + seconds * 1000
    setRemaining(seconds)
  }, [])

  const adjust = useCallback((delta: number) => {
    if (endRef.current === null) return
    const left = Math.max(5, Math.round((endRef.current - Date.now()) / 1000) + delta)
    endRef.current = Date.now() + left * 1000
    setRemaining(left)
  }, [])

  const cancel = useCallback(() => {
    if (doneTimeoutRef.current) window.clearTimeout(doneTimeoutRef.current)
    endRef.current = null
    setRemaining(null)
    setDone(false)
  }, [])

  return { remaining, done, start, adjust, cancel }
}
