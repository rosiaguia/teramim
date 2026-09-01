import { useLayoutEffect, useRef, useState } from 'react'
import { UNIVERSE_CATEGORIES, NEED_TO_UNIVERSE, questionsForCategory, universeCategoryById } from '../data/universeQuestions.js'

const WHY_ASK = {
  title: 'Por que perguntar?',
  lines: [
    'Uma pergunta abre portas que uma conclusão fecha. Quando a mente responde e conclui, ela volta para o mesmo ciclo — repete o padrão de sempre.',
    'Por isso, hoje, em vez de responder, apenas pergunte ao Universo. E depois solte.',
    'A vantagem: quando você solta a pergunta sem exigir resposta, a resposta chega quando você menos esperar — e chega de um lugar que a sua mente jamais encontraria sozinha.'
  ]
}

const SINGLE_INSTRUCTION = [
  'Escreva a pergunta com caneta, num papel ou caderno. Escrever à mão fixa na memória de longo prazo.',
  'Pergunte ao Universo e depois solte. A resposta virá quando você menos esperar.'
]

export default function UniverseAsk({ onClose, onTake, single = false, needId = null }) {
  const lockedNeed = single && needId ? (NEED_TO_UNIVERSE[needId] || needId) : null
  const initialCat = lockedNeed
  const [catId, setCatId] = useState(initialCat)
  const [qList, setQList] = useState(() => (initialCat ? questionsForCategory(initialCat, 3, { lock: true }) : []))
  const [qIdx, setQIdx] = useState(0)
  const modalRef = useRef(null)
  const overlayRef = useRef(null)

  useLayoutEffect(() => {
    const el = modalRef.current
    const ov = overlayRef.current
    if (!el && !ov) return
    const reset = () => {
      if (el) el.scrollTop = 0
      if (ov) ov.scrollTop = 0
    }
    reset()
    const raf = requestAnimationFrame(reset)
    const t1 = setTimeout(reset, 50)
    const t2 = setTimeout(reset, 250)
    let pending = null
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { pending = requestAnimationFrame(reset) })
    }
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t1)
      clearTimeout(t2)
      if (pending) cancelAnimationFrame(pending)
    }
  }, [catId, qIdx])
  const cat = universeCategoryById(catId)

  function openCat(id) {
    setCatId(id)
    setQList(questionsForCategory(id, 3))
    setQIdx(0)
  }

  function showPrev() {
    setQIdx((i) => (i > 0 ? i - 1 : qList.length - 1))
  }

  function showNext() {
    setQIdx((i) => (i + 1 < qList.length ? i + 1 : 0))
  }

  return (
    <div className="universe-overlay" ref={overlayRef} onClick={onClose}>
      <div className="universe-modal card" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <button className="universe-close" onClick={onClose} aria-label="Fechar">✕</button>

        {!cat ? (
          <>
            <span className="chip">Pergunte ao Universo</span>
            <h3 className="universe-title">Quer fazer uma pergunta ao Universo?</h3>
            <div className="universe-why">
              <strong>{WHY_ASK.title}</strong>
              {WHY_ASK.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="universe-cats">
              {UNIVERSE_CATEGORIES.map((c) => (
                <button key={c.id} className="universe-cat" onClick={() => openCat(c.id)}>
                  <span className="universe-cat-emoji">{c.emoji}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {single && !lockedNeed && <button className="universe-back" onClick={() => setCatId(null)}>← Trocar de tema</button>}
            <span className="chip">{cat.emoji} {cat.label}</span>
            <h3 className="universe-title">Pergunta {qIdx + 1} de {qList.length}</h3>
            <div className="universe-q-card">
              <p className="universe-ask-line">Respire calmamente, e pergunte:</p>
              <p className="universe-q-text">"{qList[qIdx]}"</p>
              <div className="universe-nav">
                <button className="btn btn-ghost btn-sm" onClick={showPrev}>← Anterior</button>
                <button className="btn btn-ghost btn-sm" onClick={showNext}>Próxima →</button>
              </div>
            </div>
            <div className="universe-instruction">
              {SINGLE_INSTRUCTION.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="step-actions">
              <button className="btn btn-primary" onClick={onTake || onClose}>Levar comigo</button>
              <button className="btn btn-ghost" onClick={onClose}>Fechar</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
