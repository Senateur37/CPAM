import { useEffect, useState } from 'react'
import client from '../api/client'

// ── Palette for charts ────────────────────────────────────────────────────────
const PALETTE = [
  '#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1',
]

// ── Utility: format currency ──────────────────────────────────────────────────
function fCur(n) {
  if (n === undefined || n === null) return '—'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(n)
}
function fNum(n, dec = 1) {
  if (!n && n !== 0) return '—'
  return Number(n).toLocaleString('fr-FR', { maximumFractionDigits: dec })
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KPI({ label, value, sub, color = 'var(--accent)', icon }) {
  return (
    <div className="rpt-kpi">
      {icon && (
        <span className="rpt-kpi-icon" style={{ background: color + '1a', color }}>
          {icon}
        </span>
      )}
      <div>
        <div className="rpt-kpi-value" style={{ color }}>{value}</div>
        <div className="rpt-kpi-label">{label}</div>
        {sub && <div className="rpt-kpi-sub">{sub}</div>}
      </div>
    </div>
  )
}

// ── Donut Chart ───────────────────────────────────────────────────────────────
function Donut({ data, size = 120 }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  if (!total) return <div className="rpt-empty">Aucune donnée</div>
  const r = 45, cx = 60, cy = 60, circum = 2 * Math.PI * r
  let offset = 0
  const slices = data.map((d, i) => {
    const pct   = d.value / total
    const dash  = pct * circum
    const slice = { ...d, dash, offset, color: d.color || PALETTE[i % PALETTE.length] }
    offset += dash
    return slice
  })
  return (
    <div className="rpt-donut-wrap">
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth="18" />
        {slices.map((s, i) => (
          <circle
            key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth="18"
            strokeDasharray={`${s.dash} ${circum - s.dash}`}
            strokeDashoffset={-s.offset + circum / 4}
            style={{ transition: 'stroke-dasharray 0.5s ease' }}
          />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--text-h)">{total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="var(--text)" opacity="0.6">total</text>
      </svg>
      <div className="rpt-donut-legend">
        {slices.map((s, i) => (
          <div key={i} className="rpt-legend-row">
            <span className="rpt-legend-dot" style={{ background: s.color }} />
            <span className="rpt-legend-name">{s.label}</span>
            <span className="rpt-legend-val">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Bar Chart (grouped month bars) ───────────────────────────────────────────
function BarChart({ data, keys, colors, height = 160 }) {
  if (!data || !data.length) return <div className="rpt-empty">Aucune donnée</div>
  const maxVal = Math.max(...data.flatMap(d => keys.map(k => d[k] || 0)), 1)
  const barW   = Math.max(6, Math.floor(460 / (data.length * keys.length + data.length + 1)))
  const gap    = 3
  const groupW = keys.length * (barW + gap) - gap + 8
  const totalW = data.length * groupW
  return (
    <div className="rpt-barchart-wrap">
      <svg viewBox={`0 0 ${totalW} ${height + 28}`} width="100%" preserveAspectRatio="none">
        {/* Gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = height - pct * height
          return (
            <line key={pct} x1={0} x2={totalW} y1={y} y2={y}
              stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3 3" />
          )
        })}
        {data.map((d, gi) => {
          const gx = gi * groupW
          return (
            <g key={gi}>
              {keys.map((k, ki) => {
                const barH = ((d[k] || 0) / maxVal) * height
                const x = gx + ki * (barW + gap)
                return (
                  <rect key={k} x={x} y={height - barH} width={barW} height={barH}
                    rx="2" fill={colors[ki]} opacity="0.85">
                    <title>{`${k}: ${fNum(d[k], 0)}`}</title>
                  </rect>
                )
              })}
              <text x={gx + groupW / 2 - 4} y={height + 18}
                textAnchor="middle" fontSize="7" fill="var(--text)" opacity="0.6">
                {d.mois}
              </text>
            </g>
          )
        })}
      </svg>
      <div className="rpt-bar-legend">
        {keys.map((k, i) => (
          <span key={k} className="rpt-legend-row">
            <span className="rpt-legend-dot" style={{ background: colors[i] }} />
            {k.charAt(0).toUpperCase() + k.slice(1)}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Gauge ─────────────────────────────────────────────────────────────────────
function Gauge({ value, min, max, label, color = '#3b82f6', unit = '' }) {
  const pct     = Math.min(1, Math.max(0, (value - min) / (max - min)))
  const r       = 38
  const circum  = Math.PI * r   // half circle
  const dash    = pct * circum
  return (
    <div className="rpt-gauge">
      <svg viewBox="0 0 100 60" width="130">
        <path d={`M 12 54 A ${r} ${r} 0 0 1 88 54`}
          fill="none" stroke="var(--border)" strokeWidth="10" strokeLinecap="round" />
        <path d={`M 12 54 A ${r} ${r} 0 0 1 88 54`}
          fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${dash} ${circum}`} style={{ transition: 'stroke-dasharray 0.6s ease' }} />
        <text x="50" y="48" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--text-h)">
          {fNum(value, 1)}{unit}
        </text>
      </svg>
      <div className="rpt-gauge-label">{label}</div>
      <div className="rpt-gauge-range">{min}{unit} — {max}{unit}</div>
    </div>
  )
}

// ── Progress bar list ─────────────────────────────────────────────────────────
function BarList({ items }) {
  if (!items || !items.length) return <div className="rpt-empty">Aucune donnée</div>
  const max = Math.max(...items.map(i => i.value), 1)
  return (
    <div className="rpt-barlist">
      {items.map((item, i) => (
        <div key={i} className="rpt-barlist-row">
          <span className="rpt-barlist-label">{item.label}</span>
          <div className="rpt-barlist-track">
            <div className="rpt-barlist-fill"
              style={{ width: `${(item.value / max) * 100}%`, background: item.color || PALETTE[i % PALETTE.length] }} />
          </div>
          <span className="rpt-barlist-count">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, color, children }) {
  return (
    <section className="rpt-section">
      <div className="rpt-section-head" style={{ borderLeftColor: color }}>
        <h2 className="rpt-section-title">{title}</h2>
      </div>
      {children}
    </section>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skel({ h = 120 }) {
  return <div className="db-skeleton" style={{ width: '100%', height: h, borderRadius: 10 }} />
}

// ── Main Reports component ────────────────────────────────────────────────────
export default function Reports() {
  const [data, setData]   = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    client.get('/stats/')
      .then(res => setData(res.data))
      .catch(() => setError('Impossible de charger les statistiques.'))
  }, [])

  return (
    <div className="db-page rpt-page">
      {/* Header */}
      <div className="db-header">
        <div>
          <h1 className="db-title">Rapports &amp; Statistiques</h1>
          <p className="db-subtitle">Vue d'ensemble analytique de votre exploitation agricole.</p>
        </div>
        {data && (
          <div className="db-header-kpi">
            <div className="db-kpi-chip">
              <span className="db-kpi-dot" />
              <span>Données en temps réel</span>
            </div>
          </div>
        )}
      </div>

      {error && <div className="alert-error">{error}</div>}

      {/* ── Comptabilité ─────────────────────────────────────────── */}
      <Section title="📊 Comptabilité &amp; Finances" color="#8b5cf6">
        {!data ? <Skel h={140} /> : (
          <>
            <div className="rpt-kpi-row">
              <KPI label="Revenus totaux"  value={fCur(data.comptabilite.revenus)}  color="#22c55e" />
              <KPI label="Dépenses totales" value={fCur(data.comptabilite.depenses)} color="#ef4444" />
              <KPI label="Solde net"        value={fCur(data.comptabilite.solde)}
                color={data.comptabilite.solde >= 0 ? '#22c55e' : '#ef4444'} />
              <KPI label="Factures"         value={data.comptabilite.total_factures}
                sub={`${data.comptabilite.factures_payees} payées · ${data.comptabilite.factures_impayees} impayées`}
                color="#8b5cf6" />
            </div>

            <div className="rpt-card-row">
              <div className="rpt-card rpt-card--wide">
                <div className="rpt-card-title">Évolution mensuelle (12 mois)</div>
                <BarChart
                  data={data.comptabilite.evolution_mensuelle}
                  keys={['revenus', 'depenses']}
                  colors={['#22c55e', '#ef4444']}
                />
              </div>
              <div className="rpt-card">
                <div className="rpt-card-title">Statut des factures</div>
                <Donut data={[
                  { label: 'Payées',   value: data.comptabilite.factures_payees,   color: '#22c55e' },
                  { label: 'Impayées', value: data.comptabilite.factures_impayees, color: '#ef4444' },
                ]} />
              </div>
            </div>
          </>
        )}
      </Section>

      {/* ── Agriculture ──────────────────────────────────────────── */}
      <Section title="🌿 Agriculture" color="#22c55e">
        {!data ? <Skel h={140} /> : (
          <>
            <div className="rpt-kpi-row">
              <KPI label="Total cultures"    value={data.agriculture.total_cultures}  color="#22c55e" />
              <KPI label="Rendement moyen"   value={`${fNum(data.agriculture.rendement_moyen)} t/ha`} color="#16a34a" />
              <KPI label="Types d'irrigation" value={data.agriculture.irrigations_by_type.length} color="#4ade80" />
            </div>
            <div className="rpt-card-row">
              <div className="rpt-card">
                <div className="rpt-card-title">Cultures par saison</div>
                <Donut data={data.agriculture.cultures_by_saison.map((c, i) => ({
                  label: c.saison || 'N/A', value: c.count, color: PALETTE[i],
                }))} />
              </div>
              <div className="rpt-card rpt-card--wide">
                <div className="rpt-card-title">Types d'irrigation</div>
                <BarList items={data.agriculture.irrigations_by_type.map((c, i) => ({
                  label: c.type || 'N/A', value: c.count, color: PALETTE[i],
                }))} />
              </div>
            </div>
          </>
        )}
      </Section>

      {/* ── Élevage ──────────────────────────────────────────────── */}
      <Section title="🐄 Élevage" color="#f59e0b">
        {!data ? <Skel h={140} /> : (
          <>
            <div className="rpt-kpi-row">
              <KPI label="Total animaux"   value={data.elevage.total_animaux}                 color="#f59e0b" />
              <KPI label="Poids moyen"     value={`${fNum(data.elevage.poids_moyen)} kg`}     color="#d97706" />
              <KPI label="Visites santé"   value={data.elevage.total_visites}                 color="#fbbf24" />
            </div>
            <div className="rpt-card-row">
              <div className="rpt-card">
                <div className="rpt-card-title">Répartition par espèce</div>
                <Donut data={data.elevage.animaux_by_espece.map((a, i) => ({
                  label: a.espece, value: a.count, color: PALETTE[i],
                }))} />
              </div>
              <div className="rpt-card rpt-card--wide">
                <div className="rpt-card-title">Effectif par espèce</div>
                <BarList items={data.elevage.animaux_by_espece.map((a, i) => ({
                  label: a.espece, value: a.count, color: PALETTE[i],
                }))} />
              </div>
            </div>
          </>
        )}
      </Section>

      {/* ── Pisciculture ─────────────────────────────────────────── */}
      <Section title="🐟 Pisciculture" color="#3b82f6">
        {!data ? <Skel h={140} /> : (
          <>
            <div className="rpt-kpi-row">
              <KPI label="Capacité totale" value={`${fNum(data.pisciculture.capacite_totale)} m³`} color="#3b82f6" />
              <KPI label="pH moyen"        value={fNum(data.pisciculture.ph_moyen)}                color="#60a5fa" />
              <KPI label="Température moy" value={`${fNum(data.pisciculture.temperature_moy)} °C`} color="#f59e0b" />
              <KPI label="O₂ moyen"        value={`${fNum(data.pisciculture.oxygene_moyen)} mg/L`} color="#22c55e" />
            </div>
            <div className="rpt-card-row">
              <div className="rpt-card">
                <div className="rpt-card-title">Jauges qualité eau</div>
                <div className="rpt-gauges">
                  <Gauge value={data.pisciculture.ph_moyen}          min={0}  max={14}  label="pH"         color="#3b82f6" />
                  <Gauge value={data.pisciculture.temperature_moy}   min={0}  max={40}  label="Temp." unit="°C" color="#f59e0b" />
                  <Gauge value={data.pisciculture.oxygene_moyen}     min={0}  max={15}  label="O₂"  unit=" mg/L" color="#22c55e" />
                </div>
              </div>
              <div className="rpt-card">
                <div className="rpt-card-title">Types de bassins</div>
                <Donut data={data.pisciculture.bassins_by_type.map((b, i) => ({
                  label: b.type || 'N/A', value: b.count, color: PALETTE[i],
                }))} />
              </div>
              <div className="rpt-card">
                <div className="rpt-card-title">Espèces de poissons</div>
                <BarList items={data.pisciculture.poissons_by_espece.map((p, i) => ({
                  label: p.espece, value: p.count, color: PALETTE[i],
                }))} />
              </div>
            </div>
          </>
        )}
      </Section>

      {/* ── Fermes ───────────────────────────────────────────────── */}
      <Section title="🏡 Vue par Ferme" color="#ec4899">
        {!data ? <Skel h={140} /> : (
          data.fermes.liste.length === 0
            ? <div className="rpt-empty">Aucune ferme enregistrée.</div>
            : (
              <div className="rpt-farm-table">
                <table>
                  <thead>
                    <tr>
                      <th>Ferme</th>
                      <th>Localisation</th>
                      <th>Surface (ha)</th>
                      <th>Cultures</th>
                      <th>Animaux</th>
                      <th>Bassins</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.fermes.liste.map((f, i) => (
                      <tr key={i}>
                        <td><strong>{f.nom}</strong></td>
                        <td>{f.localisation}</td>
                        <td>{fNum(f.surface_totale)}</td>
                        <td>
                          <span className="rpt-badge" style={{ background: '#22c55e22', color: '#22c55e' }}>
                            {f.nb_cultures}
                          </span>
                        </td>
                        <td>
                          <span className="rpt-badge" style={{ background: '#f59e0b22', color: '#d97706' }}>
                            {f.nb_animaux}
                          </span>
                        </td>
                        <td>
                          <span className="rpt-badge" style={{ background: '#3b82f622', color: '#3b82f6' }}>
                            {f.nb_bassins}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
        )}
      </Section>
    </div>
  )
}

