import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import client from '../api/client'
import { RESOURCES } from '../config/resources'
import { IconSearch, IconX } from '../components/icons'

function emptyFormState(fields) {
  const state = {}
  for (const field of fields) {
    state[field.name] = field.type === 'checkbox' ? false : ''
  }
  return state
}

function itemToFormState(fields, item) {
  const state = {}
  for (const field of fields) {
    const value = item[field.name]
    if (field.type === 'checkbox') {
      state[field.name] = Boolean(value)
    } else {
      state[field.name] = value ?? ''
    }
  }
  return state
}

export default function ResourcePage() {
  const { resourceKey } = useParams()
  const resource = RESOURCES[resourceKey]

  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [pageUrl, setPageUrl] = useState(null)
  const [nextUrl, setNextUrl] = useState(null)
  const [prevUrl, setPrevUrl] = useState(null)
  const [relationOptions, setRelationOptions] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form, setForm] = useState(() => emptyFormState(resource.fields))
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const relationFields = useMemo(() => resource.fields.filter((f) => f.type === 'relation'), [resource])

  useEffect(() => {
    setForm(emptyFormState(resource.fields))
    setShowForm(false)
    setEditingItem(null)
    setPageUrl(null)
    setSearchTerm('')
  }, [resourceKey])

  // Real-time table filter based on search term across all columns
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items
    const term = searchTerm.toLowerCase().trim()
    return items.filter((item) =>
      resource.columns.some((col) => {
        const val = item[col.key]
        if (val === null || val === undefined) return false
        return String(val).toLowerCase().includes(term)
      })
    )
  }, [items, searchTerm, resource.columns])

  useEffect(() => {
    let cancelled = false

    async function loadList() {
      setLoading(true)
      setError('')
      try {
        const { data } = pageUrl
          ? await client.get(pageUrl)
          : await client.get(resource.endpoint)
        if (cancelled) return
        setItems(data.results ?? data)
        setCount(data.count ?? (data.results ?? data).length)
        setNextUrl(data.next ?? null)
        setPrevUrl(data.previous ?? null)
      } catch {
        if (!cancelled) setError('Impossible de charger les données.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadList()
    return () => {
      cancelled = true
    }
  }, [resourceKey, pageUrl])

  useEffect(() => {
    let cancelled = false

    async function loadRelations() {
      const entries = await Promise.all(
        relationFields.map(async (field) => {
          const relatedResource = RESOURCES[field.resource]
          try {
            const { data } = await client.get(relatedResource.endpoint, { params: { page_size: 1000 } })
            const results = data.results ?? data
            return [field.name, results.map((item) => ({ id: item.id, label: relatedResource.itemLabel(item) }))]
          } catch {
            return [field.name, []]
          }
        }),
      )
      if (!cancelled) {
        setRelationOptions(Object.fromEntries(entries))
      }
    }

    if (relationFields.length > 0) {
      loadRelations()
    } else {
      setRelationOptions({})
    }
    return () => {
      cancelled = true
    }
  }, [resourceKey, relationFields])

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function startCreate() {
    if (showForm && !editingItem) {
      setShowForm(false)
      return
    }
    setEditingItem(null)
    setForm(emptyFormState(resource.fields))
    setShowForm(true)
  }

  function startEdit(item) {
    setEditingItem(item)
    setForm(itemToFormState(resource.fields, item))
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditingItem(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const payload = {}
      for (const field of resource.fields) {
        const value = form[field.name]
        if (value === '' && !field.required) continue
        payload[field.name] = value
      }
      if (editingItem) {
        const { data } = await client.patch(`${resource.endpoint}${editingItem.id}/`, payload)
        setItems((prev) => prev.map((item) => (item.id === editingItem.id ? data : item)))
      } else {
        await client.post(resource.endpoint, payload)
        setPageUrl(null)
      }
      setForm(emptyFormState(resource.fields))
      setShowForm(false)
      setEditingItem(null)
    } catch (err) {
      const detail = err.response?.data
      setError(detail ? JSON.stringify(detail) : "Échec de l'enregistrement.")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Supprimer cet élément ?')) return
    try {
      await client.delete(`${resource.endpoint}${id}/`)
      setItems((prev) => prev.filter((item) => item.id !== id))
      setCount((prev) => prev - 1)
      if (editingItem?.id === id) cancelForm()
    } catch {
      setError('Suppression impossible.')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>{resource.label}</h1>
        <button type="button" className="btn-primary" onClick={startCreate}>
          {showForm && !editingItem ? 'Annuler' : 'Ajouter'}
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {showForm && (
        <form className="resource-form" onSubmit={handleSubmit}>
          {resource.fields.map((field) => (
            <label key={field.name}>
              {field.label}
              {field.type === 'relation' ? (
                <select
                  value={form[field.name]}
                  required={field.required}
                  onChange={(e) => updateField(field.name, e.target.value)}
                >
                  <option value="">-- Sélectionner --</option>
                  {(relationOptions[field.name] ?? []).map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'select' ? (
                <select
                  value={form[field.name]}
                  required={field.required}
                  onChange={(e) => updateField(field.name, e.target.value)}
                >
                  <option value="">-- Sélectionner --</option>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={form[field.name]}
                  required={field.required}
                  onChange={(e) => updateField(field.name, e.target.value)}
                />
              ) : field.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  checked={form[field.name]}
                  onChange={(e) => updateField(field.name, e.target.checked)}
                />
              ) : (
                <input
                  type={field.type}
                  step={field.step}
                  value={form[field.name]}
                  required={field.required}
                  onChange={(e) => updateField(field.name, e.target.value)}
                />
              )}
            </label>
          ))}
          <div className="resource-form-actions">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Enregistrement...' : editingItem ? 'Enregistrer les modifications' : 'Enregistrer'}
            </button>
            {editingItem && (
              <button type="button" className="btn-secondary" onClick={cancelForm}>
                Annuler
              </button>
            )}
          </div>
        </form>
      )}

      {/* Search Toolbar */}
      {!loading && items.length > 0 && (
        <div className="resource-search-toolbar">
          <div className="resource-search-box">
            <IconSearch width={16} height={16} className="resource-search-icon" />
            <input
              type="text"
              placeholder={`Rechercher dans les ${resource.label.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="resource-search-clear"
                onClick={() => setSearchTerm('')}
                aria-label="Effacer la recherche"
              >
                <IconX width={14} height={14} />
              </button>
            )}
          </div>
          {searchTerm && (
            <span className="resource-search-badge">
              {filteredItems.length} résultat{filteredItems.length > 1 ? 's' : ''} sur {items.length}
            </span>
          )}
        </div>
      )}

      {loading ? (
        <p className="page-loading-inline">Chargement des données...</p>
      ) : items.length === 0 ? (
        <p className="resource-empty-text">Aucune donnée pour le moment.</p>
      ) : filteredItems.length === 0 ? (
        <div className="resource-empty-search">
          <p>Aucun résultat ne correspond à votre recherche "{searchTerm}".</p>
          <button type="button" className="btn-secondary" onClick={() => setSearchTerm('')}>
            Réinitialiser la recherche
          </button>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {resource.columns.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className={editingItem?.id === item.id ? 'row-editing' : ''}>
                    {resource.columns.map((col) => (
                      <td key={col.key}>{formatValue(item[col.key], col, resource)}</td>
                    ))}
                    <td className="row-actions">
                      <button type="button" className="btn-edit" onClick={() => startEdit(item)}>
                        Modifier
                      </button>
                      <button type="button" className="btn-danger" onClick={() => handleDelete(item.id)}>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <span>{searchTerm ? `${filteredItems.length} affiché(s)` : `${count} élément(s)`}</span>
            <div>
              <button type="button" disabled={!prevUrl || Boolean(searchTerm)} onClick={() => setPageUrl(prevUrl)}>
                Précédent
              </button>
              <button type="button" disabled={!nextUrl || Boolean(searchTerm)} onClick={() => setPageUrl(nextUrl)}>
                Suivant
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function formatValue(value, column, resource) {
  if (column?.key === 'cv') {
    return value ? (
      <a href={value} target="_blank" rel="noreferrer" className="cv-link">
        Voir le CV
      </a>
    ) : (
      '—'
    )
  }
  const field = resource?.fields.find((f) => f.name === column?.key)
  if (field?.type === 'select') {
    const opt = field.options.find((o) => o.value === value)
    if (opt) return opt.label
  }
  if (typeof value === 'boolean') return value ? 'Oui' : 'Non'
  if (value === null || value === undefined || value === '') return '—'
  return value
}
