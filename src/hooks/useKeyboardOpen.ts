import { useEffect, useState } from 'react'

const EDITABLE = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

/**
 * True while a text field is focused (i.e. the on-screen keyboard is up on
 * mobile). Used to hide the bottom nav so it doesn't get pushed over the
 * content / search results. Uses focusin/focusout, which bubble.
 */
export function useKeyboardOpen(): boolean {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onFocusIn(e: FocusEvent) {
      const t = e.target as HTMLElement | null
      if (t && EDITABLE.has(t.tagName)) setOpen(true)
    }
    function onFocusOut() {
      // defer so focus moving between two inputs doesn't flicker the nav
      window.setTimeout(() => {
        const a = document.activeElement
        setOpen(!!a && EDITABLE.has(a.tagName))
      }, 0)
    }
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
    return () => {
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
    }
  }, [])

  return open
}
