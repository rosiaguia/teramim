import { Link } from 'react-router-dom'
import { mergeRespList } from '../engine/contentStore'
import { useContent } from '../engine/ContentContext.jsx'
import AppLogo from '../components/AppLogo.jsx'

const STEPS = [
  { n: 'P', title: 'Presença', text: 'Pare o automático. Você percebe que está de novo na correria da mente.' },
  { n: 'A', title: 'Acolhimento', text: 'Reconheça corpo e emoção, sem julgamento. O que dói, onde dói.' },
  { n: 'R', title: 'Reorientação', text: 'Perceba que a crença do passado foi aprendida, não escolhida. Você decide: sim ou não, ela fica?' },
  { n: 'E', title: 'Escolha', text: 'Escolha a crença nova que vai ao comando. A antiga volta ao passado — e a imagem nova vira experiência.' }
]

const PAINS = [
  'Você acorda já cansada, com a mente ligada antes dos pés tocarem o chão.',
  'Cuida de todo mundo o dia inteiro — e percebe que ninguém cuidou de você.',
  'Sente que tem um "piloto automático" que não desliga nunca.',
  'No fim do dia, o corpo pede paz — mas a cabeça não deixa.'
]

const BENEFITS = [
  { icon: '🌿', title: 'Regula seu sistema nervoso', text: 'Tira seu corpo do modo alerta e leva para o modo calma, em poucos minutos por dia.' },
  { icon: '🗣️', title: 'Voz da Rosi te guia', text: 'Práticas guiadas por quem entende: acolhimento de mulher para mulher, sem enrolação.' },
  { icon: '🧠', title: 'Entende o que você precisa agora', text: 'Avaliação emocional que identifica o momento certo e te leva ao protocolo certo.' },
  { icon: '⏱️', title: 'Cabe na sua rotina', text: 'Práticas curtas de manhã, meio-dia e noite. Você não precisa de horas — precisa de constância.' },
  { icon: '🆘', title: 'SOS para os dias difíceis', text: 'Um recurso fisiológico de emergência para quando a emoção apertar.' },
  { icon: '💚', title: 'Feito para mulher 40+', text: 'Não é mais um app de gente jovem. É para a mulher madura que quer voltar para si.' }
]

