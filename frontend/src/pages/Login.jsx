import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import {
  IconAnimal,
  IconCoins,
  IconEye,
  IconEyeOff,
  IconFish,
  IconLeaf,
  IconLock,
  IconShield,
  IconSparkles,
  IconUserCheck,
  LogoMark,
} from '../components/icons'
import { useAuth } from '../context/AuthContext'
import { useSiteSettings } from '../context/SiteSettingsContext'

export default function Login() {
  const { user, login } = useAuth()
  const { settings } = useSiteSettings()
  const navigate = useNavigate()
  const location = useLocation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    return <Navigate to={location.state?.from ?? '/dashboard'} replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(username, password, remember)
      navigate(location.state?.from ?? '/dashboard', { replace: true })
    } catch {
      setError('Identifiants incorrects. Vérifiez votre nom d’utilisateur et votre mot de passe.')
    } finally {
      setSubmitting(false)
    }
  }

  function fillDemoCredentials() {
    setUsername('admin')
    setPassword('admin')
    setError('')
  }

  return (
    <div className="premium-login-page">
      {/* Background ambient lighting effects */}
      <div className="login-ambient-glow glow-1" />
      <div className="login-ambient-glow glow-2" />

      {/* ═════════════════════════════════════════════════════
          LEFT HERO VISUAL SHOWCASE
      ═════════════════════════════════════════════════════ */}
      <aside className="premium-login-brand">
        <div className="brand-panel-inner">
          {/* Top Brand Logo */}
          <Link to="/" className="brand-logo-wrap">
            {settings?.logo_url ? (
              <img
                src={settings.logo_url}
                alt={settings.nom_application || 'Logo'}
                className="brand-custom-logo login-logo-large"
              />
            ) : (
              <LogoMark className="brand-mark login-logo-large" />
            )}
            <div className="brand-logo-text">
              <span className="brand-name">{settings?.nom_application || 'CPAM'}</span>
              <span className="brand-tagline">Système de Gestion Intégrée</span>
            </div>
          </Link>

          {/* Core Pitch */}
          <div className="login-pitch">
            <div className="login-pill-badge">
              <IconSparkles width={13} height={13} />
              <span>Plateforme Professionnelle Multi-ressources</span>
            </div>
            <h1 className="login-hero-headline">
              Pilotez l’ensemble de votre exploitation avec précision et sérénité.
            </h1>
            <p className="login-hero-sub">
              {settings?.description ||
                'Unifiez vos campagnes agricoles, la santé de vos cheptels, les bassins piscicoles et la rentabilité financière en temps réel.'}
            </p>
          </div>

          {/* Interactive Feature Pills */}
          <div className="login-feature-cards">
            <div className="login-feat-item">
              <div className="feat-icon-wrap" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}>
                <IconLeaf width={18} height={18} />
              </div>
              <div>
                <div className="feat-item-title">Agriculture & Sols</div>
                <div className="feat-item-sub">Suivi des cycles culturaux, parcelles et rendements</div>
              </div>
            </div>

            <div className="login-feat-item">
              <div className="feat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                <IconAnimal width={18} height={18} />
              </div>
              <div>
                <div className="feat-item-title">Cheptels & Traçabilité</div>
                <div className="feat-item-sub">Historique sanitaire complet et gestion du troupeau</div>
              </div>
            </div>

            <div className="login-feat-item">
              <div className="feat-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                <IconFish width={18} height={18} />
              </div>
              <div>
                <div className="feat-item-title">Pisciculture & Eau</div>
                <div className="feat-item-sub">Surveillance rigoureuse des bassins et des intrants</div>
              </div>
            </div>

            <div className="login-feat-item">
              <div className="feat-icon-wrap" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
                <IconCoins width={18} height={18} />
              </div>
              <div>
                <div className="feat-item-title">Comptabilité & Bilan</div>
                <div className="feat-item-sub">Recettes, dépenses et rentabilité par ferme</div>
              </div>
            </div>
          </div>

          {/* Bottom Trust & Operational status */}
          <div className="login-brand-footer">
            <div className="status-live-indicator">
              <span className="live-pulse-dot" />
              <span>Système opérationnel • SSL 256-bit</span>
            </div>
            <div className="brand-footer-links">
              <Link to="/apropos">À propos</Link>
              <span>•</span>
              <Link to="/contact">Support & Contact</Link>
            </div>
          </div>
        </div>
      </aside>

      {/* ═════════════════════════════════════════════════════
          RIGHT FORM PANEL (PREMIUM GLASSMORPHISM)
      ═════════════════════════════════════════════════════ */}
      <main className="premium-login-form-panel">
        <div className="login-card-container">
          {/* Card Frame */}
          <form className="premium-login-card" onSubmit={handleSubmit}>
            {/* Form Header */}
            <div className="login-card-header">
              <div className="login-secure-badge">
                <IconLock width={13} height={13} />
                <span>Portail d’accès sécurisé</span>
              </div>
              <h2 className="login-card-title">Bienvenue sur votre espace</h2>
              <p className="login-card-subtitle">
                Connectez-vous pour accéder à votre console de gestion et vos statistiques.
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="login-error-alert" role="alert">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Input: Username */}
            <div className="login-field-group">
              <label className="login-field-label" htmlFor="login_username">
                Nom d’utilisateur
              </label>
              <div className="login-input-wrapper">
                <span className="input-icon">
                  <IconUserCheck width={17} height={17} />
                </span>
                <input
                  id="login_username"
                  type="text"
                  className="login-input"
                  placeholder="Ex: admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Input: Password */}
            <div className="login-field-group">
              <div className="login-label-row">
                <label className="login-field-label" htmlFor="login_password">
                  Mot de passe
                </label>
              </div>
              <div className="login-input-wrapper">
                <span className="input-icon">
                  <IconLock width={17} height={17} />
                </span>
                <input
                  id="login_password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input password-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="btn-toggle-eye"
                  onClick={() => setShowPassword((prev) => !prev)}
                  title={showPassword ? 'Masquer' : 'Afficher'}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <IconEyeOff width={17} height={17} /> : <IconEye width={17} height={17} />}
                </button>
              </div>
            </div>

            {/* Remember me option */}
            <div className="login-options-row">
              <label className="remember-checkbox-label">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Maintenir ma session active</span>
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-login-submit" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="btn-spinner" />
                  Vérification en cours...
                </>
              ) : (
                <>
                  <span>Accéder au tableau de bord</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="16" height="16">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>

            {/* Demo Shortcut Helper Pill */}
            <div className="login-demo-helper">
              <span className="helper-label">Besoin de tester ?</span>
              <button type="button" className="btn-fill-demo" onClick={fillDemoCredentials}>
                ⚡ Remplir avec <strong>admin / admin</strong>
              </button>
            </div>

            {/* Security Guarantee & Return */}
            <div className="login-card-footer">
              <div className="login-guarantee">
                <IconShield width={13} height={13} />
                <span>Protection des données agricoles • Chiffrement SHA-256</span>
              </div>
              <Link to="/" className="btn-return-home">
                ← Retourner au site vitrine
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
