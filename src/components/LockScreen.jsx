import { Link } from 'react-router-dom'
import AppLogo from './AppLogo.jsx'

const SUPPORT_PHONE = '(51) 99403-4879'
const SUPPORT_WA = 'https://wa.me/5551994034879'

export default function LockScreen() {
  return (
    <main className="lock-page">
      <section className="hero sub-hero">
        <div className="hero-bg">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <div className="container hero-layout fade-up">
          <div className="hero-logo">
            <AppLogo height={160} />
          </div>
          <div className="hero-content">
            <span className="hero-brand">P.A.R.E<sup>®</sup> · terAmim</span>
            <h1 className="hero-title" style={{ fontSize: 'clamp(26px, 4vw, 38px)' }}>Aqui dentro é para quem escolheu a paz como treino.</h1>
            <p className="hero-sub">Este espaço é exclusivo para as mulheres que fazem parte da comunidade P.A.R.E®. Se ainda não é assinante, sua jornada começa em poucos cliques.</p>
            <div className="hero-cta">
              <Link to="/assinar" className="btn btn-lime btn-lg">Quero meu acesso completo</Link>
            </div>
            <p className="hero-note">Pagamento seguro · Acesso imediato · Garantia de 7 dias</p>
          </div>
        </div>
      </section>

      <section className="container section center">
        <div className="card lock-card fade-up">
          <div className="lock-icon">🔒</div>
          <h2 className="section-title">O que espera por você aqui dentro</h2>
          <div className="lock-grid">
            <div className="lock-item">
              <span className="lock-item-icone">🕊️</span>
              <strong>Ritual diário</strong>
              <span>Manhã e noite, guiado pela voz da Rosi</span>
            </div>
            <div className="lock-item">
              <span className="lock-item-icone">🫁</span>
              <strong>Biblioteca RÉSP®</strong>
              <span>Práticas de breathwork para cada momento</span>
            </div>
            <div className="lock-item">
              <span className="lock-item-icone">🎧</span>
              <strong>Protocolos guiados</strong>
              <span>Manhã, meio-dia e noite em poucos minutos</span>
            </div>
            <div className="lock-item">
              <span className="lock-item-icone">🆘</span>
              <strong>SOS emocional</strong>
              <span>Quando a emoção apertar, você tem onde apoiar</span>
            </div>
          </div>
          <Link to="/entrar" className="btn btn-lime btn-lg btn-block">Já sou assinante — Entrar</Link>
          <Link to="/assinar" className="btn btn-ghost btn-lg btn-block" style={{ marginTop: 10 }}>Quero assinar o P.A.R.E®</Link>
          <p className="price-note">Menos de R$ 1,00 por dia · Cancele quando quiser</p>
          <div className="lock-support">
            <p className="price-note">Pagou e não consegue entrar?</p>
            <a className="btn btn-terracotta btn-sm" href={SUPPORT_WA} target="_blank" rel="noreferrer">
              <svg className="wa-icone" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.25 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29z" /></svg>
              WhatsApp da Rosi · {SUPPORT_PHONE}
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
