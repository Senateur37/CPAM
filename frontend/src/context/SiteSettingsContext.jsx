import { createContext, useContext, useEffect, useState } from 'react'
import client from '../api/client'

const DEFAULT_SETTINGS = {
  nom_application: 'CPAM',
  slogan: 'Centre de Production Agricole et Multi-ressources',
  description: "Plateforme intégrée de gestion agricole, d'élevage et de pisciculture.",
  logo_url: '',
  email_contact: 'contact@cpam.com',
  telephone: '+223 70 00 00 00',
  adresse: 'Bamako, Mali',
  devise: 'FCFA',
  site_web: '',
  facebook: '',
  linkedin: '',
  whatsapp: '',
}

const SiteSettingsContext = createContext(null)

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  async function loadSettings() {
    try {
      // First try public endpoint, fallback if needed
      const { data } = await client.get('/public/parametres/')
      if (data && data.nom_application) {
        setSettings((prev) => ({ ...prev, ...data }))
      }
    } catch {
      // If public fails, try authenticated or retain default
      try {
        const { data } = await client.get('/utilisateurs/parametres/')
        if (data && data.nom_application) {
          setSettings((prev) => ({ ...prev, ...data }))
        }
      } catch {
        // Keep default settings
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  async function updateSettings(updatedData) {
    const { data } = await client.put('/utilisateurs/parametres/', updatedData)
    setSettings((prev) => ({ ...prev, ...data }))
    return data
  }

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, updateSettings, refreshSettings: loadSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext)
  if (!ctx) throw new Error('useSiteSettings must be used within SiteSettingsProvider')
  return ctx
}
