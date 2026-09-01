export const DECREES = [
  { id: 'd01', title: 'Merecimento', tags: ['reconhecimento', 'amada'], text: 'Eu agora autorizo, permito e elevo o meu nível de permissão, merecimento e gratidão. Está feito assim é.' },
  { id: 'd02', title: 'Saúde', tags: ['seguranca'], text: 'Aqui é solo sagrado e meu corpo é o templo da saúde perfeita. Está feito assim é.' },
  { id: 'd03', title: 'Rede Neural Unificada', tags: ['amada', 'seguranca'], text: 'Eu agora unifico minha rede neural cardíaca e cerebral em uma única rede neural, na frequência do amor, paz e gratidão. Está feito assim é.' },
  { id: 'd04', title: 'Três Energias do Dia', tags: ['amada', 'pertencimento'], text: 'Eu agora escolho a energia do amor, liberdade e gratidão e me sinto livre todo dia. Está feito assim é.' },
  { id: 'd05', title: 'Pertencimento', tags: ['pertencimento'], text: 'Eu sou filha do Deus vivo, eu pertenço ao Reino de nós, eu confio em mim e eu confio na vida. E eu confio agora. Está feito assim é.' },
  { id: 'd06', title: 'Segurança', tags: ['seguranca'], text: 'Eu agora estou segura e em paz com a minha vida, e tudo sempre dá certo para mim. Está feito assim é.' },
  { id: 'd07', title: 'Medo', tags: ['seguranca', 'pertencimento'], text: 'Não aceito nenhuma aparência de medo. Deus é vida, amor e dá liberdade. Eu agora sou vida, amor e liberdade em mim, em tudo e em todo mundo. Está feito assim é.' },
  { id: 'd08', title: 'Aceitação', tags: ['amada', 'pertencimento'], text: 'Eu agora me acolho e me aceito, eu me perdoo, me recebo, me amo e sou grata. Está feito assim é.' },
  { id: 'd10', title: 'Amor Próprio', tags: ['amada', 'reconhecimento'], text: 'Eu agora me abençoo, eu me amo, me sinto, me vejo e me ouço, e tudo vem fácil para mim. Está feito assim é.' },
  { id: 'd11', title: 'Mental', tags: ['reconhecimento', 'seguranca'], text: 'Eu agora me alinho com a mente de Deus. Só Deus vê, só Deus age, e todo o resto eu entrego ao meu Cristo interno, e tudo fica claro para mim. Está feito assim é.' },
  { id: 'd12', title: 'Pensamentos em Loop', tags: ['seguranca', 'reconhecimento'], text: 'Não aceito essa aparência. Eu já consegui uma vez, e Deus é vida, amor e dá liberdade. Portanto, eu posso conseguir de novo. Está feito assim é.' },
  { id: 'd13', title: 'Dúvida', tags: ['reconhecimento', 'pertencimento'], text: 'Eu agora sou o tempo de Deus e faço tudo na hora certa. Está feito assim é.' },
  { id: 'd15a', title: 'Mente Acelerada', tags: ['reconhecimento', 'seguranca'], text: 'Eu agora tenho foco, força e energia, e eu posso direcionar meus pensamentos para o que eu quero. E agora eu escolho. Está feito assim é.' },
  { id: 'd15b', title: 'Para Dormir', tags: ['seguranca', 'amada'], text: 'Agora, em paz, eu me deito e logo adormeço, porque só Tu, Senhor, me fazes viver em segurança. Salmo 4:8. Está feito assim é.' },
  { id: 'd16', title: 'Conectar com a Divindade', tags: ['amada', 'pertencimento'], text: 'Eu agora me conecto com minha divindade e sei, sinto, que sou orientada pelo amor Divino. Está feito assim é.' },
  { id: 'd18a', title: 'Rejuvenescimento', tags: ['amada', 'reconhecimento'], text: 'Minha pele agora é um invólucro de Deus, e eu me sinto cada vez melhor, mais saudável, jovem e bela. Está feito assim é.' },
  { id: 'd18b', title: 'Boa o Suficiente', tags: ['amada', 'reconhecimento', 'seguranca', 'pertencimento'], text: 'Eu agora sou boa o suficiente e vivo sempre satisfeita. Recupero o prazer de viver e a minha própria identidade. Está feito assim é.' },
  { id: 'd19', title: 'Ser Você', tags: ['pertencimento', 'amada', 'reconhecimento'], text: 'É verdadeiro, permitido e seguro eu ser eu. É verdadeiro, permitido, seguro e divertido eu ser eu. É verdadeiro, permitido e seguro eu ser eu e ir além do programa do medo. Está feito assim é.' },
  { id: 'd20', title: 'Frequência da Cura', tags: ['seguranca', 'amada'], text: 'Eu sou ativar, ativar, ativar cura quântica em luz. Timo, ative-se, timo, ative-se, timo, ative-se agora. Eu sou meu corpo luminoso na frequência da cura divina, na graça do Pai e de maneira perfeita. Está feito assim é.' },
  { id: 'd21', title: 'Dissipar Energia Densa', tags: ['seguranca', 'pertencimento'], text: 'Tudo o que isso é e tudo o que isso representa em meu estado de ser agora, eu dissipo, libero e neutralizo, eu dissipo, libero e neutralizo, eu dissipo, libero e neutralizo. Eu sou o amor de Deus vivo em mim. Está feito assim é.' }
]

