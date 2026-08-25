import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchAudios } from '../api/client.js'

export const RITUALS = {
  morning: {
    id: 'morning',
    label: 'Ritual da Manhã',
    emoji: '🌅',
    period: 'Abertura do dia',
    steps: [
      {
        type: 'text',
        icon: '🙏',
        title: 'Oração da Manhã',
        text: 'Obrigada, Pai, por esta manhã que se inicia. Eu sei que algo maravilhoso já está me acontecendo agora. Tudo em mim cria amor, alegria e liberdade. Eu sou energia, eu sou dinheiro, sou poder, liberdade, amor. Meu caminho é bendito, e eu vivo pela graça do Pai de maneira perfeita. Agora tudo me vem fácil, e tudo sempre dá certo para mim. Tudo isso é real, é real, é real. Obrigada, Pai — eu sei que sou boa o suficiente e vivo sempre satisfeita. Obrigada por sempre me ouvir, como eu sei que está me ouvindo agora.',
        note: 'Leia em voz alta, devagar, com a mão no peito. Sinta cada palavra.'
      },
      {
        type: 'audio',
        icon: '🫁',
        title: 'RESP Sábia',
        audioLabel: 'meio_dia',
        tagline: 'Protocolo de respiração guiado por Rosi',
        text: 'Deixe a Rosi conduzir. Respira com ela, no seu ritmo, sem forçar.'
      },
      {
        type: 'text',
        icon: '✨',
        title: 'Decreto Poderoso',
        text: 'Tudo me vem fácil e tudo sempre dá certo pra mim, 10x.',
        gratitude: 'Obrigada, Pai, por sempre me ouvir, como sei que está me ouvindo agora.',
        note: 'Repita em voz alta, dez vezes, com convicção. A sua voz é o seu poder. Depois, agradeça.'
      },
      {
        type: 'text',
        icon: '💗',
        title: 'Pergunta de Interiorização',
        text: 'Corpo, como eu posso te fazer feliz hoje?',
        note: 'Feche os olhos e apenas sinta a resposta. Ela é para você, em silêncio — não precisa digitar nada.'
      }
    ]
  },
  night: {
    id: 'night',
    label: 'Ritual da Noite',
    emoji: '🌙',
    period: 'Encerramento do dia',
    steps: [
      {
        type: 'audio',
        icon: '🫁',
        title: 'RESP Zero',
        audioLabel: 'zero',
        tagline: 'Protocolo de respiração guiado por Rosi',
        text: 'Respiração 4/8 para entregar o dia. Deixe o corpo se soltar, pronta para descansar.'
      },
      {
        type: 'text',
        icon: '🙏',
        title: 'Oração Consciente',
        text: 'Obrigada, Pai, por este dia que se encerra. Entrego tudo em Tuas mãos — o que ficou resolvido e o que ainda não entendi. Em paz me deito, e logo durmo, porque sei que minha segurança está em Deus. Agora o meu sangue flui em minhas veias, eu adormeço e já me sinto renovada. Amanhã será um dia maravilhoso, e algo maravilhoso vai acontecer para mim. Obrigada, Pai — eu sei que sou boa o suficiente e vivo sempre satisfeita. Obrigada por sempre me ouvir, como sei que está me ouvindo agora.',
        note: 'Leia em voz alta ou sussurrada, entregando o dia. É o seu fechamento em paz.'
      },
      {
        type: 'text',
        icon: '💡',
        title: 'Pergunta Inteligente',
        text: 'O que hoje me ensinou sobre mim mesma e como eu posso me amar mais do que hoje?',
        note: 'Reflexão silenciosa. Não precisa responder por escrito — apenas deixe a pergunta trabalhar em você.'
      },
      {
        type: 'text',
        icon: '🕊️',
        title: 'Frase de Fechamento',
        text: 'Agora eu sou boa o suficiente, e vivo sempre satisfeita. Estou em paz.',
        gratitude: 'Obrigada, Pai, por sempre me ouvir, como sei que está me ouvindo agora.',
        note: 'Decreta em voz alta e durma em paz. Amanhã será um dia maravilhoso.'
      }
    ]
  }
}

