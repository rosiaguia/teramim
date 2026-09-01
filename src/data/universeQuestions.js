const NEED_CATEGORIES = {
  seguranca: {
    id: 'seguranca',
    label: 'Segurança',
    emoji: '🛡️',
    intro: 'Perguntas para expandir a consciência sobre segurança, paz no corpo e confiança na vida.',
    topics: [
      'a minha segurança', 'o meu corpo em paz', 'a minha confiança na vida',
      'o que me faz sentir protegida', 'o meu direito de baixar a guarda',
      'a paz que já existe em mim', 'o chão firme debaixo dos meus pés',
      'a forma como eu me protejo', 'o que eu solto quando me sinto segura',
      'a minha capacidade de estar em paz agora', 'o alerta que eu não preciso mais',
      'a segurança que começa em mim', 'o que o meu corpo pede para se sentir seguro',
      'a liberdade de não viver em alerta', 'o meu lugar seguro dentro de mim'
    ]
  },
  pertencimento: {
    id: 'pertencimento',
    label: 'Pertencimento',
    emoji: '🤝',
    intro: 'Perguntas para expandir a consciência sobre pertencer, ter lugar e se incluir.',
    topics: [
      'o meu lugar no mundo', 'o meu pertencimento', 'a forma como eu me incluo',
      'o que me faz sentir em casa', 'a minha liberdade de ser eu entre os outros',
      'o acolhimento que eu mereço', 'o meu direito de ocupar espaço',
      'a mesa onde eu já tenho lugar', 'o que eu solto quando sei que pertenço',
      'a minha capacidade de pertencer a mim mesma', 'os laços que me sustentam',
      'o que eu escolho não repetir para caber', 'a paz de ter o meu lugar',
      'a forma como eu me recebo', 'o pertencimento que começa em mim'
    ]
  },
  reconhecimento: {
    id: 'reconhecimento',
    label: 'Reconhecimento',
    emoji: '🌟',
    intro: 'Perguntas para expandir a consciência sobre valor, visibilidade e merecimento.',
    topics: [
      'o meu valor', 'a forma como eu me vejo', 'o reconhecimento que começa em mim',
      'o que eu já faço e ainda não honro', 'a minha luz', 'o meu merecimento',
      'a imagem que eu carrego de mim', 'o que eu ousaria se o meu valor já fosse certo',
      'a minha voz verdadeira', 'o que eu adio por medo de não ser vista',
      'a forma como eu me cobro', 'o meu direito de ser reconhecida',
      'o valor que não depende do que eu faço', 'a mulher que eu sou quando me vejo',
      'o que muda quando eu me reconheço primeiro'
    ]
  },
  amada: {
    id: 'amada',
    label: 'Ser amada',
    emoji: '💗',
    intro: 'Perguntas para expandir a consciência sobre amor, afeto e se deixar amar.',
    topics: [
      'o amor que começa em mim', 'a forma como eu me amo', 'o amor que eu mereço',
      'a minha capacidade de receber amor', 'o que eu solto quando me sinto amada',
      'a minha abertura para me deixar amar', 'o carinho que eu me dou',
      'o jeito como o amor chega até mim', 'o que ainda fica de mim nas relações',
      'a paz que o amor me traz', 'o meu direito de ser amada como eu sou',
      'a forma como eu escolho o amor', 'o afeto que o meu corpo pede',
      'o que eu faria se já me soubesse amada', 'o amor que eu já sou'
    ]
  }
}

