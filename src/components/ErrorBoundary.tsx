import { Component, type ReactNode } from 'react'
import './ErrorBoundary.css'

interface Props {
  children: ReactNode
}
interface State {
  error: Error | null
}

/**
 * Catches render-time throws (e.g. a malformed session from a bad import) so
 * the whole app never white-screens with no way out. Data in IndexedDB is
 * untouched; the fallback just lets the user reload.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error) {
    console.error('IronLog crashed:', error)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="errb">
          <div className="errb__card">
            <h1 className="errb__title">Something went wrong</h1>
            <p className="errb__body">
              The app hit an unexpected error. Your saved data is safe on this device — reloading
              usually fixes it.
            </p>
            <button className="errb__btn" onClick={() => window.location.reload()}>
              Reload IronLog
            </button>
            <p className="errb__hint">
              If it keeps happening, open Settings after reloading and export a backup.
            </p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
