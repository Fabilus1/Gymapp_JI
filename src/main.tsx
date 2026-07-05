import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/space-grotesk/index.css'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

// The service worker is registered + auto-updated by vite-plugin-pwa
// (registerType: 'autoUpdate' → it skips waiting and reloads on a new build).
// iOS only checks for a new version on a cold launch, so we also prod it to
// check whenever the installed app returns to the foreground — that way an
// update lands on the next reopen instead of needing a second launch.
if ('serviceWorker' in navigator) {
  const checkForUpdate = () => {
    navigator.serviceWorker
      .getRegistration()
      .then((reg) => reg?.update())
      .catch(() => {})
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkForUpdate()
  })
  // Belt-and-suspenders for long-lived sessions left open.
  window.setInterval(checkForUpdate, 30 * 60 * 1000)
}
