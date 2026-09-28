import { useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import PublicFooter from '../components/PublicFooter'
import PublicHeader from '../components/PublicHeader'
import { IconBuilding, IconMail, IconShield } from '../components/icons'
import { useSiteSettings } from '../context/SiteSettingsContext'

const EMPTY_FORM = { nom: '', email: '', sujet: '', message: '' }

export default function Contact() {
  const { settings } = useSiteSettings()
  const siteName = settings?.nom_application || 'CPAM'
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      await client.post('/contact/messages/', form)
      setForm(EMPTY_FORM)
      setStatus('success')
    } catch {
      setError("Une erreur est survenue. Vérifiez les champs et réessayez.")
      setStatus('error')
    }
  }

  return (
    <div className="home fluid-home">
      <PublicHeader />

      <section className="simple-hero fluid-simple-hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="simple-hero-inner">
          <span className="eyebrow">Nous contacter</span>
          <h1>Une question ? Notre équipe est à votre écoute</h1>
          <p className="subtitle">
            Pour toute demande d’information, partenariat ou demande d'identifiants d'accès à la plateforme {siteName},
            transmettez-nous un message directement.
          </p>
        </div>
      </section>

      <section className="contact-cards-section">
        <div className="contact-cards fluid-contact-cards">
          <div className="contact-card">
            <div className="icon-badge icon-badge-alt">
              <IconMail />
            </div>
            <h3>Demande d'accès interne</h3>
            <p>
              Les comptes collaborateurs sont configurés par l'administrateur {siteName}. Transmettez votre demande
              pour obtenir vos codes d'accès.
            </p>
          </div>

          <div className="contact-card">
            <div className="icon-badge icon-badge-alt">
              <IconBuilding />
            </div>
            <h3>Coordonnées directes</h3>
            <div className="contact-card-details">
              {settings?.telephone && <p><strong>Tél :</strong> {settings.telephone}</p>}
              {settings?.email_contact && <p><strong>Email :</strong> {settings.email_contact}</p>}
              {settings?.adresse && <p><strong>Siège :</strong> {settings.adresse}</p>}
            </div>
          </div>

          <div className="contact-card">
            <div className="icon-badge icon-badge-alt">
              <IconShield />
            </div>
            <h3>Collaborateur déjà inscrit ?</h3>
            <p>Accédez sans attendre à votre console de travail pour suivre les parcelles, bêtes et finances.</p>
            <Link to="/login" className="btn-primary" style={{ marginTop: 10 }}>
              Se connecter →
            </Link>
          </div>
        </div>
      </section>


      <section className="contact-form-section">
        <h2 className="section-title">Écrire à l'administrateur</h2>
        <p className="section-subtitle">Votre message sera transmis directement à l'équipe CPAM.</p>

        {status === 'success' ? (
          <div className="contact-form-success">
            <p>Merci, votre message a bien été envoyé. Nous reviendrons vers vous rapidement.</p>
            <button type="button" className="btn-secondary" onClick={() => setStatus('idle')}>
              Envoyer un autre message
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            {error && <div className="alert-error">{error}</div>}
            <div className="contact-form-row">
              <label>
                Nom
                <input
                  value={form.nom}
                  onChange={(e) => updateField('nom', e.target.value)}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  required
                />
              </label>
            </div>
            <label>
              Sujet
              <input
                value={form.sujet}
                onChange={(e) => updateField('sujet', e.target.value)}
                required
              />
            </label>
            <label>
              Message
              <textarea
                value={form.message}
                onChange={(e) => updateField('message', e.target.value)}
                required
                rows={5}
              />
            </label>
            <button type="submit" className="btn-primary" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Envoi...' : 'Envoyer le message'}
            </button>
          </form>
        )}
      </section>

      <PublicFooter />
    </div>
  )
}
