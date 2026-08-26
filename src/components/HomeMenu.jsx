import { Link } from 'react-router-dom'
import InstallAppButton from './InstallAppButton.jsx'
import RenewalBanner from './RenewalBanner.jsx'

const ITEMS = [
  { path: '/app/avaliacao', icon: '🧭', title: 'Minha avaliação emocional', sub: 'Como você está agora?' },
  { path: '/app/ritual', icon: '🕊️', title: 'Ritual diário', sub: 'Seu momento de paz de hoje' },
  { path: '/app/processo', icon: '🌟', title: 'Meu processo', sub: 'Sua jornada, dia a dia' },
  { path: '/app/respiracao', icon: '🫁', title: 'Respiração consciente', sub: 'Práticas RÉSP® com a Rosi' },
  { path: '/app/protocolos', icon: '🎧', title: 'Protocolos', sub: 'Manhã, meio-dia e noite' },
  { path: '/app/sos', icon: '🆘', title: 'SOS', sub: 'Quando a emoção apertar' }
]

export default function HomeMenu() {
  return (
    <div className="menu fade-in">
      <div className="menu-hero">
        <span className="chip">P.A.R.E® · terAmim</span>
        <h2 className="section-title">O que você quer fazer agora?</h2>
      </div>
      <RenewalBanner />
      <div className="menu-grid">
        {ITEMS.map((item) => (
          <Link key={item.path} to={item.path} className="menu-card card">
            <span className="menu-icon">{item.icon}</span>
            <strong className="menu-title">{item.title}</strong>
            <span className="menu-sub">{item.sub}</span>
          </Link>
        ))}
      </div>
      <div className="install-wrap" style={{ marginTop: 44, textAlign: 'center' }}>
        <InstallAppButton />
      </div>
    </div>
  )
}
