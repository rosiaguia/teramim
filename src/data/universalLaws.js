export const LAWS = [
  {
    id: 'mentalismo',
    name: 'Lei do Mentalismo',
    short: 'O que você pensa, você começa a ver.',
    quote: 'Tudo começa na mente. A imagem que você cultiva de si vira a sua experiência.',
    trigger: ['medo', 'reconhecida', 'crítica']
  },
  {
    id: 'correspondencia',
    name: 'Lei da Correspondência',
    short: 'Dentro reflete fora.',
    quote: 'O que acontece dentro de você se espelha na sua vida. Mudando o dentro, o fora acompanha.',
    trigger: ['pertencer', 'amada', 'solidão']
  },
  {
    id: 'vibracao',
    name: 'Lei da Vibração',
    short: 'Tudo se move em frequência.',
    quote: 'Seu corpo vibra em uma frequência. A respiração é a chave para mudar a sua.',
    trigger: ['energia', 'vazio', 'torpor']
  },
  {
    id: 'polaridade',
    name: 'Lei da Polaridade',
    short: 'Tudo tem dois polos.',
    quote: 'Nada é só bom ou só ruim. Mudança é só a passagem de um polo para o outro.',
    trigger: ['mudança', 'medo de mudar', 'dúvida']
  },
  {
    id: 'ritmo',
    name: 'Lei do Ritmo',
    short: 'Tudo tem o seu tempo.',
    quote: 'Há um ritmo em tudo. Você não precisa apressar — precisa sintonizar.',
    trigger: ['controle', 'ansiedade', 'segura', 'pressa']
  },
  {
    id: 'causa-efeito',
    name: 'Lei de Causa e Efeito',
    short: 'Toda escolha tem consequência.',
    quote: 'O que você planta hoje colhe amanhã. Cada escolha pequena constrói a sua direção.',
    trigger: ['escolha', 'decisão', 'culpa']
  },
  {
    id: 'genero',
    name: 'Lei do Gênero',
    short: 'Toda criação tem um lado ativo e um receptivo.',
    quote: 'Você não precisa fazer tudo sozinha. Há um tempo de agir e um tempo de receber.',
    trigger: ['exaustão', 'reconhecida', 'cansaço']
  }
]

export function pickLawFor(topic) {
  const t = String(topic || '').toLowerCase()
  let best = LAWS[0]
  let bestScore = 0
  for (const law of LAWS) {
    let score = 0
    for (const trig of law.trigger) {
      if (t.includes(trig)) score += trig.length
    }
    if (score > bestScore) { bestScore = score; best = law }
  }
  return bestScore > 0 ? best : LAWS[1]
}
