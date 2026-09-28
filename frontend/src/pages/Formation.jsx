import { useEffect, useState } from 'react'
import client from '../api/client'
import PublicFooter from '../components/PublicFooter'
import PublicHeader from '../components/PublicHeader'
import Reveal from '../components/Reveal'
import {
  IconAward,
  IconBriefcase,
  IconCoins,
  IconGraduationCap,
  IconLeaf,
  IconMapPin,
  IconSearch,
  IconShield,
  IconSparkles,
} from '../components/icons'
import { useSiteSettings } from '../context/SiteSettingsContext'

const CATEGORIES = [
  { value: '', label: 'Toutes les offres' },
  { value: 'formation', label: 'Formations' },
  { value: 'recrutement', label: 'Recrutements' },
  { value: 'stage', label: 'Stages terrain' },
  { value: 'vente', label: 'Commerce & Vente' },
  { value: 'autre', label: 'Autres missions' },
]

const CATEGORY_COLORS = {
  formation: '#14b8a6',
  recrutement: '#3b82f6',
  stage: '#f59e0b',
  vente: '#8b5cf6',
  autre: '#64748b',
}

const CATEGORY_ICONS = {
  '': IconSparkles,
  formation: IconGraduationCap,
  recrutement: IconBriefcase,
  stage: IconLeaf,
  vente: IconCoins,
  autre: IconShield,
}

const HIGHLIGHTS = [
  {
    icon: IconGraduationCap,
    title: 'Formation 100% sur le terrain',
    desc: 'Apprentissage pratique direct au contact de nos parcelles, cheptels et bassins piscicoles.',
    color: '#14b8a6',
    bg: 'rgba(20, 184, 166, 0.12)',
  },
  {
    icon: IconBriefcase,
    title: 'Opportunités d’insertion & CDI',
    desc: 'Passerelle prioritaire vers un recrutement au sein de nos exploitations modernes.',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.12)',
  },
  {
    icon: IconLeaf,
    title: 'Technologies agronomiques',
    desc: 'Prise en main des systèmes d’irrigation, de nutrition animale et d’outils informatisés.',
    color: '#22c55e',
    bg: 'rgba(34, 197, 94, 0.12)',
  },
  {
    icon: IconAward,
    title: 'Attestation & Compétences certifiées',
    desc: 'Validation reconnue de vos acquis techniques et agronomiques à la fin de chaque cycle.',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
  },
]

const EMPTY_FORM = { offre: '', nom: '', email: '', telephone: '', message: '' }
const MAX_CV_SIZE = 5 * 1024 * 1024 // 5 Mo

