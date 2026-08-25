import { useEffect, useRef, useState } from 'react'

function fmt(secs) {
  if (!isFinite(secs) || secs < 0) return '0:00'
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function ProtocolPlayer({ protocol, audioUrl, onFinish, onBack, startLabel = 'Começar', autoStart = false }) {
  const audioRef = useRef(null)
  const autoPlayedRef = useRef(false)
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [ended, setEnded] = useState(false)
  const color = protocol.color || '#7A8B6F'

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [])

  useEffect(() => {
    if (autoStart && !started) {
      setStarted(true)
      setEnded(false)
      setProgress(0)
      setCurrent(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart])

  useEffect(() => {
    if (started && !autoPlayedRef.current) {
      autoPlayedRef.current = true
      const a = audioRef.current
      if (a) {
        a.currentTime = 0
        a.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
      }
    }
  }, [started])

  function start() {
    setStarted(true)
    setEnded(false)
    setProgress(0)
    setCurrent(0)
  }

  function toggle() {
    const a = audioRef.current
    if (!a) return
    if (a.paused) {
      a.play().catch(() => {})
      setPlaying(true)
    } else {
      a.pause()
      setPlaying(false)
    }
  }

  function onTime() {
    const a = audioRef.current
    if (!a) return
    setCurrent(a.currentTime)
    if (a.duration && isFinite(a.duration)) {
      setProgress((a.currentTime / a.duration) * 100)
    }
  }

  function onLoaded() {
    const a = audioRef.current
    if (a && a.duration && isFinite(a.duration)) setDuration(a.duration)
  }

  function onEnd() {
    setPlaying(false)
    setEnded(true)
    if (onFinish) onFinish()
  }

  function seekTo(clientX, el) {
    const a = audioRef.current
    if (!a || !a.duration) return
    const rect = el.getBoundingClientRect()
    let pct = (clientX - rect.left) / rect.width
    pct = Math.max(0, Math.min(1, pct))
    a.currentTime = pct * a.duration
    setProgress(pct * 100)
    setCurrent(a.currentTime)
  }

  const trackRef = useRef(null)

  function onPointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    seekTo(e.clientX, e.currentTarget)
  }

  function onPointerMove(e) {
    if (e.buttons !== 1 && e.pointerType !== 'touch') return
    seekTo(e.clientX, e.currentTarget)
  }

  return (
    <div className="protocol-card card fade-up" style={{ '--accent': color }}>
      <div className="protocol-head">
        <span className="chip" style={{ color }}>Protocolo · voz da Rosi</span>
        <h3 className="protocol-title">{protocol.name}</h3>
        <p className="protocol-tagline">{protocol.tagline}</p>
        <p className="protocol-desc">{protocol.description}</p>
        <span className="protocol-duration">⏱ {protocol.duration}</span>
      </div>

      {!started ? (
        <button className="btn btn-primary btn-lg btn-block protocol-start" style={{ background: color }} onClick={start}>
          ▶ {startLabel}
        </button>
      ) : (
        <div className="sensing-player">
          <audio
            ref={audioRef}
            src={audioUrl}
            preload="metadata"
            onTimeUpdate={onTime}
            onLoadedMetadata={onLoaded}
            onEnded={onEnd}
            onPause={() => setPlaying(false)}
            onPlay={() => setPlaying(true)}
          />
          <div className="player-times">
            <span>{fmt(current)}</span>
            <span>{fmt(duration)}</span>
          </div>
          <div
            ref={trackRef}
            className="player-track"
            style={{ '--track-color': color }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
          >
            <div className="player-fill" style={{ width: `${progress}%`, background: color }} />
            <div className="player-thumb" style={{ left: `${progress}%`, background: color }} />
          </div>
          <div className="player-actions">
            <button className="player-btn" onClick={toggle} aria-label={playing ? 'Pausar' : 'Tocar'}>
              {playing ? '⏸' : '▶'}
            </button>
            {ended && <button className="btn btn-primary btn-sm" style={{ background: color }} onClick={onFinish}>Finalizar</button>}
            {onBack && <button className="btn btn-ghost btn-sm" onClick={onBack}>Voltar</button>}
          </div>
        </div>
      )}
    </div>
  )
}