export default function Landing() {
  const { content } = useContent()
  if (!content) return <main className="hero" />
  const l = content.landing
  const respList = mergeRespList(content.respPractices)

  return (
    <main>
      {/* HERO — dor + promessa */}
      <section className="hero">
        <div className="hero-bg">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <div className="container hero-layout fade-up">
          <div className="hero-logo">
            <AppLogo height={200} />
          </div>
          <div className="hero-content">
            <span className="hero-brand">P.A.R.E<sup>®</sup> · terAmim</span>
            <h1 className="hero-title" style={{ whiteSpace: 'pre-line' }}>{l.heroTitle}</h1>
            <p className="hero-sub">{l.heroSub}</p>
            <div className="hero-cta">
              <Link to="/como-funciona" className="btn btn-lime btn-lg">Ver como funciona</Link>
            </div>
            <p className="hero-scroll-hint">COMO voltar para mim <span className="scroll-arrow">↓</span></p>
            <p className="hero-note">Feito para mulheres 40+ que querem recuperar prazer de viver, vitalidade e viver em paz.</p>
          </div>
        </div>
      </section>

      {/* DORES — você se reconhece? */}
      <section className="container section" id="como-voltar">
        <h2 className="section-title">Você se reconhece em algum destes dias?</h2>
        <p className="section-sub">Não é falta de força. É um sistema nervoso sobrecarregado — e isso tem solução.</p>
        <div className="pains-grid">
          {PAINS.map((p, i) => (
            <div key={i} className="pain-card card fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
              <span className="pain-mark">✦</span>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MÉTODO P.A.R.E */}
      <section className="container section">
        <h2 className="section-title">{l.stepsTitle}</h2>
        <p className="section-sub">{l.stepsSub}</p>
        <div className="steps-grid">
          {STEPS.map((s, i) => (
            <div key={s.n} className="step-card fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="step-letter">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BIBLIOTECA RÉSP — amostra que gera desejo */}
      <section className="container section">
        <div className="section-head">
          <h2 className="section-title">Biblioteca RÉSP<sup>®</sup></h2>
          <p className="section-sub">
            <span className="library-upper">Práticas rápidas para o modo paz</span><br />
            Protocolos de Breathwork consciente, de 2 a 10 ciclos, com voz da Rosi Aguiar.<br />
            <span className="library-states">Alívio · Sono · Energia · Equilíbrio · Foco · Você e sua essência</span>
          </p>
          <p className="library-explanation">Breathwork é a prática de usar a respiração de forma consciente para regular o sistema nervoso, acalmar a mente e devolver o equilíbrio ao corpo.</p>
          <p className="breath-note">Escolha a voz da Rosi, use fones de ouvido, feche os olhos e se entregue.</p>
        </div>
        <div className="resp-grid">
          {respList.map((r, i) => (
            <div key={r.id} className="resp-card fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="resp-card-tag">{r.tagline}</div>
              <h3>{r.name}</h3>
              <p className="resp-card-desc">{r.description}</p>
              <span className="resp-card-dur">{r.duration}</span>
            </div>
          ))}
        </div>
        <div className="center" style={{ marginTop: 28 }}>
          <Link to="/assinar" className="btn btn-lime btn-lg">Quero todas as práticas agora</Link>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="section sand-bg">
        <div className="container">
          <h2 className="section-title center">O que muda quando você treina paz</h2>
          <p className="section-sub center">Não é promessa mágica. É método, ciência e constância.</p>
          <p className="benefits-intro">Eu sei que você quer ser mais feliz, mas a felicidade é somativa de momentos de paz. É isso que o P.A.R.E® te proporciona:</p>
          <div className="benefits-grid">
            {BENEFITS.map((b, i) => (
              <div key={i} className="benefit-card card fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <span className="benefit-icon">{b.icon}</span>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE + TRANSFORMAÇÃO */}
      <section className="container section">
        <div className="quote-card big">
          <p className="quote">“Eu não vim te dizer o que sentir. Vim te ajudar a perceber, regular e escolher.”</p>
          <span className="quote-author">Rosi Aguiar — Instrutora de Breathwork e criadora do P.A.R.E®</span>
        </div>
      </section>

      {/* PREÇO */}
      <section className="container section center">
        <h2 className="section-title">{l.priceTitle}</h2>
        <p className="section-sub">{l.priceSub}</p>
        <div className="price-card">
          <span className="price-old">R$ {content.pricing.oldPrice}</span>
          <span className="price">R$ {content.pricing.price}</span>
          <span className="price-per">/mês</span>
          <ul className="price-feats">
            <li>Quiz das suas 4 necessidades e protocolos direcionados</li>
            <li>Práticas da Biblioteca RÉSP com a voz da Rosi</li>
            <li>Áudios guiados manhã, meio-dia e noite</li>
            <li>SOS fisiológico de emergência</li>
            <li>Rápido e seguro: poucos minutos por dia</li>
          </ul>
          <Link to="/assinar" className="btn btn-lime btn-lg btn-block">Quero começar meu P.A.R.E. agora</Link>
          <p className="price-note">Faturamento recorrente · Cancele quando quiser · Garantia de 7 dias</p>
        </div>
      </section>

      {/* TRIBO */}
      <section className="section sand-bg">
        <div className="container center">
          <span className="chip">Acompanhamento ao vivo</span>
          <h2 className="section-title">Tribo Nova Era</h2>
          <p className="section-sub" style={{ maxWidth: '560px', margin: '0 auto' }}>
            Você não precisa caminhar sozinha. Na Tribo Nova Era você encontra uma comunidade de mulheres
            que se encontram ao vivo com a Rosi, praticam juntas e seguram a mão umas das outras.
          </p>
          <a
            className="btn btn-terracotta btn-lg"
            href="https://www.rosiaguiar.com/ResetEmocional"
            target="_blank"
            rel="noopener noreferrer"
          >
            Quero acompanhamento ao vivo
          </a>
          <p className="price-note">Encontros ao vivo com a Rosi · dentro do Reset Emocional</p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="container section center">
        <div className="card final-cta fade-up">
          <h2 className="section-title" style={{ whiteSpace: 'pre-line' }}>
            {`A paz não espera o dia perfeito.\nEla começa na próxima respiração.`}
          </h2>
          <p className="section-sub">Daqui a 30 dias, você vai agradecer à mulher que começou hoje.</p>
          <Link to="/assinar" className="btn btn-lime btn-lg btn-block">Quero meu acesso completo</Link>
          <p className="price-note">Menos de R$ 1,00 por dia · Cancele quando quiser</p>
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
