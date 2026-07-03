import { useState } from 'react'
import Header from './components/Header'
import BottomNav, { type TabId } from './components/BottomNav'
import TodayScreen from './screens/TodayScreen'
import LogScreen from './screens/LogScreen'
import LibraryScreen from './screens/LibraryScreen'
import ProgressScreen from './screens/ProgressScreen'
import RecoveryScreen from './screens/RecoveryScreen'
import SettingsScreen from './screens/SettingsScreen'
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

  return (
    <>
      <Header
        title={settingsOpen ? 'Settings' : TAB_TITLES[tab]}
        onSettingsClick={settingsOpen ? undefined : () => setSettingsOpen(true)}
        onBack={settingsOpen ? () => setSettingsOpen(false) : undefined}
      />
      <main className="screen">
        {settingsOpen ? (
          <SettingsScreen />
        ) : (
          <>
            {tab === 'today' && <TodayScreen onStartWorkout={() => setTab('log')} />}
            {tab === 'log' && <LogScreen />}
            {tab === 'library' && <LibraryScreen />}
            {tab === 'progress' && <ProgressScreen />}
            {tab === 'recovery' && <RecoveryScreen />}
          </>
        )}
      </main>
      {!settingsOpen && <BottomNav active={tab} onChange={setTab} />}
    </>
  )
}