const CATEGORIES = [
  {
    id: 'amor',
    label: 'Amor & Relacionamento',
    emoji: '💗',
    intro: 'Perguntas para expandir a consciência sobre o amor — o que chega, o que parte, o que você atrai.',
    topics: [
      'o amor', 'as minhas relações', 'a forma como eu amo', 'o que eu atraio',
      'os padrões que repito sem perceber', 'a minha capacidade de receber amor',
      'a minha abertura para me deixar amar', 'o que ainda fica de mim nas relações',
      'a minha vontade de me entregar', 'o amor que começa em mim',
      'o meu jeito de pedir o que preciso', 'a paz que o amor me traz',
      'a forma como eu escolho com quem fico', 'o que eu solto quando me sinto amada',
      'o amor que eu mereço', 'o jeito como o amor chega até mim'
    ]
  },
  {
    id: 'dinheiro',
    label: 'Dinheiro & Prosperidade',
    emoji: '💰',
    intro: 'Perguntas para expandir a consciência sobre abundância, valor e merecimento.',
    topics: [
      'a minha relação com o dinheiro', 'a minha crença sobre abundância',
      'o meu valor', 'a minha capacidade de receber',
      'as histórias que conto sobre dinheiro', 'o que merecer significa para mim',
      'a minha abertura para prosperar', 'o dinheiro como energia',
      'a minha tranquilidade em ter', 'o que eu faço por dinheiro sem perceber',
      'a abundância que já existe em mim', 'o meu direito de ser próspera',
      'a riqueza que me espera', 'o meu merecimento de receber'
    ]
  },
  {
    id: 'proposito',
    label: 'Propósito & Trabalho',
    emoji: '🌟',
    intro: 'Perguntas para expandir a consciência sobre o seu lugar no mundo e o que você veio fazer.',
    topics: [
      'o meu lugar no mundo', 'o meu propósito', 'o valor que eu ofereço',
      'o meu dom', 'o que me faz vibrar', 'a contribuição que eu vim dar',
      'o talento que eu ainda não uso', 'o meu jeito de servir', 'a minha vocação',
      'o trabalho que eu sonho', 'o passo pequeno que eu posso dar',
      'o que o meu coração pede', 'a minha entrega', 'o legado que eu deixo'
    ]
  },
  {
    id: 'saude',
    label: 'Saúde & Corpo',
    emoji: '🌿',
    intro: 'Perguntas para expandir a consciência sobre o corpo, a energia e a vitalidade.',
    topics: [
      'o meu corpo', 'a minha energia', 'a minha vitalidade', 'o que o meu corpo me diz',
      'o meu ritmo de descanso', 'os meus hábitos de cuidado',
      'a minha relação com o cansaço', 'a cura que o meu corpo já conhece',
      'a minha respiração', 'a minha capacidade de regenerar', 'o que me tira energia',
      'a forma como eu me nutro', 'a minha cura', 'o prazer de estar viva'
    ]
  },
  {
    id: 'familia',
    label: 'Família & Raízes',
    emoji: '🏡',
    intro: 'Perguntas para expandir a consciência sobre os laços, as heranças e as escolhas.',
    topics: [
      'a minha família', 'os padrões da minha família', 'a herança emocional que carrego',
      'o meu lugar entre os meus', 'o amor que existe na minha família',
      'o que eu escolho não repetir', 'a paz com as minhas raízes',
      'a minha liberdade de ser eu', 'a forma como eu amo os meus',
      'o que eu quero passar adiante', 'a gratidão que me liga aos meus',
      'os limites que me protegem', 'o acolhimento que eu mereço', 'a paz com a minha história'
    ]
  },
  {
    id: 'espiritualidade',
    label: 'Espiritualidade & Fé',
    emoji: '🕊️',
    intro: 'Perguntas para expandir a consciência sobre fé, sentido e conexão com algo maior.',
    topics: [
      'a minha fé', 'a minha conexão com o todo', 'o sentido da minha vida',
      'o que eu não posso controlar', 'o fluxo da vida', 'os sinais que eu já recebi',
      'a minha confiança no processo', 'a paz que não depende das circunstâncias',
      'o sagrado em mim', 'a minha intuição', 'o mistério que me guia',
      'a presença que nunca me deixa', 'a minha entrega ao todo', 'a luz que me guia'
    ]
  },
  {
    id: 'autoconhecimento',
    label: 'Autoconhecimento',
    emoji: '🪞',
    intro: 'Perguntas para expandir a consciência sobre quem você é, de verdade.',
    topics: [
      'quem eu sou', 'a minha essência', 'o que eu escondo até de mim',
      'a forma como eu me trato', 'o que eu adio por medo',
      'as emoções que ficaram esperando para crescer', 'a minha voz verdadeira',
      'o que eu repito sem perceber', 'a escolha que eu venho adiando',
      'o meu modo de me cobrar', 'a coragem que já existe em mim',
      'o que eu faria se não tivesse medo', 'a minha sombra', 'a minha luz'
    ]
  }
]

