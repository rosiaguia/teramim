import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getOrCreateUser, updateCurrentUser, saveSubscription } from '../engine/store'
import { loginUser, setPassword } from '../api/client.js'
import AppLogo from '../components/AppLogo.jsx'

const SUPPORT_PHONE = '(51) 99403-4879'
const SUPPORT_WA = 'https://wa.me/5551994034879'

export default function Login() {
  const navigate = useNavigate()
  const user = getOrCreateUser()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ email: user.email || '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [waiting, setWaiting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const saved = getOrCreateUser()
    if (saved.email) {
      setForm((f) => ({ ...f, email: f.email || saved.email }))
    }
  }, [])

  function validateEmail(email) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
  }

  function onlyDigits(v) {
    return v.replace(/\D/g, '').slice(0, 4)
  }

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    const email = form.email.trim()
    if (!email || !validateEmail(email)) {
      setError('Digite o e-mail que você usou para pagar.')
      return
    }
    if (form.password.length < 4) {
      setError('Digite sua senha de 4 números.')
      return
    }
    setWaiting(true)
    const res = await loginUser(email, form.password)
    setWaiting(false)
    if (res.access) {
      updateCurrentUser({ email, subscribed: true, plan: 'mensal', name: res.name || user.name || '' })
      saveSubscription({ userId: user.id, name: res.name || '', email, plan: 'mensal', status: 'ativa' })
      setSuccess(true)
      setTimeout(() => navigate('/app'), 800)
      return
    }
    if (res.needPassword) {
      setMode('create')
      setError('')
      return
    }
    if (res.reason === 'expirado') {
      setError('Sua assinatura venceu. Renove para continuar acessando o aplicativo.')
      return
    }
    if (res.reason === 'no_access') {
      setError('Não encontramos seu pagamento com esse e-mail. Se você já pagou, confira se digitou o mesmo e-mail usado na compra — ou entre em contato com a Rosi pelo WhatsApp.')
      return
    }
    setError('Senha incorreta. Tente de novo — ou use a opção abaixo se ainda não criou sua senha.')
  }

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    const email = form.email.trim()
    if (!email || !validateEmail(email)) {
      setError('Digite o e-mail que você usou para pagar.')
      return
    }
    if (form.password.length < 4) {
      setError('Sua senha precisa ter 4 números.')
      return
    }
    if (form.password !== form.confirm) {
      setError('As duas senhas não batem. Confira e tente de novo.')
      return
    }
    setWaiting(true)
    const res = await setPassword(email, form.password)
    if (!res.ok) {
      setWaiting(false)
      if (res.error === 'sem_acesso') {
        setError('Não encontramos seu pagamento com esse e-mail. Se você já pagou, aguarde alguns instantes e tente de novo — ou chame a Rosi no WhatsApp.')
      } else if (res.error === 'acesso_expirado') {
        setError('Sua assinatura venceu. Renove para continuar acessando o aplicativo.')
      } else if (res.error === 'senha_4_digitos') {
        setError('Sua senha precisa ter exatamente 4 números.')
      } else {
        setError('Não foi possível criar sua senha agora. Tente de novo em instantes.')
      }
      return
    }
    const loginRes = await loginUser(email, form.password)
    setWaiting(false)
    if (loginRes.access) {
      updateCurrentUser({ email, subscribed: true, plan: 'mensal', name: loginRes.name || user.name || '' })
      saveSubscription({ userId: user.id, name: loginRes.name || '', email, plan: 'mensal', status: 'ativa' })
      setSuccess(true)
      setTimeout(() => navigate('/app'), 800)
      return
    }
    setMode('login')
  }

  if (success) {
    return (
      <main className="lock-page">
        <section className="hero sub-hero">
          <div className="hero-bg">
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
          </div>
          <div className="container hero-layout fade-up">
            <div className="hero-logo">
              <AppLogo height={160} />
            </div>
            <div className="hero-content">
              <span className="hero-brand">P.A.R.E<sup>®</sup> · terAmim</span>
              <h1 className="hero-title" style={{ fontSize: 'clamp(26px, 4vw, 38px)' }}>Bem-vinda de volta.</h1>
              <p className="hero-sub">Seu acesso está liberado. Preparando seu espaço de paz...</p>
            </div>
          </div>
        </section>
      </main>
    )
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
            <h1 className="hero-title">{mode === 'login' ? 'Você já pagou?' : 'Seja bem-vinda!'}</h1>
            <p className="hero-sub">
              {mode === 'login'
                ? 'Coloque seu e-mail e a senha de 4 números para entrar no aplicativo.'
                : 'Você já pagou? Seja bem-vinda. Agora crie sua senha de 4 números e anote para nunca esquecer.'}
            </p>
          </div>
        </div>
      </section>

      <section className="container section sub-section">
        {mode === 'login' ? (
          <form className="card sub-form fade-up" onSubmit={handleLogin}>
            <h3 className="sub-plan-title">Você já pagou?</h3>
            <p className="section-sub" style={{ textAlign: 'left' }}>
              Coloque seu <strong>e-mail</strong> (o mesmo usado no pagamento) e sua <strong>senha de 4 números</strong>.
            </p>
            <label className="field">
              <span>Seu e-mail</span>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="voce@email.com" autoComplete="email" />
            </label>
            <label className="field">
              <span>Sua senha de 4 números</span>
              <input type="password" inputMode="numeric" maxLength={4} value={form.password} onChange={(e) => setForm({ ...form, password: onlyDigits(e.target.value) })} placeholder="0000" autoComplete="current-password" />
            </label>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-lime btn-lg btn-block" disabled={waiting}>
              {waiting ? 'Entrando...' : 'Entrar no aplicativo'}
            </button>
          </form>
        ) : (
          <form className="card sub-form fade-up" onSubmit={handleCreate}>
            <h3 className="sub-plan-title">Seja bem-vinda! Crie sua senha</h3>
            <p className="section-sub" style={{ textAlign: 'left' }}>
              Sua assinatura está ativa. Crie uma senha de <strong>4 números</strong> e anote para nunca esquecer.
            </p>
            <label className="field">
              <span>Seu e-mail</span>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="voce@email.com" autoComplete="email" />
            </label>
            <label className="field">
              <span>Crie sua senha de 4 números</span>
              <input type="password" inputMode="numeric" maxLength={4} value={form.password} onChange={(e) => setForm({ ...form, password: onlyDigits(e.target.value) })} placeholder="0000" autoComplete="new-password" />
            </label>
            <label className="field">
              <span>Confirme sua senha</span>
              <input type="password" inputMode="numeric" maxLength={4} value={form.confirm} onChange={(e) => setForm({ ...form, confirm: onlyDigits(e.target.value) })} placeholder="0000" autoComplete="new-password" />
            </label>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-lime btn-lg btn-block" disabled={waiting}>
              {waiting ? 'Criando...' : 'Criar senha e entrar'}
            </button>
          </form>
        )}

        <div className="card sub-form fade-up login-help">
          <h3 className="sub-plan-title">Precisa de ajuda?</h3>
          <div className="login-help-list">
            <p className="login-help-item">
              <strong>1. Ainda não criou sua senha?</strong>
              <button type="button" className="btn btn-lime btn-lg btn-block" onClick={() => setMode('create')}>Criar minha senha</button>
            </p>
            <p className="login-help-item">
              <strong>2. Ainda não pagou?</strong>
              <Link to="/assinar" className="btn btn-lime btn-lg btn-block">Quero meu acesso</Link>
            </p>
            <p className="login-help-item">
              <strong>3. Precisa de ajuda?</strong>
              <span className="login-help-sub">Se você já efetuou o pagamento mas não está conseguindo acessar, chame o suporte no WhatsApp:</span>
              <a className="btn btn-terracotta btn-lg btn-block" href={SUPPORT_WA} target="_blank" rel="noreferrer">
                <svg className="wa-icone" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.25 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29z" /></svg>
                Chamar suporte no WhatsApp · {SUPPORT_PHONE}
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