export const NEED_TAG = {
  seguranca: 'seguranca',
  segura: 'seguranca',
  pertencimento: 'pertencimento',
  pertencer: 'pertencimento',
  reconhecimento: 'reconhecimento',
  reconhecida: 'reconhecimento',
  amada: 'amada'
}

export function decreesForNeed(needId) {
  const tag = NEED_TAG[needId]
  if (!tag) return [...DECREES]
  return DECREES.filter((d) => d.tags.includes(tag))
}

const GENERATED_OPENERS = [
  'Eu agora autorizo, permito e elevo o meu nível de permissão, merecimento e gratidão.',
  'Eu agora escolho me alinhar com a verdade de quem eu sou.',
  'Eu agora me abençoo e libero toda crença que não é minha.',
  'Eu agora me conecto com a minha divindade e com o meu valor inegável.',
  'Eu agora recupero a alegria de viver e o prazer de ser eu.',
  'Eu agora libero o passado e abro espaço para o novo.',
  'Eu agora confio em mim, confio na vida e me permito receber.',
  'Eu agora ancoro meu corpo no solo sagrado do agora.',
  'Eu agora devolvo ao passado tudo o que não me serve.',
  'Eu agora escolho a paz como o meu estado natural.',
  'Eu agora me recebo inteira, sem pedir licença.',
  'Eu agora solto a guarda e fico no meu próprio chão.',
  'Eu agora honro o meu corpo, o meu espírito e a minha mente.',
  'Eu agora me permito ser vista, ouvida e amada.',
  'Eu agora descanso na certeza de que tudo dá certo para mim.',
  'Eu agora caminho no meu tempo, no meu ritmo, na minha verdade.'
]

