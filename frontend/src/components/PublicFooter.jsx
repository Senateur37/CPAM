import { Link } from 'react-router-dom'
import { MODULE_LIST } from '../config/modules'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { LogoMark } from './icons'

const FOOTER_COLUMNS = [
  {
    title: 'Activités',
    links: MODULE_LIST.map((mod) => ({ to: mod.path, label: mod.navLabel })),
  },
  {
    title: 'Ressources',
    links: [
      { to: '/formation', label: 'Formation' },
      { to: '/apropos', label: 'À propos' },
      { to: '/contact', label: 'Contact' },
      { to: '/login', label: 'Tableau de bord' },
    ],
  },
]

export default function PublicFooter() {
  const { settings } = useSiteSettings()

  return (
    <footer className="home-footer">
      <div className="footer-top">
        <div className="footer-brand">
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
          <p>{settings?.description || 'Entreprise agricole active en agriculture, élevage et pisciculture, avec la comptabilité de nos fermes centralisée dans notre tableau de bord interne.'}</p>
        </div>
        {FOOTER_COLUMNS.map((col) => (
          <div className="footer-col" key={col.title}>
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {settings?.nom_application || 'CPAM'} — Tous droits réservés</span>
      </div>
    </footer>
  )
}

