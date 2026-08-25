import { RESP_LIBRARY } from '../data/respLibrary.js'
import { AUDIO_PRACTICES } from '../data/audioPractices.js'

const DEFAULTS = {
  landing: {
    chip: 'Metodologia P.A.R.E® · Rosi Aguiar',
    heroTitle: 'Paz não é evento.\nPaz é treino.',
    heroSub: 'Em poucos minutos por dia, regule seu sistema nervoso e volte para você. A TerAmim identifica o que você precisa agora e te leva direto ao protocolo certo — guiado pela voz de Rosi Aguiar.',
    stepsTitle: 'Como o P.A.R.E® te conduz',
    stepsSub: 'Do automático para a presença, da reação para a escolha. Um ciclo guiado por uma voz que te acolhe sem infantilizar.',
    section2Title: 'O seu sistema nervoso\nno modo da calma',
    section2Sub: 'O P.A.R.E® não trabalha apenas com trauma, mas sim com o que não cresceu: emoções que pedem acolhimento, imagens mentais novas para o que você quer viver. Respiração, presença, escolha, ciência e fé — sem promessas mágicas, mas com resultado no dia a dia.',
    priceTitle: 'Comece hoje por menos de um real ao dia',
    priceSub: 'Acesso completo à biblioteca RÉSP, áudios guiados e protocolos de breathwork. Cancele quando quiser, sem fidelidade.'
  },
  pricing: {
    price: '29,99',
    oldPrice: '49,90'
  },
  respPractices: RESP_LIBRARY.map((r) => ({
    id: r.id,
    name: r.name,
    tagline: r.tagline,
    duration: r.duration,
    description: r.description
  })),
  audioPractices: AUDIO_PRACTICES.map((p) => ({
    id: p.id,
    name: p.name,
    tagline: p.tagline
  }))
}

function mergeRespList(saved) {
  return RESP_LIBRARY.map((d) => {
    const c = (saved || []).find((p) => p.id === d.id) || {}
    return { ...d, ...c }
  })
}

function mergeAudioList(saved) {
  return AUDIO_PRACTICES.map((d) => {
    const c = (saved || []).find((p) => p.id === d.id) || {}
    return { ...d, ...c }
  })
}

export function mergeContent(saved) {
  const s = saved || {}
  return {
    landing: { ...DEFAULTS.landing, ...(s.landing || {}) },
    pricing: { ...DEFAULTS.pricing, ...(s.pricing || {}) },
    respPractices: mergeRespList(s.respPractices),
    audioPractices: mergeAudioList(s.audioPractices)
  }
}

export async function loadContent() {
  try {
    const r = await fetch('/api/content')
    if (!r.ok) return mergeContent({})
    const saved = await r.json()
    return mergeContent(saved)
  } catch (e) {
    return mergeContent({})
  }
}

export async function saveContent(content, pin) {
  try {
    const r = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, content })
    })
    if (!r.ok) throw new Error('Falha ao salvar')
    return true
  } catch (e) {
    return false
  }
}

export { DEFAULTS, mergeRespList, mergeAudioList }
