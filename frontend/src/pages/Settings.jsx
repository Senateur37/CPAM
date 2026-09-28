import { useEffect, useState } from 'react'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useSiteSettings } from '../context/SiteSettingsContext'
import {
  IconBuilding,
  IconEdit,
  IconKey,
  IconLeaf,
  IconSettings,
  IconShield,
  IconTrash,
  IconUserPlus,
  IconUsers,
  LogoMark,
} from '../components/icons'

export default function Settings() {
  const { user: currentUser } = useAuth()
  const { settings, updateSettings } = useSiteSettings()

  const [activeTab, setActiveTab] = useState('app') // 'app' | 'users'

  // ── App Settings State ──
  const [appForm, setAppForm] = useState({
    nom_application: '',
    slogan: '',
    description: '',
    logo_url: '',
    email_contact: '',
    telephone: '',
    adresse: '',
    devise: 'FCFA',
    site_web: '',
    facebook: '',
    linkedin: '',
    whatsapp: '',
  })
  const [savingApp, setSavingApp] = useState(false)
  const [appSuccess, setAppSuccess] = useState('')
  const [appError, setAppError] = useState('')

  useEffect(() => {
    if (settings) {
      setAppForm({
        nom_application: settings.nom_application || 'CPAM',
        slogan: settings.slogan || '',
        description: settings.description || '',
        logo_url: settings.logo_url || '',
        email_contact: settings.email_contact || '',
        telephone: settings.telephone || '',
        adresse: settings.adresse || '',
        devise: settings.devise || 'FCFA',
        site_web: settings.site_web || '',
        facebook: settings.facebook || '',
        linkedin: settings.linkedin || '',
        whatsapp: settings.whatsapp || '',
      })
    }
  }, [settings])

  // Handle Logo Upload (convert file to data URL)
  function handleLogoFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setAppError("L'image ne doit pas dépasser 2 Mo.")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setAppForm((prev) => ({ ...prev, logo_url: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  async function handleSaveApp(e) {
    e.preventDefault()
    setSavingApp(true)
    setAppSuccess('')
    setAppError('')
    try {
      await updateSettings(appForm)
      setAppSuccess('Paramètres de l’application enregistrés avec succès !')
      setTimeout(() => setAppSuccess(''), 4000)
    } catch (err) {
      setAppError(err.response?.data?.detail || 'Erreur lors de la sauvegarde des paramètres.')
    } finally {
      setSavingApp(false)
    }
  }

  // ── User Management State ──
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [userSearch, setUserSearch] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('all')
  const [userStatusFilter, setUserStatusFilter] = useState('all')

  // Modal User Edit / Create
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [userFormData, setUserFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'exploitant',
    telephone: '',
    password: '',
    is_active: true,
  })
  const [userFormError, setUserFormError] = useState('')
  const [savingUser, setSavingUser] = useState(false)

  // Delete Confirmation Modal
  const [userToDelete, setUserToDelete] = useState(null)
  const [deletingUser, setDeletingUser] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  async function fetchUsers() {
    setLoadingUsers(true)
    try {
      const { data } = await client.get('/utilisateurs/users/')
      setUsers(Array.isArray(data) ? data : data.results || [])
    } catch (err) {
      console.error('Erreur chargement utilisateurs:', err)
    } finally {
      setLoadingUsers(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers()
    }
  }, [activeTab])

  function openCreateUserModal() {
    setEditingUser(null)
    setUserFormData({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      role: 'exploitant',
      telephone: '',
      password: '',
      is_active: true,
    })
    setUserFormError('')
    setUserModalOpen(true)
  }

  function openEditUserModal(u) {
    setEditingUser(u)
    setUserFormData({
      username: u.username,
      email: u.email || '',
      first_name: u.first_name || '',
      last_name: u.last_name || '',
      role: u.role || 'exploitant',
      telephone: u.telephone || '',
      password: '',
      is_active: u.is_active ?? true,
    })
    setUserFormError('')
    setUserModalOpen(true)
  }

  async function handleSaveUser(e) {
    e.preventDefault()
    setSavingUser(true)
    setUserFormError('')

    const payload = { ...userFormData }
    if (editingUser && !payload.password) {
      delete payload.password
    }

    try {
      if (editingUser) {
        await client.put(`/utilisateurs/users/${editingUser.id}/`, payload)
      } else {
        await client.post('/utilisateurs/users/', payload)
      }
      setUserModalOpen(false)
      fetchUsers()
    } catch (err) {
      const resp = err.response?.data
      if (resp && typeof resp === 'object') {
        const msg = Object.entries(resp)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' ') : v}`)
          .join(' | ')
        setUserFormError(msg || 'Erreur lors de l’enregistrement de l’utilisateur.')
      } else {
        setUserFormError('Une erreur est survenue.')
      }
    } finally {
      setSavingUser(false)
    }
  }

  async function handleDeleteUser() {
    if (!userToDelete) return
    setDeletingUser(true)
    setDeleteError('')
    try {
      await client.delete(`/utilisateurs/users/${userToDelete.id}/`)
      setUserToDelete(null)
      fetchUsers()
    } catch (err) {
      setDeleteError(err.response?.data?.detail || 'Erreur lors de la suppression.')
    } finally {
      setDeletingUser(false)
    }
  }

  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase()
    const matchesQuery =
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.first_name?.toLowerCase().includes(q) ||
      u.last_name?.toLowerCase().includes(q) ||
      u.telephone?.toLowerCase().includes(q)

    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter
    const matchesStatus =
      userStatusFilter === 'all' ||
      (userStatusFilter === 'active' && u.is_active) ||
      (userStatusFilter === 'inactive' && !u.is_active)

    return matchesQuery && matchesRole && matchesStatus
  })

  return (
    <div className="settings-page">
      {/* ── Page Header ── */}
      <div className="settings-header">
        <div>
          <h1 className="settings-title">Paramètres & Administration</h1>
          <p className="settings-subtitle">
            Configurez l’identité de l’application, le logo, les informations du site et gérez les comptes d’utilisateurs.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="settings-tabs">
          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'app' ? 'active' : ''}`}
            onClick={() => setActiveTab('app')}
          >
            <IconBuilding width={17} height={17} />
            <span>Application & Site</span>
          </button>
          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <IconUsers width={17} height={17} />
            <span>Gestion Utilisateurs</span>
            {users.length > 0 && <span className="tab-badge">{users.length}</span>}
          </button>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════
          TAB 1 : APPLICATION & SITE SETTINGS
      ═════════════════════════════════════════════════════ */}
      {activeTab === 'app' && (
        <form onSubmit={handleSaveApp} className="settings-content-wrap">
          {appSuccess && (
            <div className="settings-alert success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{appSuccess}</span>
            </div>
          )}

          {appError && (
            <div className="settings-alert error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{appError}</span>
            </div>
          )}

          <div className="settings-grid">
            {/* Card 1: Identité & Logo */}
            <div className="settings-card">
              <div className="settings-card-head">
                <div className="settings-card-icon" style={{ background: 'rgba(34, 197, 94, 0.12)', color: '#22c55e' }}>
                  <IconLeaf width={20} height={20} />
                </div>
                <div>
                  <h3 className="settings-card-title">Identité visuelle & Marque</h3>
                  <p className="settings-card-desc">Nom du projet, slogan et logo affichés sur le site et l’application</p>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="nom_application">Nom de l'application / entreprise</label>
                <input
                  id="nom_application"
                  type="text"
                  className="form-input"
                  required
                  placeholder="Ex: CPAM"
                  value={appForm.nom_application}
                  onChange={(e) => setAppForm({ ...appForm, nom_application: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="slogan">Slogan ou sous-titre</label>
                <input
                  id="slogan"
                  type="text"
                  className="form-input"
                  placeholder="Ex: Centre de Production Agricole et Multi-ressources"
                  value={appForm.slogan}
                  onChange={(e) => setAppForm({ ...appForm, slogan: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="description">Présentation générale du projet</label>
                <textarea
                  id="description"
                  rows={3}
                  className="form-input"
                  placeholder="Description succincte de votre exploitation..."
                  value={appForm.description}
                  onChange={(e) => setAppForm({ ...appForm, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Logo personnalisé</label>
                <div className="logo-preview-box">
                  <div className="logo-preview-display">
                    {appForm.logo_url ? (
                      <img src={appForm.logo_url} alt="Logo Preview" className="logo-preview-img" />
                    ) : (
                      <div className="logo-preview-placeholder">
                        <LogoMark className="brand-mark" style={{ width: 44, height: 44 }} />
                        <span className="logo-placeholder-text">Logo par défaut (CPAM)</span>
                      </div>
                    )}
                  </div>
                  <div className="logo-preview-actions">
                    <label className="btn-file-upload">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      Choisir une image...
                      <input type="file" accept="image/*" onChange={handleLogoFile} style={{ display: 'none' }} />
                    </label>
                    {appForm.logo_url && (
                      <button
                        type="button"
                        className="btn-danger-outline btn-sm"
                        onClick={() => setAppForm({ ...appForm, logo_url: '' })}
                      >
                        Réinitialiser au logo par défaut
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ marginTop: 8 }}>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="Ou collez directement une URL d'image (ex: https://...)"
                    value={appForm.logo_url.startsWith('data:') ? '' : appForm.logo_url}
                    onChange={(e) => setAppForm({ ...appForm, logo_url: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Contact & Coordonnées */}
            <div className="settings-card">
              <div className="settings-card-head">
                <div className="settings-card-icon" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
                  <IconSettings width={20} height={20} />
                </div>
                <div>
                  <h3 className="settings-card-title">Coordonnées & Préférences</h3>
                  <p className="settings-card-desc">Informations de contact et monnaie de référence</p>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="email_contact">Email de contact</label>
                  <input
                    id="email_contact"
                    type="email"
                    className="form-input"
                    placeholder="contact@cpam.com"
                    value={appForm.email_contact}
                    onChange={(e) => setAppForm({ ...appForm, email_contact: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="telephone">Téléphone</label>
                  <input
                    id="telephone"
                    type="text"
                    className="form-input"
                    placeholder="+223 70 00 00 00"
                    value={appForm.telephone}
                    onChange={(e) => setAppForm({ ...appForm, telephone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="adresse">Adresse / Localisation</label>
                  <input
                    id="adresse"
                    type="text"
                    className="form-input"
                    placeholder="Bamako, Mali"
                    value={appForm.adresse}
                    onChange={(e) => setAppForm({ ...appForm, adresse: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="devise">Devise monétaire par défaut</label>
                  <input
                    id="devise"
                    type="text"
                    className="form-input"
                    placeholder="Ex: FCFA, EUR, USD"
                    value={appForm.devise}
                    onChange={(e) => setAppForm({ ...appForm, devise: e.target.value })}
                  />
                </div>
              </div>

              <div className="sidebar-divider" style={{ margin: '14px 0' }} />

              <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-subtle)', marginBottom: 12 }}>
                Réseaux & Liens externes (optionnels)
              </h4>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="site_web">Site Web</label>
                  <input
                    id="site_web"
                    type="url"
                    className="form-input"
                    placeholder="https://monsite.com"
                    value={appForm.site_web}
                    onChange={(e) => setAppForm({ ...appForm, site_web: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="whatsapp">WhatsApp</label>
                  <input
                    id="whatsapp"
                    type="text"
                    className="form-input"
                    placeholder="+223 70 00 00 00"
                    value={appForm.whatsapp}
                    onChange={(e) => setAppForm({ ...appForm, whatsapp: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="facebook">Facebook</label>
                  <input
                    id="facebook"
                    type="text"
                    className="form-input"
                    placeholder="Lien ou page Facebook"
                    value={appForm.facebook}
                    onChange={(e) => setAppForm({ ...appForm, facebook: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="linkedin">LinkedIn</label>
                  <input
                    id="linkedin"
                    type="text"
                    className="form-input"
                    placeholder="Lien ou page LinkedIn"
                    value={appForm.linkedin}
                    onChange={(e) => setAppForm({ ...appForm, linkedin: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Save Bar */}
          <div className="settings-footer-bar">
            <span className="settings-footer-info">
              Dernière mise à jour : {settings.date_mise_a_jour ? new Date(settings.date_mise_a_jour).toLocaleString('fr-FR') : 'Non renseignée'}
            </span>
            <button type="submit" className="btn-save-settings" disabled={savingApp}>
              {savingApp ? (
                <>
                  <span className="btn-spinner" />
                  Sauvegarde en cours...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Enregistrer les paramètres
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ═════════════════════════════════════════════════════
          TAB 2 : GESTION DES UTILISATEURS
      ═════════════════════════════════════════════════════ */}
      {activeTab === 'users' && (
        <div className="settings-users-wrap">
          {/* Actions toolbar */}
          <div className="users-toolbar">
            <div className="users-toolbar-left">
              <div className="users-search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher par nom, email, téléphone..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
                {userSearch && (
                  <button type="button" className="btn-clear-search" onClick={() => setUserSearch('')}>
                    ×
                  </button>
                )}
              </div>

              <select
                className="users-filter-select"
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
              >
                <option value="all">Tous les rôles</option>
                <option value="admin">Administrateurs</option>
                <option value="exploitant">Exploitants</option>
              </select>

              <select
                className="users-filter-select"
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
              </select>
            </div>

            <div className="users-toolbar-right">
              <button type="button" className="btn-add-user" onClick={openCreateUserModal}>
                <IconUserPlus width={17} height={17} />
                <span>Nouvel utilisateur</span>
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="users-table-container">
            {loadingUsers ? (
              <div className="users-loading-state">
                <span className="btn-spinner" style={{ width: 28, height: 28 }} />
                <span>Chargement des utilisateurs...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="users-empty-state">
                <IconUsers width={44} height={44} style={{ color: 'var(--text-subtle)', opacity: 0.5 }} />
                <h3>Aucun utilisateur trouvé</h3>
                <p>Aucun compte ne correspond à vos critères de recherche ou de filtre.</p>
                {users.length === 0 && (
                  <button type="button" className="btn-add-user" onClick={openCreateUserModal} style={{ marginTop: 12 }}>
                    <IconUserPlus width={16} height={16} />
                    Créer le premier utilisateur
                  </button>
                )}
              </div>
            ) : (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th>Date d'inscription</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => {
                    const isSelf = currentUser && (currentUser.id === u.id || currentUser.username === u.username)
                    const isAdmin = u.role === 'admin'
                    return (
                      <tr key={u.id} className={isSelf ? 'user-row-self' : ''}>
                        <td>
                          <div className="user-cell-profile">
                            <div className={`user-avatar ${isAdmin ? 'admin-avatar' : 'exploitant-avatar'}`}>
                              {u.username?.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="user-cell-name">
                                {u.username}
                                {isSelf && <span className="user-badge-self">Vous</span>}
                              </div>
                              {(u.first_name || u.last_name) && (
                                <div className="user-cell-fullname">
                                  {u.first_name} {u.last_name}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="user-cell-text">{u.email || '—'}</span>
                        </td>
                        <td>
                          <span className="user-cell-text">{u.telephone || '—'}</span>
                        </td>
                        <td>
                          <span className={`role-badge ${isAdmin ? 'role-admin' : 'role-exploitant'}`}>
                            {isAdmin ? <IconShield width={12} height={12} /> : <IconLeaf width={12} height={12} />}
                            {isAdmin ? 'Administrateur' : 'Exploitant'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${u.is_active ? 'status-active' : 'status-inactive'}`}>
                            <span className="status-dot" />
                            {u.is_active ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td>
                          <span className="user-cell-date">
                            {u.date_joined ? new Date(u.date_joined).toLocaleDateString('fr-FR') : '—'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="user-actions-btns">
                            <button
                              type="button"
                              className="btn-action-icon edit"
                              title="Modifier cet utilisateur"
                              onClick={() => openEditUserModal(u)}
                            >
                              <IconEdit width={15} height={15} />
                            </button>
                            <button
                              type="button"
                              className="btn-action-icon delete"
                              title={isSelf ? 'Vous ne pouvez pas supprimer votre propre compte' : 'Supprimer cet utilisateur'}
                              disabled={isSelf}
                              onClick={() => {
                                setUserToDelete(u)
                                setDeleteError('')
                              }}
                            >
                              <IconTrash width={15} height={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════
          MODAL : AJOUT / MODIFICATION D'UTILISATEUR
      ═════════════════════════════════════════════════════ */}
      {userModalOpen && (
        <div className="modal-backdrop" onClick={() => setUserModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="modal-icon-wrap">
                  {editingUser ? <IconEdit width={18} height={18} /> : <IconUserPlus width={18} height={18} />}
                </div>
                <div>
                  <h3 className="modal-title">
                    {editingUser ? `Modifier l'utilisateur : ${editingUser.username}` : 'Créer un nouvel utilisateur'}
                  </h3>
                  <p className="modal-subtitle">
                    {editingUser ? 'Mettez à jour le rôle, le statut ou réinitialisez le mot de passe' : 'Remplissez les informations du nouveau collaborateur'}
                  </p>
                </div>
              </div>
              <button type="button" className="btn-close-modal" onClick={() => setUserModalOpen(false)}>
                ×
              </button>
            </div>

            {userFormError && (
              <div className="settings-alert error" style={{ margin: '14px 20px 0' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{userFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveUser}>
              <div className="modal-body">
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="user_username">Nom d'utilisateur *</label>
                    <input
                      id="user_username"
                      type="text"
                      className="form-input"
                      required
                      placeholder="Ex: moussa.diallo"
                      value={userFormData.username}
                      onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="user_role">Rôle dans l'application *</label>
                    <select
                      id="user_role"
                      className="form-input"
                      value={userFormData.role}
                      onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                    >
                      <option value="exploitant">Exploitant (Accès exploitation)</option>
                      <option value="admin">Administrateur (Tous les droits)</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="user_first_name">Prénom</label>
                    <input
                      id="user_first_name"
                      type="text"
                      className="form-input"
                      placeholder="Ex: Moussa"
                      value={userFormData.first_name}
                      onChange={(e) => setUserFormData({ ...userFormData, first_name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="user_last_name">Nom</label>
                    <input
                      id="user_last_name"
                      type="text"
                      className="form-input"
                      placeholder="Ex: Diallo"
                      value={userFormData.last_name}
                      onChange={(e) => setUserFormData({ ...userFormData, last_name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="user_email">Adresse Email</label>
                    <input
                      id="user_email"
                      type="email"
                      className="form-input"
                      placeholder="moussa@cpam.com"
                      value={userFormData.email}
                      onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="user_telephone">Téléphone</label>
                    <input
                      id="user_telephone"
                      type="text"
                      className="form-input"
                      placeholder="+223 70 00 00 00"
                      value={userFormData.telephone}
                      onChange={(e) => setUserFormData({ ...userFormData, telephone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="user_password">
                    {editingUser ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe initial *'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="user_password"
                      type="password"
                      className="form-input"
                      required={!editingUser}
                      placeholder={editingUser ? '••••••••' : 'Min. 6 caractères'}
                      value={userFormData.password}
                      onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group-checkbox">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={userFormData.is_active}
                      onChange={(e) => setUserFormData({ ...userFormData, is_active: e.target.checked })}
                    />
                    <span>Compte utilisateur actif (peut se connecter au système)</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setUserModalOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-save-user" disabled={savingUser}>
                  {savingUser ? 'Enregistrement...' : editingUser ? 'Sauvegarder les modifications' : 'Créer l’utilisateur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════
          MODAL : CONFIRMATION DE SUPPRESSION
      ═════════════════════════════════════════════════════ */}
      {userToDelete && (
        <div className="modal-backdrop" onClick={() => setUserToDelete(null)}>
          <div className="modal-card modal-card-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="modal-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
                  <IconTrash width={18} height={18} />
                </div>
                <h3 className="modal-title">Supprimer l'utilisateur</h3>
              </div>
              <button type="button" className="btn-close-modal" onClick={() => setUserToDelete(null)}>
                ×
              </button>
            </div>

            {deleteError && (
              <div className="settings-alert error" style={{ margin: '14px 20px 0' }}>
                <span>{deleteError}</span>
              </div>
            )}

            <div className="modal-body">
              <p style={{ color: 'var(--text-subtle)', lineHeight: 1.5 }}>
                Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur{' '}
                <strong style={{ color: 'var(--text-main)' }}>@{userToDelete.username}</strong> ?
              </p>
              <p style={{ color: 'var(--text-subtle)', fontSize: 13, marginTop: 8 }}>
                Cette action supprimera également son profil associé. Cette opération est irréversible.
              </p>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={() => setUserToDelete(null)}>
                Annuler
              </button>
              <button
                type="button"
                className="btn-danger-confirm"
                onClick={handleDeleteUser}
                disabled={deletingUser}
              >
                {deletingUser ? 'Suppression...' : 'Supprimer définitivement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
