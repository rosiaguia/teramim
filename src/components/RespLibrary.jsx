import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RESP_LIBRARY, TONE_COLORS } from '../data/respLibrary.js'
import { fetchAudios } from '../api/client.js'
import { mergeRespList } from '../engine/contentStore.js'
import { useContent } from '../engine/ContentContext.jsx'

const AUDIO_LABEL = { alivio: 'alivio', zero: 'zero', boot: 'boot', equi: 'equi', foco: 'foco' }

export default function RespLibrary() {
  const [audios, setAudios] = useState({})
  const { content } = useContent()
  const list = content ? mergeRespList(content.respPractices) : RESP_LIBRARY

  useEffect(() => { fetchAudios().then(setAudios) }, [])

  return (
    <div className="library">
      <div className="library-head">
        <h2 className="section-title">Biblioteca RÉSP<sup>®</sup></h2>
        <p className="section-sub">
          <span className="library-upper">Práticas para o modo paz · Escolha a sua:</span><br />
          Protocolos de Breathwork consciente, de 2 a 10 ciclos, com voz da Rosi Aguiar.<br />
          <span className="library-states">Alívio · Sono · Energia · Equilíbrio · Foco · Você e sua essência</span>
        </p>
        <p className="library-explanation">Breathwork é a prática de usar a respiração de forma consciente para regular o sistema nervoso, acalmar a mente e devolver o equilíbrio ao corpo.</p>
        <p className="breath-note">Escolha a voz da Rosi, use fones de ouvido, feche os olhos e se entregue.</p>
      </div>
      <div className="resp-grid">
        {list.map((r, i) => {
          const hasAudio = Boolean(audios[AUDIO_LABEL[r.id]])
          return (
            <Link key={r.id} to={`/app/respiracao/${r.id}`} className="resp-card resp-card-btn fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="resp-card-tag" style={{ color: TONE_COLORS[r.tone] }}>{r.tagline}</div>
              <h3>{r.name}</h3>
              <p className="resp-card-desc">{r.description}</p>
              <div className="resp-card-foot">
                <span className="resp-card-dur">{r.duration}</span>
                {hasAudio && <span className="chip">🎧 voz da Rosi</span>}
                <span className="resp-play">Começar ▶</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
