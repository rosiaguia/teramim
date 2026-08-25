import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchAudios } from '../api/client.js'

const SOS_STEPS = [
  { icon: '👁️', title: 'OLHAR HORIZONTE®', time: '30 segundos', text: 'Olhe para um ponto no horizonte, com o olhar acima do nariz. Deixe a visão se abrir e solte os ombros.', action: null },
  { icon: '👂', title: 'Perceba três sons', time: '30 segundos', text: 'Feche os olhos se confortável e perceba três sons ao seu redor, um de cada vez, sem julgar.', action: null },
  { icon: '❤️', title: 'Foque o coração', time: '30 segundos', text: 'Coloque uma mão no coração e a outra na altura do útero. Sinta o coração, apenas sinta.', action: null },
  { icon: '🎵', title: 'Frequência da Cura', time: 'áudio com a voz da Rosi', text: 'O que você está sentindo? Se fosse dar um nome, qual seria? Onde está o peso ou a dor no corpo?', action: 'cura' },
  { icon: '❓', title: 'Uma pergunta', time: 'momento', text: '“O que é verdadeiro sobre mim, neste momento? O que eu realmente quero?”', action: null },
  { icon: '🛡️', title: 'Decreto de segurança', time: 'decreta em voz alta', text: '“Eu estou segura. Este momento passa. Eu escolho o meu corpo. Eu escolho a minha paz.”', action: null }
]

