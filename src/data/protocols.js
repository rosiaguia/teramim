export const PROTOCOLS = [
  {
    id: 'seguranca',
    need: 'seguranca',
    name: 'Protocolo Segurança',
    tagline: 'Trazer o corpo de volta para o chão',
    baseResp: 'zero',
    audioLabel: 'zero',
    duration: '2 min',
    color: '#6B5D8F',
    description: 'Respiração 4/8 com a voz da Rosi: a expiração longa acalma o sistema nervoso e devolve a sensação de segurança.',
    tags: ['alerta', 'medo', 'controle', 'seguranca'],
    optional: [
      { type: 'fisio', title: 'Exercício fisiológico', text: 'Inspire duas vezes pelo nariz e solte uma vez pela boca, como um suspiro. Três vezes seguidas.' },
      { type: 'presenca', title: 'Prática de presença', text: 'Coloque os pés no chão e perceba três sons ao seu redor, um de cada vez, sem julgar.' },
      { type: 'decreto', title: 'Pergunta de consciência', text: '"O que é verdadeiro sobre mim, neste momento? Eu estou segura."' }
    ]
  },
  {
    id: 'pertencimento',
    need: 'pertencimento',
    name: 'Protocolo Pertencimento',
    tagline: 'Sentir que você faz parte',
    baseResp: 'alivio',
    audioLabel: 'alivio',
    duration: '2 min',
    color: '#5E8B7E',
    description: 'O suspiro fisiológico com a voz da Rosi: abre o peito, solta o aperto e reconecta você com o lugar que é seu.',
    tags: ['solidao', 'desconexao', 'pertencer', 'pertencimento'],
    optional: [
      { type: 'corpo', title: 'Exercício corporal', text: 'Leve a mão ao peito, no centro. Sinta o calor da sua própria mão, sem pressa.' },
      { type: 'presenca', title: 'Prática de presença', text: 'Repita em silêncio: "Eu tenho o meu lugar. Eu pertenço a mim."' },
      { type: 'decreto', title: 'Pergunta de consciência', text: '"O que eu faço parte hoje? Onde eu já sou bem-vinda?"' }
    ]
  },
  {
    id: 'reconhecimento',
    need: 'reconhecimento',
    name: 'Protocolo Reconhecimento',
    tagline: 'Reconfigurar a imagem de si',
    baseResp: 'foco',
    audioLabel: 'foco',
    duration: '2 min',
    color: '#C9A227',
    description: 'Respiração em caixa 4/4/4/4 com a voz da Rosi: a mente vira um ponto e você volta a se enxergar.',
    tags: ['invisibilidade', 'aprovacao', 'reconhecimento', 'valor'],
    optional: [
      { type: 'fisio', title: 'Exercício fisiológico', text: 'Encolha os ombros até as orelhas, segure 3 segundos, e solte com um suspiro. Três vezes.' },
      { type: 'corpo', title: 'Exercício corporal', text: 'Levante o queixo e abra o peito. Respire por um minuto nessa postura.' },
      { type: 'decreto', title: 'Decreto de consciência', text: '"Eu sou visível. O que eu faço importa. Eu sou suficiente."' }
    ]
  },
  {
    id: 'amada',
    need: 'amada',
    name: 'Protocolo Ser Amada',
    tagline: 'Reconectar com o amor',
    baseResp: 'equi',
    audioLabel: 'equi',
    duration: '2 min',
    color: '#C08552',
    description: 'Respiração de narinas alternadas com a voz da Rosi: equilibra e reconecta você com o amor que já existe.',
    tags: ['carecia', 'afeto', 'amada', 'amor'],
    optional: [
      { type: 'fisio', title: 'Exercício fisiológico', text: 'Coloque a mão no coração e a outra na barriga. Sinta as duas subirem e descerem juntas.' },
      { type: 'corpo', title: 'Exercício corporal', text: 'Dê um abraço em você mesma, com os braços, e balance devagar de um lado para o outro.' },
      { type: 'decreto', title: 'Decreto de consciência', text: '"Eu sou amada. O amor me cerca. Eu aceito o amor."' }
    ]
  }
]

export function protocolForNeed(needId) {
  return PROTOCOLS.find((p) => p.need === needId) || PROTOCOLS[0]
}
