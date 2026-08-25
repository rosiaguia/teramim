import { useEffect, useState } from 'react'
import { FEELING_OPTIONS, LEVEL_OPTIONS, NEEDS, computeWinner, evaluateLevel, buildQuiz } from '../data/quiz.js'
import { protocolForNeed } from '../data/protocols.js'
import { decreeBankForNeed } from '../data/decrees.js'
import { fetchAudios } from '../api/client.js'
import ProtocolPlayer from './ProtocolPlayer.jsx'
import UniverseAsk from './UniverseAsk.jsx'
import InstallApp from './InstallApp.jsx'
import { getOrCreateUser, touchAccess, recordCheckIn } from '../engine/store.js'

const REFLECTIVE_BY_NEED = {
  seguranca: [
    'O que eu posso reconhecer em mim hoje que me faz sentir viva, segura e inteira — mesmo sem nada mudar lá fora?',
    'Que força eu reconheço em mim que me mantém de pé quando tudo parece ameaçador?',
    'Que parte de mim já sabe que está segura — e que eu posso reconhecer hoje?',
    'O que me devolveria vitalidade se eu soltasse a vigilância por um minuto?'
  ],
  pertencimento: [
    'Onde, em mim, eu já me sinto em casa — e que parte da minha identidade eu reconheço hoje?',
    'Que pertencimento eu posso me dar hoje, começando por mim?',
    'Que lugar meu eu posso habitar hoje, mesmo sem esperar convite?',
    'O que em mim já é acolhimento, e eu posso reconhecer agora?'
  ],
  reconhecimento: [
    'O que eu posso reconhecer em mim hoje, para que a minha luz fique tão visível para mim que o mundo também a veja?',
    'Que valor meu eu reconheço hoje, sem precisar de prova externa?',
    'O que eu vejo em mim quando me olho com os olhos do amor?',
    'Que parte da minha identidade eu me permito enxergar hoje?'
  ],
  amada: [
    'Que amor eu posso me reconhecer hoje, para que ele me devolva a vitalidade e o prazer de viver?',
    'Que carinho meu eu reconheço hoje, que me faz sentir viva?',
    'Como eu posso ser o amor que eu procuro, começando por mim?',
    'Que forma de amor por mim me devolve o prazer de viver hoje?'
  ]
}

const REFLECTIVE_QUESTIONS = [
  'Quem é a mulher que eu sou quando deixo de repetir as crenças do passado?',
  'Que parte da minha identidade eu reconheço hoje — e me devolve a vitalidade e o prazer de viver?',
  'Qual é o meu alto valor, aquele que é meu e que nenhuma crença antiga pode apagar?',
  'Que mulher eu escolho ser quando lembro que a paz é treino?',
  'O que em mim já é vital, vivo e inteiro — e que eu posso reconhecer agora?'
]

const DISSOLVE_BY_NEED = {
  seguranca: [
    'O que é verdadeiro sobre isso, que só eu entendo?',
    'Essa crença é minha ou aprendi a tê-la?',
    'O que eu realmente quero quando não estou em alerta?'
  ],
  pertencimento: [
    'Essa crença é minha ou aprendi a tê-la?',
    'O que é verdadeiro sobre isso, que só eu entendo?',
    'Quem eu sou quando eu sei que pertenço?'
  ],
  reconhecimento: [
    'O que eu realmente quero?',
    'O que é verdadeiro sobre isso, que só eu entendo?',
    'Essa crença é minha ou aprendi a tê-la?'
  ],
  amada: [
    'O que é verdadeiro sobre essa crença, que só eu entendo?',
    'Essa crença é minha ou aprendi a tê-la?',
    'O que eu realmente quero quando me sinto amada?'
  ]
}

const DISSOLVE_FALLBACK = [
  'O que é verdadeiro sobre isso, que só eu entendo?',
  'Essa crença é minha ou aprendi a tê-la?',
  'O que eu realmente quero?'
]

const NERVOUS_SYSTEM_BENEFIT = {
  title: 'Por que regular o sistema nervoso?',
  text: 'Quando você desacelera e respira, o sistema nervoso sai do estado de alerta e entra no modo de descanso e reparação. É nele que o coração desacelera, o corpo solta a tensão e a mente volta a enxergar escolhas. A prática P.A.R.E® existe para trazer esse estado para o seu dia a dia — não é teoria, é fisiologia: respirar fundo ativa o nervo vago e diz ao cérebro "estou segura".'
}

