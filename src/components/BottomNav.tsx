import './BottomNav.css'

export type TabId = 'today' | 'log' | 'plan' | 'library' | 'progress' | 'recovery'

const TABS: { id: TabId; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'log', label: 'Log' },
  { id: 'plan', label: 'Plan' },
  { id: 'library', label: 'Library' },
  { id: 'progress', label: 'Progress' },
  { id: 'recovery', label: 'Recovery' },
]

export default function BottomNav({
  active,
  onChange,
}: {
  active: TabId
  onChange: (tab: TabId) => void
}) {
  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={tab.id === active ? 'bottom-nav__tab bottom-nav__tab--active' : 'bottom-nav__tab'}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
