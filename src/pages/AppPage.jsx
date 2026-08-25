import { useState, useEffect } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { recordPageView } from '../engine/store'
import Onboarding from '../components/Onboarding.jsx'

const ONBOARD_KEY = 'teramim_onboarded'
const isHome = (pathname) => pathname === '/app' || pathname === '/app/'

export default function AppPage() {
  const { pathname } = useLocation()
  const [showOnboard, setShowOnboard] = useState(() => {
    try { return localStorage.getItem(ONBOARD_KEY) !== '1' } catch { return true }
  })

  useEffect(() => {
    recordPageView(isHome(pathname) ? 'app' : pathname.split('/')[2] || 'app')
  }, [pathname])

  function finishOnboard() {
    try { localStorage.setItem(ONBOARD_KEY, '1') } catch { /* ignore */ }
    setShowOnboard(false)
  }

  return (
    <main className="app-shell">
      {showOnboard && <Onboarding onDone={finishOnboard} />}
      {!isHome(pathname) && (
        <div className="container app-back">
          <Link to="/app" className="btn btn-ghost btn-sm">← Voltar ao menu</Link>
        </div>
      )}
      <div className="container app-content">
        <Outlet />
      </div>
    </main>
  )
}