export default function SosFlow() {
  const navigate = useNavigate()
  const [idx, setIdx] = useState(0)
  const [curaOpen, setCuraOpen] = useState(false)
  const [curaUrl, setCuraUrl] = useState(null)
  const [curaLoaded, setCuraLoaded] = useState(false)
  const [calmaOpen, setCalmaOpen] = useState(false)
  const [thanks, setThanks] = useState(false)
  const [curaPlaying, setCuraPlaying] = useState(false)
  const [curaCur, setCuraCur] = useState(0)
  const [curaDur, setCuraDur] = useState(0)
  const curaRef = useRef(null)
  const step = SOS_STEPS[idx]

  useEffect(() => {
    fetchAudios().then((list) => {
      if (list.cura) setCuraUrl(list.cura.url)
      setCuraLoaded(true)
    })
  }, [])

  function finish() {
    window.dispatchEvent(new CustomEvent('teramim:sos-done'))
    navigate('/app')
  }

  function showThanks() {
    setCalmaOpen(false)
    setThanks(true)
  }

  function closeCura() {
    if (curaRef.current) curaRef.current.pause()
    setCuraPlaying(false)
    setCuraOpen(false)
    setIdx(idx + 1)
  }

  function seekCura(clientX, el) {
    const a = curaRef.current
    if (!a || !a.duration) return
    const rect = el.getBoundingClientRect()
    let pct = (clientX - rect.left) / rect.width
    pct = Math.max(0, Math.min(1, pct))
    a.currentTime = pct * a.duration
    setCuraCur(a.currentTime)
  }

  return (
    <div className="sos-flow fade-in">
      {thanks ? (
        <div className="sos-thanks">
          <div className="sos-hero">
            <span className="chip">SOS Fisiológico</span>
            <h2 className="section-title">Muito obrigada.</h2>
          </div>
          <div className="card">
            <div className="done-mark done-mark-heart" style={{ background: '#6B5D8F' }}>♡</div>
            <p className="thanks-line">Lembre-se: você é incrível, maravilhosa e merece ser feliz todos os dias.</p>
            <p className="thanks-line">Fica bem, fica na fonte.</p>
            <p className="thanks-line">Eu estarei sempre aqui para te guiar ao modo paz.</p>
            <div className="resp-actions">
              <button className="btn btn-primary" onClick={finish}>Voltar ao menu</button>
              <button className="btn btn-ghost" onClick={() => { setThanks(false); setIdx(0) }}>Refazer SOS</button>
            </div>
          </div>
        </div>
      ) : (
        <>
      <div className="sos-hero">
        <span className="chip">SOS Fisiológico</span>
        <h2 className="section-title">Para picos de emoção</h2>
        <p className="section-sub">Uma sequência automática para aliviar dor física ou emocional e trazer seu corpo de volta ao modo seguro. Siga um passo de cada vez.</p>
      </div>

      <div className="sos-stage card">
        <div className="sos-progress">
          {SOS_STEPS.map((s, i) => (
            <div key={i} className={i === idx ? 'sos-dot active' : i < idx ? 'sos-dot done' : 'sos-dot'} />
          ))}
        </div>
        <div className="sos-step" key={idx}>
          <div className="sos-icon">{step.icon}</div>
          <h3>{step.title}</h3>
          <span className="sos-time">{step.time}</span>
          <p>{step.text}</p>
        </div>
        <div className="sos-actions">
          {step.action === 'cura' ? (
            <button className="btn btn-primary" onClick={() => setCuraOpen(true)}>Ouvir Frequência da Cura</button>
          ) : (
            <button className="btn btn-primary" onClick={() => (idx === SOS_STEPS.length - 1 ? showThanks() : setIdx(idx + 1))}>
              {idx === SOS_STEPS.length - 1 ? 'Concluir SOS' : 'Próximo passo'}
            </button>
          )}
          {idx > 0 && <button className="btn btn-ghost" onClick={() => setIdx(idx - 1)}>Voltar</button>}
          <button className="btn btn-ghost" onClick={() => setCalmaOpen(true)}>Estou mais calma</button>
        </div>
      </div>
      </>
      )}

      {calmaOpen && (
        <div className="modal-overlay fade-in">
          <div className="modal resp-modal" style={{ '--accent': '#6B5D8F' }}>
            <button className="modal-close" onClick={() => setCalmaOpen(false)} aria-label="Fechar">×</button>
            <span className="chip">Decreto de segurança</span>
            <h3>Decreta comigo</h3>
            <p className="reflect-question">"Eu estou segura. Este momento passa. Eu escolho o meu corpo. Eu escolho a minha paz."</p>
            <div className="sos-tip">
              <strong>Lembrete da TerAmim</strong>
              <p>Daqui a 4 horas, reserve 2–3 minutos para fazer a Respiração Sábia. Ela impede o corpo de voltar a se apertar. Coloque um lembrete no celular agora, querida.</p>
            </div>
            <div className="resp-actions">
              <button className="btn btn-primary" onClick={showThanks}>Concluir</button>
            </div>
          </div>
        </div>
      )}

      {curaOpen && (
        <div className="modal-overlay fade-in">
          <div className="modal resp-modal" style={{ '--accent': '#6B5D8F' }}>
            <button className="modal-close" onClick={closeCura} aria-label="Fechar">×</button>
            <h3>Frequência da Cura</h3>
            <p className="resp-modal-tag">Alívio de dor física ou emocional · voz da Rosi</p>
            {curaUrl ? (
              <>
                <div className="rosi-player rosi-player-inline">
                  <span className="chip">Voz da Rosi</span>
                  <audio
                    ref={curaRef}
                    preload="metadata"
                    src={curaUrl}
                    onTimeUpdate={(e) => setCuraCur(e.currentTarget.currentTime)}
                    onLoadedMetadata={(e) => setCuraDur(e.currentTarget.duration || 0)}
                    onEnded={() => { setCuraPlaying(false); closeCura() }}
                  ></audio>
                  <button
                    className="btn btn-primary btn-lg btn-block audio-play"
                    style={{ background: '#6B5D8F' }}
                    onClick={() => {
                      const a = curaRef.current
                      if (!a) return
                      if (curaPlaying) { a.pause(); setCuraPlaying(false) }
                      else { a.play().catch(() => {}); setCuraPlaying(true) }
                    }}
                  >
                    {curaPlaying ? '⏸ Pausar' : '▶ Começar'}
                  </button>
                  {curaDur > 0 && (
                    <div
                      className="audio-track"
                      style={{ '--track-color': '#6B5D8F' }}
                      onPointerDown={(e) => {
                        if (e.pointerType === 'mouse' && e.button !== 0) return
                        e.currentTarget.setPointerCapture?.(e.pointerId)
                        seekCura(e.clientX, e.currentTarget)
                      }}
                      onPointerMove={(e) => {
                        if (e.buttons !== 1 && e.pointerType !== 'touch') return
                        seekCura(e.clientX, e.currentTarget)
                      }}
                    >
                      <div className="audio-track-fill" style={{ width: `${curaDur ? (curaCur / curaDur) * 100 : 0}%`, background: '#6B5D8F' }} />
                      <div className="audio-track-thumb" style={{ left: `${curaDur ? (curaCur / curaDur) * 100 : 0}%`, background: '#6B5D8F' }} />
                    </div>
                  )}
                  <p className="resp-modal-hint">Toque em Começar, coloque os fones de ouvido e se entregue. Quando o áudio terminar, seguimos automaticamente.</p>
                </div>
              </>
            ) : !curaLoaded ? (
              <p className="resp-modal-hint">Carregando áudio…</p>
            ) : (
              <p className="resp-modal-hint">O áudio da Frequência da Cura ainda não foi enviado no painel (Área da Rosi → Meus áudios → Frequência da Cura). Enquanto isso, respire fundo três vezes e siga para o próximo passo.</p>
            )}
            <div className="resp-actions">
              {!curaUrl && curaLoaded && <button className="btn btn-primary" onClick={closeCura}>Continuar</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
