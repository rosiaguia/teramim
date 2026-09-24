import express from 'express'
import dotenv from 'dotenv'
import multer from 'multer'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { MASTER_PROMPT } from './masterPrompt.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = process.env.DATA_DIR || __dirname
const AUDIO_DIR = path.join(DATA_DIR, 'audio')
if (!fs.existsSync(AUDIO_DIR)) fs.mkdirSync(AUDIO_DIR, { recursive: true })

const app = express()
app.use(express.json({ limit: '2mb', verify: (req, res, buf) => { req.rawBody = buf } }))

const PORT = process.env.PORT || 3001
const CONTENT_FILE = path.join(DATA_DIR, 'content.json')
const AI_CONFIG_FILE = path.join(DATA_DIR, 'ai-config.json')
const ADMIN_CONFIG_FILE = path.join(DATA_DIR, 'admin-config.json')
const CHECKOUT_CONFIG_FILE = path.join(DATA_DIR, 'checkout-config.json')
const ACCESS_FILE = path.join(DATA_DIR, 'access-registry.json')
const WEBHOOK_LOG_FILE = path.join(DATA_DIR, 'webhook-log.json')
const PROCESSED_WEBHOOKS_FILE = path.join(DATA_DIR, 'processed-webhooks.json')
const KIWIFY_WEBHOOK_SECRET = process.env.KIWIFY_WEBHOOK_SECRET || ''
const SUBSCRIPTION_DAYS = Number(process.env.SUBSCRIPTION_DAYS || 30)
const RENEWAL_NOTICE_DAYS = 3

function effectiveExpiry(entry) {
  if (!entry) return null
  if (entry.expiresAt) return Date.parse(entry.expiresAt)
  if (entry.grantedAt) return Date.parse(entry.grantedAt) + SUBSCRIPTION_DAYS * 86400000
  return null
}

function isExpired(entry) {
  if (!entry || !entry.access) return false
  const exp = effectiveExpiry(entry)
  if (!exp) return false
  return exp < Date.now()
}

function daysLeft(entry) {
  if (!entry) return null
  const exp = effectiveExpiry(entry)
  if (!exp) return null
  const ms = exp - Date.now()
  return Math.max(0, Math.ceil(ms / 86400000))
}

