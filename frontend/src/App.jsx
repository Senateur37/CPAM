import { BrowserRouter, Route, Routes } from 'react-router-dom'
import BackToTop from './components/BackToTop'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { SiteSettingsProvider } from './context/SiteSettingsContext'
import { MODULE_PAGES } from './config/modules'
import About from './pages/About'
import Contact from './pages/Contact'
import Dashboard from './pages/Dashboard'
import Formation from './pages/Formation'
import Home from './pages/Home'
import Login from './pages/Login'
import ModulePage from './pages/ModulePage'
import Reports from './pages/Reports'
import ResourcePage from './pages/ResourcePage'
import Settings from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <SiteSettingsProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/apropos" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/formation" element={<Formation />} />
            {Object.entries(MODULE_PAGES).map(([key, mod]) => (
              <Route key={key} path={mod.path} element={<ModulePage moduleKey={key} />} />
            ))}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path=":resourceKey" element={<ResourcePage />} />
            </Route>
          </Routes>
          <BackToTop />
        </AuthProvider>
      </SiteSettingsProvider>
    </BrowserRouter>
  )
}
