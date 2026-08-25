import { Link, useLocation } from 'react-router-dom'
import AppLogo from './AppLogo.jsx'

export default function TopBar() {
  const { pathname } = useLocation()
  const isApp = pathname.startsWith('/app')

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <Link to="/" className="brand">
          <AppLogo height={40} />
          <span className="brand-name">P.A.R.E<sup>®</sup></span>
        </Link>
        <nav className="topnav">
          <Link to="/" className={pathname === '/' ? 'nav-link active' : 'nav-link'}>Início</Link>
          <Link to="/app" className={isApp ? 'nav-link active' : 'nav-link'}>Praticar</Link>
          <Link to="/app" className="btn btn-primary btn-sm">Começar agora</Link>
        </nav>
      </div>
    </header>
  )
}
