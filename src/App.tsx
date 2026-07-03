import { useEffect, useState } from 'react'
import Header from './components/Header'
import BottomNav, { type TabId } from './components/BottomNav'
import RestTimer from './components/RestTimer'
import TodayScreen from './screens/TodayScreen'
import LogScreen from './screens/LogScreen'
import LibraryScreen from './screens/LibraryScreen'
import ProgressScreen from './screens/ProgressScreen'
import RecoveryScreen from './screens/RecoveryScreen'
import SettingsScreen from './screens/SettingsScreen'
import { useAppData } from './hooks/useAppData'
import { useRestTimer } from './hooks/useRestTimer'
import './App.css'

const TAB_TITLES: Record<TabId, string> = {
  today: 'Today',
  log: 'Log',
  library: 'Library',
  progress: 'Progress',
  recovery: 'Recovery',
}

export default function App() {
  const [tab, setTab] = useState<TabId>('today')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const data = useAppData()
  const restTimer = useRestTimer()

  // Fade out the HTML splash once data is ready.
  useEffect(() => {
    if (!data.loaded) return
    const splash = document.getElementById('splash')
    if (!splash) return
    splash.classList.add('splash--out')
    const t = window.setTimeout(() => splash.remove(), 400)
    return () => window.clearTimeout(t)
  }, [data.loaded])

  if (!data.loaded || !data.settings) return null

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
      <main className="screen" key={settingsOpen ? 'settings' : tab}>
        {settingsOpen ? (
          <SettingsScreen settings={data.settings} onSettingsChange={data.updateSettings} />
        ) : (
          <>
            {tab === 'today' && (
              <TodayScreen
                settings={data.settings}
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
      {!settingsOpen && <BottomNav active={tab} onChange={setTab} />}
    </>
  )
}
