export const NEEDS = [
  {
    id: 'seguranca',
    label: 'Segurança',
    emoji: '🛡️',
    color: '#6B5D8F',
    phrase: 'Quando a necessidade é segurança, o caminho é trazer o corpo de volta para o chão, para o agora.',
    belief: 'Se eu baixar a guarda, algo ruim vai acontecer',
    affirmation: 'Eu estou segura. Eu respiro. Eu escolho a paz. Eu sou boa suficiente e vivo sempre satisfeita.',
    smartQuestion: 'Se você estivesse completamente segura, o que você se permitiria sentir agora?',
    feeling: 'insegura ou em alerta'
  },
  {
    id: 'pertencimento',
    label: 'Pertencimento',
    emoji: '🤝',
    color: '#5E8B7E',
    phrase: 'Quando a necessidade é pertencer, o caminho é sentir que você faz parte — começando por pertencer a si mesma.',
    belief: 'Eu não pertenço a lugar nenhum',
    affirmation: 'Eu pertenço. Eu tenho o meu lugar aqui. Eu sou boa suficiente e vivo sempre satisfeita.',
    smartQuestion: 'Se você soubesse que tem lugar em qualquer mesa, onde você se sentaria hoje?',
    feeling: 'que não pertence'
  },
  {
    id: 'reconhecimento',
    label: 'Reconhecimento',
    emoji: '🌟',
    color: '#C9A227',
    phrase: 'Quando a necessidade é ser reconhecida, o caminho é reconfigurar a imagem que você carrega de si.',
    belief: 'Meu valor depende do que eu faço',
    affirmation: 'Eu tenho valor pelo que eu sou, não pelo que eu faço. Eu sou boa suficiente e vivo sempre satisfeita.',
    smartQuestion: 'Se o seu valor já fosse certo e inegável, o que você ousaria fazer hoje?',
    feeling: 'invisível ou não reconhecida'
  },
  {
    id: 'amada',
    label: 'Ser amada',
    emoji: '💗',
    color: '#C08552',
    phrase: 'Quando a necessidade é se sentir amada, o caminho é reconectar com o amor que já existe — dentro e fora de você.',
    belief: 'Eu não sou amada o suficiente',
    affirmation: 'Eu sou amada exatamente como eu sou. Eu sou boa suficiente e vivo sempre satisfeita.',
    smartQuestion: 'Se você fosse amada exatamente como é, o que você faria diferente hoje?',
    feeling: 'não amada'
  }
]

export const NEED_BY_ID = Object.fromEntries(NEEDS.map((n) => [n.id, n]))

export const FEELING_OPTIONS = [
  { id: 'f_acel', label: 'Acelerada, ansiosa', emoji: '🌀', level: 'elevado', hints: ['seguranca'] },
  { id: 'f_irrit', label: 'Irritada, prestes a explodir', emoji: '🔥', level: 'elevado', hints: ['seguranca', 'reconhecimento'] },
  { id: 'f_medo', label: 'Com medo, em alerta', emoji: '😨', level: 'moderado', hints: ['seguranca'] },
  { id: 'f_triste', label: 'Triste, pesada', emoji: '🌧️', level: 'moderado', hints: ['amada', 'pertencimento'] },
  { id: 'f_vazio', label: 'Esgotada, no vazio', emoji: '🕳️', level: 'moderado', hints: ['pertencimento', 'amada'] },
  { id: 'f_auto', label: 'No automático, sem sentir', emoji: '🌫️', level: 'leve', hints: [] },
  { id: 'f_sos', label: 'PRECISO DE AJUDA URGENTE', emoji: '🆘', sos: true }
]

export const LEVEL_OPTIONS = [
  { id: 'leve', emoji: '🌱', label: 'Leve', text: 'Você percebe o que está acontecendo e consegue voltar para si.' },
  { id: 'moderado', emoji: '🌿', label: 'Moderado', text: 'Seu sistema está pedindo uma pausa consciente.' },
  { id: 'elevado', emoji: '🌳', label: 'Elevado', text: 'Seu corpo está sinalizando sobrecarga. A prioridade agora é segurança e regulação.' }
]

const LEVEL_SCORE = { leve: 1, moderado: 2, elevado: 3 }

export function evaluateLevel(feeling, scores) {
  const base = LEVEL_SCORE[(feeling && feeling.level) || 'leve'] || 1
  const safetyRatio = (scores.seguranca || 0) / 4
  const total = base + safetyRatio
  if (total <= 1.5) return 'leve'
  if (total <= 2.5) return 'moderado'
  return 'elevado'
}

const OPT = (s, p, pe, r, a) => [{ text: s, need: 'seguranca' }, { text: p, need: 'pertencimento' }, { text: pe, need: 'reconhecimento' }, { text: r, need: 'amada' }, a && a.need ? { text: a.text, need: a.need } : null].filter(Boolean).slice(0, 4)

