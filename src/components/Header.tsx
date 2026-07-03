import './Header.css'

export default function Header({
  title,
  onSettingsClick,
  onBack,
}: {
  title: string
  onSettingsClick?: () => void
  onBack?: () => void
}) {
  return (
    <header className="header">
      {onBack ? (
        <button className="header__back" onClick={onBack}>
          Back
        </button>
      ) : (
        <span />
      )}
      <h1 className="header__title">{title}</h1>
      {onSettingsClick ? (
        <button className="header__settings" onClick={onSettingsClick}>
          Settings
        </button>
      ) : (
        <span />
      )}
    </header>
  )
}
