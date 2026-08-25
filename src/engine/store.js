const USERS_KEY = 'teramim_users'
const ACCESS_KEY = 'teramim_accesses'
const SUBS_KEY = 'teramim_subs'
const CURRENT_KEY = 'teramim_current_user'
const ADMIN_PIN_KEY = 'teramim_admin_pin'

export function getAdminPin() {
  return localStorage.getItem(ADMIN_PIN_KEY) || '0707'
}

export function setAdminPin(pin) {
  localStorage.setItem(ADMIN_PIN_KEY, String(pin || '').trim())
}

export function getAllUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || [] } catch { return [] }
}

function saveUsers(list) {
  localStorage.setItem(USERS_KEY, JSON.stringify(list))
}

export function getOrCreateUser() {
  const cur = localStorage.getItem(CURRENT_KEY)
  if (cur) {
    try {
      const parsed = JSON.parse(cur)
      if (parsed && parsed.id) return parsed
    } catch { /* ignore */ }
  }
  const user = {
    id: 'usr_' + Math.random().toString(36).slice(2, 10),
    name: '',
    createdAt: new Date().toISOString(),
    sessions: 0,
    lastAccess: new Date().toISOString()
  }
  const list = getAllUsers()
  list.push(user)
  saveUsers(list)
  localStorage.setItem(CURRENT_KEY, JSON.stringify(user))
  return user
}

export function hasAccess() {
  const cur = localStorage.getItem(CURRENT_KEY)
  if (cur) {
    try {
      const parsed = JSON.parse(cur)
      if (parsed && parsed.subscribed) return true
    } catch { /* ignore */ }
  }
  return false
}

export function updateCurrentUser(patch) {
  const user = getOrCreateUser()
  const merged = { ...user, ...patch, id: user.id }
  localStorage.setItem(CURRENT_KEY, JSON.stringify(merged))
  const list = getAllUsers()
  const i = list.findIndex((u) => u.id === user.id)
  if (i >= 0) list[i] = merged
  else list.push(merged)
  saveUsers(list)
  return merged
}

export function touchAccess(session, user) {
  const accesses = JSON.parse(localStorage.getItem(ACCESS_KEY)) || []
  accesses.push({
    id: session.id,
    userId: user.id,
    ts: new Date().toISOString(),
    page: session.page || 'app'
  })
  localStorage.setItem(ACCESS_KEY, JSON.stringify(accesses))
  updateCurrentUser({ sessions: user.sessions + 1, lastAccess: new Date().toISOString() })
}

export function recordPageView(page) {
  const cur = getOrCreateUser()
  const accesses = JSON.parse(localStorage.getItem(ACCESS_KEY)) || []
  accesses.push({
    id: 'acc_' + Math.random().toString(36).slice(2, 10),
    userId: cur.id,
    ts: new Date().toISOString(),
    page
  })
  localStorage.setItem(ACCESS_KEY, JSON.stringify(accesses))
  updateCurrentUser({ lastAccess: new Date().toISOString() })
  return cur
}

export function getAccesses() {
  try { return JSON.parse(localStorage.getItem(ACCESS_KEY)) || [] } catch { return [] }
}

export function getSubscriptions() {
  try { return JSON.parse(localStorage.getItem(SUBS_KEY)) || [] } catch { return [] }
}

export function saveSubscription(sub) {
  const list = getSubscriptions()
  list.push({ ...sub, id: 'sub_' + Math.random().toString(36).slice(2, 10), createdAt: new Date().toISOString() })
  localStorage.setItem(SUBS_KEY, JSON.stringify(list))
  updateCurrentUser({ subscribed: true, plan: sub.plan })
  return list
}

export function saveReminder(userId, time) {
  const user = updateCurrentUser({ reminderTime: time, reminderActive: true })
  const list = getAllUsers()
  const i = list.findIndex((u) => u.id === userId)
  if (i >= 0) list[i] = { ...list[i], reminderTime: time, reminderActive: true }
  saveUsers(list)
  return user
}

const CHECKOUT_KEY = 'teramim_checkout_url'
const CHALLENGE_KEY = 'teramim_challenge'

const MILESTONES = [
  { days: 7, label: 'Semana 1', emoji: '🌱', text: 'Você começou. Isso já é muito.' },
  { days: 21, label: '21 dias', emoji: '🌸', text: 'Hábito em formação. Seu corpo já responde.' },
  { days: 40, label: '40 dias', emoji: '🌻', text: 'Um ciclo completo. Paz vira treino, treino vira você.' }
]

export function getCheckoutUrl() {
  return localStorage.getItem(CHECKOUT_KEY) || ''
}

export function setCheckoutUrl(url) {
  if (url) localStorage.setItem(CHECKOUT_KEY, url.trim())
  else localStorage.removeItem(CHECKOUT_KEY)
}

function todayKey() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function getChallenge() {
  try { return JSON.parse(localStorage.getItem(CHALLENGE_KEY)) || { entries: {} } } catch { return { entries: {} } }
}

function saveChallenge(c) {
  localStorage.setItem(CHALLENGE_KEY, JSON.stringify(c))
}

function computeStreak(entries) {
  const days = Object.keys(entries).sort()
  if (!days.length) return 0
  let streak = 0
  let cursor = new Date()
  if (!entries[todayKey()]) {
    cursor = new Date(cursor.getTime() - 86400000)
  }
  const p = (n) => String(n).padStart(2, '0')
  while (true) {
    const k = `${cursor.getFullYear()}-${p(cursor.getMonth() + 1)}-${p(cursor.getDate())}`
    if (entries[k]) {
      streak++
      cursor = new Date(cursor.getTime() - 86400000)
    } else {
      break
    }
  }
  return streak
}

export function recordCheckIn(mood) {
  const c = getChallenge()
  const key = todayKey()
  c.entries[key] = {
    mood,
    ts: new Date().toISOString()
  }
  saveChallenge(c)
  return getChallengeSummary()
}

export function getChallengeSummary() {
  const c = getChallenge()
  const entries = c.entries || {}
  const streak = computeStreak(entries)
  const dayCount = Object.keys(entries).length
  const milestones = MILESTONES.map((m) => ({
    ...m,
    achieved: dayCount >= m.days,
    nextIn: Math.max(0, m.days - dayCount)
  }))
  const history = Object.keys(entries)
    .sort()
    .slice(-14)
    .map((k) => ({ date: k, mood: entries[k].mood }))
  return { streak, dayCount, milestones, history }
}

export function seedDemoData() {
  const users = getAllUsers()
  if (users.length > 2) return
  const names = ['Maria Helena', 'Ana Paula', 'Cláudia Regina']
  const now = Date.now()
  for (let i = 0; i < names.length; i++) {
    const uid = 'demo_' + i
    if (users.some((u) => u.id === uid)) continue
    const createdAt = new Date(now - (i + 3) * 86400000).toISOString()
    const u = {
      id: uid,
      name: names[i],
      createdAt,
      sessions: 2 + i,
      lastAccess: new Date(now - i * 3600000).toISOString(),
      reminderTime: i % 2 ? '16:00' : null
    }
    users.push(u)
    const accesses = JSON.parse(localStorage.getItem(ACCESS_KEY)) || []
    for (let j = 0; j < u.sessions; j++) {
      accesses.push({
        id: 'demo_acc_' + i + '_' + j,
        userId: uid,
        ts: new Date(now - (i + j) * 7200000).toISOString(),
        page: j % 2 ? 'resp' : 'app'
      })
    }
    localStorage.setItem(ACCESS_KEY, JSON.stringify(accesses))
  }
  saveUsers(users)
}
