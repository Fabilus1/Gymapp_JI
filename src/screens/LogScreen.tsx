import EmptyState from '../components/EmptyState'

export default function LogScreen() {
  return (
    <EmptyState
      title="No active session"
      description="Start a workout from the Today tab to begin logging sets."
    />
  )
}
