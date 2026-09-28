import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import { NAV_ITEMS, RESOURCES } from '../config/resources'
import { useAuth } from '../context/AuthContext'
import { useSiteSettings } from '../context/SiteSettingsContext'
import {
  IconLeaf,
  IconAnimal,
  IconFish,
  IconCoins,
  IconLayers,
  IconMail,
  IconGraduationCap,
} from '../components/icons'

/* ── Group metadata ──────────────────────────────────────────────────────── */
const GROUP_META = {
  Comptes:      { color: '#ec4899', bg: 'rgba(236,72,153,0.1)',   icon: IconLayers,  emoji: '🏡' },
  Agriculture:  { color: '#22c55e', bg: 'rgba(34,197,94,0.1)',    icon: IconLeaf,    emoji: '🌿' },
  Élevage:      { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   icon: IconAnimal,  emoji: '🐄' },
  Pisciculture: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',   icon: IconFish,    emoji: '🐟' },
  Comptabilité: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',   icon: IconCoins,   emoji: '💰' },
  Messages:     { color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',    icon: IconMail,    emoji: '✉️' },
  Carrières:    { color: '#14b8a6', bg: 'rgba(20,184,166,0.1)',   icon: IconGraduationCap, emoji: '🎓' },
}

/* ── Top-level KPI summary (one per module) ──────────────────────────────── */
const SUMMARY_KEYS = [
  { key: 'fermes',       label: 'Fermes',       group: 'Comptes' },
  { key: 'cultures',     label: 'Cultures',     group: 'Agriculture' },
  { key: 'animaux',      label: 'Animaux',      group: 'Élevage' },
  { key: 'bassins',      label: 'Bassins',      group: 'Pisciculture' },
  { key: 'transactions', label: 'Transactions', group: 'Comptabilité' },
]

/* ── Helpers ──────────────────────────────────────────────────────────────── */
function formatDate(d) {
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function ArrowRight({ size = 12 }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor"
      strokeWidth="1.8" width={size} height={size}>
      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Skeleton() {
  return <span className="db-skeleton" style={{ width: 48, height: 28 }} />
}

/* ── Component ───────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const { user } = useAuth()
  const { settings } = useSiteSettings()
  const [counts, setCounts] = useState({})
  const [loading, setLoading]     = useState(true)
  const today                     = formatDate(new Date())

  useEffect(() => {
    let cancelled = false
    async function loadCounts() {
      const results = await Promise.allSettled(
        NAV_ITEMS.map((item) =>
          client
            .get(RESOURCES[item.key].endpoint, { params: { page_size: 1 } })
            .then((res) => [item.key, res.data.count]),
        ),
      )
      if (cancelled) return
      const next = {}
      for (const r of results) {
        if (r.status === 'fulfilled') next[r.value[0]] = r.value[1]
      }
      setCounts(next)
      setLoading(false)
    }
    loadCounts()
    return () => { cancelled = true }
  }, [])

  // Group items by their group label
  const grouped = {}
  for (const item of NAV_ITEMS) {
    if (!grouped[item.group]) grouped[item.group] = []
    grouped[item.group].push(item)
  }

  const totalRecords = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div className="db-page">

      {/* ══ Header ══════════════════════════════════════════════════════════ */}
      <div className="db-header">
        <div>
          <p className="db-date">{today}</p>
          <h1 className="db-title">
            Bonjour{user?.username ? `, ${user.username}` : ''} 👋
          </h1>
          <p className="db-subtitle">
            Voici un aperçu complet de votre exploitation agricole.
          </p>
        </div>
        <div className="db-header-kpi">
          <div className="db-kpi-chip">
            <span className="db-kpi-dot" />
            <span>{loading ? '…' : totalRecords} enregistrements</span>
          </div>
          <Link to="/dashboard/reports" className="db-reports-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6"  y1="20" x2="6"  y2="14" />
            </svg>
            Rapports
          </Link>
        </div>
      </div>

      {/* ══ Global KPI strip ════════════════════════════════════════════════ */}
      <div className="db-kpi-strip">
        {SUMMARY_KEYS.map(({ key, label, group }) => {
          const meta = GROUP_META[group]
          const Icon = meta.icon
          return (
            <Link
              key={key}
              to={`/dashboard/${key}`}
              className="db-kpi-card"
              style={{ '--card-color': meta.color, '--card-bg': meta.bg }}
            >
              <div className="db-kpi-card-icon">
                <Icon width={18} height={18} />
              </div>
              <div className="db-kpi-card-body">
                <div className="db-kpi-card-value">
                  {loading ? <Skeleton /> : (counts[key] ?? '0')}
                </div>
                <div className="db-kpi-card-label">{label}</div>
              </div>
              <div className="db-kpi-card-arrow">
                <ArrowRight />
              </div>
            </Link>
          )
        })}
      </div>

      {/* ══ Main body: module grids ══════════════════════════════════════════ */}
      <div className="db-body">

        {/* Left column: module sections stacked */}
        <div className="db-modules">
          {Object.entries(grouped).map(([group, items]) => {
            const meta       = GROUP_META[group] || GROUP_META['Comptes']
            const Icon       = meta.icon
            const groupTotal = items.reduce((s, i) => s + (counts[i.key] ?? 0), 0)

            return (
              <div key={group} className="db-module-block">
                {/* Module header */}
                <div className="db-module-head">
                  <span className="db-module-icon"
                    style={{ color: meta.color, background: meta.bg }}>
                    <Icon width={15} height={15} />
                  </span>
                  <span className="db-module-name">{group}</span>
                  <span className="db-module-total" style={{ color: meta.color }}>
                    {loading ? '…' : groupTotal}
                  </span>
                </div>

                {/* Resource cards */}
                <div className="db-resource-grid">
                  {items.map((item) => (
                    <Link
                      key={item.key}
                      to={`/dashboard/${item.key}`}
                      className="db-resource-card"
                      style={{ '--card-color': meta.color, '--card-bg': meta.bg }}
                    >
                      <div className="db-resource-value">
                        {loading ? <Skeleton /> : (counts[item.key] ?? '0')}
                      </div>
                      <div className="db-resource-label">
                        {RESOURCES[item.key].label}
                      </div>
                      <div className="db-resource-cta">
                        <span>Voir</span>
                        <ArrowRight size={10} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Shortcuts & Quick actions row */}
        <div className="db-shortcuts-row">
          <Link to="/dashboard/reports" className="db-shortcut-card">
            <div className="db-shortcut-icon" style={{ background: 'rgba(34, 197, 94, 0.12)', color: '#22c55e' }}>📊</div>
            <div className="db-shortcut-info">
              <h4>Rapports & Statistiques</h4>
              <p>Graphiques financiers, KPIs et analyses complètes de l'exploitation</p>
            </div>
            <ArrowRight size={16} />
          </Link>

          <Link to="/dashboard/settings" className="db-shortcut-card">
            <div className="db-shortcut-icon" style={{ background: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4' }}>⚙️</div>
            <div className="db-shortcut-info">
              <h4>Paramètres du site & identité</h4>
              <p>Nom d'application, logo, devises et coordonnées de contact</p>
            </div>
            <ArrowRight size={16} />
          </Link>

          <Link to="/dashboard/settings" className="db-shortcut-card">
            <div className="db-shortcut-icon" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>👥</div>
            <div className="db-shortcut-info">
              <h4>Gestion des Utilisateurs</h4>
              <p>Comptes d'accès, permissions et rôles administratifs</p>
            </div>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  )
}

