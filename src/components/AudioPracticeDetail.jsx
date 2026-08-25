import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AUDIO_PRACTICES } from '../data/audioPractices.js'
import { fetchAudios } from '../api/client.js'
import { mergeAudioList } from '../engine/contentStore.js'
import { useContent } from '../engine/ContentContext.jsx'

const AUDIO_LABEL = { morning: 'manha', midday: 'meio_dia', night: 'noite', paz: 'paz' }

export default function AudioPracticeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { content } = useContent()
  const practiceList = content ? mergeAudioList(content.audioPractices) : AUDIO_PRACTICES
  const practice = practiceList.find((p) => p.id === id) || practiceList[0]
  const [customAudios, setCustomAudios] = useState({})
  const [audiosLoaded, setAudiosLoaded] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [audioCur, setAudioCur] = useState(0)
  const [audioDur, setAudioDur] = useState(0)
  const [done, setDone] = useState(false)
  const [thanks, setThanks] = useState(false)
  const audioRef = useRef(null)
  const rosiAudio = customAudios[AUDIO_LABEL[practice.id]]

  useEffect(() => {
    fetchAudios().then((a) => { setCustomAudios(a); setAudiosLoaded(true) })
  }, [])

  useEffect(() => {
    return () => {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = '' }
    }
  }, [])

  useEffect(() => {
    setAudioCur(0); setAudioDur(0); setPlaying(false); setDone(false); setThanks(false)
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0 }
  }, [id])

  function seek(clientX, el) {
    const a = audioRef.current
    if (!a || !a.duration) return
    const rect = el.getBoundingClientRect()
    let pct = (clientX - rect.left) / rect.width
    pct = Math.max(0, Math.min(1, pct))
    a.currentTime = pct * a.duration
    setAudioCur(a.currentTime)
  }

  function toggle() {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else { a.play().catch(() => {}); setPlaying(true) }
  }

  function restart() {
    setThanks(false); setDone(false); setAudioCur(0); setAudioDur(0)
    if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play().catch(() => {}) }
    setPlaying(true)
  }

  if (thanks) {
    return (
      <div className="audio-detail fade-in">
        <div className="audio-stage card audio-thanks" style={{ '--accent': practice.color }}>
          <div className="done-mark done-mark-heart" style={{ background: practice.color }}>♡</div>
          <p className="thanks-line">Muito obrigada.</p>
          <p className="thanks-line">Lembre-se: você é incrível, maravilhosa e merece ser feliz todos os dias.</p>
          <p className="thanks-line">Fica bem, fica na fonte.</p>
          <p className="thanks-line">Eu estarei sempre aqui para te guiar ao modo paz.</p>
          <div className="resp-actions">
            <button className="btn btn-primary" onClick={() => navigate('/app')}>Voltar ao menu</button>
            <button className="btn btn-ghost" onClick={restart}>Praticar novamente</button>
          </div>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="audio-detail fade-in">
        <div className="audio-stage card audio-thanks" style={{ '--accent': practice.color }}>
          <div className="done-mark" style={{ background: practice.color }}>✓</div>
          <p className="resp-modal-tag">Prática completa. Note como seu corpo está agora.</p>
          <div className="resp-actions">
            <button className="btn btn-primary" onClick={() => setThanks(true)}>Concluir</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="audio-detail fade-in">
      <div className="library-head">
        <h2 className="section-title">{practice.icon} {practice.name}</h2>
        <p className="section-sub">{practice.tagline} · {practice.duration}</p>
      </div>

      <div className="audio-stage card" style={{ '--accent': practice.color }}>
        {rosiAudio ? (
          <div className="rosi-player">
            <div className="rosi-player-head">
              <span className="chip">Voz da Rosi</span>
              <span>Áudio com a voz da Rosi — toca do jeito que ela conduz.</span>
            </div>
            <audio
              ref={audioRef}
              preload="auto"
              src={rosiAudio.url}
              onTimeUpdate={(e) => setAudioCur(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setAudioDur(e.currentTarget.duration || 0)}
              onEnded={() => { setPlaying(false); setDone(true) }}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            ></audio>
            <button
              className="btn btn-primary btn-lg btn-block audio-play"
              style={{ background: practice.color }}
              onClick={toggle}
            >
              {playing ? '⏸ Pausar' : '▶ Começar'}
            </button>
            {audioDur > 0 && (
              <div
                className="audio-track"
                style={{ '--track-color': practice.color }}
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
                <div className="audio-track-fill" style={{ width: `${audioDur ? (audioCur / audioDur) * 100 : 0}%`, background: practice.color }} />
                <div className="audio-track-thumb" style={{ left: `${audioDur ? (audioCur / audioDur) * 100 : 0}%`, background: practice.color }} />
              </div>
            )}
            {!playing && <p className="resp-modal-hint">Toque em Começar e deixe a voz da Rosi te guiar. Use fones para mergulhar melhor.</p>}
          </div>
        ) : !audiosLoaded ? (
          <div className="audio-empty">
            <p className="resp-modal-hint">Carregando áudio…</p>
          </div>
        ) : (
          <div className="audio-empty">
            <p className="resp-modal-hint">
              O áudio desta prática ainda não foi enviado. A Rosi pode subir os MP3 dela no painel (Área da Rosi → Meus áudios) para que toque aqui com a voz dela.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
