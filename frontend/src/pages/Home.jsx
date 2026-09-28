import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import MiniDonut from '../components/MiniDonut'
import PublicFooter from '../components/PublicFooter'
import PublicHeader from '../components/PublicHeader'
import Reveal from '../components/Reveal'
import StatCounter from '../components/StatCounter'
import {
  IconAnimal,
  IconBolt,
  IconCoins,
  IconFish,
  IconLeaf,
  IconShield,
  IconSparkles,
  IconUsers,
} from '../components/icons'
import { MODULE_LIST } from '../config/modules'
import { useSiteSettings } from '../context/SiteSettingsContext'

const STEPS = [
  {
    icon: IconLeaf,
    color: '#22c55e',
    title: 'Saisie sur le terrain',
    description:
      'Chaque ferme enregistre ses parcelles de culture, cheptels, bassins et transactions en temps réel.',
  },
  {
    icon: IconBolt,
    color: '#f59e0b',
    title: 'Centralisation instantanée',
    description:
      'Les données sont synchronisées automatiquement, évitant les erreurs de ressaisie et les fichiers dispersés.',
  },
  {
    icon: IconShield,
    color: '#3b82f6',
    title: 'Pilotage & Décisions',
    description:
      'Indicateurs de rendement, alertes sanitaires et bilans comptables consolidés pour guider vos choix stratégiques.',
  },
]

const VALUES = [
  {
    icon: IconShield,
    color: '#3b82f6',
    title: 'Rigueur & Traçabilité',
    description:
      'Chaque culture, animal ou bassin est documenté avec précision depuis le terrain jusqu’au tableau de bord.',
    image: '/images/agriculture/agriculture-03.jpg',
  },
  {
    icon: IconLeaf,
    color: '#22c55e',
    title: 'Durabilité & Respect des sols',
    description:
      'Optimisation raisonnée des ressources hydriques et des intrants pour une production durable et responsable.',
    image: '/images/pisciculture/pisciculture-08.jpg',
  },
  {
    icon: IconUsers,
    color: '#8b5cf6',
    title: 'Synergie & Travail d’équipe',
    description:
      'Une source de vérité unique partagée entre exploitants de terrain et équipes de direction.',
    image: '/images/pisciculture/pisciculture-04.jpg',
  },
  {
    icon: IconBolt,
    color: '#f59e0b',
    title: 'Innovation & Amélioration continue',
    description:
      'Mesures continues et retours d’expérience pour maximiser la qualité et la productivité campagne après campagne.',
    image: '/images/agriculture/agriculture-10.jpg',
  },
]

const GALLERY = [
  ...MODULE_LIST[0].gallery.slice(0, 3),
  ...MODULE_LIST[1].gallery.slice(0, 3),
  ...MODULE_LIST[2].gallery.slice(0, 2),
]

