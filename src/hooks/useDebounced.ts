import { useEffect, useState } from 'react'

/** Returns `value` delayed by `delay` ms — coalesces rapid changes (e.g. typing). */
export function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(id)
  }, [value, delay])
  return debounced
}
