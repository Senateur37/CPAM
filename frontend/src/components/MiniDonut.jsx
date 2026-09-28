export default function MiniDonut({ data, size = 140 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const r = 45
  const cx = 60
  const cy = 60
  const circumference = 2 * Math.PI * r

  let offset = 0
  const slices = total
    ? data.map((d) => {
        const pct = d.value / total
        const dash = pct * circumference
        const slice = { ...d, dash, offset }
        offset += dash
        return slice
      })
    : []

  return (
    <div className="mini-donut">
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth="16" />
        {slices.map((s) => (
          <circle
            key={s.label}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="16"
            strokeDasharray={`${s.dash} ${circumference - s.dash}`}
            strokeDashoffset={-s.offset + circumference / 4}
            strokeLinecap="round"
          />
        ))}
        <text x={cx} y={cy - 2} textAnchor="middle" fontSize="20" fontWeight="800" fill="var(--text-h)">
          {total}
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle" fontSize="9" fill="var(--text)" opacity="0.6">
          au total
        </text>
      </svg>
      <div className="mini-donut-legend">
        {data.map((d) => (
          <div className="mini-donut-legend-row" key={d.label}>
            <span className="mini-donut-dot" style={{ background: d.color }} />
            <span>{d.label}</span>
            <strong>{d.value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
