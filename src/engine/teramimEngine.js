import { EMOTION_MAP } from '../data/emotions.js'
import { NEEDS, NEEDS_TEST, NEED_PROTOCOLS } from '../data/needs.js'
import { pickLawFor } from '../data/universalLaws.js'
import { RESP_LIBRARY } from '../data/respLibrary.js'
import { pickFreshDecree } from '../data/decrees.js'

const HOUR = new Date().getHours()

export function timeGreeting() {
  if (HOUR < 12) return 'Bom dia'
  if (HOUR < 18) return 'Boa tarde'
  return 'Boa noite'
}

const UPSELL_TEXT = (name) => `${name}Antes de você sair da tela, um convite — sem pressão alguma.

Você acabou de sentir o que é voltar para você em poucos minutos. Se quiser aprofundar isso com encontros ao vivo, protocolos completos e acompanhamento de verdade, o Reset Emocional é o próximo passo — é onde a gente caminha junto, com a Rosi Aguiar.

Cuidado contínuo, no seu ritmo.`

function pushUpsell(s, msgs, meta) {
  msgs.push(bot(UPSELL_TEXT(phraseWithName(meta.userName))))
  const replies = [
    reply('upsell_learn', 'Quero conhecer o Reset Emocional'),
    reply('upsell_end', 'Por hoje é só, obrigada')
  ]
  s.step = 'upsell_offer'
  return { state: s, messages: msgs, replies, awaiting: null, action: { type: 'openUpsell' } }
}

export function initialState() {
  return {
    step: 'welcome',
    emotion: null,
    intensity: null,
    need: null,
    needCounts: { amada: 0, reconhecida: 0, segura: 0, pertencer: 0 },
    belief: null,
    newBelief: null,
    beliefLaw: null,
    nextNeedsQ: 0,
    pendingAction: null,
    awaiting: null
  }
}

function respById(id) {
  return RESP_LIBRARY.find((r) => r.id === id)
}

function reply(id, label, tone) {
  return { id, label, tone: tone || null }
}

function bot(text) {
  return { role: 'bot', text }
}

function phraseWithName(name) {
  return name ? `, ${name}` : ''
}

