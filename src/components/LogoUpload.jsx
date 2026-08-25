import { useEffect, useRef, useState } from 'react'
import { fetchLogo, uploadLogo } from '../api/client.js'

export default function LogoUpload() {
  const [logo, setLogo] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const fileRef = useRef(null)

  async function load() {
    const url = await fetchLogo()
    setLogo(url)
  }

  useEffect(() => { load() }, [])

  async function onFile(file) {
    if (!file) return
    setUploading(true)
    setMsg('')
    try {
      const r = await uploadLogo(file)
      setLogo(r.url)
      setMsg('Logo enviado com sucesso! Já aparece no app. ✓')
    } catch (e) {
      setMsg('Não consegui enviar esse arquivo. Use PNG, JPG, WEBP ou SVG.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <section className="card audio-upload-card">
      <h3>Logo do app</h3>
      <p className="settings-sub">
        Escolha a imagem do logo (PNG, JPG ou WEBP) no seu celular e ela aparece no topo e na tela inicial do app.
      </p>
      {msg && <p className="settings-saved">{msg}</p>}
      <div className="logo-upload-row">
        {logo && (
          <img
            className="logo-preview"
            src={logo}
            alt="Logo"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
          style={{ display: 'none' }}
          onChange={(e) => onFile(e.target.files && e.target.files[0])}
        />
        <button
          className="btn btn-sm btn-ghost"
          disabled={uploading}
          onClick={() => fileRef.current && fileRef.current.click()}
        >
          {uploading ? 'Enviando...' : logo ? 'Trocar logo' : 'Enviar logo'}
        </button>
      </div>
    </section>
  )
}