function readAccessRegistry() {
  try {
    const raw = fs.readFileSync(ACCESS_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch (e) {
    return {}
  }
}

function writeAccessRegistry(reg) {
  try {
    fs.writeFileSync(ACCESS_FILE, JSON.stringify(reg, null, 2))
  } catch (e) {
    console.error('access registry save error', e.message)
  }
}

function logKiwifyHit(entry) {
  try {
    const raw = fs.existsSync(WEBHOOK_LOG_FILE) ? fs.readFileSync(WEBHOOK_LOG_FILE, 'utf8') : '[]'
    let arr = []
    try { arr = JSON.parse(raw) } catch (e) { arr = [] }
    if (!Array.isArray(arr)) arr = []
    arr.push({ at: new Date().toISOString(), ...entry })
    if (arr.length > 100) arr = arr.slice(-100)
    fs.writeFileSync(WEBHOOK_LOG_FILE, JSON.stringify(arr, null, 2))
  } catch (e) {
    console.error('webhook log save error', e.message)
  }
}

function grantAccessByEmail(email, meta = {}) {
  const key = String(email || '').toLowerCase().trim()
  if (!key || !key.includes('@')) return
  const reg = readAccessRegistry()
  const prev = reg[key] || {}
  const now = Date.now()
  const wasActive = Boolean(prev.access && prev.grantedAt)
  let base = prev.expiresAt ? Date.parse(prev.expiresAt) : now
  if (isNaN(base) || base < now) base = now
  const stamp = new Date().toISOString()
  reg[key] = {
    ...prev,
    ...meta,
    email: key,
    access: true,
    grantedAt: prev.grantedAt || stamp,
    expiresAt: new Date(base + SUBSCRIPTION_DAYS * 86400000).toISOString(),
    firstGrantedAt: prev.firstGrantedAt || stamp,
    lastRenewedAt: wasActive ? stamp : (prev.lastRenewedAt || ''),
    renewals: wasActive ? (prev.renewals || 0) + 1 : (prev.renewals || 0)
  }
  writeAccessRegistry(reg)
}

function revokeAccessByEmail(email) {
  const key = String(email || '').toLowerCase().trim()
  if (!key || !key.includes('@')) return
  const reg = readAccessRegistry()
  if (reg[key]) {
    reg[key] = { ...reg[key], access: false, revokedAt: new Date().toISOString() }
    writeAccessRegistry(reg)
  }
}

function markAccessStatus(email, status, meta = {}) {
  const key = String(email || '').toLowerCase().trim()
  if (!key || !key.includes('@')) return
  const reg = readAccessRegistry()
  if (!reg[key]) return
  reg[key] = { ...reg[key], ...meta, lastStatus: status, lastStatusAt: new Date().toISOString() }
  writeAccessRegistry(reg)
}

function readProcessedWebhooks() {
  try {
    const raw = fs.readFileSync(PROCESSED_WEBHOOKS_FILE, 'utf8')
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch (e) {
    return []
  }
}

function rememberProcessedWebhook(hash) {
  try {
    const arr = readProcessedWebhooks()
    arr.push(hash)
    fs.writeFileSync(PROCESSED_WEBHOOKS_FILE, JSON.stringify(arr.slice(-300), null, 2))
  } catch (e) {
    console.error('processed webhook save error', e.message)
  }
}

function hashPassword(password, salt) {
  return crypto.scryptSync(String(password || ''), String(salt || ''), 64).toString('hex')
}

function setPasswordForEmail(email, password) {
  const key = String(email || '').toLowerCase().trim()
  if (!key || !key.includes('@')) return { ok: false, error: 'email_invalido' }
  const pass = String(password || '').trim()
  if (!/^\d{4}$/.test(pass)) return { ok: false, error: 'senha_4_digitos' }
  const reg = readAccessRegistry()
  const entry = reg[key]
  if (!entry || !entry.access) return { ok: false, error: 'sem_acesso' }
  if (isExpired(entry)) return { ok: false, error: 'acesso_expirado' }
  const salt = crypto.randomBytes(16).toString('hex')
  reg[key] = { ...entry, pwdSalt: salt, pwdHash: hashPassword(pass, salt) }
  writeAccessRegistry(reg)
  return { ok: true }
}

function verifyLogin(email, password) {
  const key = String(email || '').toLowerCase().trim()
  if (!key || !key.includes('@')) return { access: false, reason: 'no_access' }
  const reg = readAccessRegistry()
  const entry = reg[key]
  if (!entry || !entry.access) return { access: false, reason: 'no_access' }
  if (isExpired(entry)) return { access: false, reason: 'expirado' }
  if (!entry.pwdHash || !entry.pwdSalt) return { access: false, needPassword: true, name: entry.name || '' }
  if (hashPassword(String(password || ''), entry.pwdSalt) !== entry.pwdHash) return { access: false, reason: 'wrong_password' }
  return { access: true, name: entry.name || '', expiresAt: entry.expiresAt || '', daysLeft: daysLeft(entry) }
}

function verifyKiwifySignature(req, rawBody) {
  if (!KIWIFY_WEBHOOK_SECRET) return true
  const sig = String(req.query.signature || req.headers['x-webhook-signature'] || '').trim()
  if (!sig) return false
  if (sig === KIWIFY_WEBHOOK_SECRET) return true
  try {
    const hmac1 = crypto.createHmac('sha1', KIWIFY_WEBHOOK_SECRET).update(rawBody).digest('hex')
    const hmac256 = crypto.createHmac('sha256', KIWIFY_WEBHOOK_SECRET).update(rawBody).digest()
    return sig === hmac1 || sig === hmac256.toString('hex') || sig === hmac256.toString('base64')
  } catch (e) {
    return false
  }
}

function kiwifyEmailFromData(data) {
  if (!data) return ''
  if (data.Customer && data.Customer.email) return data.Customer.email
  if (data.customer && data.customer.email) return data.customer.email
  if (data.subscription && data.subscription.customer && data.subscription.customer.email) return data.subscription.customer.email
  if (data.subscriber && data.subscriber.email) return data.subscriber.email
  if (data.order && data.order.customer && data.order.customer.email) return data.order.customer.email
  if (data.email) return data.email
  return ''
}

function kiwifyProductName(data) {
  if (!data) return ''
  if (data.Product && data.Product.product_name) return data.Product.product_name
  if (data.Product && data.Product.name) return data.Product.name
  if (data.product && data.product.name) return data.product.name
  if (data.subscription && data.subscription.product && data.subscription.product.name) return data.subscription.product.name
  return ''
}

function kiwifyCustomerName(data) {
  if (!data) return ''
  if (data.Customer && (data.Customer.full_name || data.Customer.name)) return data.Customer.full_name || data.Customer.name
  if (data.customer && (data.customer.name || data.customer.full_name)) return data.customer.name || data.customer.full_name
  return ''
}

function getCheckoutUrl() {
  try {
    const raw = fs.readFileSync(CHECKOUT_CONFIG_FILE, 'utf8')
    const c = JSON.parse(raw)
    if (c.url && typeof c.url === 'string' && c.url.trim()) return c.url.trim()
  } catch (e) { /* ignore */ }
  return process.env.CHECKOUT_URL || ''
}

function getAdminPin() {
  try {
    const raw = fs.readFileSync(ADMIN_CONFIG_FILE, 'utf8')
    const c = JSON.parse(raw)
    if (c.pin) return c.pin
  } catch (e) { /* ignore */ }
  return process.env.ADMIN_PIN || '0707'
}
const LLM_KEY = process.env.USER_LLM_API_KEY || ''
const LLM_BASE = process.env.USER_LLM_BASE_URL || 'https://api.openai.com/v1'
const LLM_MODEL = process.env.USER_LLM_MODEL || 'gpt-4o-mini'
const ELEVEN_KEY = process.env.USER_ELEVENLABS_API_KEY || ''
const ELEVEN_VOICE = process.env.USER_ELEVENLABS_VOICE_ID || ''

function getLLMConfig() {
  try {
    const raw = fs.readFileSync(AI_CONFIG_FILE, 'utf8')
    const c = JSON.parse(raw)
    return {
      key: (c.apiKey || '').trim(),
      base: (c.baseUrl || LLM_BASE).trim(),
      model: (c.model || LLM_MODEL).trim()
    }
  } catch (e) {
    return { key: LLM_KEY, base: LLM_BASE, model: LLM_MODEL }
  }
}

function aiConfigured() {
  return Boolean(getLLMConfig().key)
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.get('/api/config', (req, res) => {
  const cfg = getLLMConfig()
  res.json({
    aiConfigured: aiConfigured(),
    ttsConfigured: Boolean(ELEVEN_KEY && ELEVEN_VOICE),
    llmModel: cfg.model,
    checkoutUrl: getCheckoutUrl()
  })
})

app.put('/api/checkout', (req, res) => {
  const { pin, url } = req.body || {}
  if (pin !== getAdminPin()) {
    return res.status(401).json({ error: 'PIN inválido' })
  }
  try {
    fs.writeFileSync(CHECKOUT_CONFIG_FILE, JSON.stringify({ url: String(url || '').trim() }, null, 2))
    res.json({ ok: true })
  } catch (e) {
    console.error('checkout save error', e.message)
    res.status(500).json({ error: 'Não foi possível salvar.' })
  }
})

app.get('/api/kiwify/webhook', (req, res) => {
  res.json({ ok: true, message: 'Webhook ativo. Aguardando avisos da Kiwify.' })
})

app.get('/api/kiwify/diag', (req, res) => {
  const { pin } = req.query || {}
  if (pin !== getAdminPin()) {
    return res.status(401).json({ error: 'PIN inválido' })
  }
  let arr = []
  try {
    if (fs.existsSync(WEBHOOK_LOG_FILE)) {
      arr = JSON.parse(fs.readFileSync(WEBHOOK_LOG_FILE, 'utf8'))
    }
  } catch (e) { arr = [] }
  res.json({ entries: Array.isArray(arr) ? arr : [], secretConfigured: Boolean(KIWIFY_WEBHOOK_SECRET) })
})

app.post('/api/kiwify/webhook', (req, res) => {
  const body = req.body || {}
  const sig = String(req.query.signature || req.headers['x-webhook-signature'] || '')
  const event = String(body.webhook_event_type || body.event || '')
  const data = body.data || body
  const email = kiwifyEmailFromData(data)

  const okSig = verifyKiwifySignature(req, req.rawBody || Buffer.from(JSON.stringify(body)))
  const raw = (req.rawBody ? req.rawBody.toString('utf8') : '') || JSON.stringify(body)
  logKiwifyHit({
    event,
    email: email || '',
    sig: sig ? (sig.slice(0, 12) + '...') : '(sem assinatura)',
    sigOk: okSig,
    url: req.originalUrl || req.url || '',
    headers: Object.keys(req.headers || {}).filter((h) => h.startsWith('x-') || h.includes('token') || h.includes('sign') || h.includes('auth') || h.includes('kiwify')),
    bodyPreview: raw.slice(0, 2000)
  })
  if (!okSig) {
    return res.status(401).json({ error: 'Assinatura inválida' })
  }

  const eventHash = crypto.createHash('sha1').update(raw).digest('hex')
  const processed = readProcessedWebhooks()
  if (processed.includes(eventHash)) {
    console.log('kiwify webhook duplicado ignorado', event, email)
    return res.json({ ok: true, handled: true, duplicate: true })
  }
  rememberProcessedWebhook(eventHash)

  const product = kiwifyProductName(data)
  const orderId = String(data.order_id || data.orderId || (data.order && data.order.id) || data.id || '')
  const plan = (body.subscription || data.subscription) ? 'mensal' : (product ? product : 'mensal')

  if (!email) {
    console.log('kiwify webhook sem e-mail', event)
    return res.json({ ok: true, handled: false })
  }

  const evt = event.toLowerCase()
  const status = String(data.order_status || data.status || (data.subscription && data.subscription.status) || '').toLowerCase()
  const revokes =
    status === 'refunded' ||
    status === 'refund' ||
    status === 'canceled' ||
    status === 'cancelled' ||
    status === 'cancelled_subscription' ||
    status === 'chargeback' ||
    status === 'dispute' ||
    status === 'rejected' ||
    status === 'refused' ||
    status === 'expired' ||
    status === 'suspended' ||
    evt.includes('refund') ||
    evt.includes('cancel') ||
    evt.includes('chargeback') ||
    evt.includes('dispute') ||
    evt.includes('rejected') ||
    evt.includes('refused') ||
    evt.includes('expired') ||
    evt.includes('suspended')
  const pending =
    status === 'late' ||
    status === 'past_due' ||
    status === 'unpaid' ||
    status === 'waiting_payment' ||
    status === 'in_analysis' ||
    evt.includes('late') ||
    evt.includes('past_due') ||
    evt.includes('unpaid')
  const grants =
    status === 'paid' ||
    status === 'approved' ||
    status === 'active' ||
    status === 'confirmed' ||
    evt.includes('paid') ||
    evt.includes('approved') ||
    evt.includes('released') ||
    evt.includes('confirmed') ||
    evt.includes('charged') ||
    evt.includes('renewed') ||
    evt.includes('reactivated')

  if (revokes) {
    revokeAccessByEmail(email)
    console.log('kiwify REVOKE', email, event, status)
  } else if (pending) {
    markAccessStatus(email, 'pendente', { lastEvent: event })
    console.log('kiwify PENDENTE (aguardando pagamento)', email, event, status)
  } else if (grants) {
    grantAccessByEmail(email, { plan, product, name: kiwifyCustomerName(data), lastEvent: event, lastOrderId: orderId })
    console.log('kiwify GRANT', email, event, status)
  } else {
    console.log('kiwify webhook ignorado', event, status, email)
  }

  res.json({ ok: true, handled: true })
})

app.post('/api/verify-access', (req, res) => {
  const { email } = req.body || {}
  const key = String(email || '').toLowerCase().trim()
  if (!key || !key.includes('@')) {
    return res.json({ ok: true, access: false })
  }
  const reg = readAccessRegistry()
  const entry = reg[key]
  const active = Boolean(entry && entry.access) && !isExpired(entry)
  const exp = entry ? effectiveExpiry(entry) : null
  res.json({
    ok: true,
    access: active,
    name: (entry && entry.name) || '',
    expiresAt: exp ? new Date(exp).toISOString() : '',
    daysLeft: entry ? daysLeft(entry) : null
  })
})

app.post('/api/subscription-status', (req, res) => {
  const { email } = req.body || {}
  const key = String(email || '').toLowerCase().trim()
  if (!key || !key.includes('@')) {
    return res.json({ ok: true, access: false })
  }
  const reg = readAccessRegistry()
  const entry = reg[key]
  const active = Boolean(entry && entry.access) && !isExpired(entry)
  const dl = entry ? daysLeft(entry) : null
  const exp = entry ? effectiveExpiry(entry) : null
  res.json({
    ok: true,
    access: active,
    name: (entry && entry.name) || '',
    expiresAt: exp ? new Date(exp).toISOString() : '',
    daysLeft: dl,
    expiringSoon: Boolean(entry && exp && active && dl !== null && dl <= RENEWAL_NOTICE_DAYS)
  })
})

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {}
  res.json({ ok: true, ...verifyLogin(email, password) })
})

app.post('/api/set-password', (req, res) => {
  const { email, password } = req.body || {}
  const r = setPasswordForEmail(email, password)
  if (!r.ok) {
    return res.status(400).json({ ok: false, error: r.error })
  }
  res.json({ ok: true })
})

app.get('/api/subscribers', (req, res) => {
  const { pin } = req.query || {}
  if (pin !== getAdminPin()) {
    return res.status(401).json({ error: 'PIN inválido' })
  }
  const reg = readAccessRegistry()
  const list = Object.values(reg)
    .filter((s) => s.access && !isExpired(s))
    .map((s) => ({ ...s, daysLeft: daysLeft(s) }))
    .sort((a, b) => String(b.grantedAt || '').localeCompare(String(a.grantedAt || '')))
  res.json({ list })
})

app.get('/api/subscriptions', (req, res) => {
  const { pin } = req.query || {}
  if (pin !== getAdminPin()) {
    return res.status(401).json({ error: 'PIN inválido' })
  }
  const reg = readAccessRegistry()
  const list = Object.values(reg).map((s) => {
    const exp = effectiveExpiry(s)
    const dl = s.access ? daysLeft(s) : null
    let status = 'ativa'
    if (!s.access) status = s.revokedAt ? 'cancelada' : 'inativa'
    else if (isExpired(s)) status = 'vencida'
    else if (dl !== null && dl <= RENEWAL_NOTICE_DAYS) status = 'vencendo'
    return {
      email: s.email || '',
      name: s.name || '',
      plan: s.plan || 'mensal',
      product: s.product || '',
      status,
      grantedAt: s.grantedAt || '',
      firstGrantedAt: s.firstGrantedAt || s.grantedAt || '',
      expiresAt: exp ? new Date(exp).toISOString() : '',
      daysLeft: dl,
      renewals: s.renewals || 0,
      lastRenewedAt: s.lastRenewedAt || '',
      lastEvent: s.lastEvent || '',
      lastOrderId: s.lastOrderId || '',
      lastStatus: s.lastStatus || '',
      revokedAt: s.revokedAt || ''
    }
  }).sort((a, b) => String(b.grantedAt || '').localeCompare(String(a.grantedAt || '')))
  const counts = {
    total: list.length,
    active: list.filter((s) => s.status === 'ativa' || s.status === 'vencendo').length,
    expiring: list.filter((s) => s.status === 'vencendo').length,
    expired: list.filter((s) => s.status === 'vencida').length,
    renewed: list.filter((s) => s.renewals > 0).length
  }
  res.json({ list, counts })
})

app.put('/api/ai-config', (req, res) => {
  const { pin, apiKey, baseUrl, model } = req.body || {}
  if (pin !== getAdminPin()) {
    return res.status(401).json({ error: 'PIN inválido' })
  }
  const cfg = getLLMConfig()
  const next = {
    apiKey: String(apiKey || '').trim() || cfg.key,
    baseUrl: String(baseUrl || '').trim() || cfg.base,
    model: String(model || '').trim() || cfg.model
  }
  try {
    fs.writeFileSync(AI_CONFIG_FILE, JSON.stringify(next, null, 2))
    res.json({ ok: true, configured: Boolean(next.apiKey) })
  } catch (e) {
    console.error('AI config save error', e.message)
    res.status(500).json({ error: 'Não foi possível salvar.' })
  }
})

const AUDIO_LABELS = ['manha', 'meio_dia', 'noite', 'alivio', 'calma', 'zen', 'zero', 'boot', 'neuro', 'equi', 'foco', 'outro', 'paz', 'cura']

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, AUDIO_DIR),
    filename: (req, file, cb) => cb(null, `tmp-${Date.now()}-${Math.round(Math.random() * 1e6)}.mp3`)
  }),
  limits: { fileSize: 200 * 1024 * 1024 }
})

