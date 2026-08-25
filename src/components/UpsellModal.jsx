import { Link } from 'react-router-dom'

export default function UpsellModal({ onClose }) {
  return (
    <div className="modal-overlay fade-in">
      <div className="modal upsell-modal">
        <button className="modal-close" onClick={onClose} aria-label="Fechar">×</button>
        <span className="chip">Convite · sem pressão</span>
        <h3>Reset Emocional</h3>
        <p className="section-sub center">
          Você acabou de sentir o que é voltar para você em poucos minutos. O Reset Emocional é onde a gente
          aprofunda isso junto: hipnoterapia, encontros ao vivo e todos os protocolos com orientação da Rosi Aguiar.
        </p>
        <div className="upsell-points">
          <div className="upsell-point">
            <strong>Encontros ao vivo</strong>
            <span>Acompanhamento em grupo com a Rosi</span>
          </div>
          <div className="upsell-point">
            <strong>Protocolos completos</strong>
            <span>Toda a biblioteca RÉSP + áudios clonados</span>
          </div>
          <div className="upsell-point">
            <strong>Orientação ao vivo</strong>
            <span>Não é só um app, é um caminho acompanhado</span>
          </div>
        </div>
        <div className="upsell-cta">
          <button className="btn btn-terracotta btn-lg" onClick={() => { onClose(); window.location.hash = '#/assinar' }}>
            Quero conhecer o Reset Emocional
          </button>
          <button className="btn btn-ghost" onClick={onClose}>Por enquanto, só o TERAMIM</button>
        </div>
      </div>
    </div>
  )
}
