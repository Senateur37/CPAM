import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { NAV_ITEMS, RESOURCES } from '../config/resources'
import {
  LogoMark,
  IconLeaf,
  IconAnimal,
  IconFish,
  IconCoins,
  IconLayers,
  IconMail,
  IconSettings,
  IconGraduationCap,
  IconMenu,
  IconX,
  IconSearch,
} from './icons'

const GROUP_ICONS = {
  Agriculture:  IconLeaf,
  Élevage:      IconAnimal,
  Pisciculture: IconFish,
  Comptabilité: IconCoins,
  Comptes:      IconLayers,
  Messages:     IconMail,
  Carrières:    IconGraduationCap,
}

const GROUP_COLORS = {
  Agriculture:  '#22c55e',
  Élevage:      '#f59e0b',
  Pisciculture: '#3b82f6',
  Comptabilité: '#8b5cf6',
  Comptes:      '#ec4899',
  Messages:     '#06b6d4',
  Carrières:    '#14b8a6',
}

function groupNavItems() {
  const groups = {}
  for (const item of NAV_ITEMS) {
    if (!groups[item.group]) groups[item.group] = []
    groups[item.group].push(item)
  }
  return groups
}

function getInitials(username) {
  if (!username) return '?'
  return username.slice(0, 2).toUpperCase()
}

