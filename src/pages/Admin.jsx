import { useState, useEffect } from 'react'
import { getAllUsers, getAccesses, getSubscriptions, getCheckoutUrl, setCheckoutUrl, setAdminPin, getAdminPin, updateCurrentUser } from '../engine/store.js'
import { fetchConfig, saveAiConfig, saveCheckoutUrl, loginAdmin, changeAdminPin, fetchSubscribers } from '../api/client.js'
import AudioUpload from '../components/AudioUpload.jsx'
import LogoUpload from '../components/LogoUpload.jsx'
import ContentEditor from '../components/ContentEditor.jsx'

export default function Admin() {
  const [pin, setPin] = useState('')
  const [ok, setOk] = useState(false)
  const [err, setErr] = useState(false)
  const [busy, setBusy] = useState(false)

  if (!ok) {
    return (
      <main className="admin-login container">
        <div className="card admin-card fade-up">
          <div className="admin-lock">🔒</div>
          <h2 className="section-title center">Área da Rosi Aguiar</h2>
          <p className="section-sub center">Painel de acessos e assinaturas do P.A.R.E<sup>®</sup>.</p>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              if (busy) return
              setBusy(true)
              setErr(false)
              const valid = await loginAdmin(pin)
              if (valid) {
                setAdminPin(pin)
                updateCurrentUser({ subscribed: true })
                setOk(true)
              } else {
                setErr(true)
              }
              setBusy(false)
            }}
          >
            <input
              className="pin-input"
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Digite seu PIN"
            />
            {err && <p className="form-error">PIN incorreto. Tente de novo.</p>}
            <button type="submit" className="btn btn-primary btn-lg btn-block">{busy ? 'Entrando...' : 'Entrar'}</button>
          </form>
          <p className="price-note">Acesso restrito à proprietária.</p>
        </div>
      </main>
    )
  }

  return <Dashboard />
}

