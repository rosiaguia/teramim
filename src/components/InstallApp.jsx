import { useEffect, useRef, useState } from 'react'

export default function InstallApp() {
  const [open, setOpen] = useState(false)
  const [installed, setInstalled] = useState(false)
  const deferredPrompt = useRef(null)

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault()
      deferredPrompt.current = e
    }
    const onInstalled = () => {
      setInstalled(true)
      setOpen(false)
      deferredPrompt.current = null
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  async function handleInstall() {
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt()
      try {
        const { outcome } = await deferredPrompt.current.userChoice
        if (outcome === 'accepted') setInstalled(true)
      } catch (e) { /* usuário fechou a janela */ }
      deferredPrompt.current = null
      return
    }
    setOpen(true)
  }

  if (installed) {
    return (
      <p className="install-done">
        P.A.R.E<sup>®</sup> instalado na tela inicial do seu celular!
      </p>
    )
  }

  return (
    <>
      <button className="btn btn-ghost install-app-btn" onClick={handleInstall}>
        📲 Instalar o P.A.R.E.
      </button>
      {open && (
        <div className="modal-overlay fade-in" onClick={() => setOpen(false)} style={{ zIndex: 130 }}>
          <div className="modal install-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpen(false)} aria-label="Fechar">×</button>
            <h3 className="section-title center">Instalar o P.A.R.E.</h3>
            <p className="section-sub center" style={{ marginBottom: 18 }}>
              Deixe o P.A.R.E<sup>®</sup> na tela do seu celular.
            </p>

            <div className="install-block">
              <h4 className="install-title">📱 iPhone</h4>
              <ol className="install-steps">
                <li>Abra o P.A.R.E. no Safari.</li>
                <li>Toque no botão Compartilhar.</li>
                <li>Toque em "Adicionar à Tela de Início".</li>
                <li>Toque em "Adicionar".</li>
              </ol>
            </div>

            <div className="install-block">
              <h4 className="install-title">🤖 Android</h4>
              <ol className="install-steps">
                <li>Abra o P.A.R.E. no Chrome.</li>
                <li>Toque nos três pontinhos.</li>
                <li>Toque em "Adicionar à tela inicial" ou "Instalar aplicativo".</li>
                <li>Confirme a instalação.</li>
              </ol>
            </div>

            <p className="install-note">
              Depois de instalado, o P.A.R.E<sup>®</sup> abre em tela cheia, sem navegador.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