app.post('/api/upload', upload.single('file'), (req, res) => {
  const label = String(req.body.label || 'outro')
  if (!AUDIO_LABELS.includes(label)) {
    if (req.file) {
      try { fs.unlinkSync(req.file.path) } catch (e) { /* ignore */ }
    }
    return res.status(400).json({ error: 'Rótulo inválido' })
  }
  const target = path.join(AUDIO_DIR, `${label}.mp3`)
  try {
    fs.renameSync(req.file.path, target)
  } catch (e) {
    fs.copyFileSync(req.file.path, target)
    try { fs.unlinkSync(req.file.path) } catch (e2) { /* ignore */ }
  }
  res.json({ ok: true, label, url: `/audio/${label}.mp3` })
})

app.get('/api/audios', (req, res) => {
  const audios = {}
  if (fs.existsSync(AUDIO_DIR)) {
    fs.readdirSync(AUDIO_DIR).forEach((f) => {
      if (!f.endsWith('.mp3')) return
      const label = f.replace(/\.mp3$/, '')
      try {
        const stat = fs.statSync(path.join(AUDIO_DIR, f))
        audios[label] = { url: `/audio/${f}`, size: stat.size, mtime: stat.mtimeMs }
      } catch (e) { /* ignore */ }
    })
  }
  res.json(audios)
})

