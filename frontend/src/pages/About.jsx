import { Link } from 'react-router-dom'
import PublicFooter from '../components/PublicFooter'
import PublicHeader from '../components/PublicHeader'
import Reveal from '../components/Reveal'
import { IconBolt, IconLayers, IconShield } from '../components/icons'
import { MODULE_LIST } from '../config/modules'
import { useSiteSettings } from '../context/SiteSettingsContext'

const BENEFITS = [
  {
    icon: IconLayers,
    title: 'Tout en un seul endroit',
    description: "Plus besoin de jongler entre plusieurs outils : chaque activité de l'entreprise vit dans le même tableau de bord.",
  },
  {
    icon: IconBolt,
    title: 'Données à jour en continu',
    description: 'Chaque saisie est immédiatement disponible pour toute notre équipe, sans ressaisie ni fichier à partager.',
  },
  {
    icon: IconShield,
    title: 'Accès sécurisé',
    description: 'Authentification par jeton et accès protégé : seules les personnes autorisées consultent nos données.',
  },
]

export default function About() {
  const { settings } = useSiteSettings()
  const siteName = settings?.nom_application || 'CPAM'

  return (
    <div className="home fluid-home">
      <PublicHeader />

      <section className="simple-hero fluid-simple-hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="simple-hero-inner">
          <span className="eyebrow">À propos de nous</span>
          <h1>Une entreprise agricole intégrée d’excellence</h1>
          <p className="subtitle">
            {siteName} est une entreprise pionnière en agriculture, élevage et pisciculture, combinée à une
            gestion comptable rigoureuse. Pour piloter l’ensemble de nos exploitations au quotidien, nous centralisons
            les parcelles, les cheptels, les bassins et les états financiers dans un portail unifié, fluide et fiable.
          </p>
        </div>
      </section>


      <section className="benefits-section">
        <div className="benefits">
          {BENEFITS.map((benefit, i) => (
            <Reveal as="div" className="benefit" key={benefit.title} delay={i * 80}>
              <div className="icon-badge icon-badge-alt">
                <benefit.icon />
              </div>
              <div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="modules-recap-section">
        <h2 className="section-title">Explorer nos activités</h2>
        <div className="modules-recap">
          {MODULE_LIST.map((mod) => (
            <Link to={mod.path} className="module-pill" key={mod.path}>
              <mod.icon />
              {mod.navLabel}
            </Link>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
