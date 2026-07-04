/**
 * Fire a haptic pulse if the platform supports the Web Vibration API.
 * iOS Safari doesn't expose it, so this safely no-ops there.
 */
export function vibrate(pattern: number | number[]): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern)
    } catch {
      // some browsers throw if called without a user gesture — ignore
    }
  }
}
