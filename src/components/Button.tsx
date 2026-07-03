import './Button.css'

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled,
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}) {
  return (
    <button
      className={variant === 'primary' ? 'btn btn--primary' : 'btn btn--secondary'}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
