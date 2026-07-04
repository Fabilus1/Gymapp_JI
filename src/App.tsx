import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import Splash from './components/Splash'
import BottomNav, { type TabId } from './components/BottomNav'
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

  // Collapsible bottom nav: hide on scroll-down, reveal on scroll-up.
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

  const showRestBar =
    restTimer.remaining !== null ||
    restTimer.done ||
    (tab === 'log' && !settingsOpen && data.activeSession !== null)

  return (
    <>
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
                settings={data.settings}
                customPlans={data.customPlans}
                sessions={data.sessions}
                hasActiveSession={data.activeSession !== null}
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
                session={data.activeSession}
                sessions={data.sessions}
                onChange={data.updateActiveSession}
                onFinish={() => {
                  data.finishWorkout()
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
            {tab === 'plan' && (
              <PlannerScreen
                settings={data.settings}
                customPlans={data.customPlans}
                onSettingsChange={data.updateSettings}
                onPlansChange={data.updateCustomPlans}
              />
            )}
            {tab === 'library' && <LibraryScreen sessions={data.sessions} />}
            {tab === 'progress' && <ProgressScreen sessions={data.sessions} />}
            {tab === 'recovery' && <RecoveryScreen sessions={data.sessions} />}
          </>
        )}
      </main>
      {!settingsOpen && showRestBar && (
        <RestTimer
          timer={restTimer}
          showPresets={tab === 'log' && data.activeSession !== null}
        />
      )}
      {!settingsOpen && <BottomNav active={tab} onChange={setTab} hidden={navHidden} />}
      <AnimatePresence>{showSplash && <Splash key="splash" />}</AnimatePresence>
    </>
  )
}
