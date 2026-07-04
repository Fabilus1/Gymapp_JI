import { motion } from 'framer-motion'
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
  hidden = false,
}: {
  active: TabId
  onChange: (tab: TabId) => void
  hidden?: boolean
}) {
  return (
    <motion.nav
      className="bottom-nav"
      // slide fully off-screen (incl. safe-area) on scroll-down; snap back up
      animate={{ y: hidden ? '130%' : 0 }}
      transition={
        hidden
          ? { type: 'tween', duration: 0.25, ease: 'easeInOut' }
          : { type: 'spring', stiffness: 500, damping: 40 }
      }
    >
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
    </motion.nav>
  )
}
