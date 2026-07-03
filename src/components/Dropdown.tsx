import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import './Dropdown.css'

export interface DropdownOption {
  value: string
  label: string
}

export default function Dropdown({
  value,
  options,
  onChange,
  align = 'right',
}: {
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
  align?: 'left' | 'right'
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDocClick(e: Event) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('touchstart', onDocClick)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('touchstart', onDocClick)
    }
  }, [open])

  const current = options.find((o) => o.value === value)

  return (
    <div className="dd" ref={rootRef}>
      <button
        type="button"
        className={open ? 'dd__btn dd__btn--open' : 'dd__btn'}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="dd__label">{current?.label ?? value}</span>
        <ChevronDown size={15} className="dd__chevron" />
      </button>

      <div
        className={open ? 'dd__menu dd__menu--open' : 'dd__menu'}
        style={{ [align]: 0 } as React.CSSProperties}
        role="listbox"
      >
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="option"
            aria-selected={o.value === value}
            className={o.value === value ? 'dd__option dd__option--on' : 'dd__option'}
            onClick={() => {
              onChange(o.value)
              setOpen(false)
            }}
          >
            <span>{o.label}</span>
            {o.value === value && <Check size={14} />}
          </button>
        ))}
      </div>
    </div>
  )
}
