import { useEffect, useRef, useState } from 'react'
import { fetchConfig } from '../api/client.js'
import AiChat from './AiChat.jsx'
import ScriptedChat from './ScriptedChat.jsx'

export default function ChatWindow() {
  const [sessionKey, setSessionKey] = useState(1)
  const [mode, setMode] = useState('loading')

  useEffect(() => {
    let alive = true
    fetchConfig().then((c) => {
      if (alive) setMode(c.aiConfigured ? 'ai' : 'scripted')
    })
    return () => { alive = false }
  }, [])

  if (mode === 'loading') {
    return (
      <div className="chat-wrap chat-loading fade-in">
        <div className="chat-avatar">T</div>
        <p>conectando com a TERAMIM...</p>
      </div>
    )
  }

  return mode === 'ai'
    ? <AiChat key={sessionKey} onReset={() => setSessionKey((k) => k + 1)} />
    : <ScriptedChat key={sessionKey} onReset={() => setSessionKey((k) => k + 1)} />
}