const CLOSING_MESSAGE = [
  'Você é um lindo ser.',
  'Muito obrigada por respirar comigo.',
  'Que todos os seres de todos os mundos, sejam felizes e muito abençoados.',
  'Fique bem. Fique na fonte!'
]

const CHECKIN_OPTIONS = [
  { id: 'melhor', emoji: '🌤️', label: 'Melhor', text: 'O corpo respondeu. Siga leve.' },
  { id: 'muito_melhor', emoji: '✨', label: 'Muito melhor', text: 'O corpo soltou bastante. Siga assim.' },
  { id: 'igual', emoji: '🕊️', label: 'Estou igual', text: 'O corpo ainda está segurando algo.' }
]

const SOS_RESOURCES = [
  { name: 'CVV — Centro de Valorização da Vida', contact: 'Ligue 188 (24h, grátis)' },
  { name: 'SAMU', contact: 'Ligue 192 (emergência)' },
  { name: 'UPA ou hospital mais próximo', contact: 'Procure atendimento presencial' }
]

const CURA_PROTOCOL = {
  id: 'cura',
  name: 'Frequência da Cura',
  tagline: 'Alívio de dor física ou emocional',
  audioLabel: 'cura',
  duration: 'áudio com a voz da Rosi',
  color: '#C08552',
  description: 'O que você está sentindo? Se fosse dar um nome, qual seria? Onde está o peso ou a dor no corpo? Já respondeu? OK. Agora coloca os fones de ouvido, procura um lugar confortável e apenas se entregue. Fique bem, fique na fonte!'
}

