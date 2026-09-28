import { createContext, useContext, useEffect, useState } from 'react'
import client from '../api/client'
import { tokenStorage } from '../api/tokenStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadUser() {
    try {
      const { data } = await client.get('/utilisateurs/me/')
      setUser(data)
    } catch {
      setUser(null)
    }
  }

  useEffect(() => {
    if (tokenStorage.get('access_token')) {
      loadUser().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  async function login(username, password, remember = true) {
    tokenStorage.setRemember(remember)
    const { data } = await client.post('/token/', { username, password })
    tokenStorage.set('access_token', data.access)
    tokenStorage.set('refresh_token', data.refresh)
    await loadUser()
  }

  function logout() {
    tokenStorage.remove('access_token')
    tokenStorage.remove('refresh_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
