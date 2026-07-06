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
import {
  toDisplayWeight,
  toDisplayLength,
  fromDisplayLength,
  lengthUnitLabel,
  inchesToFtIn,
  ftInToInches,
  inchesToMeters,
  metersToInches,
} from '../logic/units'
import LineChart from '../components/LineChart'
import { useApp } from '../context/AppDataContext'
import type { BiologicalSex, BodyMetric, MeasureKey, Profile } from '../types'
import './SettingsScreen.css'

const SEXES: { value: BiologicalSex; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]

const ALL_MEASURE_FIELDS: { key: MeasureKey; label: string }[] = [
  { key: 'biceps', label: 'Biceps' },
  { key: 'forearms', label: 'Forearms' },
  { key: 'shoulders', label: 'Shoulders' },
  { key: 'chest', label: 'Chest' },
  { key: 'waist', label: 'Waist' },
  { key: 'hips', label: 'Hips' },
  { key: 'thighs', label: 'Thighs' },
  { key: 'calves', label: 'Calves' },
  { key: 'neck', label: 'Neck' },
]

const DEFAULT_VISIBLE: MeasureKey[] = ['biceps', 'chest', 'waist', 'thighs']

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
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [latestWeightLb, setLatestWeightLb] = useState<number | null>(null)
  const [metrics, setMetrics] = useState<BodyMetric[]>([])
  const [draftMeasure, setDraftMeasure] = useState<Record<string, string>>({})
  // height drafts so partial input ("1." / "5' 10.") survives re-renders
  const [heightDraft, setHeightDraft] = useState<{ ft: string; inch: string; m: string }>({
    ft: '',
    inch: '',
    m: '',
  })
  const [editFields, setEditFields] = useState(false)
  const [graphKey, setGraphKey] = useState<MeasureKey | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getProfile().then((p) => {
      setProfile(p)
      setProfileLoaded(true)
    })
    getBodyMetrics().then(setMetrics)
    getAllBodyWeightEntries().then((e) => setLatestWeightLb(e[0]?.weight ?? null))
  }, [])

  // Initialize height drafts from the canonical inches value — on load and
  // whenever the unit system flips (not on every keystroke, so typing never
  // fights the round-trip conversion).
  useEffect(() => {
    if (!profileLoaded) return
    if (profile.heightIn === undefined) {
      setHeightDraft({ ft: '', inch: '', m: '' })
      return
    }
    const { ft, inches } = inchesToFtIn(profile.heightIn)
    setHeightDraft({
      ft: String(ft),
      inch: String(inches),
      m: inchesToMeters(profile.heightIn).toFixed(2),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileLoaded, settings.units])

  function patchProfile(patch: Partial<Profile>) {
    const next = { ...profile, ...patch }
    ;(Object.keys(next) as (keyof Profile)[]).forEach((k) => {
      if (next[k] === undefined) delete next[k]
    })
    setProfile(next)
    saveProfile(next)
  }

  function commitImperialHeight(ftRaw: string, inchRaw: string) {
    const ft = numOrUndef(ftRaw)
    const inch = numOrUndef(inchRaw)
    if (ft === undefined && inch === undefined) {
      patchProfile({ heightIn: undefined })
      return
    }
    patchProfile({ heightIn: ftInToInches(ft ?? 0, inch ?? 0) })
  }

  function commitMetricHeight(mRaw: string) {
    const m = numOrUndef(mRaw)
    if (m === undefined) {
      patchProfile({ heightIn: undefined })
      return
    }
    patchProfile({ heightIn: metersToInches(m) })
  }

  const visibleFields = ALL_MEASURE_FIELDS.filter((f) =>
    (profile.measureFields ?? DEFAULT_VISIBLE).includes(f.key)
  )
  const lenUnit = lengthUnitLabel(settings.units)

  function toggleField(key: MeasureKey) {
    const current = profile.measureFields ?? DEFAULT_VISIBLE
    const next = current.includes(key)
      ? current.filter((k) => k !== key)
      : [...current, key]
    if (next.length === 0) return // keep at least one visible
    patchProfile({ measureFields: next })
    if (graphKey === key) setGraphKey(null)
  }

  async function logMeasurements() {
    const entry: BodyMetric = { id: newId(), date: new Date().toISOString() }
    let any = false
    for (const f of visibleFields) {
      const v = numOrUndef(draftMeasure[f.key] ?? '')
      if (v !== undefined) {
        entry[f.key] = fromDisplayLength(v, settings.units) // store inches
        any = true
      }
    }
    if (!any) return
    await addBodyMetric(entry)
    setMetrics(await getBodyMetrics())
    setDraftMeasure({})
    setStatus('Measurements logged.')
    window.setTimeout(() => setStatus(null), 2000)
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

  // Progression graph: oldest → newest points for the selected body part.
  const activeGraphKey = graphKey ?? visibleFields[0]?.key ?? null
  const graphPoints = activeGraphKey
    ? metrics
        .filter((m) => m[activeGraphKey] !== undefined)
        .map((m) => ({
          date: m.date,
          value: toDisplayLength(m[activeGraphKey] as number, settings.units),
        }))
        .reverse()
    : []

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

          {settings.units === 'lb' ? (
            <div className="settings__field">
              <span className="settings__field-label">Height (ft / in)</span>
              <div className="settings__height-pair">
                <input
                  className="settings__num"
                  type="text"
                  inputMode="numeric"
                  value={heightDraft.ft}
                  placeholder="5"
                  aria-label="Height feet"
                  onChange={(e) => {
                    const raw = e.target.value
                    if (!/^\d*$/.test(raw)) return
                    setHeightDraft((d) => ({ ...d, ft: raw }))
                    commitImperialHeight(raw, heightDraft.inch)
                  }}
                />
                <span className="settings__height-sep">ft</span>
                <input
                  className="settings__num"
                  type="text"
                  inputMode="decimal"
                  value={heightDraft.inch}
                  placeholder="10"
                  aria-label="Height inches"
                  onChange={(e) => {
                    const raw = e.target.value
                    if (!/^\d*\.?\d*$/.test(raw)) return
                    setHeightDraft((d) => ({ ...d, inch: raw }))
                    commitImperialHeight(heightDraft.ft, raw)
                  }}
                />
                <span className="settings__height-sep">in</span>
              </div>
            </div>
          ) : (
            <label className="settings__field">
              <span className="settings__field-label">Height (m)</span>
              <input
                className="settings__num"
                type="text"
                inputMode="decimal"
                value={heightDraft.m}
                placeholder="1.75"
                onChange={(e) => {
                  const raw = e.target.value
                  if (!/^\d*\.?\d*$/.test(raw)) return
                  setHeightDraft((d) => ({ ...d, m: raw }))
                  commitMetricHeight(raw)
                }}
              />
            </label>
          )}
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
        <div className="settings__heading-row">
          <h2 className="settings__heading">Measurements ({lenUnit})</h2>
          <button
            className={editFields ? 'settings__edit-btn settings__edit-btn--on' : 'settings__edit-btn'}
            onClick={() => setEditFields((v) => !v)}
          >
            {editFields ? 'Done' : 'Edit fields'}
          </button>
        </div>

        {editFields && (
          <div className="settings__chips">
            {ALL_MEASURE_FIELDS.map((f) => {
              const on = (profile.measureFields ?? DEFAULT_VISIBLE).includes(f.key)
              return (
                <button
                  key={f.key}
                  className={on ? 'settings__chip settings__chip--on' : 'settings__chip'}
                  onClick={() => toggleField(f.key)}
                >
                  {f.label}
                </button>
              )
            })}
          </div>
        )}

        <div className="settings__measure-grid">
          {visibleFields.map((f) => (
            <label key={f.key} className="settings__field">
              <span className="settings__field-label">
                {f.label}
                {latestMetric?.[f.key] !== undefined && (
                  <span className="settings__last-val">
                    {' '}
                    · last {toDisplayLength(latestMetric[f.key] as number, settings.units)}
                  </span>
                )}
              </span>
              <input
                className="settings__num"
                type="text"
                inputMode="decimal"
                value={draftMeasure[f.key] ?? ''}
                placeholder="—"
                onChange={(e) => setDraftMeasure((d) => ({ ...d, [f.key]: e.target.value }))}
              />
            </label>
          ))}
        </div>
        <button className="settings__log-measure" onClick={logMeasurements}>
          Log measurements
        </button>

        {/* progression graph per body part */}
        {metrics.length > 0 && activeGraphKey && (
          <div className="settings__graph">
            <span className="settings__field-label">Progression</span>
            <div className="settings__chips">
              {visibleFields.map((f) => (
                <button
                  key={f.key}
                  className={
                    f.key === activeGraphKey ? 'settings__chip settings__chip--on' : 'settings__chip'
                  }
                  onClick={() => setGraphKey(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {graphPoints.length >= 2 ? (
              <LineChart points={graphPoints} />
            ) : (
              <p className="settings__description">
                {graphPoints.length === 1
                  ? `One ${activeGraphKey} entry logged — the chart starts with your next one.`
                  : `No ${activeGraphKey} entries yet.`}
              </p>
            )}
          </div>
        )}
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
          Weights are stored internally in lb, so switching never rewrites your history. kg mode
          also switches height to meters and measurements to cm.
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
