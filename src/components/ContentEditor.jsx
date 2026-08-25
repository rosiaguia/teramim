import { useState } from 'react'
import { useContent } from '../engine/ContentContext.jsx'

function Field({ label, value, onChange, area }) {
  return (
    <label className="editor-field">
      <span>{label}</span>
      {area ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  )
}

export default function ContentEditor() {
  const { content, update } = useContent()
  const [draft, setDraft] = useState(null)
  const [msg, setMsg] = useState('')
  if (!content) return null
  const d = draft || content

  function setLanding(key, val) { setDraft({ ...d, landing: { ...d.landing, [key]: val } }) }
  function setPricing(key, val) { setDraft({ ...d, pricing: { ...d.pricing, [key]: val } }) }
  function setResp(id, key, val) {
    setDraft({ ...d, respPractices: d.respPractices.map((p) => (p.id === id ? { ...p, [key]: val } : p)) })
  }
  function setAudio(id, key, val) {
    setDraft({ ...d, audioPractices: d.audioPractices.map((p) => (p.id === id ? { ...p, [key]: val } : p)) })
  }

  async function save() {
    const ok = await update(d)
    setMsg(ok ? '✓ Tudo salvo com sucesso! Já está no ar.' : 'Não consegui salvar. Tente de novo.')
    setTimeout(() => setMsg(''), 3500)
  }

  return (
    <section className="card settings-card content-editor">
      <div className="editor-head">
        <div>
          <h3>Painel de Edição</h3>
          <p className="settings-sub">Tudo que você escrever aqui aparece na hora no app. Edite quando quiser — é o seu.</p>
        </div>
        <button className="btn btn-primary" onClick={save}>Salvar tudo</button>
      </div>
      {msg && <p className="settings-saved">{msg}</p>}

      <details className="editor-block" open>
        <summary>💰 Preço e assinatura</summary>
        <div className="editor-grid-2">
          <Field label="Preço mensal (ex.: 29,99)" value={d.pricing.price} onChange={(v) => setPricing('price', v)} />
          <Field label="Preço antigo riscado (ex.: 49,90)" value={d.pricing.oldPrice} onChange={(v) => setPricing('oldPrice', v)} />
        </div>
      </details>

      <details className="editor-block" open>
        <summary>📝 Página inicial (textos)</summary>
        <Field label="Selo acima do título" value={d.landing.chip} onChange={(v) => setLanding('chip', v)} />
        <Field label="Título principal (use quebra de linha quando quiser)" value={d.landing.heroTitle} onChange={(v) => setLanding('heroTitle', v)} area />
        <Field label="Frase de apresentação" value={d.landing.heroSub} onChange={(v) => setLanding('heroSub', v)} area />
        <Field label="Título 'Como o P.A.R.E te conduz'" value={d.landing.stepsTitle} onChange={(v) => setLanding('stepsTitle', v)} />
        <Field label="Frase abaixo desse título" value={d.landing.stepsSub} onChange={(v) => setLanding('stepsSub', v)} area />
        <Field label="Título da seção 'Sistema nervoso'" value={d.landing.section2Title} onChange={(v) => setLanding('section2Title', v)} area />
        <Field label="Texto dessa seção" value={d.landing.section2Sub} onChange={(v) => setLanding('section2Sub', v)} area />
        <Field label="Título do preço" value={d.landing.priceTitle} onChange={(v) => setLanding('priceTitle', v)} />
        <Field label="Frase abaixo do preço" value={d.landing.priceSub} onChange={(v) => setLanding('priceSub', v)} area />
      </details>

      <details className="editor-block">
        <summary>🫁 Práticas RÉSP (nomes e textos)</summary>
        <p className="settings-sub">Os tempos de respiração são fixos por segurança — você edita nome, frase e descrição.</p>
        {d.respPractices.map((p) => (
          <div key={p.id} className="editor-subblock">
            <h5>{p.name}</h5>
            <div className="editor-grid-2">
              <Field label="Nome" value={p.name} onChange={(v) => setResp(p.id, 'name', v)} />
              <Field label="Frase curta (tagline)" value={p.tagline} onChange={(v) => setResp(p.id, 'tagline', v)} />
            </div>
            <div className="editor-grid-2">
              <Field label="Duração" value={p.duration} onChange={(v) => setResp(p.id, 'duration', v)} />
              <span />
            </div>
            <Field label="Descrição" value={p.description} onChange={(v) => setResp(p.id, 'description', v)} area />
          </div>
        ))}
      </details>

      <details className="editor-block">
        <summary>🎧 Áudios guiados (nomes)</summary>
        <p className="settings-sub">Os nomes que aparecem nas práticas. O áudio em si é a sua voz gravada, enviada no painel de áudios.</p>
        {d.audioPractices.map((p) => (
          <div key={p.id} className="editor-subblock">
            <h5>{p.name}</h5>
            <div className="editor-grid-2">
              <Field label="Nome" value={p.name} onChange={(v) => setAudio(p.id, 'name', v)} />
              <Field label="Frase curta (tagline)" value={p.tagline} onChange={(v) => setAudio(p.id, 'tagline', v)} />
            </div>
          </div>
        ))}
      </details>
    </section>
  )
}