const LOGO_DIR = path.join(DATA_DIR, 'logo')
if (!fs.existsSync(LOGO_DIR)) fs.mkdirSync(LOGO_DIR, { recursive: true })

const logoUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, LOGO_DIR),
    filename: (req, file, cb) => {
      const ext = (path.extname(file.originalname) || '.png').toLowerCase()
      cb(null, `logo${ext}`)
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 }
})

app.post('/api/logo-upload', logoUpload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo' })
  const ext = path.extname(req.file.filename).toLowerCase()
  const allowed = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif']
  if (!allowed.includes(ext)) {
    try { fs.unlinkSync(req.file.path) } catch (e) { /* ignore */ }
    return res.status(400).json({ error: 'Formato inválido. Use PNG, JPG, WEBP ou SVG.' })
  }
  res.json({ ok: true, url: `/logo/${req.file.filename}`, mtime: Date.now() })
})

app.get('/api/logo', (req, res) => {
  try {
    const files = fs.readdirSync(LOGO_DIR)
    if (files.length === 0) return res.json({ url: null })
    const f = files[0]
    const stat = fs.statSync(path.join(LOGO_DIR, f))
    res.json({ url: `/logo/${f}`, mtime: stat.mtimeMs })
  } catch (e) {
    res.json({ url: null })
  }
})