export default function Layout() {
  const { user, logout } = useAuth()
  const { settings } = useSiteSettings()
  const navigate = useNavigate()
  const location = useLocation()
  const groups = groupNavItems()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const searchRef = useRef(null)

  // Close drawer on any route change
  useEffect(() => {
    setMobileOpen(false)
    setSearchFocused(false)
  }, [location.pathname])

  // Global search keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        const input = searchRef.current?.querySelector('input')
        if (input) input.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // Filter navigation & pages by search term
  const searchResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase()
    if (!q) return []
    const results = []

    // Quick Pages
    if ('tableau de bord'.includes(q) || 'dashboard'.includes(q) || 'accueil'.includes(q)) {
      results.push({
        path: '/dashboard',
        title: 'Tableau de bord',
        sub: 'Vue globale & indicateurs',
        icon: IconLayers,
        color: 'var(--accent)',
      })
    }
    if ('rapports'.includes(q) || 'statistiques'.includes(q) || 'finances'.includes(q) || 'chiffres'.includes(q)) {
      results.push({
        path: '/dashboard/reports',
        title: 'Rapports & Statistiques',
        sub: 'Graphiques financiers et KPI',
        icon: IconCoins,
        color: '#8b5cf6',
      })
    }
    if ('paramètres'.includes(q) || 'settings'.includes(q) || 'utilisateurs'.includes(q) || 'logo'.includes(q) || 'compte'.includes(q)) {
      results.push({
        path: '/dashboard/settings',
        title: 'Paramètres & Accès',
        sub: 'Identité du site & gestion des utilisateurs',
        icon: IconSettings,
        color: '#06b6d4',
      })
    }

    // Resources
    for (const item of NAV_ITEMS) {
      const resConfig = RESOURCES[item.key]
      const label = resConfig?.label || item.key
      if (label.toLowerCase().includes(q) || item.group.toLowerCase().includes(q)) {
        const Icon = GROUP_ICONS[item.group] || IconLayers
        const color = GROUP_COLORS[item.group] || 'var(--accent)'
        results.push({
          path: `/dashboard/${item.key}`,
          title: label,
          sub: `Module ${item.group}`,
          icon: Icon,
          color: color,
        })
      }
    }

    return results.slice(0, 8)
  }, [globalSearch])

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="app-shell">
      {/* ── Mobile Backdrop ────────────────────────────── */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Mobile drawer header */}
        <div className="sidebar-header-mobile">
          <NavLink to="/" className="brand" onClick={() => setMobileOpen(false)}>
            {settings?.logo_url ? (
              <img
                src={settings.logo_url}
                alt={settings.nom_application || 'Logo'}
                className="brand-custom-logo"
              />
            ) : (
              <LogoMark className="brand-mark" />
            )}
            <span>{settings?.nom_application || 'CPAM'}</span>
          </NavLink>
          <button
            type="button"
            className="btn-sidebar-close"
            aria-label="Fermer le menu"
            onClick={() => setMobileOpen(false)}
          >
            <IconX width={20} height={20} />
          </button>
        </div>

        {/* Desktop Brand */}
        <div className="sidebar-header-desktop">
          <NavLink to="/" className="brand">
            {settings?.logo_url ? (
              <img
                src={settings.logo_url}
                alt={settings.nom_application || 'Logo'}
                className="brand-custom-logo"
              />
            ) : (
              <LogoMark className="brand-mark" />
            )}
            <span>{settings?.nom_application || 'CPAM'}</span>
          </NavLink>
        </div>

        {/* Dashboard overview link */}
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          <span className="nav-link-icon" style={{ color: 'var(--accent)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </span>
          Tableau de bord
        </NavLink>

        <NavLink
          to="/dashboard/reports"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          <span className="nav-link-icon" style={{ color: '#8b5cf6' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6"  y1="20" x2="6"  y2="14" />
            </svg>
          </span>
          Rapports
        </NavLink>

        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          <span className="nav-link-icon" style={{ color: '#06b6d4' }}>
            <IconSettings width={16} height={16} />
          </span>
          Paramètres & Accès
        </NavLink>

        <div className="sidebar-divider" />


        {/* Navigation groups */}
        <nav className="sidebar-nav">
          {Object.entries(groups).map(([group, items]) => {
            const Icon = GROUP_ICONS[group] || IconLayers
            const color = GROUP_COLORS[group] || 'var(--accent)'
            return (
              <div className="nav-group" key={group}>
                <div className="nav-group-title">
                  <span className="nav-group-icon" style={{ color }}>
                    <Icon width={13} height={13} />
                  </span>
                  {group}
                </div>
                {items.map((item) => (
                  <NavLink
                    key={item.key}
                    to={`/dashboard/${item.key}`}
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                    style={({ isActive }) => isActive ? { '--active-color': color } : {}}
                  >
                    <span className="nav-link-dot" style={{ background: color }} />
                    {RESOURCES[item.key].label}
                  </NavLink>
                ))}
              </div>
            )
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{getInitials(user?.username)}</div>
            <div className="sidebar-user-info">
              <span className="sidebar-username">{user?.username}</span>
              {user?.role && <span className="sidebar-role">{user.role}</span>}
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────── */}
      <div className="main">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="btn-sidebar-toggle"
              aria-label="Ouvrir le menu de navigation"
              onClick={() => setMobileOpen(true)}
            >
              <IconMenu width={20} height={20} />
            </button>
            <div className="topbar-brand-mobile">
              {settings?.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt={settings.nom_application || 'Logo'}
                  className="brand-custom-logo-mini"
                />
              ) : (
                <LogoMark className="brand-mark-mini" />
              )}
              <span className="topbar-appname-mobile">{settings?.nom_application || 'CPAM'}</span>
            </div>
            <h2 className="topbar-greeting">{settings?.slogan || 'Gestion agricole & multi-ressources'}</h2>
          </div>

          {/* Topbar Center: Global Search Bar */}
          <div className="topbar-search-container" ref={searchRef}>
            <div className={`topbar-search-box ${searchFocused ? 'focused' : ''}`}>
              <IconSearch width={15} height={15} className="topbar-search-icon" />
              <input
                type="text"
                placeholder="Rechercher (ex: cultures, animaux, rapports...)"
                value={globalSearch}
                onChange={(e) => {
                  setGlobalSearch(e.target.value)
                  setSearchFocused(true)
                }}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setGlobalSearch('')
                    setSearchFocused(false)
                  }
                }}
              />
              {globalSearch ? (
                <button
                  type="button"
                  className="topbar-search-clear"
                  onClick={() => setGlobalSearch('')}
                  aria-label="Effacer la recherche"
                >
                  <IconX width={13} height={13} />
                </button>
              ) : (
                <kbd className="topbar-search-kbd">⌘K</kbd>
              )}
            </div>

            {searchFocused && globalSearch.trim() && (
              <div className="topbar-search-dropdown">
                {searchResults.length > 0 ? (
                  searchResults.map((res) => {
                    const Icon = res.icon
                    return (
                      <button
                        key={res.path}
                        type="button"
                        className="topbar-search-item"
                        onClick={() => {
                          navigate(res.path)
                          setGlobalSearch('')
                          setSearchFocused(false)
                        }}
                      >
                        <span className="search-item-icon" style={{ color: res.color, background: `${res.color}15` }}>
                          <Icon width={14} height={14} />
                        </span>
                        <div className="search-item-content">
                          <span className="search-item-title">{res.title}</span>
                          <span className="search-item-sub">{res.sub}</span>
                        </div>
                        <span className="search-item-arrow">→</span>
                      </button>
                    )
                  })
                ) : (
                  <div className="topbar-search-empty">
                    <span>Aucun module ou ressource trouvé pour "{globalSearch}"</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="topbar-right">
            <div className="topbar-user-pill">
              <span className="topbar-avatar">{getInitials(user?.username)}</span>
              <span className="topbar-username">{user?.username}</span>
            </div>
            <button
              type="button"
              className="btn-logout"
              onClick={handleLogout}
              title="Déconnexion"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="btn-logout-text">Déconnexion</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
