import EmptyState from '../components/EmptyState'
import Button from '../components/Button'

export default function TodayScreen({ onStartWorkout }: { onStartWorkout: () => void }) {
  return (
    <EmptyState
      title="No workout scheduled yet"
      description="Today's suggested session — with weights pulled from your last workout — will show up here once logging is wired up."
      action={<Button onClick={onStartWorkout}>Start Workout</Button>}
    />
  )
}
