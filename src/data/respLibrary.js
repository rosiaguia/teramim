export const RESP_LIBRARY = [
  {
    id: 'alivio',
    name: 'RÉSP ALÍVIO®',
    tagline: 'Aliviar',
    duration: '10 ciclos',
    description: 'O suspiro fisiológico. Inspire duas vezes pelo nariz e solte uma vez pela boca. Devolve o oxigênio que a aceleração roubou.',
    pattern: [
      { phase: 'Inspire (1ª)', secs: 1.5, tip: 'Pelo nariz, leve' },
      { phase: 'Inspire (2ª)', secs: 1.5, tip: 'Encha um pouco mais' },
      { phase: 'Solte', secs: 2.5, tip: 'Uma vez, pela boca, como um suspiro' }
    ],
    cycles: 10,
    tone: 'alívio'
  },
  {
    id: 'zero',
    name: 'RÉSP ZERO®',
    tagline: 'Dormir ou relaxar',
    duration: '2 minutos',
    description: 'Ritmo 4/8. A expiração longa ativa o modo parasimpático e prepara o corpo para descansar de verdade.',
    pattern: [
      { phase: 'Inspire', secs: 4, tip: 'Pelo nariz' },
      { phase: 'Solte', secs: 8, tip: 'Longo e lento, pela boca' }
    ],
    cycles: 10,
    tone: 'zero'
  },
  {
    id: 'boot',
    name: 'RÉSP BOOT®',
    tagline: 'Ter energia',
    duration: '2 minutos',
    description: 'Mais rápida e ativadora. Para despertar, espantar o torpor e recolocar o corpo em movimento. Nunca em momentos de crise.',
    pattern: [
      { phase: 'Inspire', secs: 2, tip: 'Pelo nariz, cheio' },
      { phase: 'Solte', secs: 2, tip: 'Pelo nariz, firme' }
    ],
    cycles: 30,
    tone: 'boot'
  },
  {
    id: 'equi',
    name: 'RÉSP EQUI®',
    tagline: 'Equilibrar',
    duration: '2 minutos',
    description: 'Narinas alternadas. Inspira pela direita, solta pela esquerda, e vice-versa. Equilibra os dois lados do corpo.',
    pattern: [
      { phase: 'Inspire direita', secs: 4, tip: 'Feche a esquerda' },
      { phase: 'Solte esquerda', secs: 4, tip: 'Troque o dedo' },
      { phase: 'Inspire esquerda', secs: 4, tip: 'Feche a direita' },
      { phase: 'Solte direita', secs: 4, tip: 'Troque o dedo' }
    ],
    cycles: 6,
    tone: 'equi'
  },
  {
    id: 'foco',
    name: 'RÉSP FOCO®',
    tagline: 'Caixa de foco',
    duration: '2 minutos',
    description: 'Respiração em caixa 4/4/4/4. Quatro tempos para cada movimento. A mente vira um ponto, o resto fica de fora.',
    pattern: [
      { phase: 'Inspire', secs: 4, tip: 'Pelo nariz' },
      { phase: 'Segure', secs: 4, tip: 'Pelo nariz' },
      { phase: 'Solte', secs: 4, tip: 'Pela boca' },
      { phase: 'Segure', secs: 4, tip: 'Vazio, em paz' }
    ],
    cycles: 7,
    tone: 'foco'
  }
]

export const TONE_COLORS = {
  alivio: '#C08552',
  zero: '#6B5D8F',
  boot: '#B34A3A',
  equi: '#5E8B7E',
  foco: '#C9A227'
}
