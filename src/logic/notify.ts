// Minimal pub/sub so the storage layer can surface a toast without importing React.
type Listener = (message: string) => void

const listeners = new Set<Listener>()

export function onNotify(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function notify(message: string): void {
  for (const l of listeners) l(message)
}
