import EmptyState from '../components/EmptyState'
import { EXERCISES } from '../data/exercises'

export default function LibraryScreen() {
  return (
    <EmptyState
      title={`${EXERCISES.length} exercises loaded`}
      description="Browsing, filtering by muscle group, and per-exercise history land in a later phase."
    />
  )
}