function Dashboard() {
  const users = getAllUsers()
  const accesses = getAccesses()
  const subs = getSubscriptions()
  const [paidSubs, setPaidSubs] = useState([])
  const [paidLoaded, setPaidLoaded] = useState(false)

  useEffect(() => {
    fetchSubscribers(getAdminPin()).then((list) => {
      setPaidSubs(list)
      setPaidLoaded(true)
    })
  }, [])

  const activeSubs = subs.filter((s) => s.status === 'ativa')
  const realActiveCount = paidLoaded ? Math.max(activeSubs.length, paidSubs.length) : activeSubs.length
  const mrr = (realActiveCount * 29.99).toFixed(2)
  const today = new Date().toDateString()
  const accessToday = accesses.filter((a) => new Date(a.ts).toDateString() === today).length
  const accessWeek = accesses.filter((a) => Date.now() - new Date(a.ts).getTime() < 7 * 86400000).length
  const accessByPage = accesses.reduce((acc, a) => {
    acc[a.page || 'app'] = (acc[a.page || 'app'] || 0) + 1
    return acc
  }, {})

  return (
    <main className="admin container">
      <div className="admin-head">
        <div>
          <span className="chip">Painel Restrito</span>
          <h2 className="section-title">Olá, Rosi 👋</h2>
          <p className="section-sub">Acompanhe os acessos, as práticas e as assinaturas das suas alunas.</p>
        </div>
        <span className="admin-live">● ao vivo</span>
      </div>

      <div className="stats-grid">
        <Stat label="Mulheres cadastradas" value={users.length} icon="👩" />
        <Stat label="Acessos hoje" value={accessToday} icon="🕐" />
        <Stat label="Acessos nos últimos 7 dias" value={accessWeek} icon="📈" />
        <Stat label="Assinantes ativas" value={realActiveCount} icon="💚" />
        <Stat label="Receita recorrente (MRR)" value={`R$ ${mrr}`} icon="💰" accent />
      </div>

      <div className="admin-grid">
        <section className="card admin-table">
          <h3>Usuárias</h3>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Sessões</th>
                  <th>Último acesso</th>
                  <th>Assinatura</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name || '— sem nome —'}</td>
                    <td>{u.sessions || 0}</td>
                    <td>{new Date(u.lastAccess).toLocaleString('pt-BR')}</td>
                    <td>
                      {u.subscribed ? (
                        <span className="badge ok">Ativa</span>
                      ) : (
                        <span className="badge">Grátis</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card admin-table">
          <h3>Assinaturas (R$ 29,99/mês)</h3>
          <div className="table-scroll">
            {activeSubs.length === 0 ? (
              <p className="empty">Ainda não há assinaturas ativas.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Pagamento</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeSubs.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.email}</td>
                      <td>{s.method === 'pix' ? 'Pix' : 'Cartão'}</td>
                      <td><span className="badge ok">{s.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section className="card admin-table">
          <h3>Pagamentos confirmados (Kiwify)</h3>
          <div className="table-scroll">
            {!paidLoaded ? (
              <p className="empty">Buscando pagamentos...</p>
            ) : paidSubs.length === 0 ? (
              <p className="empty">Nenhum pagamento confirmado ainda.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>E-mail</th>
                    <th>Plano</th>
                    <th>Liberado em</th>
                  </tr>
                </thead>
                <tbody>
                  {paidSubs.map((s) => (
                    <tr key={s.email}>
                      <td>{s.email}</td>
                      <td>{s.plan || 'mensal'}</td>
                      <td>{new Date(s.grantedAt).toLocaleString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      <section className="card admin-table">
        <h3>Acessos recentes</h3>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Quando</th>
                <th>Área</th>
                <th>Usuária</th>
              </tr>
            </thead>
            <tbody>
              {[...accesses].reverse().slice(0, 20).map((a) => {
                const u = users.find((x) => x.id === a.userId)
                return (
                  <tr key={a.id}>
                    <td>{new Date(a.ts).toLocaleString('pt-BR')}</td>
                    <td><span className="badge">{a.page}</span></td>
                    <td>{u ? u.name || '—' : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="page-breakdown">
          {Object.entries(accessByPage).map(([p, n]) => (
            <span key={p} className="chip">{p}: {n}</span>
          ))}
        </div>
      </section>

      <LogoUpload />
      <AudioUpload />
      <ContentEditor />
      <SettingsPanel />
    </main>
  )
}

function SettingsPanel() {
  const [cfg, setCfg] = useState({ aiConfigured: false, ttsConfigured: false, llmModel: '' })
  const [url, setUrl] = useState(getCheckoutUrl())
  const [saved, setSaved] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const [provider, setProvider] = useState('deepseek')
  const [apiKey, setApiKey] = useState('')
  const [aiSaving, setAiSaving] = useState(false)
  const [aiMsg, setAiMsg] = useState('')
  const [curPin, setCurPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [pinSaving, setPinSaving] = useState(false)
  const [pinMsg, setPinMsg] = useState('')

  useEffect(() => {
    fetchConfig(true).then(setCfg)
  }, [])

  async function save() {
    setCheckoutUrl(url)
    try {
      await saveCheckoutUrl(url, getAdminPin())
      setSaved(true)
    } catch (e) {
      setSavedMsg(e.message || 'Não foi possível salvar.')
      setTimeout(() => setSavedMsg(''), 4000)
    }
    setTimeout(() => setSaved(false), 2000)
  }

  const providerInfo = {
    deepseek: { name: 'DeepSeek', baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-chat', hint: 'Mais barata — ideal para começar. Recarga mínima de alguns reais.' },
    openai: { name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini', hint: 'Mais conhecida. Cobra por uso, precisa de crédito pré-pago.' }
  }

  async function connectAI() {
    setAiSaving(true)
    setAiMsg('')
    const info = providerInfo[provider]
    const ok = await saveAiConfig({ apiKey, baseUrl: info.baseUrl, model: info.model })
    const c = await fetchConfig(true)
    setCfg(c)
    setAiSaving(false)
    setAiMsg(ok ? (c.aiConfigured ? '✓ Conectado! A TERAMIM agora conversa com a IA real.' : 'Salvo. Verifique se a chave está correta.') : 'Não consegui salvar. Tente de novo.')
    setTimeout(() => setAiMsg(''), 4000)
  }

  async function changePin() {
    if (pinSaving) return
    setPinSaving(true)
    setPinMsg('')
    try {
      await changeAdminPin(curPin, newPin)
      setAdminPin(newPin)
      setPinMsg('✓ PIN trocado! Da próxima vez use o seu novo código.')
      setCurPin('')
      setNewPin('')
    } catch (e) {
      setPinMsg(e.message || 'Não foi possível trocar.')
    }
    setPinSaving(false)
    setTimeout(() => setPinMsg(''), 4000)
  }

  return (
    <section className="card settings-card">
      <h3>Configurações</h3>
      <div className="settings-grid">
        <div className="settings-block">
          <h4>Status do sistema</h4>
          <p><span className={cfg.aiConfigured ? 'badge ok' : 'badge'}>IA de conversa: {cfg.aiConfigured ? 'conectada' : 'não conectada'}</span></p>
          {cfg.aiConfigured && <p className="settings-sub">modelo: {cfg.llmModel || '—'}</p>}
          <p><span className={cfg.ttsConfigured ? 'badge ok' : 'badge'}>Voz clonada: {cfg.ttsConfigured ? 'ativa' : 'não configurada'}</span></p>
        </div>
        <div className="settings-block">
          <h4>Conectar IA</h4>
          <p className="settings-sub">Escolha o provedor e cole a sua chave. A chave fica guardada só no seu servidor e nunca aparece para as visitantes.</p>
          <div className="settings-row">
            <select className="pin-input settings-input" value={provider} onChange={(e) => setProvider(e.target.value)}>
              <option value="deepseek">DeepSeek (mais barata)</option>
              <option value="openai">OpenAI</option>
            </select>
          </div>
          <p className="settings-sub" style={{ marginTop: 6 }}>{providerInfo[provider].hint}</p>
          <div className="settings-row" style={{ marginTop: 8 }}>
            <input
              className="pin-input settings-input"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Cole aqui a sua chave"
            />
            <button className="btn btn-primary btn-sm" disabled={aiSaving} onClick={connectAI}>
              {aiSaving ? 'Conectando...' : 'Conectar'}
            </button>
          </div>
          {aiMsg && <p className="settings-saved">{aiMsg}</p>}
        </div>
        <div className="settings-block">
          <h4>Link de pagamento (checkout)</h4>
          <p className="settings-sub">Cole aqui o link de checkout do seu provedor (Hotmart, Kiwify, Mercado Pago ou Pix). Ao assinar, a cliente vai direto para lá — e o dinheiro cai na SUA conta.</p>
          <div className="settings-row">
            <input
              className="pin-input settings-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://pay.hotmart.com/XXXXX"
            />
            <button className="btn btn-primary btn-sm" onClick={save}>Salvar</button>
          </div>
          {saved && <p className="settings-saved">✓ Salvo</p>}
          {savedMsg && <p className="settings-saved" style={{ color: 'var(--terracotta-dark)' }}>{savedMsg}</p>}
        </div>
        <div className="settings-block">
          <h4>Trocar meu PIN de acesso</h4>
          <p className="settings-sub">Escolha um código só seu (4 a 8 números). Ninguém mais entra no painel.</p>
          <div className="settings-row" style={{ marginTop: 8 }}>
            <input
              className="pin-input settings-input"
              type="password"
              inputMode="numeric"
              value={curPin}
              onChange={(e) => setCurPin(e.target.value)}
              placeholder="PIN atual"
            />
          </div>
          <div className="settings-row" style={{ marginTop: 8 }}>
            <input
              className="pin-input settings-input"
              type="password"
              inputMode="numeric"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="Novo PIN"
            />
            <button className="btn btn-primary btn-sm" disabled={pinSaving} onClick={changePin}>
              {pinSaving ? 'Salvando...' : 'Trocar PIN'}
            </button>
          </div>
          {pinMsg && <p className="settings-saved">{pinMsg}</p>}
        </div>
      </div>
      <div className="settings-guide">
        <h4>Como conectar a IA real</h4>
        <ol>
          <li>Escolha o provedor no campo acima. Para economizar, o <strong>DeepSeek</strong> é o mais indicado (custa centavos por conversa).</li>
          <li><strong>DeepSeek:</strong> entre em <code>platform.deepseek.com</code> → <strong>API Keys</strong> → <strong>Create new key</strong>. A recarga mínima é poucos reais.</li>
          <li><strong>OpenAI:</strong> entre em <code>platform.openai.com</code> → <strong>API keys</strong> → <strong>Create new secret key</strong>.</li>
          <li>Copie a chave e cole no campo acima → <strong>Conectar</strong>. O painel mostra "IA de conversa: conectada".</li>
          <li><strong>Importante:</strong> antes de divulgar o app, troque o PIN no campo <strong>"Trocar meu PIN de acesso"</strong> ao lado. Guarde bem o seu novo código.</li>
        </ol>
        <h4 style={{ marginTop: 12 }}>Sua voz e o dinheiro</h4>
        <ol>
          <li><strong>Sua voz:</strong> suba seus MP3 no painel acima e as práticas tocam a SUA voz gravada, de graça — sem clonagem.</li>
          <li><strong>Dinheiro:</strong> o app nunca recebe o dinheiro — quem recebe é o seu provedor de pagamento (na sua conta).</li>
        </ol>
      </div>
    </section>
  )
}

function Stat({ label, value, icon, accent }) {
  return (
    <div className={accent ? 'stat-card accent' : 'stat-card'}>
      <span className="stat-icon">{icon}</span>
      <strong className="stat-value">{value}</strong>
      <span className="stat-label">{label}</span>
    </div>
  )
}
