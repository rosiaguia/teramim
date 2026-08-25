import express from 'express'
import dotenv from 'dotenv'
import multer from 'multer'
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
app.use(express.json({ limit: '2mb' }))

const PORT = process.env.PORT || 3001
const CONTENT_FILE = path.join(DATA_DIR, 'content.json')
const AI_CONFIG_FILE = path.join(DATA_DIR, 'ai-config.json')
const ADMIN_CONFIG_FILE = path.join(DATA_DIR, 'admin-config.json')
const CHECKOUT_CONFIG_FILE = path.join(DATA_DIR, 'checkout-config.json')

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

const LOGO_DIR = path.join(__dirname, 'logo')
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
