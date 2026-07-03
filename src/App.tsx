import { useState } from 'react'
import Header from './components/Header'
import BottomNav, { type TabId } from './components/BottomNav'
import TodayScreen from './screens/TodayScreen'
import LogScreen from './screens/LogScreen'
import LibraryScreen from './screens/LibraryScreen'
import ProgressScreen from './screens/ProgressScreen'
import RecoveryScreen from './screens/RecoveryScreen'
import SettingsScreen from './screens/SettingsScreen'
import { useAppData } from './hooks/useAppData'
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

  if (!data.loaded || !data.settings) return null

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
              />
            )}
            {tab === 'log' && (
              <LogScreen
                session={data.activeSession}
                onChange={data.updateActiveSession}
                onFinish={() => {
                  data.finishWorkout()
                  setTab('today')
                }}
                onCancel={() => {
                  data.cancelWorkout()
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
      {!settingsOpen && <BottomNav active={tab} onChange={setTab} />}
    </>
  )
}