app.use('/logo', express.static(LOGO_DIR))

app.use('/audio', express.static(AUDIO_DIR))

app.get('/api/content', (req, res) => {
  try {
    const raw = fs.readFileSync(CONTENT_FILE, 'utf8')
    res.json(JSON.parse(raw))
  } catch (e) {
    res.json({})
  }
})

app.put('/api/content', (req, res) => {
  const { pin, content } = req.body || {}
  if (pin !== getAdminPin()) {
    return res.status(401).json({ error: 'PIN inválido' })
  }
  if (!content || typeof content !== 'object') {
    return res.status(400).json({ error: 'Conteúdo inválido' })
  }
  try {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2))
    res.json({ ok: true })
  } catch (e) {
    console.error('Content save error', e.message)
    res.status(500).json({ error: 'Não foi possível salvar.' })
  }
})

app.post('/api/admin/login', (req, res) => {
  const { pin } = req.body || {}
  if (String(pin || '') === getAdminPin()) {
    res.json({ ok: true })
  } else {
    res.status(401).json({ ok: false, error: 'PIN inválido' })
  }
})

app.put('/api/admin-pin', (req, res) => {
  const { pin, newPin } = req.body || {}
  if (pin !== getAdminPin()) {
    return res.status(401).json({ error: 'PIN inválido' })
  }
  const nextPin = String(newPin || '').trim()
  if (!/^\d{4,8}$/.test(nextPin)) {
    return res.status(400).json({ error: 'O PIN deve ter entre 4 e 8 números.' })
  }
  try {
    fs.writeFileSync(ADMIN_CONFIG_FILE, JSON.stringify({ pin: nextPin }, null, 2))
    res.json({ ok: true })
  } catch (e) {
    console.error('PIN save error', e.message)
    res.status(500).json({ error: 'Não foi possível salvar.' })
  }
})

