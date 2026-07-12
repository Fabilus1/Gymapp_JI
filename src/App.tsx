import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import Splash from './components/Splash'
import Toast from './components/Toast'
import InstallHint from './components/InstallHint'
import BottomNav, { type TabId } from './components/BottomNav'
import { useKeyboardOpen } from './hooks/useKeyboardOpen'
import RestTimer from './components/RestTimer'
import TodayScreen from './screens/TodayScreen'
import LogScreen from './screens/LogScreen'
import PlannerScreen from './screens/PlannerScreen'
import LibraryScreen from './screens/LibraryScreen'
import ProgressScreen from './screens/ProgressScreen'
import RecoveryScreen from './screens/RecoveryScreen'
import SettingsScreen from './screens/SettingsScreen'
import { useAppData } from './hooks/useAppData'
import { useRestTimer } from './hooks/useRestTimer'
import { useWakeLock } from './hooks/useWakeLock'
import { AppDataProvider, type AppDataValue } from './context/AppDataContext'
import './App.css'

// Default rest by movement mechanic (spec: 2.5 min compound / 60 s isolation).
const REST_COMPOUND = 150
const REST_ISOLATION = 60

const TAB_TITLES: Record<TabId, string> = {
  today: 'Today',
  log: 'Log',
  plan: 'Planner',
  library: 'Library',
  progress: 'Progress',
  recovery: 'Recovery',
}

export default function App() {
  const [tab, setTab] = useState<TabId>('today')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const data = useAppData()
  const restTimer = useRestTimer()

  // Keep the screen awake while a workout is in progress.
  useWakeLock(data.activeSession !== null)

  // The static HTML splash is replaced by the animated React one on mount;
  // the React splash stays up ≥1.5s, then fades into the app.
  const [splashHolding, setSplashHolding] = useState(true)
  useEffect(() => {
    document.getElementById('splash')?.remove()
    const t = window.setTimeout(() => setSplashHolding(false), 1500)
    return () => window.clearTimeout(t)
  }, [])

  // Collapsible bottom nav: hide on scroll-down, reveal on scroll-up, and
  // hide entirely while the keyboard is up so it can't cover search results.
  const keyboardOpen = useKeyboardOpen()
  const [navHidden, setNavHidden] = useState(false)
  const lastScrollY = useRef(0)
  function handleScroll(e: React.UIEvent<HTMLElement>) {
    const y = e.currentTarget.scrollTop
    if (y > lastScrollY.current + 6 && y > 48) setNavHidden(true)
    else if (y < lastScrollY.current - 6) setNavHidden(false)
    lastScrollY.current = y
  }
  // Reset when the screen changes (it remounts scrolled to top).
  useEffect(() => {
    setNavHidden(false)
    lastScrollY.current = 0
  }, [tab, settingsOpen])

  const showSplash = splashHolding || !data.loaded || !data.settings

  if (!data.loaded || !data.settings) {
    return <Splash />
  }

  const appDataValue: AppDataValue = {
    settings: data.settings,
    units: data.settings.units,
    sessions: data.sessions,
    customPlans: data.customPlans,
    activeSession: data.activeSession,
    updateSettings: data.updateSettings,
    updateCustomPlans: data.updateCustomPlans,
    updateActiveSession: data.updateActiveSession,
  }

  const showRestBar =
    restTimer.remaining !== null ||
    restTimer.done ||
    (tab === 'log' && !settingsOpen && data.activeSession !== null)

  return (
    <AppDataProvider value={appDataValue}>
      <Header
        title={settingsOpen ? 'Settings' : TAB_TITLES[tab]}
        onSettingsClick={settingsOpen ? undefined : () => setSettingsOpen(true)}
        onBack={settingsOpen ? () => setSettingsOpen(false) : undefined}
      />
      <main className="screen" key={settingsOpen ? 'settings' : tab} onScroll={handleScroll}>
        {settingsOpen ? (
          <SettingsScreen />
        ) : (
          <>
            {tab === 'today' && (
              <TodayScreen
                onStartWorkout={() => {
                  data.startWorkout()
                  setTab('log')
                }}
                onResumeWorkout={() => setTab('log')}
                onGoProgress={() => setTab('progress')}
              />
            )}
            {tab === 'log' && (
              <LogScreen
                onFinish={(rpe) => {
                  data.finishWorkout(rpe)
                  restTimer.cancel()
                  setTab('today')
                }}
                onCancel={() => {
                  data.cancelWorkout()
                  restTimer.cancel()
                  setTab('today')
                }}
                onGoToday={() => setTab('today')}
                onSetLogged={(isCompound) =>
                  restTimer.start(isCompound ? REST_COMPOUND : REST_ISOLATION)
                }
              />
            )}
            {tab === 'plan' && <PlannerScreen />}
            {tab === 'library' && <LibraryScreen />}
            {tab === 'progress' && <ProgressScreen />}
            {tab === 'recovery' && <RecoveryScreen />}
          </>
        )}
      </main>
      {!settingsOpen && showRestBar && (
        <RestTimer
          timer={restTimer}
          showPresets={tab === 'log' && data.activeSession !== null}
        />
      )}
      {!settingsOpen && !keyboardOpen && (
        <BottomNav active={tab} onChange={setTab} hidden={navHidden} />
      )}
      <Toast />
      {!keyboardOpen && <InstallHint />}
      <AnimatePresence>{showSplash && <Splash key="splash" />}</AnimatePresence>
    </AppDataProvider>
  )
}
