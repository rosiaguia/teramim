import { initialState, reduce } from '../src/engine/teramimEngine.js'

function run() {
  let s = initialState()
  let fails = 0

  function act(a, name = 'Maria') {
    const r = reduce(s, a, { userName: name })
    s = r.state
    return r
  }

  function check(name, cond) {
    if (!cond) { fails++; console.error('FAIL:', name) }
    else console.log('ok:', name)
  }

  // 1. welcome
  let r = act({ type: 'start' })
  check('welcome opens with 6 emotions + SOS', r.replies.length === 7 && r.state.step === 'emotion')

  // 2. pick emotion
  r = act({ type: 'reply', id: 'emotion_ansiedade', label: 'Ansiedade' })
  check('emotion selected -> body quick replies', r.state.step === 'emotion_body' && r.replies.length === 5)

  // 3. body
  r = act({ type: 'reply', id: 'body_peito', label: 'Peito / coração' })
  check('body -> mind inquiry (text)', r.state.step === 'emotion_mind' && r.awaiting === 'text')

  // 4. mind text
  r = act({ type: 'text', text: 'que tudo vai dar errado' })
  check('mind -> presence', r.state.step === 'emotion_presence' && r.replies.length === 3)

  // 5. presence
  r = act({ type: 'reply', id: 'pres_auto', label: 'Estou no automático' })
  check('presence -> intensity', r.state.step === 'intensity' && r.replies.length === 3)

  // 6. intensity leve
  r = act({ type: 'reply', id: 'int_leve', label: 'Leve' })
  check('leve -> needs_intro (continue)', r.state.step === 'needs_intro' && r.awaiting === 'continue')

  r = act({ type: 'continue' })
  check('continue -> needs q1 shown', r.state.step === 'needs_question' && r.state.nextNeedsQ === 1 && r.replies.length === 4)

  // 7. needs questions
  r = act({ type: 'reply', id: 'q1_amada', label: 'a' })
  check('q1 answered -> q2', r.state.nextNeedsQ === 2 && r.replies.length === 4)
  r = act({ type: 'reply', id: 'q2_amada', label: 'b' })
  check('q2 answered -> q3', r.state.nextNeedsQ === 3)
  r = act({ type: 'reply', id: 'q3_amada', label: 'c' })
  check('need computed -> protocol_resp + openResp', r.state.need === 'amada' && r.state.step === 'protocol_resp' && r.action && r.action.type === 'openResp')

  // 8. practice done
  r = act({ type: 'continue' })
  check('practice done -> check-in', r.state.step === 'after_practice' && r.replies.length === 3)

  // 9. after_better -> belief_intro
  r = act({ type: 'reply', id: 'after_better', label: 'Mais leve' })
  check('check-in -> belief_intro', r.state.step === 'belief_intro' && r.awaiting === 'continue')
  r = act({ type: 'continue' })
  check('belief intro offers quiz belief (amada)', r.state.step === 'belief_suggest' && r.replies.length === 2 && r.messages.some((m) => m.text.includes('Eu não sou amada o suficiente')))

  // 10. belief tree (accept suggested belief -> straight to who taught it)
  r = act({ type: 'reply', id: 'belief_sug_yes', label: 'Sim, essa frase é minha' })
  check('belief suggest yes -> q1', r.state.step === 'belief_q1' && r.awaiting === 'text')
  r = act({ type: 'text', text: 'minha mãe' })
  check('belief q1 -> q2', r.state.step === 'belief_q2' && r.replies.length === 2)
  r = act({ type: 'reply', id: 'belief_yes', label: 'Sim' })
  check('belief q2 yes -> q4', r.state.step === 'belief_q4')
  r = act({ type: 'reply', id: 'belief_yes', label: 'Concordo' })
  check('belief q4 answered -> q5', r.state.step === 'belief_q5' && r.replies.length === 2)
  r = act({ type: 'reply', id: 'belief_no', label: 'Tenho dúvida' })
  check('belief q5 no -> dissolve (curious belief)', r.state.step === 'belief_dissolve' && r.awaiting === 'continue' && r.messages.some((m) => m.text.includes('crença que eu tenho essa crença')))
  r = act({ type: 'continue' })
  check('belief dissolve -> q6', r.state.step === 'belief_q6' && r.awaiting === 'text')
  r = act({ type: 'text', text: 'que eu sou capaz' })
  check('belief q6 -> q7 (affirmation + smart question)', r.state.step === 'belief_q7' && r.awaiting === 'text' && r.messages.some((m) => m.text.includes('Eu sou amada exatamente como eu sou')))
  r = act({ type: 'text', text: 'cuidei da minha mãe por anos' })
  check('belief q7 -> love intro (continue)', r.state.step === 'love_intro' && r.awaiting === 'continue')
  r = act({ type: 'continue' })
  check('love intro question', r.state.step === 'love_answer' && r.awaiting === 'text')

  // 11. love experience
  r = act({ type: 'text', text: 'minha filha' })
  check('love -> smell', r.state.step === 'love_smell' && r.awaiting === 'text')
  r = act({ type: 'text', text: 'cheiro de lavanda' })
  check('smell -> decrees', r.state.step === 'love_decrees' && r.awaiting === 'continue')
  r = act({ type: 'continue' })
  check('decrees -> reminder (continue)', r.state.step === 'reminder' && r.awaiting === 'continue' && r.messages.some((m) => m.text.includes('decreto de luz')))
  r = act({ type: 'continue' })
  check('reminder -> question', r.state.step === 'reminder_choose' && r.replies.length === 3)

  // 12. reminder
  r = act({ type: 'reply', id: 'rem_time', label: 'Quero escolher o horário' })
  check('reminder -> time pick', r.state.step === 'reminder_time' && r.replies.length === 5)
  r = act({ type: 'reply', id: 't_16', label: '16:00' })
  check('time -> setReminder action', r.action && r.action.type === 'setReminder' && r.action.time === '16:00')

  // continue from setReminder -> upsell
  r = act({ type: 'continue' })
  check('setReminder continue -> upsell open + text', r.action && r.action.type === 'openUpsell' && r.state.step === 'upsell_offer' && r.messages.some((m) => m.text.includes('Reset Emocional')))

  // 13. upsell end
  r = act({ type: 'reply', id: 'upsell_end', label: 'Por hoje é só' })
  check('upsell end -> farewell', r.action && r.action.type === 'endSession')

  // 14. upsell learn path
  let u = initialState()
  let ur = reduce(u, { type: 'start' }, { userName: 'Maria' })
  u = ur.state
  ur = reduce(u, { type: 'reply', id: 'emotion_medo', label: 'Medo' }, { userName: 'Maria' })
  u = ur.state
  ur = reduce(u, { type: 'reply', id: 'body_garganta', label: 'Garganta' }, { userName: 'Maria' })
  u = ur.state
  ur = reduce(u, { type: 'text', text: 'não sei' }, { userName: 'Maria' })
  u = ur.state
  ur = reduce(u, { type: 'reply', id: 'pres_discon', label: 'Desconectada' }, { userName: 'Maria' })
  u = ur.state
  ur = reduce(u, { type: 'reply', id: 'int_mod', label: 'Moderado' }, { userName: 'Maria' })
  u = ur.state
  ur = reduce(u, { type: 'continue' }, { userName: 'Maria' })
  check('int moderado -> needs', ur.state.step === 'needs_question')
  u = ur.state
  ur = reduce(u, { type: 'reply', id: 'q1_segura', label: 's' }, { userName: 'Maria' })
  u = ur.state
  ur = reduce(u, { type: 'reply', id: 'q2_segura', label: 's' }, { userName: 'Maria' })
  u = ur.state
  ur = reduce(u, { type: 'reply', id: 'q3_segura', label: 's' }, { userName: 'Maria' })
  check('need segura -> openResp zero', ur.state.need === 'segura' && ur.action.type === 'openResp')

  // --- Crisis path ---
  let c = initialState()
  let cr = reduce(c, { type: 'start' }, { userName: 'Ana' })
  c = cr.state
  cr = reduce(c, { type: 'reply', id: 'emotion_raiva', label: 'Raiva' }, { userName: 'Ana' })
  c = cr.state
  cr = reduce(c, { type: 'reply', id: 'body_ombros', label: 'Ombros' }, { userName: 'Ana' })
  c = cr.state
  cr = reduce(c, { type: 'text', text: 'tudo' }, { userName: 'Ana' })
  c = cr.state
  cr = reduce(c, { type: 'reply', id: 'pres_here', label: 'Estou aqui' }, { userName: 'Ana' })
  c = cr.state
  cr = reduce(c, { type: 'reply', id: 'int_alto', label: 'Alto' }, { userName: 'Ana' })
  check('alto -> safety check', cr.state.step === 'safety_check')
  c = cr.state
  cr = reduce(c, { type: 'reply', id: 'safe_no_self', label: 'Tenho medo de me machucar' }, { userName: 'Ana' })
  check('crisis -> crisis protocol', cr.state.step === 'crisis' && cr.replies.length === 2)
  c = cr.state
  cr = reduce(c, { type: 'reply', id: 'crisis_help', label: 'Vou buscar ajuda agora' }, { userName: 'Ana' })
  check('crisis end -> endSession', cr.action && cr.action.type === 'endSession')

  // high but safe -> zero practice
  let h = initialState()
  let hr = reduce(h, { type: 'start' }, { userName: 'Ana' })
  h = hr.state
  hr = reduce(h, { type: 'reply', id: 'emotion_raiva', label: 'Raiva' }, { userName: 'Ana' })
  h = hr.state
  hr = reduce(h, { type: 'reply', id: 'body_peito', label: 'Peito' }, { userName: 'Ana' })
  h = hr.state
  hr = reduce(h, { type: 'text', text: 'nada' }, { userName: 'Ana' })
  h = hr.state
  hr = reduce(h, { type: 'reply', id: 'pres_auto', label: 'Automático' }, { userName: 'Ana' })
  h = hr.state
  hr = reduce(h, { type: 'reply', id: 'int_alto', label: 'Alto' }, { userName: 'Ana' })
  h = hr.state
  hr = reduce(h, { type: 'reply', id: 'safe_yes', label: 'Sim, mas ativada' }, { userName: 'Ana' })
  check('high+safe -> zero practice', hr.action && hr.action.type === 'openResp' && hr.action.respId === 'zero')

  // --- SOS path ---
  let so = initialState()
  let sr = reduce(so, { type: 'start' }, { userName: 'Sof' })
  so = sr.state
  sr = reduce(so, { type: 'reply', id: 'sos', label: 'SOS' }, { userName: 'Sof' })
  check('sos -> openSos action', sr.action.type === 'openSos' && sr.state.step === 'after_sos')
  so = sr.state
  sr = reduce(so, { type: 'continue' }, { userName: 'Sof' })
  check('sos continue -> check', sr.state.step === 'sos_check' && sr.replies.length === 3)
  so = sr.state
  sr = reduce(so, { type: 'reply', id: 'after_ready', label: 'Vamos continuar' }, { userName: 'Sof' })
  check('sos -> back to needs', sr.state.step === 'needs_question')

  // belief no path
  let bn = initialState()
  let br = reduce(bn, { type: 'start' }, { userName: 'N' })
  bn = br.state
  br = reduce(bn, { type: 'reply', id: 'emotion_tristeza', label: 'Tristeza' }, { userName: 'N' })
  bn = br.state
  br = reduce(bn, { type: 'reply', id: 'body_garganta', label: 'Garganta' }, { userName: 'N' })
  bn = br.state
  br = reduce(bn, { type: 'text', text: 'lembranças' }, { userName: 'N' })
  bn = br.state
  br = reduce(bn, { type: 'reply', id: 'pres_here', label: 'Estou aqui' }, { userName: 'N' })
  bn = br.state
  br = reduce(bn, { type: 'reply', id: 'int_mod', label: 'Moderado' }, { userName: 'N' })
  bn = br.state
  br = reduce(bn, { type: 'continue' }, { userName: 'N' })
  bn = br.state
  br = reduce(bn, { type: 'reply', id: 'q1_pertencer', label: 'p' }, { userName: 'N' })
  bn = br.state
  br = reduce(bn, { type: 'reply', id: 'q2_pertencer', label: 'p' }, { userName: 'N' })
  bn = br.state
  br = reduce(bn, { type: 'reply', id: 'q3_pertencer', label: 'p' }, { userName: 'N' })
  check('need pertencer -> alivio', br.state.need === 'pertencer' && br.action && br.action.respId === 'alivio')
  bn = br.state
  br = reduce(bn, { type: 'continue' }, { userName: 'N' })
  bn = br.state
  br = reduce(bn, { type: 'reply', id: 'after_ready', label: 'Pronta' }, { userName: 'N' })
  check('after_ready -> belief_intro', br.state.step === 'belief_intro')
  bn = br.state
  br = reduce(bn, { type: 'continue' }, { userName: 'N' })
  check('belief intro offers quiz belief (pertencer)', br.state.step === 'belief_suggest' && br.replies.length === 2 && br.messages.some((m) => m.text.includes('Eu não pertenço a lugar nenhum')))
  bn = br.state
  br = reduce(bn, { type: 'reply', id: 'belief_sug_own', label: 'É parecida, deixa eu contar' }, { userName: 'N' })
  check('belief suggest own -> share text', br.state.step === 'belief_share' && br.awaiting === 'text')
  bn = br.state
  br = reduce(bn, { type: 'text', text: 'sou invisível' }, { userName: 'N' })
  check('belief text -> q1', br.state.step === 'belief_q1')
  bn = br.state
  br = reduce(bn, { type: 'text', text: 'meu pai' }, { userName: 'N' })
  bn = br.state
  br = reduce(bn, { type: 'reply', id: 'belief_no', label: 'Não' }, { userName: 'N' })
  check('belief no -> explanation', br.state.step === 'belief_q2_2')
  bn = br.state
  br = reduce(bn, { type: 'reply', id: 'belief_yes', label: 'Sim' }, { userName: 'N' })
  check('belief explanation yes -> reconfirm', br.state.step === 'belief_q2_3')
  bn = br.state
  br = reduce(bn, { type: 'reply', id: 'belief_yes', label: 'Sim' }, { userName: 'N' })
  check('belief reconfirm -> q5', br.state.step === 'belief_q5')

  if (fails === 0) console.log('\nALL TESTS PASSED')
  else { console.error(`\n${fails} FAILURES`); process.exit(1) }
}

run()
