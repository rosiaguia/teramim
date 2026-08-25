import { useEffect, useRef, useState } from 'react'
import { askAi } from '../api/client.js'
import { parseAiReply } from '../engine/aiMarkers.js'
import { getOrCreateUser, updateCurrentUser, touchAccess, saveReminder } from '../engine/store.js'
import { EMOTION_MAP } from '../data/emotions.js'
import RespModal from './RespModal.jsx'
import UpsellModal from './UpsellModal.jsx'

export default function AiChat({ onReset }) {
  const userRef = useRef(null)
  const sessionRef = useRef(null)
  const messagesRef = useRef([])
  const busyRef = useRef(false)

  const [messages, setMessages] = useState([])
  const [replies, setReplies] = useState([])
  const [busy, setBusy] = useState(false)
  const [respOpen, setRespOpen] = useState(null)
  const [upsellOpen, setUpsellOpen] = useState(false)
  const [ended, setEnded] = useState(false)
  const [error, setError] = useState('')
  const [typed, setTyped] = useState('')
  const [welcomed, setWelcomed] = useState(false)
  const bottomRef = useRef(null)

  function setMessagesAll(next) {
    messagesRef.current = next
    setMessages(next)
  }

  function applyReply(raw) {
    const { text, replies: q, action } = parseAiReply(raw)
    if (text) setMessagesAll([...messagesRef.current, { role: 'bot', text }])
    setReplies(q)
    if (action) {
      if (action.type === 'openResp') setRespOpen(action.respId)
      else if (action.type === 'openSos') {
        const el = document.getElementById('sosTabButton')
        if (el) el.click()
      }
      else if (action.type === 'openUpsell') setUpsellOpen(true)
      else if (action.type === 'endSession') setEnded(true)
      else if (action.type === 'setReminder') {
        saveReminder(userRef.current.id, action.time)
        setMessagesAll([...messagesRef.current, { role: 'bot', text: `Combinado. ${action.time} — eu vou estar aqui. Você recebe o aviso e a gente faz a prática orientada do dia.` }])
      }
    }
  }

  function payload() {
    return messagesRef.current.map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }))
  }

  async function callAi() {
    setBusy(true)
    setError('')
    setReplies([])
    try {
      const reply = await askAi(payload(), userRef.current.name)
      applyReply(reply)
    } catch (e) {
      if (e.message === 'AI_NOT_CONFIGURED') {
        setError('A IA ainda não foi conectada. Peça à Rosi para adicionar a chave de IA no servidor.')
      } else {
        setError('Não consegui me conectar agora. Respira comigo e tenta de novo em instantes.')
      }
      setReplies([{ id: 'ai_retry', label: 'Tentar de novo' }])
    } finally {
      setBusy(false)
    }
  }

  async function greet() {
    if (busyRef.current) return
    busyRef.current = true
    try {
      const reply = await askAi([], userRef.current.name)
      applyReply(reply)
    } catch (e) {
      const name = userRef.current.name ? `, ${userRef.current.name}` : ''
      setMessagesAll([{ role: 'bot', text: `Olá${name}. Que bom ter você aqui. Eu sou a TERAMIM.\n\nComo você está SE sentindo agora?` }])
      setReplies(EMOTION_MAP.map((e, i) => ({ id: 'em_' + e.id, label: e.label })).concat([{ id: 'sos', label: 'Preciso de um SOS agora' }]))
    } finally {
      busyRef.current = false
      setBusy(false)
    }
  }

  async function send(text) {
    const v = String(text || '').trim()
    if (!v || busyRef.current) return
    busyRef.current = true
    setBusy(true)
    setError('')
    setReplies([])
    setMessagesAll([...messagesRef.current, { role: 'user', text: v }])
    try {
      const reply = await askAi(payload(), userRef.current.name)
      applyReply(reply)
    } catch (e) {
      setError('Não consegui me conectar agora. Respira comigo e tenta de novo em instantes.')
      setReplies([{ id: 'ai_retry', label: 'Tentar de novo' }])
    } finally {
      busyRef.current = false
      setBusy(false)
    }
  }

  function sendReply(r) {
    if (r.id === 'ai_retry') callAi()
    else send(r.label)
  }

  useEffect(() => {
    if (sessionRef.current) return
    sessionRef.current = { id: 'ses_' + Math.random().toString(36).slice(2, 10), startedAt: new Date().toISOString(), page: 'app' }
    userRef.current = getOrCreateUser()
    touchAccess(sessionRef.current, userRef.current)
  }, [])

  useEffect(() => {
    if (!welcomed) {
      setWelcomed(true)
      const cur = getOrCreateUser()
      const timer = setTimeout(() => {
        if (!cur.name) {
          const first = window.prompt('Antes de começar, me conta seu primeiro nome (para eu te chamar por ele):')
          if (first && first.trim()) {
            cur.name = first.trim()
            updateCurrentUser({ name: first.trim() })
          }
        }
        greet()
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [welcomed])

  useEffect(() => {
    const onSosDone = () => send('Concluí o SOS.')
    window.addEventListener('teramim:sos-done', onSosDone)
    return () => window.removeEventListener('teramim:sos-done', onSosDone)
  }, [])

  useEffect(() => {
    bottomRef.current && bottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, replies.length, busy])

  function practiceDone() {
    setRespOpen(null)
    send('Concluí a prática de respiração.')
  }

  function submit(e) {
    e.preventDefault()
    const v = typed.trim()
    if (!v) return
    setTyped('')
    send(v)
  }

  return (
    <div className="chat-wrap fade-in">
      <div className="chat-header">
        <div className="chat-avatar">T</div>
        <div className="chat-title">
          <strong>TERAMIM<sup>®</sup></strong>
          <span className="chat-status">{busy ? 'está sentindo você...' : 'presente com você'}</span>
        </div>
        <button className="chat-reset" onClick={onReset} title="Nova conversa">↻</button>
      </div>
      <div className="chat-scroll">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'bot' ? 'msg bot' : 'msg user'}>
            {m.text.split('\n').map((line, j) => <p key={j}>{line || '\u00A0'}</p>)}
          </div>
        ))}
        {busy && (
          <div className="msg bot typing">
            <span className="dot" /><span className="dot" /><span className="dot" />
          </div>
        )}
        {error && <p className="ai-error">{error}</p>}
        {!ended && !busy && replies.length > 0 && (
          <div className="quick-replies">
            {replies.map((r) => (
              <button key={r.id} className="quick-reply" onClick={() => sendReply(r)}>{r.label}</button>
            ))}
          </div>
        )}
        {!ended && (
          <form className="chat-input" onSubmit={submit}>
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Escreva como você está se sentindo..."
              disabled={busy}
            />
            <button type="submit" className="btn btn-primary" disabled={busy}>Enviar</button>
          </form>
        )}
        {ended && (
          <div className="session-end fade-in">
            <p>Paz não é evento. Paz é treino. Eu estou aqui sempre que você quiser voltar para si.</p>
            <button className="btn btn-primary" onClick={onReset}>Começar nova conversa</button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      {respOpen && <RespModal respId={respOpen} onClose={practiceDone} />}
      {upsellOpen && <UpsellModal onClose={() => setUpsellOpen(false)} />}
    </div>
  )
}
