import { useEffect, useRef, useState } from 'react'
import { RESP_LIBRARY, TONE_COLORS } from '../data/respLibrary.js'
import { mergeRespList } from '../engine/contentStore.js'
import { useContent } from '../engine/ContentContext.jsx'
import BreathingScene from './BreathingScene.jsx'

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms))
}

export default function RespModal({ respId, onClose, onDone, standalone, customAudioUrl }) {
  const { content } = useContent()
  const list = content ? mergeRespList(content.respPractices) : RESP_LIBRARY
  const resp = list.find((r) => r.id === respId) || list[0] || RESP_LIBRARY[0]
  const color = TONE_COLORS[resp.tone] || '#7A8B6F'
  const audioMode = Boolean(customAudioUrl)
  const audioRef = useRef(null)
  const [running, setRunning] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [audioCur, setAudioCur] = useState(0)
  const [audioDur, setAudioDur] = useState(0)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [cycle, setCycle] = useState(1)
  const [secLeft, setSecLeft] = useState(0)
  const [done, setDone] = useState(false)
  const [thanks, setThanks] = useState(false)
  const [paused, setPaused] = useState(false)
  const stopRef = useRef(false)
  const pausedRef = useRef(false)

  function start() {
    setRunning(true)
    setDone(false)
    setCycle(1)
    setPhaseIdx(0)
    stopRef.current = false
    pausedRef.current = false
    run()
  }

  async function run() {
    for (let c = 1; c <= resp.cycles && !stopRef.current; c++) {
      for (let p = 0; p < resp.pattern.length && !stopRef.current; p++) {
        const phase = resp.pattern[p]
        setCycle(c)
        setPhaseIdx(p)
        for (let s = Math.ceil(phase.secs); s > 0; s--) {
          if (stopRef.current) return
          while (pausedRef.current) {
            await delay(150)
            if (stopRef.current) return
          }
          setSecLeft(s)
          await delay(1000)
        }
      }
    }
    if (!stopRef.current) {
      setDone(true)
      setRunning(false)
    }
  }

  useEffect(() => {
    return () => { stopRef.current = true }
  }, [])

  function stop() {
    stopRef.current = true
    setRunning(false)
    setPaused(false)
    setSecLeft(0)
    setAudioPlaying(false)
    if (audioRef.current) audioRef.current.pause()
  }

  function seekAudio(clientX, el) {
    const a = audioRef.current
    if (!a || !a.duration) return
    const rect = el.getBoundingClientRect()
    let pct = (clientX - rect.left) / rect.width
    pct = Math.max(0, Math.min(1, pct))
    a.currentTime = pct * a.duration
    setAudioCur(a.currentTime)
  }

  const phase = resp.pattern[phaseIdx]

  return (
    <div className="modal-overlay fade-in">
      <div className="modal resp-modal" style={{ '--accent': color }}>
        <button className="modal-close" onClick={() => { stop(); onClose && onClose() }} aria-label="Fechar">×</button>
        <h3>{resp.name}</h3>
        <p className="resp-modal-tag">{resp.tagline} · {resp.duration}</p>

        {thanks ? (
          <div className="resp-thanks">
            <div className="done-mark done-mark-heart" style={{ background: color }}>♡</div>
            <p className="thanks-line">Muito obrigada.</p>
            <p className="thanks-line">Lembre-se: você é incrível, maravilhosa e merece ser feliz todos os dias.</p>
            <p className="thanks-line">Fica bem, fica na fonte.</p>
            <p className="thanks-line">Eu estarei sempre aqui para te guiar ao modo paz.</p>
            <div className="resp-actions">
              <button className="btn btn-primary" onClick={() => { stop(); onClose && onClose() }}>Voltar ao menu</button>
              <button className="btn btn-ghost" onClick={() => { setThanks(false); setDone(false); setRunning(false); setAudioPlaying(false); if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0 } }}>Praticar novamente</button>
            </div>
          </div>
        ) : done ? (
          <div className="resp-done">
            <div className="done-mark" style={{ background: color }}>✓</div>
            <p>Prática completa. Note como seu corpo está agora.</p>
            <div className="resp-actions">
              <button className="btn btn-primary" onClick={() => { stop(); setThanks(true) }}>Concluir a respiração</button>
            </div>
          </div>
        ) : audioMode ? (
          <>
            <div className="breathe-stage">
              <div className="breathe-scene">
                <BreathingScene />
              </div>
              <span className="breathe-phase">Feche os olhos, fones de ouvido, e deixe a voz da Rosi te guiar.</span>
            </div>
            <div className="rosi-player rosi-player-inline">
              <span className="chip">Voz da Rosi</span>
              <audio
                ref={audioRef}
                preload="metadata"
                src={customAudioUrl}
                onTimeUpdate={(e) => setAudioCur(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setAudioDur(e.currentTarget.duration || 0)}
                onEnded={() => { setAudioPlaying(false); setDone(true) }}
              ></audio>
              <button
                className="btn btn-primary btn-lg btn-block audio-play"
                style={{ background: color }}
                onClick={() => {
                  const a = audioRef.current
                  if (!a) return
                  if (audioPlaying) { a.pause(); setAudioPlaying(false) }
                  else { a.play().catch(() => {}); setAudioPlaying(true) }
                }}
              >
                {audioPlaying ? '⏸ Pausar' : '▶ Começar'}
              </button>
              {audioDur > 0 && (
                <div
                  className="audio-track"
                  style={{ '--track-color': color }}
                  onPointerDown={(e) => {
                    if (e.pointerType === 'mouse' && e.button !== 0) return
                    e.currentTarget.setPointerCapture?.(e.pointerId)
                    seekAudio(e.clientX, e.currentTarget)
                  }}
                  onPointerMove={(e) => {
                    if (e.buttons !== 1 && e.pointerType !== 'touch') return
                    seekAudio(e.clientX, e.currentTarget)
                  }}
                >
                  <div className="audio-track-fill" style={{ width: `${audioDur ? (audioCur / audioDur) * 100 : 0}%`, background: color }} />
                  <div className="audio-track-thumb" style={{ left: `${audioDur ? (audioCur / audioDur) * 100 : 0}%`, background: color }} />
                </div>
              )}
              {!audioPlaying && <p className="resp-modal-hint">Toque em Começar e deixe a voz te guiar.</p>}
            </div>
            {!standalone && <p className="resp-modal-hint">Respiração guiada pela TERAMIM. Não force: no seu ritmo.</p>}
          </>
        ) : (
          <>
            <div className="breathe-stage">
              <div className="breathe-scene" style={{ animation: running && !paused ? 'sceneDrift 40s linear infinite' : 'none' }}>
                <BreathingScene />
                <span className="breathe-sec breathe-sec-overlay">{secLeft > 0 ? secLeft : ''}</span>
              </div>
              <span className="breathe-phase">{paused ? 'Pausa' : (phase ? phase.phase : '')}</span>
              {phase && <span className="breathe-tip">{phase.tip}</span>}
            </div>

            <div className="resp-progress">
              <span>Ciclo {cycle} de {resp.cycles}</span>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${(cycle / resp.cycles) * 100}%`, background: color }} />
              </div>
            </div>

            <div className="resp-actions">
              {!running ? (
                <button className="btn btn-primary" onClick={start}>Começar</button>
              ) : (
                <>
                  <button className="btn btn-ghost" onClick={() => { pausedRef.current = !pausedRef.current; setPaused(!paused) }}>
                    {paused ? 'Continuar' : 'Pausar'}
                  </button>
                  <button className="btn btn-ghost" onClick={() => { stop(); onClose && onClose() }}>Encerrar</button>
                </>
              )}
            </div>
            {!standalone && <p className="resp-modal-hint">Respiração guiada pela TERAMIM. Não force: no seu ritmo.</p>}
          </>
        )}
      </div>
    </div>
  )
}