export default function Home() {
  const { settings } = useSiteSettings()
  const [stats, setStats] = useState(null)

  const siteName = settings?.nom_application || 'CPAM'

  useEffect(() => {
    let cancelled = false
    client
      .get('/public/stats/')
      .then(({ data }) => {
        if (!cancelled) setStats(data)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="home fluid-home">
      <PublicHeader />

      {/* ══ HERO SECTION WITH FLUID DYNAMICS ═════════════════════════════════ */}
      <section
        id="accueil"
        className="hero hero-photo fluid-hero"
        style={{ backgroundImage: "url('/images/agriculture/agriculture-02.jpg')" }}
      >
        <div className="hero-photo-overlay" aria-hidden="true" />
        <div className="hero-mesh-glow" aria-hidden="true" />

        <div className="hero-content fluid-hero-content">
          <div className="eyebrow eyebrow-light fluid-eyebrow">
            <IconSparkles width={14} height={14} />
            <span>Entreprise Agricole & Multi-ressources</span>
          </div>

          <h1 className="fluid-hero-title">
            <span className="hero-gradient-text">{siteName}</span>, une production moderne sur toute la chaîne agricole.
          </h1>

          <p className="subtitle subtitle-light fluid-hero-desc">
            {settings?.slogan ||
              "Centralisez l'agriculture, l'élevage, la pisciculture et la gestion comptable de vos fermes au sein d’une plateforme fluide, intuitive et performante."}
          </p>

          <div className="hero-actions fluid-hero-actions">
            <Link to="/login" className="btn-primary btn-large btn-glow">
              <span>Accéder à l’espace interne</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <a href="#modules" className="btn-ghost btn-ghost-light btn-smooth-scroll">
              Découvrir nos filières ↓
            </a>
          </div>

          {/* Floating Pill Highlights on Hero */}
          <div className="hero-floating-pills">
            <div className="hero-pill-item">
              <span className="hero-pill-dot" style={{ background: '#22c55e' }} />
              <IconLeaf width={13} height={13} style={{ color: '#22c55e' }} />
              <span>Cultures maîtrisées</span>
            </div>
            <div className="hero-pill-item">
              <span className="hero-pill-dot" style={{ background: '#f59e0b' }} />
              <IconAnimal width={13} height={13} style={{ color: '#f59e0b' }} />
              <span>Cheptels suivis</span>
            </div>
            <div className="hero-pill-item">
              <span className="hero-pill-dot" style={{ background: '#3b82f6' }} />
              <IconFish width={13} height={13} style={{ color: '#3b82f6' }} />
              <span>Bassins contrôlés</span>
            </div>
            <div className="hero-pill-item">
              <span className="hero-pill-dot" style={{ background: '#8b5cf6' }} />
              <IconCoins width={13} height={13} style={{ color: '#8b5cf6' }} />
              <span>Comptabilité en temps réel</span>
            </div>
          </div>
        </div>

        {/* Soft bottom wave blend */}
        <div className="hero-wave-divider">
          <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
            <path
              d="M0,40 C320,80 480,10 720,40 C960,70 1120,20 1440,50 L1440,80 L0,80 Z"
              fill="var(--bg)"
            />
          </svg>
        </div>
      </section>

      {/* ══ STATS SECTION ═════════════════════════════════════════════════════ */}
      {stats && (
        <section id="statistiques" className="stats-bar fluid-stats-bar">
          <div className="stats-bar-container">
            <Reveal as="div" className="stats-head-center">
              <span className="section-pill-tag">Indicateurs consolidés</span>
              <h2 className="section-title stats-bar-title">{siteName} en chiffres</h2>
              <p className="section-subtitle">Aperçu en direct des exploitations et des ressources suivies.</p>
            </Reveal>

            <div className="stats-bar-inner fluid-stats-inner">
              <div className="stats-bar-donut-box">
                <MiniDonut
                  data={[
                    { label: 'Cultures', value: stats.cultures || 0, color: '#22c55e' },
                    { label: 'Animaux', value: stats.animaux || 0, color: '#f59e0b' },
                    { label: 'Bassins', value: stats.bassins || 0, color: '#3b82f6' },
                  ]}
                />
              </div>
              <div className="stats-bar-counters fluid-counters">
                <div className="stat-counter-card">
                  <div className="stat-card-icon" style={{ background: 'rgba(236,72,153,0.12)', color: '#ec4899' }}>
                    🏡
                  </div>
                  <StatCounter value={stats.fermes} label="Fermes actives" />
                </div>
                <div className="stat-counter-card">
                  <div className="stat-card-icon" style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>
                    🌱
                  </div>
                  <StatCounter value={stats.cultures} label="Cultures en suivi" />
                </div>
                <div className="stat-counter-card">
                  <div className="stat-card-icon" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
                    🐄
                  </div>
                  <StatCounter value={stats.animaux} label="Têtes de bétail" />
                </div>
                <div className="stat-counter-card">
                  <div className="stat-card-icon" style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}>
                    🐟
                  </div>
                  <StatCounter value={stats.bassins} label="Bassins suivis" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══ MODULES & ACTIVITES ═══════════════════════════════════════════════ */}
      <section id="modules" className="features-section fluid-section">
        <div className="section-head-wrap">
          <span className="section-pill-tag">Expertises de terrain</span>
          <Reveal as="h2" className="section-title">
            Nos pôles d'activités
          </Reveal>
          <Reveal as="p" className="section-subtitle" delay={80}>
            Chaque filière dispose d'outils sur-mesure pour mesurer et optimiser sa production.
          </Reveal>
        </div>

        <div className="features fluid-features-grid">
          {MODULE_LIST.map((mod, i) => (
            <Reveal as="div" key={mod.path} delay={i * 90}>
              <Link to={mod.path} className="feature-card feature-card-link fluid-feature-card">
                <div className="feature-card-image">
                  <img src={mod.image} alt={mod.title} loading="lazy" />
                  <div className="feature-card-overlay-gradient" />
                  <div className="icon-badge feature-card-icon">
                    <mod.icon />
                  </div>
                </div>
                <div className="feature-card-body">
                  <span className="feature-tag">Module spécialisé</span>
                  <h3>{mod.title}</h3>
                  <p>{mod.tagline}</p>
                  <span className="feature-card-cta">
                    Explorer la filière
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ PROCESS STEP TIMELINE ═════════════════════════════════════════════ */}
      <section className="process-section fluid-process-section">
        <div className="section-head-wrap">
          <span className="section-pill-tag">Méthodologie</span>
          <Reveal as="h2" className="section-title">
            Comment fonctionne la plateforme ?
          </Reveal>
          <Reveal as="p" className="section-subtitle" delay={80}>
            De la collecte sur les parcelles jusqu'aux arbitrages de gestion.
          </Reveal>
        </div>

        <div className="process-steps fluid-process-steps">
          {STEPS.map((step, i) => (
            <Reveal as="div" className="process-step fluid-step-card" key={step.title} delay={i * 100}>
              <div className="step-top-row">
                <span className="process-step-number" style={{ background: step.color }}>
                  0{i + 1}
                </span>
                <div className="icon-badge icon-badge-alt" style={{ color: step.color }}>
                  <step.icon />
                </div>
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ VALEURS ET ENGAGEMENTS ════════════════════════════════════════════ */}
      <section className="values-section fluid-values-section">
        <div className="section-head-wrap">
          <span className="section-pill-tag">Principes fondamentaux</span>
          <Reveal as="h2" className="section-title">
            Nos engagements & valeurs
          </Reveal>
          <Reveal as="p" className="section-subtitle">
            Une culture d'excellence appliquée à chaque étape de notre production.
          </Reveal>
        </div>

        <div className="alt-rows fluid-alt-rows">
          {VALUES.map((value, i) => (
            <Reveal
              as="div"
              className={`alt-row fluid-alt-row ${i % 2 === 1 ? 'alt-row-reverse' : ''}`}
              key={value.title}
              delay={60}
            >
              <div className="alt-row-image fluid-alt-img">
                <img src={value.image} alt={value.title} loading="lazy" />
                <div className="alt-image-shine" />
              </div>
              <div className="alt-row-text fluid-alt-text">
                <div className="icon-badge" style={{ background: `${value.color}18`, color: value.color }}>
                  <value.icon />
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ GALLERY SECTION ═══════════════════════════════════════════════════ */}
      <section className="home-gallery-section fluid-gallery-section">
        <div className="section-head-wrap">
          <span className="section-pill-tag">Immersion visuelle</span>
          <Reveal as="h2" className="section-title">
            Nos fermes en images
          </Reveal>
          <Reveal as="p" className="section-subtitle">
            Un aperçu authentique de nos infrastructures et de nos équipes.
          </Reveal>
        </div>

        <div className="module-gallery fluid-module-gallery">
          {GALLERY.map((src, i) => (
            <Reveal as="div" className="module-gallery-item fluid-gallery-card" key={src} delay={i * 45}>
              <img src={src} alt="Exploitation agricole" loading="lazy" />
              <div className="gallery-hover-overlay">
                <span className="gallery-hover-badge">Explorer</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ CALL TO ACTION BANNER ═════════════════════════════════════════════ */}
      <section className="cta-banner fluid-cta-section">
        <Reveal as="div" className="cta-banner-inner fluid-cta-card">
          <div className="cta-glow-orb" />
          <span className="section-pill-tag" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}>
            Prêt à collaborer ?
          </span>
          <h2>Envie d'en savoir plus sur {siteName} ?</h2>
          <p>
            Découvrez nos réalisations en détail ou contactez directement l'équipe de direction pour toute demande d'accès
            ou de partenariat.
          </p>
          <div className="cta-banner-actions fluid-cta-actions">
            <Link to="/contact" className="btn-primary btn-large btn-glow">
              Nous contacter
            </Link>
            <Link to="/apropos" className="btn-secondary btn-large">
              En savoir plus sur l'entreprise
            </Link>
          </div>
        </Reveal>
      </section>

      <PublicFooter />
    </div>
  )
}
