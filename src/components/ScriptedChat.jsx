import { useEffect, useRef, useState } from 'react'
import { useTeramim } from '../hooks/useTeramim.js'
import { getOrCreateUser, updateCurrentUser } from '../engine/store.js'
import RespModal from './RespModal.jsx'
import UpsellModal from './UpsellModal.jsx'

export default function ScriptedChat({ onReset }) {
  const t = useTeramim()
  const [typed, setTyped] = useState('')
  const [respOpen, setRespOpen] = useState(null)
  const [upsellOpen, setUpsellOpen] = useState(false)
  const [welcomed, setWelcomed] = useState(false)
  const bottomRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    t.ensureSession()
  }, [t.ensureSession])

  useEffect(() => {
    if (t.chat.action && !respOpen && !upsellOpen) {
      const a = t.chat.action
      if (a.type === 'openResp') setRespOpen(a.respId)
      else if (a.type === 'openSos') {
        const el = document.getElementById('sosTabButton')
        if (el) el.click()
      }
      else if (a.type === 'openUpsell') setUpsellOpen(true)
      else if (a.type === 'endSession') {
        t.continueFlow()
      }
      else if (a.type === 'setReminder') {
        t.setReminder(a.time)
        t.continueFlow()
      }
    }
  }, [t.chat.action, respOpen, upsellOpen])

  useEffect(() => {
    const onSosDone = () => {
      t.continueFlow()
    }
    window.addEventListener('teramim:sos-done', onSosDone)
    return () => window.removeEventListener('teramim:sos-done', onSosDone)
  }, [t.continueFlow])

  useEffect(() => {
    bottomRef.current && bottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [t.chat.messages.length, t.chat.replies])

  useEffect(() => {
    if (!welcomed && t.chat.started) {
      setWelcomed(true)
      const cur = getOrCreateUser()
      const timer = setTimeout(() => {
        if (!cur.name) {
          const first = window.prompt('Antes de começar, me conta seu primeiro nome (para eu te chamar por ele):')
          if (first && first.trim()) updateCurrentUser({ name: first.trim() })
        }
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [t.chat.started, welcomed])

  function sendReply(r) {
    t.sendReply(r)
  }

  function sendText(e) {
    e.preventDefault()
    const v = typed.trim()
    if (!v) return
    setTyped('')
    t.sendText(v)
  }

  function afterPractice() {
    setRespOpen(null)
    t.continueFlow()
  }

  return (
    <div className="chat-wrap fade-in">
      <div className="chat-header">
        <div className="chat-avatar">T</div>
        <div className="chat-title">
          <strong>TERAMIM<sup>®</sup></strong>
          <span className="chat-status">presente com você</span>
        </div>
        <button className="chat-reset" onClick={onReset} title="Nova conversa">↻</button>
      </div>
      <div className="chat-scroll" ref={scrollRef}>
        {t.chat.messages.map((m, i) => (
          <div key={i} className={m.role === 'bot' ? 'msg bot' : 'msg user'}>
            {m.text.split('\n').map((line, j) => (
              <p key={j}>{line || '\u00A0'}</p>
            ))}
          </div>
        ))}
        {t.chat.replies && t.chat.replies.length > 0 && (
          <div className="quick-replies">
            {t.chat.replies.map((r) => (
              <button key={r.id} className="quick-reply" onClick={() => sendReply(r)}>
                {r.label}
              </button>
            ))}
          </div>
        )}
        {t.chat.awaiting === 'continue' && (
          <div className="quick-replies">
            <button className="quick-reply" onClick={t.continueFlow}>Continuar</button>
          </div>
        )}
        {t.chat.awaiting === 'text' && (
          <form className="chat-input" onSubmit={sendText}>
            <input
              autoFocus
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Escreva o que vier, sem filtro..."
            />
            <button type="submit" className="btn btn-primary">Enviar</button>
          </form>
        )}
        <div ref={bottomRef} />
      </div>
      {respOpen && <RespModal respId={respOpen} onClose={afterPractice} />}
      {upsellOpen && <UpsellModal onClose={() => setUpsellOpen(false)} />}
    </div>
  )
}