app.post('/api/ai', async (req, res) => {
  const cfg = getLLMConfig()
  if (!cfg.key) {
    return res.status(503).json({ error: 'AI não configurada. Adicione sua chave da OpenAI no painel da Rosi.' })
  }
  const { messages = [], userName } = req.body || {}
  const history = messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .slice(-30)
    .map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: String(m.content || '') }))

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 60000)
    const resp = await fetch(`${cfg.base.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cfg.key}`
      },
      body: JSON.stringify({
        model: cfg.model,
        temperature: 0.7,
        max_tokens: 900,
        messages: [
          {
            role: 'system',
            content: MASTER_PROMPT + `\n\nA usuária que você está atendendo agora se chama ${userName || 'querida'}.`
          },
          ...history
        ]
      }),
      signal: controller.signal
    })
    clearTimeout(timer)

    if (!resp.ok) {
      const body = await resp.text()
      console.error('LLM error', resp.status, body.slice(0, 300))
      return res.status(502).json({ error: `Falha ao falar com o modelo (${resp.status}).` })
    }

    const data = await resp.json()
    const reply = data.choices && data.choices[0] && data.choices[0].message
    return res.json({ reply: reply ? reply.content : '' })
  } catch (err) {
    console.error('LLM exception', err.message)
    return res.status(502).json({ error: 'Falha ao conectar com o provedor de IA.' })
  }
})

