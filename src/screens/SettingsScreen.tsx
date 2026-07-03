import { useRef, useState } from 'react'
import { exportAllData, importAllData } from '../db/db'
import './SettingsScreen.css'

export default function SettingsScreen() {
  const [status, setStatus] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleExport() {
    const json = await exportAllData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const date = new Date().toISOString().slice(0, 10)
    a.href = url
    a.download = `ironlog-backup-${date}.json`
    a.click()
    URL.revokeObjectURL(url)
    setStatus('Backup downloaded.')
  }

  async function handleImportFile(file: File) {
    const confirmed = window.confirm(
      'Importing will replace all data currently on this device with the contents of this backup. Continue?'
    )
    if (!confirmed) return
    try {
      const text = await file.text()
      await importAllData(text)
      // Reload so every screen rehydrates from the imported data.
      window.location.reload()
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Import failed.')
    }
  }

  return (
    <div className="settings">
      <section className="settings__section">
        <h2 className="settings__heading">Program</h2>
        <p className="settings__description">
          Programs and weekly scheduling moved to the Plan tab.
        </p>
      </section>

      <section className="settings__section">
        <h2 className="settings__heading">Units</h2>
        <p className="settings__value">lb</p>
      </section>

      <section className="settings__section">
        <h2 className="settings__heading">Backup</h2>
        <p className="settings__description">
          Export your data to a JSON file, or restore from a previous backup.
        </p>
        <div className="settings__options">
          <button className="settings__option" onClick={handleExport}>
            Export data
          </button>
          <button className="settings__option" onClick={() => fileInputRef.current?.click()}>
            Import data
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImportFile(file)
              e.target.value = ''
            }}
          />
        </div>
        {status && <p className="settings__status">{status}</p>}
      </section>
    </div>
  )
}