export default function Formation() {
  const { settings } = useSiteSettings()
  const siteName = settings?.nom_application || 'CPAM'

  const [offres, setOffres] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [form, setForm] = useState(EMPTY_FORM)
  const [cv, setCv] = useState(null)
  const [selectedOffreTitle, setSelectedOffreTitle] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    client
      .get('/carrieres/offres/', { params: { page_size: 100 } })
      .then(({ data }) => setOffres(data.results ?? data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = offres.filter((o) => {
    const matchesCat = !filter || o.categorie === filter
    const matchesSearch =
      !searchQuery.trim() ||
      o.titre?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      o.description?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      o.lieu?.toLowerCase().includes(searchQuery.toLowerCase().trim())
    return matchesCat && matchesSearch
  })

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function postulerA(offreId, offreTitre) {
    updateField('offre', String(offreId))
    setSelectedOffreTitle(offreTitre || '')
    const el = document.getElementById('candidature-form')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  function handleSelectOffre(e) {
    const val = e.target.value
    updateField('offre', val)
    const found = offres.find((o) => String(o.id) === String(val))
    setSelectedOffreTitle(found ? found.titre : '')
  }

  function handleCvChange(event) {
    const file = event.target.files?.[0] ?? null
    if (file && file.size > MAX_CV_SIZE) {
      setError('Le CV dépasse la taille maximale autorisée (5 Mo).')
      event.target.value = ''
      setCv(null)
      return
    }
    setError('')
    setCv(file)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      const payload = new FormData()
      Object.entries(form).forEach(([key, value]) => payload.append(key, value))
      if (cv) payload.append('cv', cv)
      await client.post('/carrieres/candidatures/', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setForm(EMPTY_FORM)
      setCv(null)
      setSelectedOffreTitle('')
      setStatus('success')
    } catch {
      setError('Une erreur est survenue lors de l’envoi. Veuillez vérifier les champs et réessayer.')
      setStatus('error')
    }
  }

  return (
    <div className="home fluid-home">
      <PublicHeader />

      {/* ═══ 1. Hero Section ═══ */}
      <section className="simple-hero fluid-simple-hero careers-hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="simple-hero-inner">
          <span className="eyebrow careers-eyebrow">
            <IconGraduationCap width={15} height={15} style={{ display: 'inline', verticalAlign: '-2.5px', marginRight: 6 }} />
            Carrières & Pédagogie
          </span>
          <h1>Formations d'excellence, stages & carrières</h1>
          <p className="subtitle">
            Développez vos compétences agronomiques au cœur des exploitations {siteName}, explorez nos opportunités
            professionnelles et rejoignez une équipe d'experts dédiée à la performance agricole.
          </p>

          {/* Floating Pill Badges */}
          <div className="hero-fluid-pills">
            <div className="hero-pill">
              <span className="hero-pill-dot" style={{ background: '#14b8a6' }} />
              <span>Formations pratiques certifiantes</span>
            </div>
            <div className="hero-pill">
              <span className="hero-pill-dot" style={{ background: '#3b82f6' }} />
              <span>Postes & Recrutements actifs</span>
            </div>
            <div className="hero-pill">
              <span className="hero-pill-dot" style={{ background: '#f59e0b' }} />
              <span>Stages terrain & immersion</span>
            </div>
            <div className="hero-pill">
              <span className="hero-pill-dot" style={{ background: '#22c55e' }} />
              <span>100% Accompagnement terrain</span>
            </div>
          </div>
        </div>

        {/* Fluid wave divider */}
        <div className="hero-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
            <path
              d="M0,40 C320,80 480,0 720,40 C960,80 1120,10 1440,40 L1440,80 L0,80 Z"
              fill="var(--surface)"
            />
          </svg>
        </div>
      </section>

      {/* ═══ 2. Highlights / Value Proposition ═══ */}
      <section className="careers-highlights-section">
        <div className="careers-highlights-grid">
          {HIGHLIGHTS.map((item, i) => {
            const HIcon = item.icon
            return (
              <Reveal as="div" className="careers-highlight-card" key={item.title} delay={i * 70}>
                <div className="careers-highlight-icon" style={{ background: item.bg, color: item.color }}>
                  <HIcon width={22} height={22} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* ═══ 3. Category Filter Switcher & Search ═══ */}
      <section className="careers-filters-section">
        <div className="careers-filters-header">
          <h2 className="section-title">Nos opportunités actuelles</h2>
          <p className="section-subtitle">Filtrez ou recherchez les offres selon vos objectifs professionnels</p>
        </div>

        {/* Search bar */}
        <div className="careers-search-wrap">
          <div className="careers-search-box">
            <IconSearch width={16} height={16} className="careers-search-icon" />
            <input
              type="text"
              placeholder="Rechercher une formation, un poste, un lieu (ex: pisciculture, gestion, Bamako...)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="careers-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Effacer la recherche"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="careers-filters">
          {CATEGORIES.map((cat) => {
            const CatIcon = CATEGORY_ICONS[cat.value] || IconSparkles
            const activeColor = CATEGORY_COLORS[cat.value] || 'var(--accent)'
            const isActive = filter === cat.value
            const count =
              cat.value === ''
                ? offres.length
                : offres.filter((o) => o.categorie === cat.value).length

            return (
              <button
                key={cat.value}
                type="button"
                className={`careers-filter ${isActive ? 'active' : ''}`}
                style={isActive ? { '--filter-color': activeColor } : {}}
                onClick={() => setFilter(cat.value)}
              >
                <CatIcon width={14} height={14} />
                <span>{cat.label}</span>
                <span className="careers-filter-count">{count}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* ═══ 4. Offers Grid ═══ */}
      <section className="careers-offers-section">
        {loading ? (
          <div className="careers-loading-wrap">
            <div className="careers-skeleton-pulse" />
            <p className="careers-empty">Chargement des opportunités en cours...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="careers-empty-card">
            <div className="careers-empty-icon">🌱</div>
            <h3>Aucune offre dans cette catégorie</h3>
            <p>
              Il n’y a pas d’offre active dans cette catégorie pour l’instant. N’hésitez pas à nous transmettre une
              candidature spontanée ci-dessous.
            </p>
            <button type="button" className="btn-secondary" onClick={() => setFilter('')}>
              Voir toutes les offres
            </button>
          </div>
        ) : (
          <div className="careers-grid">
            {filtered.map((offre, i) => {
              const catColor = CATEGORY_COLORS[offre.categorie] || '#14b8a6'
              const CatIcon = CATEGORY_ICONS[offre.categorie] || IconGraduationCap
              return (
                <Reveal as="div" className="careers-card" key={offre.id} delay={i * 60}>
                  <div className="careers-card-top">
                    <span
                      className="careers-badge"
                      style={{
                        background: `${catColor}18`,
                        color: catColor,
                        borderColor: `${catColor}35`,
                      }}
                    >
                      <CatIcon width={12} height={12} />
                      <span>{CATEGORIES.find((c) => c.value === offre.categorie)?.label || offre.categorie}</span>
                    </span>
                    <span className="careers-card-status">
                      <span className="careers-status-dot" style={{ background: catColor }} />
                      Ouvert
                    </span>
                  </div>

                  <h3>{offre.titre}</h3>

                  {offre.lieu && (
                    <p className="careers-card-lieu">
                      <IconMapPin width={14} height={14} />
                      <span>{offre.lieu}</span>
                    </p>
                  )}

                  <p className="careers-card-desc">{offre.description}</p>

                  <div className="careers-card-footer">
                    <button
                      type="button"
                      className="btn-primary careers-card-btn"
                      style={{ '--btn-glow-color': catColor }}
                      onClick={() => postulerA(offre.id, offre.titre)}
                    >
                      <span>Postuler</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </Reveal>
              )
            })}
          </div>
        )}
      </section>

      {/* ═══ 5. Application Form Section ═══ */}
      <section id="candidature-form" className="contact-form-section careers-form-section">
        <h2 className="section-title">Envoyer votre candidature</h2>
        <p className="section-subtitle">
          Sélectionnez une formation ou une offre d’emploi et transmettez-nous vos motivations.
        </p>

        {selectedOffreTitle && (
          <div className="candidature-selected-banner">
            <div className="candidature-selected-left">
              <span className="candidature-selected-tag">Offre sélectionnée</span>
              <strong className="candidature-selected-title">{selectedOffreTitle}</strong>
            </div>
            <button
              type="button"
              className="candidature-change-btn"
              onClick={() => {
                updateField('offre', '')
                setSelectedOffreTitle('')
              }}
            >
              Changer
            </button>
          </div>
        )}

        {status === 'success' ? (
          <div className="contact-form-success careers-success-card">
            <div className="careers-success-icon">✓</div>
            <h3>Candidature enregistrée avec succès !</h3>
            <p>
              Merci, nous avons bien reçu votre candidature. Notre équipe pédagogique et RH étudiera votre dossier
              et vous contactera très rapidement.
            </p>
            <button type="button" className="btn-secondary" onClick={() => setStatus('idle')}>
              Envoyer une autre candidature
            </button>
          </div>
        ) : (
          <form className="contact-form careers-form" onSubmit={handleSubmit}>
            {error && <div className="alert-error">{error}</div>}

            <label>
              <span className="field-label-text">
                Offre ou formation concernée <span className="req-star">*</span>
              </span>
              <select value={form.offre} onChange={handleSelectOffre} required>
                <option value="">-- Sélectionnez une offre ou formation --</option>
                {offres.map((o) => (
                  <option key={o.id} value={o.id}>
                    [{CATEGORIES.find((c) => c.value === o.categorie)?.label || o.categorie}] {o.titre}
                  </option>
                ))}
              </select>
            </label>

            <div className="contact-form-row">
              <label>
                <span className="field-label-text">
                  Nom complet <span className="req-star">*</span>
                </span>
                <input
                  placeholder="Ex: Moussa Sacko"
                  value={form.nom}
                  onChange={(e) => updateField('nom', e.target.value)}
                  required
                />
              </label>

              <label>
                <span className="field-label-text">
                  Adresse email <span className="req-star">*</span>
                </span>
                <input
                  type="email"
                  placeholder="Ex: contact@example.com"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  required
                />
              </label>
            </div>

            <label>
              <span className="field-label-text">Numéro de téléphone (optionnel)</span>
              <input
                placeholder="Ex: +223 70 00 00 00"
                value={form.telephone}
                onChange={(e) => updateField('telephone', e.target.value)}
              />
            </label>

            <label>
              <span className="field-label-text">
                Message & motivations <span className="req-star">*</span>
              </span>
              <textarea
                placeholder="Présentez votre parcours, vos objectifs ou vos motivations pour cette formation ou ce poste..."
                value={form.message}
                onChange={(e) => updateField('message', e.target.value)}
                required
                rows={5}
              />
            </label>

            <label>
              <span className="field-label-text">CV (optionnel, PDF ou Word, 5 Mo max)</span>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} className="cv-input" />
              {cv && <span className="cv-selected-name">{cv.name}</span>}
            </label>

            <button
              type="submit"
              className="btn-primary btn-large btn-glow careers-submit-btn"
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? (
                <>
                  <span className="btn-spinner" />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <span>Soumettre ma candidature</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </>
              )}
            </button>
          </form>
        )}
      </section>

      <PublicFooter />
    </div>
  )
}
