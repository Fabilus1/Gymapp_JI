import { useEffect, useState } from 'react'
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
  // true while the post-workout RPE modal is up — hides the rest bar + nav
  // so neither can sit on top of the modal's slider/buttons.
  const [finishModalOpen, setFinishModalOpen] = useState(false)
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

  // The bottom nav stays put (it's a flex sibling, so it never overlaps
  // content) — the only time it hides is when the on-screen keyboard is up,
  // so it can't sit over search results. A scroll-collapse was tried but was
  // janky and could get stuck, so the nav is now reliably always-visible.
  const keyboardOpen = useKeyboardOpen()

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
      <main className="screen" key={settingsOpen ? 'settings' : tab}>
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
                onFinishModalChange={(open) => {
                  setFinishModalOpen(open)
                  if (open) restTimer.cancel() // no rest countdown during the RPE prompt
                }}
              />
            )}
            {tab === 'plan' && <PlannerScreen />}
            {tab === 'library' && <LibraryScreen />}
            {tab === 'progress' && <ProgressScreen />}
            {tab === 'recovery' && <RecoveryScreen />}
          </>
        )}
      </main>
      {!settingsOpen && !finishModalOpen && showRestBar && (
        <RestTimer
          timer={restTimer}
          showPresets={tab === 'log' && data.activeSession !== null}
        />
      )}
      {!settingsOpen && !keyboardOpen && !finishModalOpen && (
        <BottomNav active={tab} onChange={setTab} />
      )}
      <Toast />
      {!keyboardOpen && <InstallHint />}
      <AnimatePresence>{showSplash && <Splash key="splash" />}</AnimatePresence>
    </AppDataProvider>
  )
}
