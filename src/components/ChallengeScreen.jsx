import { useState } from 'react'
import { getChallengeSummary } from '../engine/store.js'

export default function ChallengeScreen() {
  const [summary, setSummary] = useState(() => getChallengeSummary())

  function formatDate(key) {
    const [y, m, d] = key.split('-').map(Number)
    const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
    return `${d} ${months[m - 1]}`
  }

  return (
    <div className="challenge-screen fade-in">
      <div className="library-head">
        <h2 className="section-title">Seu desafio P.A.R.E®</h2>
        <p className="section-sub">Não é perfeição, é presença. Cada dia com prática vale. Se você falhar um dia, não perde nada — é só recomeçar. Sem culpa.</p>
      </div>

      <div className="challenge-hero card">
        <div className="challenge-streak">
          <span className="challenge-streak-num">{summary.streak}</span>
          <span className="challenge-streak-label">dias seguidos com você</span>
        </div>
        <div className="challenge-days">
          <strong>{summary.dayCount}</strong>
          <span>dias de prática no total</span>
        </div>
      </div>

      <div className="challenge-milestones">
        {summary.milestones.map((m) => (
          <div key={m.days} className={m.achieved ? 'milestone achieved card' : 'milestone card'}>
            <span className="milestone-emoji">{m.achieved ? m.emoji : '🔒'}</span>
            <div className="milestone-info">
              <strong>{m.label}</strong>
              <span>{m.achieved ? m.text : `Faltam ${m.nextIn} dias de prática para este selo.`}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="challenge-evolution card">
        <h3>Sua evolução emocional</h3>
        <p className="settings-sub">Como você registrou que estava após cada prática.</p>
        {summary.history.length ? (
          <div className="evolution-row">
            {summary.history.map((h) => (
              <div key={h.date} className="evolution-day" title={formatDate(h.date)}>
                <span className="evolution-mood">{h.mood}</span>
                <span className="evolution-date">{formatDate(h.date)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="resp-modal-hint">Quando você terminar sua primeira prática, registre como está se sentindo e sua evolução aparece aqui.</p>
        )}
      </div>
    </div>
  )
}
