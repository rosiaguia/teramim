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
  { id: 'd18b', title: 'Preocupação com Filho', tags: ['seguranca', 'amada'], text: 'Meu filho é um invólucro de Deus, e toda vez que nele eu penso, imediatamente o vejo no círculo dourado de proteção de Deus. Está feito assim é.' },
  { id: 'd19', title: 'Ser Você', tags: ['pertencimento', 'amada', 'reconhecimento'], text: 'É verdadeiro, permitido e seguro eu ser eu. É verdadeiro, permitido, seguro e divertido eu ser eu. É verdadeiro, permitido e seguro eu ser eu e ir além do programa do medo. Está feito assim é.' },
  { id: 'd20', title: 'Frequência da Cura', tags: ['seguranca', 'amada'], text: 'Eu sou ativar, ativar, ativar cura quântica em luz. Timo, ative-se, timo, ative-se, timo, ative-se agora. Eu sou meu corpo luminoso na frequência da cura divina, na graça do Pai e de maneira perfeita. Está feito assim é.' },
  { id: 'd21', title: 'Dissipar Energia Densa', tags: ['seguranca', 'pertencimento'], text: 'Tudo o que isso é e tudo o que isso representa em meu estado de ser agora, eu dissipo, libero e neutralizo, eu dissipo, libero e neutralizo, eu dissipo, libero e neutralizo. Eu sou o amor de Deus vivo em mim. Está feito assim é.' }
]

export const NEED_TAG = {
  seguranca: 'seguranca',
  pertencimento: 'pertencimento',
  reconhecimento: 'reconhecimento',
  amada: 'amada'
}

export function decreesForNeed(needId) {
  const tag = NEED_TAG[needId]
  if (!tag) return [...DECREES]
  const matched = DECREES.filter((d) => d.tags.includes(tag))
  const fallback = DECREES.filter((d) => !d.tags.includes(tag))
  return [...matched, ...fallback]
}

const GENERATED_OPENERS = [
  'Eu agora autorizo, permito e elevo o meu nível de permissão, merecimento e gratidão.',
  'Eu agora escolho me alinhar com a verdade de quem eu sou.',
  'Eu agora me abençoo e libero toda crença que não é minha.',
  'Eu agora me conecto com a minha divindade e com o meu valor inegável.',
  'Eu agora recupero a alegria de viver e o prazer de ser eu.',
  'Eu agora libero o passado e abro espaço para o novo.',
  'Eu agora confio em mim, confio na vida e me permito receber.',
  'Eu agora ancoro meu corpo no solo sagrado do agora.'
]

const GENERATED_CORES = [
  'Eu sou boa o suficiente e vivo sempre satisfeita.',
  'Eu recupero o prazer de viver e a minha identidade própria.',
  'Eu sou boa o suficiente, viva e satisfeita, no meu próprio ritmo.',
  'Eu me sinto segura, amada e inteira, exatamente como eu sou.',
  'Eu pertenço, eu tenho valor e eu me permito ser eu.',
  'Eu recupero a minha essência e a minha própria identidade.',
  'Eu vivo em paz, com prazer de viver e gratidão.',
  'Eu sou boa o suficiente e mereço viver sempre satisfeita.'
]

const GENERATED_CLOSERS = [
  'Está feito assim é.',
  'Está feito. Assim é.',
  'Está feito assim é. Eu confio.',
  'Está feito. Eu agradeço.'
]

const GENERATED_TITLES = [
  'Prazer de Viver', 'Identidade Própria', 'Boa o Suficiente', 'Sempre Satisfeita',
  'Essência', 'Merecimento', 'Confiança', 'Liberdade'
]

export function generateDecree(seed, needId = null) {
  const opener = GENERATED_OPENERS[seed % GENERATED_OPENERS.length]
  const core = GENERATED_CORES[(seed * 3 + 1) % GENERATED_CORES.length]
  const closer = GENERATED_CLOSERS[(seed * 5 + 2) % GENERATED_CLOSERS.length]
  const title = GENERATED_TITLES[(seed * 7 + 3) % GENERATED_TITLES.length]
  const needTail = needId && NEED_TAG[needId] ? DECREES.find((d) => d.tags.includes(needId)) : null
  const tail = needTail ? ` ${needTail.text.split('Está feito')[0].trim()}` : ''
  return {
    id: 'gen_' + seed,
    title,
    generated: true,
    tags: needId ? [needId] : [],
    text: `${opener} ${core}${tail} ${closer}`
  }
}

export function decreeBankForNeed(needId, count = 30) {
  const fromRosi = decreesForNeed(needId)
  const generated = Array.from({ length: count }, (_, i) => generateDecree(i, needId))
  return [...fromRosi, ...generated]
}

export function decreeAt(bank, index) {
  if (!bank || bank.length === 0) return null
  return bank[index % bank.length]
}
