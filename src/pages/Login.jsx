import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getOrCreateUser, updateCurrentUser, saveSubscription } from '../engine/store'
import { loginUser, setPassword } from '../api/client.js'
import AppLogo from '../components/AppLogo.jsx'

const SUPPORT_PHONE = '(51) 99403-4879'
const SUPPORT_TEL = 'tel:+5551994034879'

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

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    const email = form.email.trim()
    if (!email || !validateEmail(email)) {
      setError('Digite o e-mail que você usou para pagar.')
      return
    }
    if (!form.password) {
      setError('Digite sua senha.')
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
      setError('Sua senha precisa ter pelo menos 4 caracteres.')
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
      } else if (res.error === 'senha_curta') {
        setError('Sua senha precisa ter pelo menos 4 caracteres.')
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
            <h1 className="hero-title">{mode === 'login' ? 'Entrar no meu espaço' : 'Criar minha senha'}</h1>
            <p className="hero-sub">
              {mode === 'login'
                ? 'Você já pagou? Coloque seu e-mail e senha para acessar o aplicativo.'
                : 'Primeiro acesso: crie sua senha para entrar quando quiser.'}
            </p>
          </div>
        </div>
      </section>

      <section className="container section sub-section">
        {mode === 'login' ? (
          <form className="card sub-form fade-up" onSubmit={handleLogin}>
            <h3 className="sub-plan-title">Já efetuou o pagamento?</h3>
            <p className="section-sub" style={{ textAlign: 'left' }}>
              Coloque seu <strong>e-mail</strong> (o mesmo usado no pagamento) e sua <strong>senha</strong> para acessar o aplicativo.
            </p>
            <label className="field">
              <span>Seu e-mail</span>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="voce@email.com" autoComplete="email" />
            </label>
            <label className="field">
              <span>Sua senha</span>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Sua senha" autoComplete="current-password" />
            </label>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-lime btn-lg btn-block" disabled={waiting}>
              {waiting ? 'Entrando...' : 'Entrar no aplicativo'}
            </button>
            <p className="price-note">
              Ainda não criou sua senha? <button type="button" className="link-btn" onClick={() => setMode('create')}>Criar minha senha</button>
            </p>
            <p className="price-note">
              Ainda não assinou? <Link to="/assinar" className="link-btn">Quero meu acesso</Link>
            </p>
          </form>
        ) : (
          <form className="card sub-form fade-up" onSubmit={handleCreate}>
            <h3 className="sub-plan-title">Criar minha senha</h3>
            <p className="section-sub" style={{ textAlign: 'left' }}>
              Pronto, seu pagamento foi encontrado! Escolha uma senha para entrar no aplicativo sempre que quiser.
            </p>
            <label className="field">
              <span>Seu e-mail</span>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="voce@email.com" autoComplete="email" />
            </label>
            <label className="field">
              <span>Escolha sua senha</span>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Mínimo 4 caracteres" autoComplete="new-password" />
            </label>
            <label className="field">
              <span>Confirme sua senha</span>
              <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="Repita a senha" autoComplete="new-password" />
            </label>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-lime btn-lg btn-block" disabled={waiting}>
              {waiting ? 'Criando...' : 'Criar senha e entrar'}
            </button>
            <p className="price-note">
              Já tem senha? <button type="button" className="link-btn" onClick={() => setMode('login')}>Entrar</button>
            </p>
          </form>
        )}

        <div className="card sub-form fade-up" style={{ marginTop: 16 }}>
          <h3 className="sub-plan-title">Precisa de ajuda?</h3>
          <p className="section-sub" style={{ textAlign: 'left' }}>
            Se você pagou e não está conseguindo entrar, chame a Rosi no WhatsApp.
          </p>
          <a className="btn btn-terracotta btn-lg btn-block" href={SUPPORT_TEL}>
            WhatsApp da Rosi · {SUPPORT_PHONE}
          </a>
        </div>
      </section>
    </main>
  )
}
