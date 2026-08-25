import { useEffect, useRef, useState } from 'react'
import { fetchAudios, uploadAudio } from '../api/client.js'

const SLOTS = [
  { id: 'manha', name: 'Soltíria', hint: 'Manhã' },
  { id: 'meio_dia', name: 'Respira Sábia', hint: 'Meio-dia' },
  { id: 'noite', name: 'Fecha Ciclo', hint: 'Noite' },
  { id: 'paz', name: 'Paz', hint: 'Quando precisar' },
  { id: 'cura', name: 'Frequência da Cura', hint: 'Alívio de dor física ou emocional' },
  { id: 'alivio', name: 'RÉSP ALÍVIO®', hint: 'Suspiro fisiológico' },
  { id: 'zero', name: 'RÉSP ZERO®', hint: '4/8 dormir' },
  { id: 'boot', name: 'RÉSP BOOT®', hint: 'Energia' },
  { id: 'equi', name: 'RÉSP EQUI®', hint: 'Narinas alternadas' },
  { id: 'foco', name: 'RÉSP FOCO®', hint: 'Caixa 4/4/4/4' },
  { id: 'outro', name: 'Conexão Corpo Presença', hint: 'Material de referência' }
]

export default function AudioUpload() {
  const [audios, setAudios] = useState({})
  const [uploading, setUploading] = useState(null)
  const [msg, setMsg] = useState('')
  const fileRefs = useRef({})

  async function load() {
    const list = await fetchAudios()
    setAudios(list)
  }

  useEffect(() => { load() }, [])

  async function onFile(slot, file) {
    if (!file) return
    setUploading(slot)
    setMsg('')
    try {
      const r = await uploadAudio(file, slot)
      setMsg(`${SLOTS.find((s) => s.id === slot).name}: áudio enviado com sucesso! ✓`)
      await load()
    } catch (e) {
      setMsg('Não consegui enviar esse arquivo. Tenta de novo.')
    } finally {
      setUploading(null)
    }
  }

  return (
    <section className="card audio-upload-card">
      <h3>Meus áudios (a sua voz)</h3>
      <p className="settings-sub">
        Toque em um espaço, escolha o arquivo MP3 do seu celular e ele entra no lugar certo do app.
        Se o arquivo for vídeo, me avisa no chat que eu extraio o som.
      </p>
      {msg && <p className="settings-saved">{msg}</p>}
      <div className="audio-slots">
        {SLOTS.map((s) => {
          const has = audios[s.id]
          return (
            <div key={s.id} className={has ? 'audio-slot has' : 'audio-slot'}>
              <div className="audio-slot-info">
                <strong>{s.name}</strong>
                <span>{has ? '✓ voz da Rosi' : s.hint}</span>
              </div>
              <div className="audio-slot-actions">
                {has && <a className="slot-play" href={audios[s.id].url} target="_blank" rel="noreferrer">▶</a>}
                <input
                  ref={(el) => { fileRefs.current[s.id] = el }}
                  type="file"
                  accept="audio/*"
                  style={{ display: 'none' }}
                  onChange={(e) => onFile(s.id, e.target.files && e.target.files[0])}
                />
                <button
                  className="btn btn-sm btn-ghost"
                  disabled={uploading === s.id}
                  onClick={() => fileRefs.current[s.id] && fileRefs.current[s.id].click()}
                >
                  {uploading === s.id ? 'Enviando...' : has ? 'Trocar' : 'Enviar'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