const STEMS = [
  'O que o universo quer que eu veja sobre {topic}?',
  'O que eu ainda não percebi sobre {topic}?',
  'Que possibilidade escondida existe quando eu aceito {topic}?',
  'O que muda em mim quando eu olho para {topic}?',
  'Que pergunta sobre {topic} eu nunca me fiz?',
  'O que eu escolheria sentir com {topic}?',
  'Que mensagem eu recebo quando olho para {topic}?',
  'Que liberdade existe quando eu abro espaço para {topic}?',
  'Como posso receber mais quando olho para {topic}?',
  'O que a minha versão mais leve saberia sobre {topic}?',
  'Que sabedoria nasce quando eu respiro e olho para {topic}?',
  'O que eu solto quando deixo {topic} me atravessar?',
  'Que nova forma de ver {topic} está disponível para mim?',
  'O que o universo quer que eu lembre sobre {topic}?',
  'O que a minha intuição sabe sobre {topic}?',
  'Que espaço eu posso abrir para {topic} hoje?',
  'O que acontece quando eu deixo de lutar contra {topic}?',
  'Que presente {topic} quer me dar?',
  'O que {topic} me mostra que eu ainda não vejo?',
  'Que escolha mais gentil existe em {topic}?',
  'O que eu permitiria sentir sobre {topic} se não tivesse medo?',
  'Que verdade sobre {topic} eu já conheço no fundo?',
  'Como {topic} pode se tornar mais leve na minha vida?',
  'Que conversa o universo quer ter comigo sobre {topic}?',
  'O que eu preciso saber sobre {topic} para seguir em paz?',
  'Que parte de mim se ilumina quando eu olho para {topic}?',
  'O que muda quando eu aceito {topic} como ele é?',
  'Que amor escondido existe em {topic}?',
  'Que sabedoria {topic} carrega para mim?',
  'O que eu agradeceria em {topic} hoje?',
  'Que porta se abre quando eu olho para {topic} com os olhos do coração?',
  'O que {topic} me ensina sobre quem eu sou?',
  'Que liberdade existe quando eu solto o controle sobre {topic}?',
  'O que eu recebo quando abro espaço para {topic} na minha vida?',
  'Que futuro gentil se desenha quando eu penso em {topic}?',
  'Que paz está disponível quando eu aceito {topic}?',
  'O que {topic} quer que eu entenda?',
  'Que coragem nasce quando eu olho para {topic}?',
  'Como eu posso honrar {topic} na minha vida?',
  'Que lembrança o meu corpo guarda sobre {topic}?'
]

const OPENINGS = [
  ''
]

export const NEED_TO_UNIVERSE = {
  seguranca: 'seguranca',
  segura: 'seguranca',
  pertencimento: 'pertencimento',
  pertencer: 'pertencimento',
  reconhecimento: 'reconhecimento',
  reconhecida: 'reconhecimento',
  amada: 'amada'
}

export const UNIVERSE_CATEGORIES = CATEGORIES.map(({ id, label, emoji, intro }) => ({ id, label, emoji, intro }))

export function universeCategoryById(id) {
  const needCat = NEED_CATEGORIES[id]
  if (needCat) {
    return { id: needCat.id, label: needCat.label, emoji: needCat.emoji, intro: needCat.intro }
  }
  return CATEGORIES.find((c) => c.id === id) || null
}

function shuffle(list) {
  const arr = [...list]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const STORAGE_KEY = 'teramim_universe_seen'
let seen = new Set()

function loadSeen() {
  if (typeof localStorage === 'undefined') return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) seen = new Set(JSON.parse(raw))
  } catch {
    seen = new Set()
  }
}

function saveSeen() {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen]))
  } catch {
    // ignore
  }
}

function buildPool(catId) {
  const cat = NEED_CATEGORIES[catId] || CATEGORIES.find((c) => c.id === catId)
  if (!cat) return []
  const pool = []
  for (const opening of OPENINGS) {
    for (const stem of STEMS) {
      for (const topic of cat.topics) {
        pool.push(opening + stem.replace('{topic}', topic))
      }
    }
  }
  return pool
}

function freshFrom(catIds, excludeSeen) {
  const pool = catIds.flatMap(buildPool)
  return shuffle(pool.filter((q) => !excludeSeen.has(q)))
}

export function questionsForCategory(catId, count = 3, options = {}) {
  loadSeen()
  const lock = Boolean(options.lock) || Boolean(NEED_CATEGORIES[catId])
  const mainPool = buildPool(catId)
  const fresh = shuffle(mainPool.filter((q) => !seen.has(q)))
  let picked = fresh.slice(0, count)
  if (picked.length < count && !lock) {
    const otherIds = CATEGORIES.map((c) => c.id).filter((id) => id !== catId)
    const supplement = freshFrom(otherIds, seen)
    picked = picked.concat(supplement.slice(0, count - picked.length))
  } else if (picked.length < count) {
    picked = picked.concat(shuffle(mainPool).slice(0, count - picked.length))
  }
  picked.forEach((q) => seen.add(q))
  saveSeen()
  return picked
}

export function questionsForNeed(needId, count = 3) {
  const catId = NEED_TO_UNIVERSE[needId] || needId
  return questionsForCategory(catId, count, { lock: true })
}

export function nextQuestion(catId) {
  loadSeen()
  const mainPool = buildPool(catId)
  const fresh = shuffle(mainPool.filter((q) => !seen.has(q)))
  const q = fresh.length ? fresh[0] : freshFrom(CATEGORIES.map((c) => c.id), seen)[0]
  seen.add(q)
  saveSeen()
  return q
}