const NEED_MIDDLES = {
  seguranca: [
    'Eu estou segura. O meu corpo pode baixar a guarda.',
    'Eu escolho a paz no corpo e a vida me sustenta.',
    'Eu estou protegida. Nada precisa me ameaçar agora.',
    'O meu chão é firme. Eu posso respirar e ficar.',
    'Eu solto o alerta. Eu estou em paz neste instante.',
    'Eu confio na vida. Eu estou segura exatamente como estou.',
    'O perigo antigo já passou. Hoje eu estou em paz.',
    'Eu habito o meu corpo com segurança e leveza.',
    'Eu devolvo o medo ao passado. Agora eu fico.',
    'Eu estou segura, em paz, e a vida cuida de mim.',
    'O meu sistema nervoso escolhe descanso. Eu estou segura.',
    'Eu posso soltar. Eu estou segura agora.'
  ],
  pertencimento: [
    'Eu pertenço. Eu tenho o meu lugar aqui.',
    'Eu me incluo. Eu não preciso caber para existir.',
    'O meu lugar já é meu. Eu ocupo sem pedir.',
    'Eu pertenço a mim mesma, e isso já é casa.',
    'Eu tenho mesa, tenho lugar, tenho nome.',
    'Eu me recebo. Eu faço parte.',
    'Eu não preciso desaparecer para ficar.',
    'Eu pertenço. Eu sou parte do Reino de nós.',
    'O meu lugar não depende de convite.',
    'Eu me acolho e me coloco no centro da minha vida.',
    'Eu pertenço, mesmo quando estou só.',
    'Eu tenho o meu lugar. Eu fico.'
  ],
  reconhecimento: [
    'Eu tenho valor pelo que eu sou, não pelo que eu faço.',
    'Eu me vejo. Eu me honro. Eu me reconheço primeiro.',
    'O meu valor já é certo. Eu não preciso provar.',
    'Eu sou visível para mim, e isso basta para o mundo me ver.',
    'Eu reconheço a minha luz sem pedir permissão.',
    'Eu importo. O que eu sou já é suficiente.',
    'Eu solto a cobrança. Eu já sou valor.',
    'Eu me vejo com os olhos do amor.',
    'A minha voz tem lugar. A minha presença tem peso.',
    'Eu honro o que eu já sou, hoje.',
    'Eu não preciso produzir para merecer existir.',
    'Eu me reconheço. Eu me basto.'
  ],
  amada: [
    'Eu sou amada exatamente como eu sou.',
    'Eu me amo, me sinto, me vejo e me ouço.',
    'O amor começa em mim e volta para mim.',
    'Eu me deixo amar. Eu recebo.',
    'Eu sou o amor que eu procuro.',
    'Eu me abençoo. Eu me acolho. Eu me amo.',
    'O carinho que eu mereço já pode começar em mim.',
    'Eu aceito o amor. Eu não preciso merecer para recebê-lo.',
    'Eu sou amada, viva e inteira.',
    'Eu me dou o afeto que o meu corpo pede.',
    'Eu me deixo receber. Eu sou amada.',
    'O amor me cerca. Eu aceito o amor.'
  ]
}

const GENERATED_CORES = [
  'Eu sou boa o suficiente e vivo sempre satisfeita.',
  'Eu recupero o prazer de viver e a minha identidade própria.',
  'Eu sou boa o suficiente, viva e satisfeita, no meu próprio ritmo.',
  'Eu recupero a minha essência e a minha própria identidade.',
  'Eu vivo em paz, com prazer de viver e gratidão.',
  'Eu sou boa o suficiente e mereço viver sempre satisfeita.',
  'Eu sou boa o suficiente. Eu vivo satisfeita. Eu me basto.',
  'Eu recupero o prazer de viver, a paz e a minha própria identidade.'
]

const GENERATED_CLOSERS = [
  'Está feito assim é.',
  'Está feito. Assim é.',
  'Está feito assim é. Eu confio.',
  'Está feito. Eu agradeço.',
  'Está feito assim é. Eu recebo.',
  'Está feito. Assim é, agora.'
]

const GENERATED_TITLES = [
  'Prazer de Viver', 'Identidade Própria', 'Boa o Suficiente', 'Sempre Satisfeita',
  'Essência', 'Merecimento', 'Confiança', 'Liberdade', 'Paz no Corpo', 'Meu Lugar'
]

const STORAGE_KEY = 'teramim_decrees_seen'