const QUIZ_BANK = [
  {
    id: 'q_sil',
    focus: 'seguranca',
    text: 'Quando você fecha os olhos e se escuta agora, o que está mais presente?',
    options: OPT(
      'A sensação de que algo está errado, que preciso me proteger.',
      'A solidão. A sensação de não pertencer a lugar nenhum.',
      'A sensação de ser invisível, de que ninguém vê meu esforço.',
      'A falta de afeto, a sensação de não ser amada como eu sou.'
    )
  },
  {
    id: 'q_conversa',
    focus: 'amada',
    text: 'Pensando em uma conversa que você gostaria de ter, o que você mais deseja ouvir?',
    options: OPT(
      '"Você está segura. Está tudo bem agora."',
      '"Você tem o seu lugar aqui, sempre teve."',
      '"Você faz a diferença. Eu vejo o seu valor."',
      '"Eu te amo do jeito que você é."'
    )
  },
  {
    id: 'q_corpo',
    focus: 'seguranca',
    text: 'Quando a emoção aperta, o que o seu corpo pede primeiro?',
    options: OPT(
      'Parar. Me sentir protegida. Um chão firme.',
      'Um abraço. Estar perto de alguém.',
      'Ser vista. Que percebam o que estou passando.',
      'Cuidado. Carinho. Ser acolhida.'
    )
  },
  {
    id: 'q_paz',
    focus: 'pertencimento',
    text: 'No fim do dia, o que te deixa em paz?',
    options: OPT(
      'Saber que está tudo em ordem, sem ameaças.',
      'Sentir que faço parte, que tenho com quem contar.',
      'Ter feito algo que foi percebido e valorizado.',
      'Ter me sentido amada, e ter amado.'
    )
  },
  {
    id: 'q_corpo_fala',
    focus: 'seguranca',
    text: 'Se o seu corpo pudesse falar agora, o que ele estaria dizendo?',
    options: OPT(
      'Me protege. Eu não me sinto segura aqui.',
      'Me leva para perto de alguém. Eu estou só.',
      'Me vê. Eu cansei de passar despercebida.',
      'Me abraça. Eu preciso de afeto.'
    )
  },
  {
    id: 'q_frase',
    focus: 'amada',
    text: 'Qual frase você mais precisa ouvir de si mesma hoje?',
    options: OPT(
      '"Você está segura. Pode soltar."',
      '"Você pertence. Você é parte de algo."',
      '"Você importa. O que você faz tem valor."',
      '"Você é amada. Exatamente como é."'
    )
  },
  {
    id: 'q_desgaste',
    focus: 'pertencimento',
    text: 'O que mais te desgastou nas últimas semanas?',
    options: OPT(
      'Viver em alerta, esperando o pior acontecer.',
      'Me sentir sozinha, mesmo rodeada de gente.',
      'Correr atrás de reconhecimento que não vem.',
      'Dar cuidado e não receber afeto de volta.'
    )
  },
  {
    id: 'q_casa',
    focus: 'pertencimento',
    text: 'Quando você pensa em "casa", o que sente?',
    options: OPT(
      'Ainda não encontro um lugar onde me sinta protegida.',
      'Não é um lugar onde pertenço de verdade.',
      'Não sou vista lá. Meu esforço some.',
      'Não é um lugar onde o amor circula.'
    )
  },
  {
    id: 'q_pedido',
    focus: 'amada',
    text: 'Se você pudesse pedir uma coisa ao universo agora, seria...',
    options: OPT(
      'Segurança. Saber que estou fora de perigo.',
      'Um lugar meu. Sentir que pertenço.',
      'Ser reconhecida pelo que eu já faço.',
      'Um amor que me acolha como eu sou.'
    )
  },
  {
    id: 'q_sinal',
    focus: 'seguranca',
    text: 'O que o seu corpo está sinalizando hoje?',
    options: OPT(
      'Tensão, coração acelerado, tudo em alerta.',
      'Peso no peito, sensação de vazio e distância.',
      'Nó na garganta, pensamento girando na mesma frase.',
      'Aperto no coração, vontade de receber carinho.'
    )
  },
  {
    id: 'q_sonho',
    focus: 'pertencimento',
    text: 'Quando você se imagina plena e feliz, o que aparece primeiro?',
    options: OPT(
      'Paz. Poder finalmente baixar a guarda.',
      'Pessoas. Uma mesa cheia, risadas, pertencimento.',
      'Respeito. Ser ouvida e admirada pelo que sou.',
      'Amor. Alguém me olhando com ternura.'
    )
  },
  {
    id: 'q_meta',
    focus: 'amada',
    text: 'Qual dessas frases descreve a sua sede do momento?',
    options: OPT(
      'Fome de sossego, de uma trégua para o meu sistema.',
      'Fome de conexão, de sentir que tenho gente comigo.',
      'Fome de ser enxergada, de validação verdadeira.',
      'Fome de afeto, de um carinho que me alcance.'
    )
  }
]

function shuffle(list) {
  const arr = [...list]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function buildQuiz(feeling) {
  const hints = (feeling && feeling.hints) || []
  const matched = []
  const rest = []
  shuffle(QUIZ_BANK).forEach((q) => {
    if (hints.includes(q.focus)) matched.push(q)
    else rest.push(q)
  })
  const picked = [...shuffle(matched).slice(0, Math.min(2, matched.length)), ...shuffle(rest)]
  return picked.slice(0, 4).map((q, i) => ({ ...q, id: `q${i + 1}` }))
}

const Q_WEIGHT = { q1: 4, q3: 3, q2: 2, q4: 1 }

export function computeWinner(scores, pickOrder) {
  let max = -1
  let winner = null
  for (const n of NEEDS) {
    if (scores[n.id] > max) {
      max = scores[n.id]
      winner = n.id
    } else if (scores[n.id] === max) {
      winner = null
    }
  }
  if (winner) return winner
  const tied = NEEDS.filter((n) => scores[n.id] === max).map((n) => n.id)
  return tiebreak(tied, pickOrder || [])
}

function tiebreak(tiedIds, pickOrder) {
  const weight = tiedIds.map((id) => {
    let w = 0
    pickOrder.forEach((qid, idx) => {
      const wgt = Q_WEIGHT[qid] || 0
      if (wgt) w += wgt * 100 - idx
    })
    return { id, w }
  })
  weight.sort((a, b) => b.w - a.w)
  return weight[0].id
}
