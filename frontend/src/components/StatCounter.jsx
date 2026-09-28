import { useCountUp } from '../hooks/useCountUp'
import { useReveal } from '../hooks/useReveal'

export default function StatCounter({ value, label, suffix = '' }) {
  const [ref, visible] = useReveal()
  const count = useCountUp(value, { start: visible })

  return (
    <div ref={ref} className="stat-counter">
      <div className="stat-counter-value">
        {count}
        {suffix}
      </div>
      <div className="stat-counter-label">{label}</div>
    </div>
  )
}
