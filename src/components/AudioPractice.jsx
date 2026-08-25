import { Link } from 'react-router-dom'
import { AUDIO_PRACTICES } from '../data/audioPractices.js'
import { mergeAudioList } from '../engine/contentStore.js'
import { useContent } from '../engine/ContentContext.jsx'

export default function AudioPractice() {
  const { content } = useContent()
  const practiceList = content ? mergeAudioList(content.audioPractices) : AUDIO_PRACTICES

  return (
    <div className="audio-practice fade-in">
      <div className="library-head">
        <h2 className="section-title">Protocolos de Breathwork</h2>
        <p className="section-sub">Práticas fixas com a voz da Rosi para os momentos do seu dia: manhã, meio-dia e noite — com fundo musical sutil de frequência de cura. Escolha um e ele abre para você.</p>
      </div>

      <div className="audio-select">
        {practiceList.map((p) => (
          <Link
            key={p.id}
            to={`/app/protocolos/${p.id}`}
            className="audio-card audio-card-link"
            style={{ borderColor: 'transparent' }}
          >
            <div className="audio-icon" style={{ background: p.color }}>{p.icon}</div>
            <div className="audio-meta">
              <strong>{p.name}</strong>
              <span>{p.tagline} · {p.duration}</span>
            </div>
            <span className="audio-freq">{p.frequency}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
