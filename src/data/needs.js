export const NEEDS = {
  amada: {
    id: 'amada',
    label: 'Amada',
    phrase: 'Hoje, sua necessidade mais ativa parece ser ser amada.',
    belief: 'Eu não sou amada o suficiente',
    affirmation: 'Eu sou amada exatamente como eu sou. Eu sou boa suficiente e vivo sempre satisfeita.',
    smartQuestion: 'Se você fosse amada exatamente como é, o que você faria diferente hoje?'
  },
  reconhecida: {
    id: 'reconhecida',
    label: 'Reconhecida',
    phrase: 'Hoje, sua necessidade mais ativa parece ser ser reconhecida.',
    belief: 'Meu valor depende do que eu faço',
    affirmation: 'Eu tenho valor pelo que eu sou, não pelo que eu faço. Eu sou boa suficiente e vivo sempre satisfeita.',
    smartQuestion: 'Se o seu valor já fosse certo e inegável, o que você ousaria fazer hoje?'
  },
  segura: {
    id: 'segura',
    label: 'Segura',
    phrase: 'Hoje, sua necessidade mais ativa parece ser se sentir segura.',
    belief: 'Se eu baixar a guarda, algo ruim vai acontecer',
    affirmation: 'Eu estou segura. Eu respiro. Eu escolho a paz. Eu sou boa suficiente e vivo sempre satisfeita.',
    smartQuestion: 'Se você estivesse completamente segura, o que você se permitiria sentir agora?'
  },
  pertencer: {
    id: 'pertencer',
    label: 'Pertencer',
    phrase: 'Hoje, sua necessidade mais ativa parece ser pertencer.',
    belief: 'Eu não pertenço a lugar nenhum',
    affirmation: 'Eu pertenço. Eu tenho o meu lugar aqui. Eu sou boa suficiente e vivo sempre satisfeita.',
    smartQuestion: 'Se você soubesse que tem lugar em qualquer mesa, onde você se sentaria hoje?'
  }
}

export const NEEDS_TEST = {
  intro: 'Vou te fazer três perguntas simples. Sem resposta certa ou errada — só escolha o que toca mais fundo em você.',
  questions: [
    {
      id: 'q1',
      scenario: 'Imagine que você manda uma mensagem importante e a pessoa não responde. O que dói mais?',
      options: [
        { id: 'q1_amada', text: 'Talvez ela não goste mais de mim.', need: 'amada' },
        { id: 'q1_reconhecida', text: 'Talvez não reconheçam tudo o que eu faço.', need: 'reconhecida' },
        { id: 'q1_segura', text: 'E se alguma coisa estiver errada?', need: 'segura' },
        { id: 'q1_pertencer', text: 'Talvez eu não seja importante para ninguém.', need: 'pertencer' }
      ]
    },
    {
      id: 'q2',
      scenario: 'Pense em uma reunião de família. No fim do dia, o que você mais deseja ter recebido?',
      options: [
        { id: 'q2_amada', text: 'Um abraço demorado e um "eu te amo".', need: 'amada' },
        { id: 'q2_reconhecida', text: 'Que notassem tudo o que você organizou.', need: 'reconhecida' },
        { id: 'q2_segura', text: 'Saber que está tudo certo com todo mundo.', need: 'segura' },
        { id: 'q2_pertencer', text: 'Fazer parte da conversa, estar incluída.', need: 'pertencer' }
      ]
    },
    {
      id: 'q3',
      scenario: 'Quando você se sente insegura sobre si mesma, o que você mais precisa ouvir?',
      options: [
        { id: 'q3_amada', text: 'Eu te amo exatamente como você é.', need: 'amada' },
        { id: 'q3_reconhecida', text: 'Você faz a diferença, vejo seu valor.', need: 'reconhecida' },
        { id: 'q3_segura', text: 'Você está segura, está tudo bem agora.', need: 'segura' },
        { id: 'q3_pertencer', text: 'Você tem o seu lugar aqui, sempre teve.', need: 'pertencer' }
      ]
    }
  ]
}

export const NEED_PROTOCOLS = {
  amada: {
    respId: 'zero',
    message: 'Quando a necessidade é se sentir amada, o caminho é reconectar com o amor que já existe — dentro e fora de você.',
    law: 'Correspondência'
  },
  reconhecida: {
    respId: 'foco',
    message: 'Quando a necessidade é ser reconhecida, o caminho é reconfigurar a imagem que você carrega de si.',
    law: 'Mentalismo'
  },
  segura: {
    respId: 'zero',
    message: 'Quando a necessidade é segurança, o caminho é trazer o corpo de volta para o chão, para o agora.',
    law: 'Ritmo'
  },
  pertencer: {
    respId: 'alivio',
    message: 'Quando a necessidade é pertencer, o caminho é sentir que você faz parte — começando por pertencer a si mesma.',
    law: 'Correspondência'
  }
}
