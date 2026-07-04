import { useEffect, useRef } from 'react'

type WakeLockSentinelLike = { released: boolean; release: () => Promise<void> }

/**
 * Keeps the screen awake while `active` is true (e.g. during a workout so it
 * doesn't sleep between sets). Re-acquires the lock when the tab becomes
 * visible again, since the browser releases it on tab switch. No-ops on
 * platforms without the Screen Wake Lock API.
 */
export function useWakeLock(active: boolean): void {
  const sentinelRef = useRef<WakeLockSentinelLike | null>(null)

  useEffect(() => {
    if (!active) return
    const wl = (navigator as unknown as {
      wakeLock?: { request: (t: 'screen') => Promise<WakeLockSentinelLike> }
    }).wakeLock
    if (!wl) return

    let cancelled = false

    async function acquire() {
      try {
        const sentinel = await wl!.request('screen')
        if (cancelled) {
          sentinel.release().catch(() => {})
          return
        }
        sentinelRef.current = sentinel
      } catch {
        // request can reject (e.g. low battery / not visible) — safe to ignore
      }
    }

    function onVisible() {
      if (document.visibilityState === 'visible' && !sentinelRef.current?.released) {
        // sentinel was released while hidden; grab a fresh one
        acquire()
      }
    }

    acquire()
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisible)
      sentinelRef.current?.release().catch(() => {})
      sentinelRef.current = null
    }
  }, [active])
}