app.post('/api/tts', async (req, res) => {
  if (!ELEVEN_KEY || !ELEVEN_VOICE) {
    return res.status(503).json({ error: 'Voz não configurada. Adicione USER_ELEVENLABS_API_KEY e USER_ELEVENLABS_VOICE_ID no .env.' })
  }
  const { text } = req.body || {}
  if (!text) return res.status(400).json({ error: 'texto obrigatório' })

  try {
    const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVEN_KEY
      },
      body: JSON.stringify({
        text,
        model_id: process.env.USER_ELEVENLABS_MODEL || 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.85, style: 0.4 }
      })
    })
    if (!resp.ok) {
      const body = await resp.text()
      console.error('TTS error', resp.status, body.slice(0, 300))
      return res.status(502).json({ error: `Falha ao gerar voz (${resp.status}).` })
    }
    const buf = Buffer.from(await resp.arrayBuffer())
    res.set('Content-Type', 'audio/mpeg')
    res.set('Content-Length', buf.length)
    res.set('Cache-Control', 'public, max-age=86400')
    res.send(buf)
  } catch (err) {
    console.error('TTS exception', err.message)
    return res.status(502).json({ error: 'Falha ao gerar voz.' })
  }
})

const DIST_DIR = path.join(__dirname, '..', 'dist')
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR))
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next()
    if (req.path.startsWith('/api') || req.path.startsWith('/audio') || req.path.startsWith('/logo')) return next()
    res.sendFile(path.join(DIST_DIR, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`TERAMIM server listening on :${PORT}`)
  console.log(`AI ${aiConfigured() ? 'CONFIGURADA' : 'NÃO configurada (modo demo)'}`)
  console.log(`Voz ${ELEVEN_KEY && ELEVEN_VOICE ? 'CONFIGURADA' : 'NÃO configurada (voz padrão)'}`)
})
