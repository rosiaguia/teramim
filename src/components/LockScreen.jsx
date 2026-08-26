import { Link } from 'react-router-dom'
import AppLogo from './AppLogo.jsx'

const SUPPORT_PHONE = '(51) 99403-4879'
const SUPPORT_TEL = 'tel:+5551994034879'

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
            <a className="btn btn-terracotta btn-sm" href={SUPPORT_TEL}>WhatsApp da Rosi · {SUPPORT_PHONE}</a>
          </div>
        </div>
      </section>
    </main>
  )
}