export default function GuidedFlow() {
  const [screen, setScreen] = useState('home')
  const [calmMode, setCalmMode] = useState(false)
  const [feeling, setFeeling] = useState(null)
  const [evaluatedLevel, setEvaluatedLevel] = useState(null)
  const [qIdx, setQIdx] = useState(0)
  const [scores, setScores] = useState({ seguranca: 0, pertencimento: 0, reconhecimento: 0, amada: 0 })
  const [pickOrder, setPickOrder] = useState([])
  const [quiz, setQuiz] = useState(() => buildQuiz())
  const [winnerNeed, setWinnerNeed] = useState(null)
  const [protocol, setProtocol] = useState(null)
  const [audios, setAudios] = useState({})
  const [reflectStep, setReflectStep] = useState(0)
  const [reflectFeeling, setReflectFeeling] = useState(null)
  const [sessionKey, setSessionKey] = useState(null)
  const [universeOpen, setUniverseOpen] = useState(false)
  const [curaOpen, setCuraOpen] = useState(false)
  const [checkinRound, setCheckinRound] = useState(0)
  const [suggestedCura, setSuggestedCura] = useState(false)
  const [beliefStep, setBeliefStep] = useState(null)
  const [sessionSeed, setSessionSeed] = useState(() => Math.floor(Math.random() * 99999))

  useEffect(() => {
    fetchAudios().then(setAudios)
    if (!sessionKey) {
      const s = { id: 'ses_' + Math.random().toString(36).slice(2, 10), startedAt: new Date().toISOString(), page: 'app' }
      setSessionKey(s)
      touchAccess(s, getOrCreateUser())
    }
  }, [])

  function reset() {
    setScreen('home')
    setCalmMode(false)
    setFeeling(null)
    setEvaluatedLevel(null)
    setQIdx(0)
    setScores({ seguranca: 0, pertencimento: 0, reconhecimento: 0, amada: 0 })
    setPickOrder([])
    setQuiz(buildQuiz())
    setWinnerNeed(null)
    setProtocol(null)
    setReflectStep(0)
    setReflectFeeling(null)
    setBeliefStep(null)
    setSessionSeed(Math.floor(Math.random() * 99999))
  }

  function goCalm() {
    setCalmMode(true)
    setScreen('calm_warn')
  }

  function goCura() {
    setCalmMode(false)
    setProtocol(CURA_PROTOCOL)
    setScreen('player')
  }

  function goQuiz() {
    setCalmMode(false)
    setScreen('feeling')
  }

  function pickFeeling(f) {
    if (f.sos) {
      setScreen('safety')
      return
    }
    setFeeling(f)
    setQuiz(buildQuiz(f))
    setQIdx(0)
    setScores({ seguranca: 0, pertencimento: 0, reconhecimento: 0, amada: 0 })
    setPickOrder([])
    setScreen('quiz')
  }

  function pickAnswer(q, opt) {
    const next = { ...scores, [opt.need]: (scores[opt.need] || 0) + 1 }
    setScores(next)
    setPickOrder([...pickOrder, q.id])
    if (qIdx + 1 < quiz.length) {
      setQIdx(qIdx + 1)
    } else {
      const win = computeWinner(next, [...pickOrder, q.id])
      const lvl = evaluateLevel(feeling, next)
      setWinnerNeed(win)
      setEvaluatedLevel(lvl)
      setProtocol(protocolForNeed(win))
      setScreen('result')
    }
  }

  function startProtocolAudio() {
    setScreen('player')
  }

  function onPlayerFinish() {
    setReflectStep(0)
    setReflectFeeling(null)
    setSuggestedCura(false)
    setBeliefStep(null)
    setScreen('reflect')
  }

  function pickCheckin(opt) {
    recordCheckIn(opt.emoji)
    setReflectFeeling(opt)
    if (opt.id === 'igual') {
      setSuggestedCura(true)
      return
    }
    if (!winnerNeed) {
      setReflectStep(2)
      return
    }
    setBeliefStep(0)
  }

  function beliefDevolve() {
    setBeliefStep(1)
  }

  function beliefEscolha() {
    setBeliefStep(2)
  }

  function currentDecree() {
    if (!winnerNeed) return null
    const bank = decreeBankForNeed(winnerNeed, 60)
    return bank[sessionSeed % bank.length] || bank[0]
  }

  function playCuraSuggestion() {
    setProtocol(CURA_PROTOCOL)
    setScreen('player')
  }

  function afterReflect() {
    setReflectStep(2)
  }

  function closeAndReset() {
    reset()
  }

  function reflectQuestion() {
    const pool = (winnerNeed && REFLECTIVE_BY_NEED[winnerNeed]) || REFLECTIVE_QUESTIONS
    return pool[sessionSeed % pool.length]
  }

  function dissolveQuestionForNeed() {
    const pool = (winnerNeed && DISSOLVE_BY_NEED[winnerNeed]) || DISSOLVE_FALLBACK
    return pool[(sessionSeed * 3 + (winnerNeed ? winnerNeed.length : 0)) % pool.length]
  }

  const needData = winnerNeed ? (NEEDS.find((n) => n.id === winnerNeed) || null) : null
  const isCuraFlow = protocol && protocol.id === 'cura'

  const audioUrl = protocol && audios[protocol.audioLabel] ? audios[protocol.audioLabel].url : null

  return (
    <div className="guided-flow fade-in">
      {screen === 'home' && (
        <div className="guided-home">
          <div className="guided-hero">
            <span className="chip">P.A.R.E® · com a voz da Rosi Aguiar</span>
            <h2 className="section-title">Como você está agora?</h2>
            <p className="section-sub">
              Bem-vinda! Me conta como você está que eu te escuto e te direciono para a prática certa, criada e conduzida pela Rosi.
            </p>
          </div>
          <div className="guided-options">
            <button className="guided-option card" onClick={goCalm}>
              <span className="guided-option-icon">🫁</span>
              <div>
                <strong>Quero só me acalmar</strong>
                <span>Direto para a prática RÉSP ZERO® com a voz da Rosi. Use fones de ouvido.</span>
              </div>
            </button>
            <button className="guided-option card" onClick={goQuiz}>
              <span className="guided-option-icon">💡</span>
              <div>
                <strong>Quero saber do que preciso hoje</strong>
                <span>Algumas perguntas rápidas e eu te mostro a prática mais adequada para agora.</span>
              </div>
            </button>
            <button className="guided-option card" onClick={goCura}>
              <span className="guided-option-icon">🎵</span>
              <div>
                <strong>Sessão de alívio para dor ou peso emocional</strong>
                <span>Frequência da Cura com a voz da Rosi, para o corpo soltar o que está segurando. Use fones.</span>
              </div>
            </button>
            <button className="guided-option card" onClick={() => setUniverseOpen(true)}>
              <span className="guided-option-icon">🌌</span>
              <div>
                <strong>Pergunte ao Universo</strong>
                <span>Escolha um tema e receba perguntas para expandir a consciência.</span>
              </div>
            </button>
          </div>
          <InstallApp />
          {universeOpen && <UniverseAsk onClose={() => setUniverseOpen(false)} onTake={() => { setUniverseOpen(false); setScreen('universe_close') }} />}
        </div>
      )}

      {screen === 'calm_warn' && (
        <div className="guided-step">
          <div className="guided-step-card card">
            <div className="step-emoji">🎧</div>
            <h3>Prepare-se para a prática</h3>
            <p className="step-text">Coloque os fones de ouvido, sente-se ou deite-se confortavelmente, e permita-se alguns minutos só para você.</p>
            <div className="step-actions">
              <button className="btn btn-primary btn-lg" onClick={() => { setProtocol(protocolForNeed('seguranca')); setScreen('player') }}>
                Começar RÉSP ZERO®
              </button>
              <button className="btn btn-ghost" onClick={reset}>Voltar</button>
            </div>
          </div>
        </div>
      )}

      {screen === 'feeling' && (
        <div className="guided-step">
          <div className="guided-step-card card">
            <span className="chip">1 de 5 · Como você está</span>
            <h3>O que mais combina com você agora?</h3>
            <p className="step-text">Escolha uma opção. Não existe resposta errada.</p>
            <div className="feeling-grid">
              {FEELING_OPTIONS.map((f) => (
                <button key={f.id} className="feeling-opt" onClick={() => pickFeeling(f)}>
                  <span className="feeling-emoji">{f.emoji}</span>
                  <span>{f.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {screen === 'quiz' && quiz[qIdx] && (
        <div className="guided-step">
          <div className="guided-step-card card">
            <span className="chip">{qIdx + 2} de 5 · Conhecendo você</span>
            <div className="quiz-progress">
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${((qIdx + 1) / quiz.length) * 100}%` }} />
              </div>
            </div>
            <h3>{quiz[qIdx].text}</h3>
            <div className="need-options">
              {quiz[qIdx].options.map((o, i) => (
                <button key={i} className="quiz-opt" onClick={() => pickAnswer(quiz[qIdx], o)}>
                  <span>{o.text}</span>
                </button>
              ))}
            </div>
            <button className="btn btn-ghost" onClick={() => (qIdx > 0 ? setQIdx(qIdx - 1) : setScreen('feeling'))}>Voltar</button>
          </div>
        </div>
      )}

      {screen === 'result' && winnerNeed && protocol && (
        <div className="guided-step">
          <div className="guided-result card">
            <span className="chip">Identifiquei o que você mais precisa hoje</span>
            <h3>{NEEDS.find((n) => n.id === winnerNeed).emoji} {NEEDS.find((n) => n.id === winnerNeed).label}</h3>
            <p className="step-text">{NEEDS.find((n) => n.id === winnerNeed).phrase}</p>
            <div className="result-level">
              <span className="result-level-label">Nível identificado pela TerAmim</span>
              <span className="result-level-value">{LEVEL_OPTIONS.find((l) => l.id === evaluatedLevel)?.emoji} {LEVEL_OPTIONS.find((l) => l.id === evaluatedLevel)?.label}</span>
              <span className="result-level-text">{LEVEL_OPTIONS.find((l) => l.id === evaluatedLevel)?.text}</span>
            </div>
            {evaluatedLevel === 'elevado' && (
              <p className="step-text level-warn">Seu corpo está pedindo regulação primeiro. A prática indicada abaixo é o passo de segurança. Respire com a Rosi antes de qualquer outra coisa.</p>
            )}
            <div className="result-protocol">
              <div className="result-protocol-name" style={{ color: protocol.color }}>{protocol.name}</div>
              <p>{protocol.description}</p>
              <span className="result-protocol-dur">⏱ {protocol.duration} · 🎧 voz da Rosi</span>
            </div>
            <div className="result-instructions">
              <strong>Como fazer agora</strong>
              <ol>
                <li>Coloque os fones de ouvido e encontre um lugar sem interrupções.</li>
                <li>Toque em <b>Ouvir a prática</b> e acompanhe a voz da Rosi no seu ritmo.</li>
                <li>Deixe o corpo fazer — não precisa "tentar" acalmar. A respiração faz por você.</li>
                <li>Ao terminar, responda como você está se sentindo (1 toque) e leve a pergunta reflexiva com você.</li>
                <li>Se o desconforto voltar, repita. Você pode vir aqui quantas vezes precisar.</li>
              </ol>
            </div>
            <div className="benefit-box">
              <strong>{NERVOUS_SYSTEM_BENEFIT.title}</strong>
              <p>{NERVOUS_SYSTEM_BENEFIT.text}</p>
            </div>
            <div className="step-actions">
              <button className="btn btn-primary btn-lg" style={{ background: protocol.color }} onClick={startProtocolAudio}>
                Ouvir a prática
              </button>
              <button className="btn btn-ghost" onClick={reset}>Recomeçar</button>
            </div>
          </div>
        </div>
      )}

      {screen === 'player' && protocol && (
        audioUrl ? (
          <ProtocolPlayer
            protocol={protocol}
            audioUrl={audioUrl}
            onFinish={onPlayerFinish}
            onBack={() => (protocol.id === 'cura' ? reset() : setScreen('result'))}
            startLabel={calmMode ? 'Começar RÉSP ZERO®' : 'Começar'}
            autoStart
          />
        ) : (
          <div className="guided-step">
            <div className="guided-step-card card">
              <div className="step-emoji">🎧</div>
              <h3>Áudio em preparação</h3>
              <p className="step-text">O áudio desta prática com a voz da Rosi ainda não foi enviado no painel. Enquanto isso, você pode usar a biblioteca RÉSP para respirar guiada.</p>
              <div className="step-actions">
                <button className="btn btn-primary" onClick={reset}>Voltar ao início</button>
              </div>
            </div>
          </div>
        )
      )}

      {screen === 'reflect' && (
        <div className="guided-step">
          <div className="guided-step-card card">
            {reflectStep === 0 && !suggestedCura && beliefStep === null ? (
              <>
                <span className="chip">Para fechar · Registro de 1 toque</span>
                <h3>Como você está se sentindo agora?</h3>
                <p className="step-text">Um toque e pronto. Isso ajuda você a ver sua evolução no Desafio.</p>
                <div className="feeling-grid">
                  {CHECKIN_OPTIONS.filter((o) => !isCuraFlow || o.id !== 'igual').map((o) => (
                    <button key={o.id} className="feeling-opt" onClick={() => pickCheckin(o)}>
                      <span className="feeling-emoji">{o.emoji}</span>
                      <span>{o.label}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : reflectStep === 0 && suggestedCura ? (
              <>
                <span className="chip">Seu corpo ainda está segurando algo</span>
                <h3>Que tal a Frequência da Cura?</h3>
                <p className="step-text">Você disse que está igual. Isso é um sinal de que o corpo ainda guarda uma tensão. A Frequência da Cura ajuda a liberar dor física ou emocional.</p>
                <div className="step-actions">
                  <button className="btn btn-primary" onClick={playCuraSuggestion}>🎵 Ouvir Frequência da Cura</button>
                  <button className="btn btn-ghost" onClick={() => setReflectStep(1)}>Prefiro concluir assim</button>
                </div>
              </>
            ) : beliefStep === 0 && needData ? (
              <>
                <span className="chip">Reorientação · A crença que mora em você</span>
                <h3 className="reflect-question">"{needData.belief}"</h3>
                <p className="step-text">Essa frase não nasceu com você — foi aprendida. Provavelmente lá na infância, com alguém que cuidou de você e que também vivia assim. Receber não é escolher.</p>
                <div className="step-actions">
                  <button className="btn btn-primary" onClick={beliefDevolve}>Sim, percebo que foi aprendida</button>
                  <button className="btn btn-ghost" onClick={() => setBeliefStep(3)}>Ainda não reconheço</button>
                </div>
              </>
            ) : beliefStep === 1 ? (
              <>
                <span className="chip">Reorientação · Devolvendo a crença</span>
                <h3 className="reflect-question">Essa crença não é sua.</h3>
                <p className="step-text">Ela pertence a quem a plantou. Você pode devolvê-la ao passado — sem briga, com respeito. Agradeça a ela por ter te protegido até aqui, e deixe-a ir.</p>
                <div className="belief-devolve-card">
                  <p>“A crença antiga vai ao passado.</p>
                  <p>A nova imagem mental vai ao comando.”</p>
                </div>
                <div className="step-actions">
                  <button className="btn btn-primary" onClick={beliefEscolha}>Devolvo e sigo</button>
                </div>
              </>
            ) : beliefStep === 3 ? (
              <>
                <span className="chip">Reorientação · Sem pressa</span>
                <h3 className="reflect-question">Fica tranquila.</h3>
                <p className="step-text">O processo de liberar crenças do passado não acontece do dia para a noite. Você não precisa resolver isso agora — só precisa começar a olhar.</p>
                <div className="belief-devolve-card">
                  <p>“Faça essa pergunta hoje, sempre que se sentir {needData.feeling}:</p>
                  <p>"{reflectQuestion()}"</p>
                  <p>…e lembre de respirar consciente mais vezes.”</p>
                </div>
                <p className="step-text">E quando a crença aparecer, discipline-a com curiosidade, repetindo várias vezes:</p>
                <div className="belief-afirmation-card">
                  <p>“Curiosa… crença que eu tenho essa crença.”</p>
                  <span className="decree-source">repita várias vezes</span>
                </div>
                <p className="step-text">Depois, a verdade de quem é essa crença:</p>
                <div className="belief-devolve-card">
                  <p>“Essa crença é minha ou aprendi a tê-la?”</p>
                  <p>“{dissolveQuestionForNeed()}"</p>
                </div>
                <p className="step-text command-line">É no questionamento da crença antiga que você abre espaço para criar a imagem nova. Discipline a antiga — e a nova nasce.</p>
                <div className="step-actions">
                  <button className="btn btn-primary" onClick={() => { setBeliefStep(null); setReflectStep(2) }}>Concluir</button>
                </div>
              </>
            ) : beliefStep === 2 ? (
              <>
                <span className="chip">Escolha o seu decreto de luz</span>
                <h3 className="reflect-question">Feche os olhos e coloque em uma imagem como seria o seu dia bom hoje e faça esse decreto.</h3>
                <div className="belief-afirmation-card">
                  <p>“{currentDecree().text}”</p>
                  {currentDecree().generated && <span className="decree-source">Decreto de {currentDecree().title}</span>}
                </div>
                <p className="step-text command-line">Repita em voz alta. Coloque uma mão no coração e a outra na altura do útero. Tome uma respiração consciente, longa e lenta.</p>
                <div className="step-actions">
                  <button className="btn btn-primary" onClick={() => { setBeliefStep(null); setReflectStep(2) }}>Levar comigo</button>
                </div>
              </>
            ) : reflectStep === 1 ? (
              <>
                <span className="chip">Pergunta reflexiva</span>
                <h3 className="reflect-question">"{reflectQuestion()}"</h3>
                <p className="step-text">Leve essa pergunta com você hoje. Não precisa responder agora — apenas deixe ecoar.</p>
                <div className="step-actions">
                  <button className="btn btn-primary" onClick={() => setUniverseOpen(true)}>🌌 Quer fazer uma pergunta ao Universo?</button>
                  <button className="btn btn-ghost" onClick={afterReflect}>Concluir</button>
                </div>
              </>
            ) : reflectStep === 2 ? (
              <>
                <span className="chip">Pense em algo pelo qual você é grata agora</span>
                <div className="closing-card">
                  {CLOSING_MESSAGE.map((line, i) => (
                    <p key={i} className={i === 0 ? 'closing-line closing-line-first' : 'closing-line'}>{line}</p>
                  ))}
                </div>
                <div className="step-actions">
                  <button className="btn btn-primary" onClick={closeAndReset}>Concluir</button>
                </div>
              </>
            ) : null}
            {universeOpen && <UniverseAsk single needId={winnerNeed} onClose={() => setUniverseOpen(false)} />}
          </div>
        </div>
      )}

      {screen === 'universe_close' && (
        <div className="guided-step">
          <div className="guided-step-card card">
            <span className="chip">Pense em algo pelo qual você é grata agora</span>
            <div className="closing-card">
              {CLOSING_MESSAGE.map((line, i) => (
                <p key={i} className={i === 0 ? 'closing-line closing-line-first' : 'closing-line'}>{line}</p>
              ))}
            </div>
            <div className="step-actions">
              <button className="btn btn-primary" onClick={reset}>Concluir</button>
            </div>
          </div>
        </div>
      )}

      {screen === 'safety' && (
        <div className="guided-step">
          <div className="guided-step-card card safety-card">
            <div className="step-emoji">🤍</div>
            <h3>Você não precisa passar por isso sozinha</h3>
            <p className="step-text">Se você está em risco, pensando em se machucar ou se sentindo em desespero agora, o mais importante é buscar ajuda profissional imediatamente. Isso é um ato de coragem e de amor próprio.</p>
            <div className="sos-resources">
              {SOS_RESOURCES.map((r) => (
                <div key={r.name} className="sos-resource">
                  <strong>{r.name}</strong>
                  <span>{r.contact}</span>
                </div>
              ))}
            </div>
            <p className="step-text">O P.A.R.E® é uma prática de regulação para o dia a dia, não substitui atendimento profissional.</p>
            <div className="step-actions">
              <button className="btn btn-primary" onClick={reset}>Voltar ao início</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
