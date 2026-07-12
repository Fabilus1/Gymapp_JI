import { useEffect, useState } from 'react'
import { Share, X } from 'lucide-react'
import './InstallHint.css'

const DISMISS_KEY = 'ironlog:install-hint-dismissed'

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function isStandalone(): boolean {
  // iOS uses navigator.standalone; others use the display-mode media query.
  return (
    (navigator as unknown as { standalone?: boolean }).standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches
  )
}

/**
 * One-time hint nudging iOS Safari users to install the PWA to their home
 * screen (iOS has no beforeinstallprompt, so this is the only entry point).
 * Hidden once installed (standalone) or dismissed.
 */
export default function InstallHint() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isStandalone()) return // already installed — it IS the app
    if (localStorage.getItem(DISMISS_KEY)) return
    if (!isIos()) return // Android/desktop get the native install prompt elsewhere
    const t = window.setTimeout(() => setShow(true), 1200)
    return () => window.clearTimeout(t)
  }, [])

  if (!show) return null

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, '1')
    setShow(false)
  }

  return (
    <div className="install-hint" role="dialog" aria-label="Install IronLog">
      <div className="install-hint__body">
        <p className="install-hint__title">Install IronLog</p>
        <p className="install-hint__text">
          Tap <Share size={13} className="install-hint__icon" /> Share, then{' '}
          <b>Add to Home Screen</b> for a full-screen app that works offline.
        </p>
      </div>
      <button className="install-hint__close" aria-label="Dismiss" onClick={dismiss}>
        <X size={18} />
      </button>
    </div>
  )
}
