import {
  BookOpen,
  CalendarRange,
  Dumbbell,
  HeartPulse,
  Home,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import './BottomNav.css'

export type TabId = 'today' | 'log' | 'plan' | 'library' | 'progress' | 'recovery'

const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'today', label: 'Today', icon: Home },
  { id: 'log', label: 'Log', icon: Dumbbell },
  { id: 'plan', label: 'Plan', icon: CalendarRange },
  { id: 'library', label: 'Library', icon: BookOpen },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'recovery', label: 'Recovery', icon: HeartPulse },
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
      {TABS.map((tab) => {
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            className={
              tab.id === active ? 'bottom-nav__tab bottom-nav__tab--active' : 'bottom-nav__tab'
            }
            onClick={() => onChange(tab.id)}
          >
            <Icon size={18} strokeWidth={1.75} className="bottom-nav__icon" />
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
