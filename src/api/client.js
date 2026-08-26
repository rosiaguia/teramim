import { getAdminPin } from '../engine/store.js'

let configCache = null

export async function fetchConfig(force = false) {
  if (configCache && !force) return configCache
  try {
    const r = await fetch('/api/config')
    if (!r.ok) { configCache = { aiConfigured: false, ttsConfigured: false, llmModel: '', checkoutUrl: '' }; return configCache }
    configCache = await r.json()
  } catch (e) {
    configCache = { aiConfigured: false, ttsConfigured: false, llmModel: '', checkoutUrl: '' }
  }
  return configCache
}

export async function saveCheckoutUrl(url, pin) {
  try {
    const r = await fetch('/api/checkout', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, url })
    })
    if (!r.ok) {
      let msg = 'Não foi possível salvar o link.'
      try { msg = (await r.json()).error || msg } catch { /* ignore */ }
      throw new Error(msg)
    }
    if (configCache) configCache.checkoutUrl = String(url || '').trim()
    return true
  } catch (e) {
    throw e
  }
}

export async function askAi(messages, userName) {
  const r = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, userName })
  })
  if (!r.ok) {
    if (r.status === 503) throw new Error('AI_NOT_CONFIGURED')
    throw new Error('AI_ERROR')
  }
  const data = await r.json()
  return data.reply || ''
}

export async function ttsAudio(text) {
  try {
    const r = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
    if (!r.ok) return null
    const blob = await r.blob()
    return URL.createObjectURL(blob)
  } catch (e) {
    return null
  }
}

export async function uploadAudio(file, label) {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('label', label)
  const r = await fetch('/api/upload', { method: 'POST', body: fd })
  if (!r.ok) throw new Error('Falha no envio')
  return r.json()
}

export async function fetchAudios() {
  try {
    const r = await fetch('/api/audios')
    if (!r.ok) return {}
    return await r.json()
  } catch (e) {
    return {}
  }
}

export async function uploadLogo(file) {
  const fd = new FormData()
  fd.append('file', file)
  const r = await fetch('/api/logo-upload', { method: 'POST', body: fd })
  if (!r.ok) throw new Error('Falha no envio do logo')
  return r.json()
}

export async function fetchLogo() {
  try {
    const r = await fetch('/api/logo')
    if (!r.ok) return null
    const data = await r.json()
    if (!data.url) return null
    return data.mtime ? `${data.url}?t=${Math.round(data.mtime)}` : data.url
  } catch (e) {
    return null
  }
}

export async function saveAiConfig({ apiKey, baseUrl, model }) {
  try {
    const r = await fetch('/api/ai-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: getAdminPin(), apiKey, baseUrl, model })
    })
    return r.ok
  } catch (e) {
    return false
  }
}

export async function loginAdmin(pin) {
  try {
    const r = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    })
    if (!r.ok) return false
    const data = await r.json()
    return Boolean(data.ok)
  } catch (e) {
    return false
  }
}

export async function changeAdminPin(currentPin, newPin) {
  try {
    const r = await fetch('/api/admin-pin', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: currentPin, newPin })
    })
    if (!r.ok) {
      let msg = 'Não foi possível trocar o PIN.'
      try { msg = (await r.json()).error || msg } catch { /* ignore */ }
      throw new Error(msg)
    }
    return true
  } catch (e) {
    throw e
  }
}

export async function verifyAccess(email) {
  try {
    const r = await fetch('/api/verify-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: String(email || '').trim() })
    })
    if (!r.ok) return false
    const data = await r.json()
    return Boolean(data.access)
  } catch (e) {
    return false
  }
}

export async function loginUser(email, password) {
  try {
    const r = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: String(email || '').trim(), password: String(password || '') })
    })
    if (!r.ok) return { ok: false, access: false, reason: 'no_access' }
    return await r.json()
  } catch (e) {
    return { ok: false, access: false, reason: 'error' }
  }
}

export async function setPassword(email, password) {
  try {
    const r = await fetch('/api/set-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: String(email || '').trim(), password: String(password || '') })
    })
    if (!r.ok) {
      let msg = 'Não foi possível criar sua senha.'
      try { msg = (await r.json()).error || msg } catch { /* ignore */ }
      return { ok: false, error: msg }
    }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: 'error' }
  }
}

export async function fetchSubscribers(pin) {
  try {
    const r = await fetch(`/api/subscribers?pin=${encodeURIComponent(pin)}`)
    if (!r.ok) return []
    const data = await r.json()
    return Array.isArray(data.list) ? data.list : []
  } catch (e) {
    return []
  }
}
