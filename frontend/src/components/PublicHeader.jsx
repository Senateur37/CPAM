import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MODULE_LIST } from '../config/modules'
import { useSiteSettings } from '../context/SiteSettingsContext'
import {
  IconAnimal,
  IconBuilding,
  IconCoins,
  IconFish,
  IconGraduationCap,
  IconLeaf,
  IconMail,
  LogoMark,
} from './icons'

const NAV_TABS = [
  { to: '/', label: 'Accueil' },
  ...MODULE_LIST.map((mod) => ({ to: mod.path, label: mod.navLabel })),
  { to: '/formation', label: 'Formation' },
  { to: '/apropos', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
]

const TAB_ICONS = {
  '/': null,
  '/agriculture': IconLeaf,
  '/elevage': IconAnimal,
  '/pisciculture': IconFish,
  '/comptabilite': IconCoins,
  '/formation': IconGraduationCap,
  '/apropos': IconBuilding,
  '/contact': IconMail,
}

const TAB_COLORS = {
  '/': '#22c55e',
  '/agriculture': '#22c55e',
  '/elevage': '#f59e0b',
  '/pisciculture': '#3b82f6',
  '/comptabilite': '#8b5cf6',
  '/formation': '#14b8a6',
  '/apropos': '#06b6d4',
  '/contact': '#ec4899',
}

export default function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { settings } = useSiteSettings()
  const location = useLocation()

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={scrolled ? 'home-nav scrolled' : 'home-nav'}>
      <Link to="/" className="brand">
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
      </Link>

      <button
        type="button"
        className={`nav-toggle ${menuOpen ? 'open' : ''}`}
        aria-label="Ouvrir le menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`home-tabs ${menuOpen ? 'open' : ''}`}>
        <div className="home-tabs-inner">
          {NAV_TABS.map((tab) => {
            const isActive = tab.to === '/' ? location.pathname === '/' : location.pathname === tab.to
            const Icon = TAB_ICONS[tab.to]
            const color = TAB_COLORS[tab.to] || '#22c55e'

            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={`home-tab ${isActive ? 'active' : ''}`}
                style={{ '--tab-color': color }}
                onClick={() => setMenuOpen(false)}
              >
                {Icon ? (
                  <span className="tab-mini-icon">
                    <Icon width={13} height={13} />
                  </span>
                ) : (
                  <span className="tab-home-dot" />
                )}
                <span>{tab.label}</span>
              </Link>
            )
          })}
        </div>

        <Link to="/login" className="btn-primary nav-cta btn-glow" onClick={() => setMenuOpen(false)}>
          <span>Tableau de bord</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </nav>
    </header>
  )
}