export default function RitualScreen() {
  const { ritualId } = useParams()
  const [stepIdx, setStepIdx] = useState(0)
  const [thanks, setThanks] = useState(false)
  const [audios, setAudios] = useState({})
  const [audiosLoaded, setAudiosLoaded] = useState(false)
  const [audioCur, setAudioCur] = useState(0)
  const [audioDur, setAudioDur] = useState(0)
  const audioRef = useRef(null)

  useEffect(() => {
    fetchAudios().then((a) => { setAudios(a); setAudiosLoaded(true) })
  }, [])

  const ritual = RITUALS[ritualId] || RITUALS.morning
  const step = ritual.steps[stepIdx]
  const isLast = stepIdx === ritual.steps.length - 1

  useEffect(() => {
    setStepIdx(0)
    setThanks(false)
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0 }
    setAudioCur(0); setAudioDur(0)
  }, [ritualId])

  function next() {
    if (isLast) {
      if (audioRef.current) audioRef.current.pause()
      setThanks(true)
    } else {
      setStepIdx(stepIdx + 1)
    }
  }

  function restart() {
    setThanks(false)
    setStepIdx(0)
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0 }
    setAudioCur(0); setAudioDur(0)
  }

  function seek(clientX, el) {
    const a = audioRef.current
    if (!a || !a.duration) return
    const rect = el.getBoundingClientRect()
    let pct = (clientX - rect.left) / rect.width
    pct = Math.max(0, Math.min(1, pct))
    a.currentTime = pct * a.duration
    setAudioCur(a.currentTime)
  }

  const audioUrl = step.type === 'audio' && audios[step.audioLabel] ? audios[step.audioLabel].url : null
  const accent = ritualId === 'morning' ? '#C59A5B' : '#D9B26B'

  if (thanks) {
    return (
      <div className={`ritual-screen ritual-${ritualId} fade-in`}>
        <div className="audio-stage card audio-thanks" style={{ '--accent': accent }}>
          <div className="done-mark done-mark-heart" style={{ background: accent }}>♡</div>
          <p className="thanks-line">Muito obrigada.</p>
          <p className="thanks-line">Lembre-se: você é incrível, maravilhosa e merece ser feliz todos os dias.</p>
          <p className="thanks-line">Fica bem, fica na fonte.</p>
          <p className="thanks-line">Eu estarei sempre aqui para te guiar ao modo paz.</p>
          <div className="resp-actions">
            <Link to="/app" className="btn btn-primary">Voltar ao menu</Link>
            <button className="btn btn-ghost" onClick={restart}>Refazer ritual</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`ritual-screen ritual-${ritualId} fade-in`}>
      <div className="library-head">
        <h2 className="section-title">{ritual.emoji} {ritual.label}</h2>
        <p className="section-sub">{ritual.period}. Siga os passos no seu ritmo — um de cada vez.</p>
      </div>

      <div className="ritual-progress">
        {ritual.steps.map((s, i) => (
          <div key={i} className={i === stepIdx ? 'ritual-dot active' : i < stepIdx ? 'ritual-dot done' : 'ritual-dot'} />
        ))}
        <span className="ritual-step-count">Etapa {stepIdx + 1} de {ritual.steps.length}</span>
      </div>

      <div className="ritual-card card" key={`${ritual.id}-${stepIdx}`}>
        <div className="ritual-card-head">
          <span className="chip">{ritual.emoji} {ritual.label}</span>
          <div className="ritual-step-icon">{step.icon}</div>
          <h3>{step.title}</h3>
          <p className="ritual-card-note">{step.note}</p>
        </div>

        {step.type === 'audio' ? (
          audioUrl ? (
            <div className="rosi-player rosi-player-inline">
              <span className="chip">Voz da Rosi</span>
              <span className="ritual-audio-tag">{step.tagline}</span>
              <audio
                ref={audioRef}
                preload="metadata"
                src={audioUrl}
                onTimeUpdate={(e) => setAudioCur(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setAudioDur(e.currentTarget.duration || 0)}
                onEnded={() => setAudioCur(audioRef.current ? audioRef.current.duration : 0)}
              ></audio>
              <button
                className="btn btn-primary btn-lg btn-block audio-play"
                style={{ background: accent }}
                onClick={() => {
                  const a = audioRef.current
                  if (!a) return
                  if (a.paused) { a.play().catch(() => {}) }
                  else a.pause()
                }}
              >
                {audioRef.current && !audioRef.current.paused ? '⏸ Pausar' : '▶ Começar'}
              </button>
              {audioDur > 0 && (
                <div
                  className="audio-track"
                  style={{ '--track-color': accent }}
                  onPointerDown={(e) => {
                    if (e.pointerType === 'mouse' && e.button !== 0) return
                    e.currentTarget.setPointerCapture?.(e.pointerId)
                    seek(e.clientX, e.currentTarget)
                  }}
                  onPointerMove={(e) => {
                    if (e.buttons !== 1 && e.pointerType !== 'touch') return
                    seek(e.clientX, e.currentTarget)
                  }}
                >
                  <div className="audio-track-fill" style={{ width: `${audioDur ? (audioCur / audioDur) * 100 : 0}%`, background: accent }} />
                  <div className="audio-track-thumb" style={{ left: `${audioDur ? (audioCur / audioDur) * 100 : 0}%`, background: accent }} />
                </div>
              )}
              <p className="resp-modal-hint">{step.text}</p>
            </div>
          ) : !audiosLoaded ? (
            <p className="resp-modal-hint">Carregando áudio…</p>
          ) : (
            <p className="resp-modal-hint">O áudio deste protocolo ainda não foi enviado no painel (Área da Rosi → Meus áudios). Enquanto isso, respire fundo três vezes e siga em frente.</p>
          )
        ) : (
          <>
            <p className="ritual-prayer">{step.text}</p>
            {step.gratitude && <p className="ritual-gratitude">“{step.gratitude}”</p>}
          </>
        )}

        <div className="ritual-actions">
          <button className="btn btn-primary" onClick={next}>
            {isLast ? 'Concluir ritual' : 'Continuar'}
          </button>
          {stepIdx > 0 && <button className="btn btn-ghost" onClick={() => setStepIdx(stepIdx - 1)}>Voltar</button>}
        </div>
      </div>
    </div>
  )
}
