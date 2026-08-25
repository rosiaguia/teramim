import { Link } from 'react-router-dom'
import { RITUALS } from './RitualScreen.jsx'

export default function RitualMenu() {
  return (
    <div className="ritual-menu fade-in">
      <div className="library-head">
        <h2 className="section-title">Ritual Diário · P.A.R.E.<sup>®</sup></h2>
        <p className="section-sub">O toque diário de Rosi: uma sequência fixa de manhã e outra de noite. Abra o dia em paz e encerre em paz, todos os dias. Escolha qual quer fazer agora.</p>
      </div>
      <div className="menu-grid">
        {Object.values(RITUALS).map((r) => (
          <Link key={r.id} to={`/app/ritual/${r.id}`} className="menu-card card">
            <span className="menu-icon">{r.emoji}</span>
            <strong className="menu-title">{r.label}</strong>
            <span className="menu-sub">{r.period}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
