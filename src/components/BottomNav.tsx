import { useLayoutEffect, useRef, useState } from 'react'
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

const COLLAPSED_H = 3 // just the indicator rail

export default function BottomNav({
  active,
  onChange,
  hidden = false,
}: {
  active: TabId
  onChange: (tab: TabId) => void
  hidden?: boolean
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [fullH, setFullH] = useState<number | undefined>(undefined)

  // Measure the expanded height once so we can collapse the dock's own height
  // (not just translate it) — that lets the scroll area reclaim the space.
  useLayoutEffect(() => {
    if (contentRef.current) setFullH(contentRef.current.offsetHeight + COLLAPSED_H)
  }, [])

  const activeIndex = TABS.findIndex((t) => t.id === active)

  return (
    <motion.nav
      className="bottom-nav"
      initial={false}
      animate={{ height: hidden && fullH ? COLLAPSED_H : fullH ?? 'auto' }}
      transition={
        hidden
          ? { type: 'tween', duration: 0.24, ease: 'easeInOut' }
          : { type: 'spring', stiffness: 480, damping: 42 }
      }
    >
      <div className="bottom-nav__tabs" ref={contentRef}>
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
      </div>

      {/* 2px active-tab indicator, visible when the nav is collapsed */}
      <div className="bottom-nav__rail" aria-hidden="true">
        <motion.span
          className="bottom-nav__rail-seg"
          animate={{
            opacity: hidden ? 1 : 0,
            left: `${(activeIndex / TABS.length) * 100}%`,
          }}
          transition={{ duration: 0.2 }}
          style={{ width: `${100 / TABS.length}%` }}
        />
      </div>
    </motion.nav>
  )
}
