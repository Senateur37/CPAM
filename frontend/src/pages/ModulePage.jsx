import { Link } from 'react-router-dom'
import PublicFooter from '../components/PublicFooter'
import PublicHeader from '../components/PublicHeader'
import Reveal from '../components/Reveal'
import { MODULE_PAGES } from '../config/modules'

export default function ModulePage({ moduleKey }) {
  const mod = MODULE_PAGES[moduleKey]
  const Icon = mod.icon
  const featureImages = mod.gallery ?? []
  const remainingGallery = featureImages.slice(mod.features.length)

  return (
    <div className="home fluid-home">
      <PublicHeader />

      <section className="module-hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="module-hero-grid">
          <div className="module-hero-text">
            <div className="icon-badge module-hero-icon">
              <Icon />
            </div>
            <span className="eyebrow">{mod.title}</span>
            <h1>{mod.tagline}</h1>
            <p className="subtitle">{mod.description}</p>
            <Link to="/login" className="btn-primary btn-large btn-glow">
              Se connecter au tableau de bord
            </Link>
          </div>

          <div className="module-hero-image">
            <img src={mod.image} alt={`Photo illustrant le module ${mod.title}`} />
          </div>
        </div>
      </section>

      <section className="module-features-section">
        <Reveal as="h2" className="section-title">
          Fonctionnalités
        </Reveal>
        <div className="alt-rows">
          {mod.features.map((feature, i) => (
            <Reveal
              as="div"
              className={i % 2 === 1 ? 'alt-row alt-row-reverse' : 'alt-row'}
              key={feature}
            >
              <div className="alt-row-image">
                <img src={featureImages[i]} alt="" loading="lazy" />
              </div>
              <div className="alt-row-text">
                <span className="module-feature-check">✓</span>
                <p>{feature}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {remainingGallery.length > 0 && (
        <section className="module-gallery-section">
          <h2 className="section-title">En images</h2>
          <div className="module-gallery">
            {remainingGallery.map((src, i) => (
              <Reveal as="div" className="module-gallery-item" key={src} delay={i * 60}>
                <img src={src} alt={`${mod.title} — photo ${i + 1}`} loading="lazy" />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <PublicFooter />
    </div>
  )
}
