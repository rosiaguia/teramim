import { Link } from 'react-router-dom'
import AppLogo from '../components/AppLogo.jsx'

const NEURO_STEPS = [
  {
    n: '1',
    title: 'Seu cérebro está em modo de alerta',
    text: 'O cortisol (hormônio do estresse) vive alto no seu dia a dia. A mente dispara o alerta até quando você está tentando descansar — por isso o piloto automático não desliga.'
  },
  {
    n: '2',
    title: 'A respiração é a chave mestre',
    text: 'Quando você muda o ritmo da respiração, envia um sinal direto ao nervo vago. Ele ativa o sistema parassimpático — o modo da calma do seu corpo. Não é crença: é fisiologia.'
  },
  {
    n: '3',
    title: 'O corpo aprende o caminho da paz',
    text: 'A cada prática, seu cérebro cria e fortalece uma nova via neural. É a plasticidade do cérebro adulto: o que você repete, você se torna. Por isso paz não é evento — é treino.'
  },
  {
    n: '4',
    title: 'Escolha que vira presença',
    text: 'Com o sistema nervoso regulado, a mente clareia. O que era reação automática vira escolha consciente. Você para, percebe, acolhe e decide — em vez de apenas reagir.'
  }
]

const PROMISES = [
  { icon: '🌬️', text: 'Em poucos minutos por dia, o corpo sai do modo alerta e entra no modo calma.' },
  { icon: '🧠', text: 'Técnica baseada em neurociência: nervo vago, sistema parassimpático e regulação emocional.' },
  { icon: '🗣️', text: 'Voz guiada por quem entende de breathwork e de acolhimento: a Rosi Aguiar.' },
  { icon: '⏱️', text: 'Práticas curtas de manhã, meio-dia e noite — cabem na rotina de qualquer mulher.' },
  { icon: '💚', text: 'Feito para a mulher 40+, que já carrega muito e merece voltar para si.' },
  { icon: '🆘', text: 'Um SOS fisiológico para os dias em que a emoção aperta.' }
]

export default function HowItWorks() {
  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <div className="container hero-layout fade-up">
          <div className="hero-logo">
            <AppLogo height={180} />
          </div>
          <div className="hero-content">
            <span className="hero-brand">Como o P.A.R.E<sup>®</sup> funciona</span>
            <h1 className="hero-title">Você não precisa de mais esforço.<br />Precisa de regulação.</h1>
            <p className="hero-sub">
              O P.A.R.E® age onde a paz começa de verdade: no seu sistema nervoso.
              Entenda, em linguagem simples, por que a respiração consciente transforma
              o seu dia a dia — e como poucos minutos por dia mudam o seu cérebro.
            </p>
            <div className="hero-cta">
              <Link to="/assinar" className="btn btn-lime btn-lg">Quero começar meu P.A.R.E. agora</Link>
            </div>
          </div>
        </div>
      </section>

      {/* POR QUE FUNCIONA — NEUROCIÊNCIA */}
      <section className="container section">
        <h2 className="section-title center">Por que o P.A.R.E® funciona?</h2>
        <p className="section-sub center">Porque ele fala a língua que o seu corpo entende: a do sistema nervoso.</p>
        <div className="how-steps">
          {NEURO_STEPS.map((s, i) => (
            <div key={s.n} className="how-step card fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="how-step-num">{s.n}</div>
              <div className="how-step-body">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* O QUE VOCE GANHA */}
      <section className="section sand-bg">
        <div className="container">
          <h2 className="section-title center">O que a paz diária devolve para você</h2>
          <p className="section-sub center">Não é promessa mágica. É método, ciência e constância.</p>
          <div className="promise-grid">
            {PROMISES.map((p, i) => (
              <div key={i} className="promise-card card fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <span className="promise-icon">{p.icon}</span>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="container section">
        <div className="quote-card big">
          <p className="quote">“Eu não vim te dizer o que sentir. Vim te ajudar a perceber, regular e escolher.”</p>
          <span className="quote-author">Rosi Aguiar — Instrutora de Breathwork e criadora do P.A.R.E®</span>
        </div>
      </section>

      {/* CTA FINAL — BOTÃO VERDE-LIMÃO GIGANTE */}
      <section className="container section center">
        <div className="card how-cta fade-up">
          <h2 className="section-title">Pronta para voltar para si?</h2>
          <p className="section-sub">Daqui a 30 dias, você vai agradecer à mulher que começou hoje.</p>
          <Link to="/assinar" className="btn btn-lime btn-giant btn-block">QUERO COMEÇAR AGORA</Link>
          <p className="price-note">Menos de R$ 1,00 por dia · Acesso imediato · Garantia de 7 dias</p>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <span className="brand-name">P.A.R.E<sup>®</sup> · Metodologia terAmim · Rosi Aguiar</span>
            <span className="footer-note">O P.A.R.E é uma ferramenta de apoio à regulação emocional e não substitui atendimento médico, psicológico ou psiquiátrico.</span>
            <Link to="/admin" className="footer-admin">Acesso restrito</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