export function reduce(state, action, meta = {}) {
  const s = { ...state }
  const msgs = []
  let replies = []
  let awaiting = null
  let actionOut = null

  const userName = meta.userName
  const name = (t) => t.replace('%name%', phraseWithName(userName))

  switch (s.step) {
    case 'welcome': {
      msgs.push(bot(name(`%name% Que bom ter você aqui. Eu sou a TERAMIM.

Eu não vim te dizer o que sentir. Vim te ajudar a perceber, regular e escolher.

Para começar, uma pergunta: como você está SE sentindo agora?`)))
      replies = EMOTION_MAP.map((e) => reply(`emotion_${e.id}`, e.label))
      replies.push(reply('sos', 'Preciso de um SOS agora'))
      s.step = 'emotion'
      break
    }

    case 'emotion': {
      if (action.type === 'reply' && action.id === 'sos') {
        msgs.push(bot(`Entendido. Vamos parar tudo e cuidar de você agora.`))
        actionOut = { type: 'openSos' }
        s.step = 'after_sos'
        break
      }
      if (action.type === 'reply' && action.id.startsWith('emotion_')) {
        const emo = EMOTION_MAP.find((e) => e.id === action.id.replace('emotion_', ''))
        s.emotion = emo
        msgs.push(bot(name(`${emo.label}... Estou aqui.
Respira comigo: inspire e solte devagar.

Regra de ouro — primeiro a gente fica presente, depois a gente escolhe.`)))
        msgs.push(bot(`Me conta: onde isso está no seu corpo agora? ${emo.body}`))
        replies = [
          reply('body_peito', 'Peito / coração'),
          reply('body_estomago', 'Estômago / barriga'),
          reply('body_ombros', 'Ombros / nuca'),
          reply('body_garganta', 'Garganta'),
          reply('body_outro', 'Em outro lugar / não sei')
        ]
        s.step = 'emotion_body'
      }
      break
    }

    case 'emotion_body': {
      const loc = action.type === 'reply' ? action.label : String(action.text || '')
      msgs.push(bot(name(`Obrigada por sentir. Esse ${loc ? 'aperto em ' + loc.toLowerCase() : 'lugar'} é onde o seu sistema guardou essa emoção. Não precisa empurrar — é só perceber que ele está aí.
E o que você está pensando agora? Pode me contar.`)))
      s.step = 'emotion_mind'
      awaiting = 'text'
      break
    }

    case 'emotion_mind': {
      const thought = String(action.text || '').trim() || 'pensamentos acelerados'
      msgs.push(bot(name(`Eu te ouço. Esses pensamentos ${thought.toLowerCase()} não são você — são o looping da mente tentando proteger você do jeito que ela aprendeu.
E a sua presença, agora? Você sente que está aqui, ou no automático?`)))
      replies = [
        reply('pres_here', 'Estou aqui'),
        reply('pres_auto', 'Estou no automático'),
        reply('pres_discon', 'Estou desconectada de mim')
      ]
      s.step = 'emotion_presence'
      break
    }

    case 'emotion_presence': {
      const pres = action.type === 'reply' ? action.label : String(action.text || '')
      msgs.push(bot(name(`${pres}. Obrigada pela sinceridade. Isso já é presença: você percebeu onde estava.
Agora, num gesto de cuidado, me diz: como está a intensidade disso agora?`)))
      replies = [
        reply('int_leve', 'Leve 🌱', 'leve'),
        reply('int_mod', 'Moderado 🌿', 'moderado'),
        reply('int_alto', 'Alto 🌳', 'alto')
      ]
      s.step = 'intensity'
      break
    }

    case 'intensity': {
      const lvl = action.type === 'reply' ? action.id.replace('int_', '') : 'moderado'
      s.intensity = lvl
      if (lvl === 'alto') {
        msgs.push(bot(name(`Seu corpo está sinalizando sobrecarga. A prioridade agora é segurança e regulação.
Antes de tudo, preciso te perguntar com carinho: você se sente segura neste momento?`)))
        replies = [
          reply('safe_yes', 'Sim, estou muito ativada mas segura'),
          reply('safe_no_crisis', 'Não, estou em desespero'),
          reply('safe_no_self', 'Tenho medo de me machucar')
        ]
        s.step = 'safety_check'
      } else {
        msgs.push(bot(name(`${lvl === 'leve' ? 'Leve' : 'Moderado'}... Você percebe o que está acontecendo e já consegue voltar para si. ${lvl === 'leve' ? 'Que bonito. Isso é regulação acontecendo.' : 'Seu sistema está pedindo uma pausa consciente — e é isso que vamos fazer.'}`)))
        s.step = 'needs_intro'
        awaiting = 'continue'
      }
      break
    }

    case 'safety_check': {
      if (action.type === 'reply' && (action.id === 'safe_no_self' || action.id === 'safe_no_crisis')) {
        s.step = 'crisis'
        msgs.push(bot(`Estou aqui. Eu vou ficar aqui com você.

Neste momento, o mais importante é que você esteja segura. Você não precisa fazer nada sozinha. Vou interromper qualquer prática agora.

Se você estiver em risco ou tiver pensado em se machucar, por favor: procure agora uma pessoa próxima de confiança ou um profissional.
Você pode chamar:
• CVV — 188 (24h, gratuito, confidencial)
• SAMU — 192 (emergência)
• CAPS mais próximo da sua cidade

Isso não é fraqueza. É cuidado com a sua vida — e a sua vida importa.
Eu sou uma ferramenta de apoio, não substituo atendimento clínico. E mesmo assim, quero que você saiba: estou aqui, sem pressa.`))
        replies = [
          reply('crisis_breathe', 'Pode me ajudar a respirar?'),
          reply('crisis_help', 'Vou buscar ajuda agora')
        ]
      } else {
        msgs.push(bot(name(`Obrigada por me contar. Você está muito ativada, mas segura — vamos regular o corpo com cuidado, devagar.
Vou te levar para uma prática de segurança. Respira comigo.`)))
        actionOut = { type: 'openResp', respId: 'zero' }
        s.step = 'after_practice'
      }
      break
    }

    case 'crisis': {
      if (action.type === 'reply' && action.id === 'crisis_breathe') {
        msgs.push(bot(`Sim. Inspire em 4 tempos... segure 2... solte em 8, bem longo. O corpo vai acalmar aos poucos.`))
        actionOut = { type: 'openResp', respId: 'zero' }
        s.step = 'crisis_after'
      } else {
        msgs.push(bot(`Faça isso. Eu fico aqui, mas o seu próximo passo é com uma pessoa real ao seu lado.
Você não está sozinha. Volte quando quiser falar comigo.`))
        actionOut = { type: 'endSession' }
      }
      break
    }

    case 'crisis_after': {
      msgs.push(bot(name(`Como você está agora?`)))
      replies = [
        reply('crisis_calm', 'Um pouco mais calma'),
        reply('crisis_same', 'Ainda muito difícil'),
        reply('crisis_help2', 'Vou buscar ajuda profissional')
      ]
      s.step = 'crisis_check'
      break
    }

    case 'crisis_check': {
      if (action.type === 'reply' && action.id === 'crisis_same') {
        msgs.push(bot(`Obrigada por ser honesta. Isso é importante.
Mesmo que a melhora pareça pequena, procure agora um profissional ou o CVV (188). Você não precisa atravessar isso em silêncio.
Quando você estiver pronta para um cuidado contínuo, eu estarei aqui.`))
        actionOut = { type: 'endSession' }
      } else {
        msgs.push(bot(name(`Que bom que você está respirando. Vamos encerrar por hoje com um cuidado simples — hoje não vai ter oferta, nem pressa. Só você.
Estou aqui sempre que você precisar voltar para si.`)))
        actionOut = { type: 'endSession' }
      }
      break
    }

    case 'needs_intro': {
      msgs.push(bot(`Para eu saber qual cuidado combina mais com você agora, vou te fazer três perguntas simples. Não existe resposta certa — escolha a que tocar mais fundo.`))
      s.nextNeedsQ = 0
      s.step = 'needs_question'
      return runNeedsQuestion(s, action)
    }

    case 'needs_question': {
      if (action.type === 'reply') {
        const q = NEEDS_TEST.questions[s.nextNeedsQ - 1]
        const opt = q && q.options.find((o) => o.id === action.id)
        if (opt) s.needCounts[opt.need] = (s.needCounts[opt.need] || 0) + 1
      }
      if (s.nextNeedsQ < NEEDS_TEST.questions.length) {
        return runNeedsQuestion(s, action)
      }
      const winner = Object.entries(s.needCounts).sort((a, b) => b[1] - a[1])[0][0]
      s.need = winner
      const n = NEEDS[winner]
      const proto = NEED_PROTOCOLS[winner]
      msgs.push(bot(name(`${n.phrase}
${proto.message}
Vou te levar para a prática que acalma esse ponto: o ${respById(proto.respId).name}.`)))
      s.step = 'protocol_resp'
      actionOut = { type: 'openResp', respId: proto.respId }
      break
    }

    case 'protocol_resp': {
      msgs.push(bot(name(`Como você está se sentindo agora, depois dessa respiração?`)))
      replies = [
        reply('after_better', 'Mais leve'),
        reply('after_same', 'Continua difícil'),
        reply('after_ready', 'Pronta para continuar')
      ]
      s.step = 'after_practice'
      break
    }

    case 'after_sos': {
      msgs.push(bot(name(`O SOS acalmou o corpo um pouco?`)))
      replies = [
        reply('after_better', 'Sim, mais calma'),
        reply('after_same', 'Ainda agitada'),
        reply('after_ready', 'Vamos continuar')
      ]
      s.step = 'sos_check'
      break
    }

    case 'sos_check': {
      if (action.type === 'reply' && action.id === 'after_same') {
        msgs.push(bot(`Obrigada por sentir. Se continuar muito intenso, o cuidado certo é procurar ajuda profissional. CVV 188, 24 horas.
Vamos fazer um momento de presença?`))
        replies = [
          reply('after_ready', 'Sim, vamos'),
          reply('sos_end', 'Vou descansar agora')
        ]
        s.step = 'sos_offer'
      } else {
        s.step = 'needs_intro'
        return reduce({ ...s, step: 'needs_intro' }, action, meta)
      }
      break
    }

    case 'sos_offer': {
      if (action.type === 'reply' && action.id === 'after_ready') {
        msgs.push(bot(`Então vamos.`))
        actionOut = { type: 'openResp', respId: 'alivio' }
        s.step = 'after_practice'
      } else {
        msgs.push(bot(name(`Foi um bom cuidado você se escutar. Descanse com paz. Quando quiser, eu estou aqui.`)))
        actionOut = { type: 'endSession' }
      }
      break
    }

    case 'after_practice': {
      if (action.type === 'reply' && action.id === 'after_better') {
        msgs.push(bot(name(`Isso é o sistema nervoso voltando ao modo parasimpático — o modo do repouso e da segurança. Cada vez que você respira assim, você treina esse caminho.`)))
        s.step = 'belief_intro'
        awaiting = 'continue'
      } else if (action.type === 'reply' && action.id === 'after_same') {
        msgs.push(bot(name(`Tudo bem sentir que continua difícil. Não apresse. Vamos apenas estar presente mais um pouco.
O que você está pensando agora?`)))
        s.step = 'after_practice_pause'
        awaiting = 'text'
      } else {
        msgs.push(bot(name(`Perfeito. Agora que o corpo está mais presente, podemos ir mais fundo.`)))
        s.step = 'belief_intro'
        awaiting = 'continue'
      }
      break
    }

    case 'after_practice_pause': {
      const t = String(action.text || '').trim() || 'apenas os pensamentos'
      msgs.push(bot(name(`${t}. Obrigada. Isso era só a mente — você já está percebendo ela de fora. O corpo está pronto para um passo a mais?`)))
      replies = [
        reply('after_ready', 'Sim, pronto'),
        reply('sos_end', 'Prefiro parar por aqui')
      ]
      s.step = 'pause_choose'
      break
    }

    case 'pause_choose': {
      if (action.type === 'reply' && action.id === 'after_ready') {
        msgs.push(bot(`Vamos.`))
        s.step = 'belief_intro'
        awaiting = 'continue'
      } else {
        msgs.push(bot(name(`Cuidar de você inclui saber quando parar. Volte quando quiser.`)))
        actionOut = { type: 'endSession' }
      }
      break
    }

    case 'belief_intro': {
      const n = s.need && NEEDS[s.need]
      if (n && n.belief) {
        msgs.push(bot(name(`Agora quero te levar a um lugar bonito.
Pelo que você me contou, existe uma frase que costuma morar em quem vive essa necessidade. Uma frase antiga, aprendida — não escolhida.
"${n.belief}".
Isso mora em você?`)))
        replies = [
          reply('belief_sug_yes', 'Sim, essa frase é minha'),
          reply('belief_sug_own', 'É parecida, deixa eu contar')
        ]
        s.step = 'belief_suggest'
      } else {
        msgs.push(bot(name(`Agora quero te convidar a um lugar bonito.
Existe alguma frase que você repete para si mesma — tipo "eu não sou boa o suficiente", "eu não posso errar", "as pessoas vão embora"? Uma frase que parece antiga, que mora em você.`)))
        s.step = 'belief_share'
        awaiting = 'text'
      }
      break
    }

    case 'belief_suggest': {
      const n = s.need && NEEDS[s.need]
      if (action.type === 'reply' && action.id === 'belief_sug_yes' && n) {
        s.belief = n.belief
        msgs.push(bot(name(`"${n.belief}" — eu escutei essa frase sua.

Agora uma pergunta importante, daquelas que mexem: quem pensava assim ou parecido? Sua mãe, seu pai, alguém da família, outra pessoa que cuidou de você?`)))
        s.step = 'belief_q1'
        awaiting = 'text'
      } else {
        msgs.push(bot(`Conta pra mim, então.`))
        s.step = 'belief_share'
        awaiting = 'text'
      }
      break
    }

    case 'belief_share': {
      const belief = String(action.text || '').trim() || 'essa frase antiga que mora em mim'
      s.belief = belief
      msgs.push(bot(name(`"${belief}" — eu escutei essa frase sua.

Agora uma pergunta importante, daquelas que mexem: quem pensava assim ou parecido? Sua mãe, seu pai, alguém da família, outra pessoa que cuidou de você?`)))
      s.step = 'belief_q1'
      awaiting = 'text'
      break
    }

    case 'belief_q1': {
      const who = String(action.text || '').trim() || 'alguém que cuidou de você'
      msgs.push(bot(name(`${who}... faz sentido.
Você percebe que essa crença foi aprendida, mas não foi escolhida por você? Só me diz: sim ou não.`)))
      replies = [reply('belief_yes', 'Sim'), reply('belief_no', 'Não')]
      s.step = 'belief_q2'
      break
    }

    case 'belief_q2': {
      if (action.type === 'reply' && action.id === 'belief_no') {
        msgs.push(bot(`Deixa eu te mostrar uma coisa. Essa frase não nasceu com você. Ninguém nasce com "não sou boa o suficiente" — isso foi sendo plantado aos poucos, por situações e por vozes de fora. Você apenas recebeu. Receber não é escolher.`))
        s.step = 'belief_q2_2'
      } else {
        msgs.push(bot(name(`Isso é um reconhecimento poderoso.`)))
        s.step = 'belief_q4'
      }
      break
    }

    case 'belief_q2_2': {
      msgs.push(bot(`Agora sim: percebendo que essa crença foi aprendida e não escolhida, você consegue dizer sim?`))
      replies = [reply('belief_yes', 'Sim'), reply('belief_no', 'Ainda não')]
      s.step = 'belief_q2_3'
      break
    }

    case 'belief_q2_3': {
      if (action.type === 'reply' && action.id === 'belief_no') {
        msgs.push(bot(name(`Sem pressa. Isso também é um processo — perceber já é metade do caminho. Quando você estiver pronta, nós seguimos.

Por enquanto, quando essa crença aparecer, discipline-a com curiosidade. Repita várias vezes: "Curiosa… crença que eu tenho essa crença." Depois pergunte: essa crença é minha ou aprendi a tê-la? O que eu realmente quero? O que é verdadeiro sobre isso, que só eu entendo?

É no questionamento da crença antiga que você abre espaço para criar a imagem nova. E respira comigo, deixando essa frase um pouco mais longe de você.`)))
        actionOut = { type: 'openResp', respId: 'alivio' }
        s.step = 'after_practice'
      } else {
        s.step = 'belief_q4'
        return reduce({ ...s, step: 'belief_q4' }, action, meta)
      }
      break
    }

    case 'belief_q4': {
      msgs.push(bot(`Então se essa frase não é sua, ela não precisa continuar no comando, não é?
Concorda?`))
      replies = [reply('belief_yes', 'Concordo'), reply('belief_no', 'Tenho dúvida')]
      s.step = 'belief_q5'
      break
    }

    case 'belief_q5': {
      if (action.type === 'reply' && action.id === 'belief_no') {
        msgs.push(bot(name(`A dúvida também é um movimento. Ela abre espaço. Se você ainda sente que essa crença tem poder, é porque ela protegeu você por muito tempo. Vamos agradecer a ela e devolvê-la ao passado — sem briga, com respeito.`)))
        s.beliefDoubt = true
        msgs.push(bot(name(`E quando essa crença aparecer, discipline-a com curiosidade. Repita várias vezes, em voz alta: "Curiosa… crença que eu tenho essa crença."

Depois, pergunte a verdade de quem ela é: essa crença é minha ou aprendi a tê-la? O que eu realmente quero? O que é verdadeiro sobre isso, que só eu entendo?

É no questionamento da crença antiga que você abre espaço para criar a imagem nova. Discipline a antiga — e a nova nasce.`)))
        s.step = 'belief_dissolve'
        awaiting = 'continue'
      } else {
        msgs.push(bot(name(`Perfeito. Então me conta: o que você gostaria de acreditar sobre isso, a partir de hoje?`)))
        s.step = 'belief_q6'
        awaiting = 'text'
      }
      break
    }

    case 'belief_dissolve': {
      msgs.push(bot(name(`O que você gostaria de acreditar sobre isso, a partir de hoje?`)))
      s.step = 'belief_q6'
      awaiting = 'text'
      break
    }

    case 'belief_q6': {
      const newBelief = String(action.text || '').trim() || 'que eu sou capaz e estou segura'
      const n = s.need && NEEDS[s.need]
      s.newBelief = newBelief
      const needId = s.need || 'amada'
      const decree = pickFreshDecree(needId)
      msgs.push(bot(name(`"${newBelief}". Vou repetir junto com você: ${newBelief}.

${n && n.affirmation ? `E essa é a frase que você vai usar no seu dia a partir de agora: "${n.affirmation}". Repita em voz alta, com a mão no coração.` : ''}

E este é o seu decreto de luz para hoje: "${decree.text}" — use esse decreto como um comando para reconfigurar o seu subconsciente.

${n && n.smartQuestion ? `Agora, uma pergunta inteligente só para você: ${n.smartQuestion}` : ''}

Me conta uma conquista sua nessa área. Pode ser pequena — algo que você já fez que mostra que essa nova frase é verdadeira para você.`)))
      s.step = 'belief_q7'
      awaiting = 'text'
      break
    }

    case 'belief_q7': {
      const win = String(action.text || '').trim() || 'essa pequena prova'
      const law = pickLawFor(s.belief)
      s.beliefLaw = law
      msgs.push(bot(name(`${win} — guarda isso, porque isso é a sua evidência. A mente cria a imagem; a imagem vira experiência.

Existe um princípio que mora nisso: a ${law.name}. ${law.quote}

A crença antiga vai ao passado. A nova imagem mental vai ao comando.`)))
      s.step = 'love_intro'
      awaiting = 'continue'
      break
    }

    case 'love_intro': {
      msgs.push(bot(`Agora, um fechamento. Uma pergunta simples:
quem é a pessoa que você mais ama neste mundo?`))
      s.step = 'love_answer'
      awaiting = 'text'
      break
    }

    case 'love_answer': {
      const love = String(action.text || '').trim() || 'essa pessoa especial'
      s.love = love
      msgs.push(bot(name(`"${love}". Então agora, se for confortável para você, feche os olhos.
Conecte-se da pontinha do seu dedão do pé até o topo da cabeça... sentindo cada pedaço do seu corpo.
Agora imagine ${love} diante de você.
Imagine o rosto dessa pessoa como um grande sol dourado, irradiando calor.
Não precisa pensar. Apenas perceba o que acontece dentro de você quando olha para esse amor.
Sinta o calor gostoso invadindo o seu corpo.
Se esse amor tivesse um cheiro... que cheiro teria?`)))
      s.step = 'love_smell'
      awaiting = 'text'
      break
    }

    case 'love_smell': {
      const smell = String(action.text || '').trim() || 'o cheiro que o seu amor tem'
      msgs.push(bot(`"${smell}". Guarda esse cheiro — ele é a sua âncora do amor.

Agora inspire longo e lento. Coloque a mão direita no coração, e a esquerda na altura do útero.
E decrete comigo, em voz alta:
"Eu sinto amor. Eu te abençoo. Eu te amo. Eu sou grata."`))
      s.step = 'love_decrees'
      awaiting = 'continue'
      break
    }

    case 'love_decrees': {
      const needId = s.need || 'amada'
      const decree = pickFreshDecree(needId)
      msgs.push(bot(name(`"Eu sinto amor. Eu te abençoo. Eu te amo. Eu sou grata."

E, para você levar o amor para o seu dia, este é o seu decreto de luz:

"${decree.text}"

Use esse decreto como um comando para reconfigurar o seu subconsciente — sempre a favor de você ser boa o suficiente e viver sempre satisfeita, recuperando o prazer de viver e a sua própria identidade.

Respira mais uma vez, longa. Percebe? Tudo isso estava dentro de você — a gente só reorganizou o caminho.

Você acabou de voltar para si. E isso, querida, é paz.`)))
      s.step = 'reminder'
      awaiting = 'continue'
      break
    }

    case 'reminder': {
      msgs.push(bot(`"Paz não é evento, paz é treino."
O ritmo do cuidado TERAMIM é simples: a cada 4 horas, um momento de volta para si — PARE → Respira → Como você está? → microprática de 2 a 5 minutos → volta para a vida.

Quer que eu te lembre do seu momento de paz hoje?`))
      replies = [
        reply('rem_yes', 'Sim, quero'),
        reply('rem_time', 'Quero escolher o horário'),
        reply('rem_no', 'Não, obrigada')
      ]
      s.step = 'reminder_choose'
      break
    }

    case 'reminder_choose': {
      if (action.type === 'reply' && action.id === 'rem_no') {
        return pushUpsell(s, msgs, meta)
      }
      msgs.push(bot(`Perfeito. Escolha o horário do seu momento de paz:`))
      replies = [
        reply('t_8', '08:00'),
        reply('t_12', '12:00'),
        reply('t_16', '16:00'),
        reply('t_20', '20:00'),
        reply('t_22', '22:00')
      ]
      s.step = 'reminder_time'
      break
    }

    case 'reminder_time': {
      const t = action.type === 'reply' ? action.label : String(action.text || '08:00')
      msgs.push(bot(name(`Combinado. ${t} — eu vou estar aqui, esperando por você. Quando o horário chegar, você recebe o aviso e a gente faz a prática orientada do dia.`)))
      actionOut = { type: 'setReminder', time: t }
      s.step = 'upsell'
      break
    }

    case 'upsell': {
      return pushUpsell(s, msgs, meta)
    }

    case 'upsell_offer': {
      if (action.type === 'reply' && action.id === 'upsell_learn') {
        msgs.push(bot(name(`Combinado! Você encontra tudo na página de assinatura — e quando voltar, eu continuo aqui exatamente de onde paramos.`)))
        replies = [reply('upsell_end', 'Vou lá conferir')]
      } else if (action.type === 'reply' && action.id === 'upsell_end') {
        msgs.push(bot(name(`Foi uma honra caminhar com você hoje. Termina como você veio: inteira, presente, escolhendo.
Paz não é evento. Paz é treino. Eu estou aqui.`)))
        actionOut = { type: 'endSession' }
      }
      break
    }

    default: {
      msgs.push(bot(`Estou aqui. Como você está se sentindo agora?`))
      replies = EMOTION_MAP.map((e) => reply(`emotion_${e.id}`, e.label))
      s.step = 'emotion'
    }
  }

  return { state: s, messages: msgs, replies, awaiting, action: actionOut }
}

function runNeedsQuestion(s, action) {
  const idx = s.nextNeedsQ
  const q = NEEDS_TEST.questions[idx]
  const msgs = []
  const replies = q.options.map((o) => reply(o.id, o.text))
  msgs.push(bot(q.scenario))
  s.nextNeedsQ = idx + 1
  s.step = 'needs_question'
  return { state: s, messages: msgs, replies, awaiting: null, action: null }
}