function loadSeen() {
  if (typeof localStorage === 'undefined') return { all: [], byNeed: {} }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { all: [], byNeed: {} }
    const parsed = JSON.parse(raw)
    return {
      all: Array.isArray(parsed.all) ? parsed.all : [],
      byNeed: parsed.byNeed && typeof parsed.byNeed === 'object' ? parsed.byNeed : {}
    }
  } catch {
    return { all: [], byNeed: {} }
  }
}

function saveSeen(data) {
  if (typeof localStorage === 'undefined') return
  try {
    const trimmedAll = data.all.slice(-4000)
    const byNeed = {}
    for (const [k, v] of Object.entries(data.byNeed || {})) {
      byNeed[k] = Array.isArray(v) ? v.slice(-1500) : []
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ all: trimmedAll, byNeed }))
  } catch {
    // ignore
  }
}

function markSeen(needId, text) {
  const data = loadSeen()
  if (!data.all.includes(text)) data.all.push(text)
  const key = NEED_TAG[needId] || 'geral'
  if (!data.byNeed[key]) data.byNeed[key] = []
  if (!data.byNeed[key].includes(text)) data.byNeed[key].push(text)
  saveSeen(data)
}

function seenSet(needId) {
  const data = loadSeen()
  const key = NEED_TAG[needId] || 'geral'
  return new Set([...(data.all || []), ...((data.byNeed && data.byNeed[key]) || [])])
}

function comboCount(tag) {
  const middles = NEED_MIDDLES[tag] || NEED_MIDDLES.amada
  return GENERATED_OPENERS.length * middles.length * GENERATED_CORES.length * GENERATED_CLOSERS.length
}

export function generateDecree(seed, needId = null) {
  const tag = NEED_TAG[needId] || 'amada'
  const middles = NEED_MIDDLES[tag] || NEED_MIDDLES.amada
  const total = comboCount(tag)
  const n = ((Number(seed) % total) + total) % total
  const o = n % GENERATED_OPENERS.length
  const m = Math.floor(n / GENERATED_OPENERS.length) % middles.length
  const c = Math.floor(n / (GENERATED_OPENERS.length * middles.length)) % GENERATED_CORES.length
  const cl = Math.floor(n / (GENERATED_OPENERS.length * middles.length * GENERATED_CORES.length)) % GENERATED_CLOSERS.length
  const text = `${GENERATED_OPENERS[o]} ${middles[m]} ${GENERATED_CORES[c]} ${GENERATED_CLOSERS[cl]}`
  return {
    id: 'gen_' + n + '_' + tag,
    title: GENERATED_TITLES[n % GENERATED_TITLES.length],
    generated: true,
    tags: [tag],
    text
  }
}

export function pickFreshDecree(needId) {
  const tag = NEED_TAG[needId] || null
  const used = seenSet(needId)
  const fromRosi = decreesForNeed(needId)
  const unusedRosi = fromRosi.filter((d) => !used.has(d.text))
  if (unusedRosi.length) {
    const pick = unusedRosi[Math.floor(Math.random() * unusedRosi.length)]
    markSeen(needId, pick.text)
    return pick
  }
  const total = comboCount(tag || 'amada')
  const start = Math.floor(Math.random() * total)
  for (let i = 0; i < total; i++) {
    const d = generateDecree(start + i, needId)
    if (!used.has(d.text)) {
      markSeen(needId, d.text)
      return d
    }
  }
  const data = loadSeen()
  const key = tag || 'geral'
  data.byNeed[key] = []
  saveSeen(data)
  const fresh = generateDecree(Date.now(), needId)
  markSeen(needId, fresh.text)
  return fresh
}

export function decreeBankForNeed(needId, count = 30) {
  const fromRosi = decreesForNeed(needId)
  const generated = Array.from({ length: count }, (_, i) => generateDecree(Date.now() + i * 17, needId))
  return [...fromRosi, ...generated]
}

export function decreeAt(bank, index) {
  if (!bank || bank.length === 0) return null
  return bank[index % bank.length]
}
