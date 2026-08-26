import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getOrCreateUser, saveSubscription, recordPageView, updateCurrentUser, getCheckoutUrl } from '../engine/store'
import { useContent } from '../engine/ContentContext.jsx'
import { fetchConfig, verifyAccess, setPassword } from '../api/client.js'
import UpsellModal from '../components/UpsellModal.jsx'
import AppLogo from '../components/AppLogo.jsx'

export default function Subscribe() {
  const user = getOrCreateUser()
  const { content } = useContent()
  const priceLabel = content ? content.pricing.price : '29,99'
  const priceValue = parseFloat(String(priceLabel).replace(',', '.')) || 29.99
  const [step, setStep] = useState('form')
  const [form, setForm] = useState({ name: user.name || '', email: '', method: 'pix' })
  const [error, setError] = useState('')
  const [waiting, setWaiting] = useState(false)
  const [upsellOpen, setUpsellOpen] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState(getCheckoutUrl())
  const [checkoutTarget, setCheckoutTarget] = useState('')
  const [passMode, setPassMode] = useState(false)
  const [passForm, setPassForm] = useState({ password: '', confirm: '' })
  const [passError, setPassError] = useState('')
  const pollRef = useRef(null)

  recordPageView('assinar')

  if (!checkoutUrl) {
    fetchConfig().then((c) => {
      if (c.checkoutUrl) setCheckoutUrl(c.checkoutUrl)
    }).catch(() => {})
  }

  function buildCheckoutUrl(name, email) {
    const url = checkoutUrl || getCheckoutUrl()
    if (!url) return ''
    const sep = url.includes('?') ? '&' : '?'
    return `${url}${sep}name=${encodeURIComponent(name.trim())}&email=${encodeURIComponent(email.trim())}&price=${priceValue.toFixed(2)}`
  }

  function submitForm(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) {
      setError('Preencha seu nome e e-mail para continuar.')
      return
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError('E-mail inválido. Confira e tente de novo.')
      return
    }
    updateCurrentUser({ name: form.name.trim(), email: form.email.trim() })
    setError('')
    if (checkoutUrl) {
      const target = buildCheckoutUrl(form.name, form.email)
      setCheckoutTarget(target)
      window.open(target, '_blank', 'noopener,noreferrer')
      setStep('sent')
      startPolling()
      return
    }
    setStep('confirm')
  }

  function startPolling() {
    if (pollRef.current) return
    const email = form.email.trim()
    pollRef.current = setInterval(async () => {
      const has = await verifyAccess(email)
      if (has.access) {
        clearInterval(pollRef.current)
        pollRef.current = null
        saveSubscription({
          userId: user.id,
          name: form.name.trim(),
          email: email,
          plan: 'mensal',
          price: priceValue,
          method: form.method,
          status: 'ativa'
        })
        setStep('done')
      }
    }, 3000)
  }

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }

  useEffect(() => {
    return () => stopPolling()
  }, [])

  async function confirmPayment() {
    if (waiting) return
    const email = form.email.trim()
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Preciso do seu e-mail para verificar o pagamento.')
      setStep('form')
      return
    }
    setWaiting(true)
    setError('')
    const has = await verifyAccess(email)
    setWaiting(false)
    if (has.access) {
      stopPolling()
      saveSubscription({
        userId: user.id,
        name: form.name.trim(),
        email: email,
        plan: 'mensal',
        price: priceValue,
        method: form.method,
        status: 'ativa'
      })
      setStep('done')
      return
    }
    setError('Ainda não encontrei seu pagamento. Aguarde alguns instantes e toque de novo — ou confirme se concluiu o pagamento na Kiwify.')
  }

  function demoConfirm() {
    saveSubscription({
      userId: user.id,
      name: form.name.trim(),
      email: form.email.trim(),
      plan: 'mensal',
      price: priceValue,
      method: form.method,
      status: 'ativa'
    })
    setStep('done')
  }

  async function createPassword(e) {
    e.preventDefault()
    setPassError('')
    if (!/^\d{4}$/.test(passForm.password)) {
      setPassError('Sua senha precisa ter exatamente 4 números.')
      return
    }
    if (passForm.password !== passForm.confirm) {
      setPassError('As duas senhas não batem. Confira e tente de novo.')
      return
    }
    const email = form.email.trim()
    const res = await setPassword(email, passForm.password)
    if (!res.ok) {
      setPassError('Não foi possível criar sua senha agora. Tente de novo em instantes.')
      return
    }
    updateCurrentUser({ email, subscribed: true, plan: 'mensal' })
    setPassMode(true)
  }

  return (
    <main className="subscribe-page">
      <section className="hero sub-hero">
        <div className="hero-bg">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <div className="container hero-layout fade-up">
          <div className="hero-logo">
            <AppLogo height={180} />
          </div>
          <div className="hero-content">
            <span className="hero-brand">P.A.R.E<sup>®</sup> · terAmim</span>
            <h1 className="hero-title">Assinatura P.A.R.E<sup>®</sup></h1>
            <p className="hero-sub">Voltar para si todos os dias, por menos de R$ 1,00 por dia.</p>
          </div>
        </div>
      </section>

      <section className="container section sub-section">
        <div className="sub-welcome fade-up">
          <div className="sub-welcome-heart">♡</div>
          <div className="sub-welcome-text">
            <p>Parabéns! Essa é tua melhor escolha para o treino de paz diária.</p>
            <p>Coloque seu nome e e-mail e eu já te direciono para a plataforma de pagamento seguro na Kiwify.</p>
            <p className="sub-welcome-guarantee">Fique tranquila, você tem garantia de 7 dias.</p>
          </div>
        </div>

        {step === 'form' && (
          <form className="card sub-form fade-up" onSubmit={submitForm}>
            <h3 className="sub-plan-title">Plano Mensal <span className="chip">R$ {priceLabel}/mês</span></h3>
            <label className="field">
              <span>Seu nome</span>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Como você quer ser chamada" />
            </label>
            <label className="field">
              <span>Seu e-mail</span>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="voce@email.com" />
            </label>
            <label className="field">
              <span>Forma de pagamento</span>
              <div className="methods">
                <button type="button" className={form.method === 'pix' ? 'method active' : 'method'} onClick={() => setForm({ ...form, method: 'pix' })}>
                  Pix
                </button>
                <button type="button" className={form.method === 'card' ? 'method active' : 'method'} onClick={() => setForm({ ...form, method: 'card' })}>
                  Cartão
                </button>
              </div>
            </label>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-lime btn-lg btn-block">{checkoutUrl ? 'Ir para o pagamento seguro' : 'Continuar para o pagamento'}</button>
            {!checkoutUrl && <p className="price-note">Ambiente de demonstração · nenhuma cobrança real é feita.</p>}
          </form>
        )}

        {step === 'sent' && (
          <div className="card sub-form fade-up">
            <h3 className="sub-plan-title">Pagamento seguro iniciado</h3>
            <p className="section-sub" style={{ textAlign: 'left' }}>
              Abrimos o checkout em uma nova aba para você concluir o pagamento com segurança.
              Assim que o pagamento confirmar, seu acesso libera sozinho aqui.
              Se a aba não abriu, toque no botão abaixo.
            </p>
            <a className="btn btn-lime btn-lg btn-block" href={checkoutTarget} target="_blank" rel="noopener noreferrer">
              Abrir página de pagamento
            </a>
            {error && <p className="form-error">{error}</p>}
            <button className="btn btn-lime btn-lg btn-block" style={{ marginTop: 10 }} onClick={confirmPayment} disabled={waiting}>
              {waiting ? 'Verificando seu pagamento...' : 'Já paguei — ativar meu acesso'}
            </button>
            <p className="price-note">Pagou? Seu acesso ativa sozinho em alguns segundos. Se preferir, toque no botão acima.</p>
          </div>
        )}

        {step === 'confirm' && (
          <div className="card sub-form fade-up">
            <h3 className="sub-plan-title">Confirme sua assinatura</h3>
            <p className="confirm-line"><strong>Plano:</strong> Mensal · P.A.R.E<sup>®</sup></p>
            <p className="confirm-line"><strong>Assinante:</strong> {form.name} ({form.email})</p>
            <p className="confirm-line"><strong>Pagamento:</strong> Pix</p>
            <p className="confirm-line"><strong>Valor:</strong> <span className="price-inline">R$ {priceLabel}</span>/mês</p>
            <div className="qrcode-placeholder">
              <div className="qrcode-box">
                <div className="qrcode-grid" />
                <span>Pix copia e cola</span>
              </div>
              <div className="qrcode-text">
                <p>Escaneie o código ou copie a chave Pix para ativar sua assinatura em até 24h.</p>
                <button className="btn btn-ghost" onClick={() => setStep('form')}>Voltar</button>
              </div>
            </div>
            <button className="btn btn-lime btn-lg btn-block" onClick={demoConfirm}>Já paguei — ativar acesso</button>
            <p className="price-note">Ao ativar, você recebe acesso completo na hora (simulação de demonstração).</p>
          </div>
        )}

        {step === 'done' && (
          <div className="card sub-form fade-up center">
            <div className="done-mark">✓</div>
            <h3>Bem-vinda, {form.name.split(' ')[0]}!</h3>
            <p className="section-sub center">
              Sua assinatura está ativa. O sistema nervoso agradece — e a Rosi já foi notificada do seu acesso.
            </p>
            {passMode ? (
              <Link to="/app" className="btn btn-primary btn-lg">Começar meu primeiro treino de paz</Link>
            ) : (
              <form className="sub-pass-form" onSubmit={createPassword}>
                <p className="section-sub center" style={{ textAlign: 'left' }}>
                  Para entrar no aplicativo quando quiser, escolha uma senha de <strong>4 números</strong> e anote para nunca esquecer. Assim você acessa por e-mail e senha em qualquer aparelho.
                </p>
                <label className="field">
                  <span>Escolha sua senha de 4 números</span>
                  <input type="password" inputMode="numeric" maxLength={4} value={passForm.password} onChange={(e) => setPassForm({ ...passForm, password: e.target.value.replace(/\D/g, '').slice(0, 4) })} placeholder="0000" autoComplete="new-password" />
                </label>
                <label className="field">
                  <span>Confirme sua senha</span>
                  <input type="password" inputMode="numeric" maxLength={4} value={passForm.confirm} onChange={(e) => setPassForm({ ...passForm, confirm: e.target.value.replace(/\D/g, '').slice(0, 4) })} placeholder="0000" autoComplete="new-password" />
                </label>
                {passError && <p className="form-error">{passError}</p>}
                <button type="submit" className="btn btn-lime btn-lg btn-block">Criar senha e entrar no app</button>
                <button type="button" className="btn btn-ghost btn-lg btn-block" style={{ marginTop: 10 }} onClick={() => setPassMode(true)}>
                  Agora não — entrar direto
                </button>
              </form>
            )}

            <div className="community-card">
              <span className="chip">Convite de coração</span>
              <h4 className="community-title">Quer caminhar com mais gente?</h4>
              <p className="section-sub center">
                No <strong>Reset Emocional</strong> existe a <strong>Tribo Nova Era</strong>: uma comunidade de mulheres que se
                encontram ao vivo com a Rosi, praticam juntas e seguram a mão umas das outras nessa jornada de voltar para si.
              </p>
              <button className="btn btn-terracotta btn-lg" onClick={() => setUpsellOpen(true)}>
                Quero conhecer a Tribo Nova Era
              </button>
            </div>
          </div>
        )}

        {upsellOpen && <UpsellModal onClose={() => setUpsellOpen(false)} />}
      </section>
    </main>
  )
}
