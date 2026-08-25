import { useState } from 'react'

const ONBOARD_STEPS = [
  {
    icon: '🕊️',
    title: 'O que é o P.A.R.E®?',
    text: 'É a sua metodologia de regulação emocional, criada pela Rosi Aguiar. Em poucos minutos por dia, você treina o corpo e a mente a voltarem para a calma — o modo parassimpático, onde você descansa, confia e se reconecta.'
  },
  {
    icon: '🧭',
    title: 'Como começar',
    text: 'Na tela Início, toque em "Quero saber do que preciso hoje". Responda com sinceridade — não existe resposta errada. A TerAmim identifica o que você mais precisa e te leva para a prática certa com a voz da Rosi.'
  },
  {
    icon: '🆘',
    title: 'Se precisar de urgência',
    text: 'Se estiver em sofrimento, procure ajuda profissional agora: CVV 188 (24h, grátis) ou SAMU 192. Dentro do app, a aba SOS tem uma sequência fisiológica para acalmar o corpo. O P.A.R.E® não substitui atendimento profissional.'
  }
]

export default function Onboarding({ onDone }) {
  const [idx, setIdx] = useState(0)
  const step = ONBOARD_STEPS[idx]
  const isLast = idx === ONBOARD_STEPS.length - 1

  function next() {
    if (isLast) {
      if (onDone) onDone()
    } else {
      setIdx(idx + 1)
    }
  }

  return (
    <div className="modal-overlay fade-in" style={{ zIndex: 200 }}>
      <div className="modal onboarding-modal">
        <span className="chip">Primeira visita · Bem-vinda</span>
        <div className="onboarding-icon">{step.icon}</div>
        <h3 className="onboarding-title">{step.title}</h3>
        <p className="onboarding-text">{step.text}</p>
        <div className="onboarding-dots">
          {ONBOARD_STEPS.map((s, i) => (
            <div key={s.title} className={i === idx ? 'ob-dot active' : i < idx ? 'ob-dot done' : 'ob-dot'} />
          ))}
        </div>
        <div className="step-actions">
          <button className="btn btn-primary btn-lg" onClick={next}>
            {isLast ? 'Começar' : 'Continuar'}
          </button>
          {!isLast && <button className="btn btn-ghost" onClick={() => { if (onDone) onDone() }}>Pular</button>}
        </div>
      </div>
    </div>
  )
}
