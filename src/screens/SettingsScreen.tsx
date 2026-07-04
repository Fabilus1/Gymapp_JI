import { useEffect, useRef, useState } from 'react'
import {
  exportAllData,
  importAllData,
  getProfile,
  saveProfile,
  getBodyMetrics,
  addBodyMetric,
  getAllBodyWeightEntries,
  newId,
} from '../db/db'
import { toDisplayWeight } from '../logic/units'
import { useApp } from '../context/AppDataContext'
import type { BiologicalSex, BodyMetric, Profile } from '../types'
import './SettingsScreen.css'

const SEXES: { value: BiologicalSex; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]

const MEASURE_FIELDS: { key: keyof Omit<BodyMetric, 'id' | 'date'>; label: string }[] = [
  { key: 'biceps', label: 'Biceps' },
  { key: 'chest', label: 'Chest' },
  { key: 'waist', label: 'Waist' },
  { key: 'thighs', label: 'Thighs' },
]

function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Healthy'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

function numOrUndef(raw: string): number | undefined {
  if (raw.trim() === '') return undefined
  const n = Number(raw)
  return Number.isNaN(n) || n < 0 ? undefined : n
}

export default function SettingsScreen() {
  const { settings, updateSettings } = useApp()
  const [status, setStatus] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile>({})
  const [latestWeightLb, setLatestWeightLb] = useState<number | null>(null)
  const [metrics, setMetrics] = useState<BodyMetric[]>([])
  const [draftMeasure, setDraftMeasure] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getProfile().then(setProfile)
    getBodyMetrics().then(setMetrics)
    getAllBodyWeightEntries().then((e) => setLatestWeightLb(e[0]?.weight ?? null))
  }, [])

  function patchProfile(patch: Partial<Profile>) {
    const next = { ...profile, ...patch }
    // strip empty values so we don't persist NaN/undefined noise
    ;(Object.keys(next) as (keyof Profile)[]).forEach((k) => {
      if (next[k] === undefined) delete next[k]
    })
    setProfile(next)
    saveProfile(next)
  }

  async function logMeasurements() {
    const entry: BodyMetric = { id: newId(), date: new Date().toISOString() }
    let any = false
    for (const f of MEASURE_FIELDS) {
      const v = numOrUndef(draftMeasure[f.key] ?? '')
      if (v !== undefined) {
        entry[f.key] = v
        any = true
      }
    }
    if (!any) return
    await addBodyMetric(entry)
    setMetrics(await getBodyMetrics())
    setDraftMeasure({})
  }

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
      window.location.reload()
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Import failed.')
    }
  }

  const bmi =
    latestWeightLb && profile.heightIn
      ? (703 * latestWeightLb) / (profile.heightIn * profile.heightIn)
      : null
  const latestMetric = metrics[0]

  return (
    <div className="settings">
      {/* ---- Profile ---- */}
      <section className="settings__section">
        <h2 className="settings__heading">Profile</h2>

        <div className="settings__seg-row">
          <span className="settings__field-label">Biological sex</span>
          <div className="settings__seg">
            {SEXES.map((s) => (
              <button
                key={s.value}
                className={
                  profile.sex === s.value ? 'settings__seg-btn settings__seg-btn--on' : 'settings__seg-btn'
                }
                onClick={() => patchProfile({ sex: s.value })}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="settings__field-grid">
          <label className="settings__field">
            <span className="settings__field-label">Age</span>
            <input
              className="settings__num"
              type="text"
              inputMode="numeric"
              value={profile.age ?? ''}
              placeholder="—"
              onChange={(e) => patchProfile({ age: numOrUndef(e.target.value) })}
            />
          </label>
          <label className="settings__field">
            <span className="settings__field-label">Height (in)</span>
            <input
              className="settings__num"
              type="text"
              inputMode="decimal"
              value={profile.heightIn ?? ''}
              placeholder="—"
              onChange={(e) => patchProfile({ heightIn: numOrUndef(e.target.value) })}
            />
          </label>
        </div>

        <div className="settings__bmi">
          <div>
            <span className="settings__field-label">BMI</span>
            <p className="settings__bmi-value">
              {bmi ? bmi.toFixed(1) : '—'}
              {bmi && <span className="settings__bmi-cat"> {bmiCategory(bmi)}</span>}
            </p>
          </div>
          <span className="settings__bmi-note">
            {latestWeightLb
              ? `From ${toDisplayWeight(latestWeightLb, settings.units)} ${settings.units} · log weight in Progress`
              : 'Log body weight in Progress to compute'}
          </span>
        </div>
      </section>

      {/* ---- Measurements ---- */}
      <section className="settings__section">
        <h2 className="settings__heading">Measurements (in)</h2>
        <div className="settings__measure-grid">
          {MEASURE_FIELDS.map((f) => (
            <label key={f.key} className="settings__field">
              <span className="settings__field-label">
                {f.label}
                {latestMetric?.[f.key] !== undefined && (
                  <span className="settings__last-val"> · last {latestMetric[f.key]}</span>
                )}
              </span>
              <input
                className="settings__num"
                type="text"
                inputMode="decimal"
                value={draftMeasure[f.key] ?? ''}
                placeholder="—"
                onChange={(e) =>
                  setDraftMeasure((d) => ({ ...d, [f.key]: e.target.value }))
                }
              />
            </label>
          ))}
        </div>
        <button className="settings__log-measure" onClick={logMeasurements}>
          Log measurements
        </button>
      </section>

      {/* ---- Units ---- */}
      <section className="settings__section">
        <h2 className="settings__heading">Units</h2>
        <div className="settings__seg">
          {(['lb', 'kg'] as const).map((u) => (
            <button
              key={u}
              className={
                settings.units === u ? 'settings__seg-btn settings__seg-btn--on' : 'settings__seg-btn'
              }
              onClick={() => updateSettings({ ...settings, units: u })}
            >
              {u}
            </button>
          ))}
        </div>
        <p className="settings__description">
          Weights are stored internally in lb, so switching never rewrites your history.
        </p>
      </section>

      {/* ---- Backup ---- */}
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
