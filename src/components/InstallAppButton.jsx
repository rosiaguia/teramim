import { useState, useEffect } from 'react'

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [installed, setInstalled] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true)
    }
    const onPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    const onInstalled = () => {
      setInstalled(true)
      setDeferredPrompt(null)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  async function handleInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice
      if (choice && choice.outcome === 'accepted') {
        setInstalled(true)
      }
      setDeferredPrompt(null)
      return
    }
    setShowHelp(true)
  }

  if (isStandalone || installed) return null

  const isIos = typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent)

  return (
    <div className="install-box fade-in">
      <button type="button" className="btn btn-brown install-app-btn" onClick={handleInstall}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M7 2.5A2.5 2.5 0 0 0 4.5 5v14A2.5 2.5 0 0 0 7 21.5h10a2.5 2.5 0 0 0 2.5-2.5V5A2.5 2.5 0 0 0 17 2.5H7zm0 1.5h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm4.5 14.75a1.25 1.25 0 1 1 2.5 0 1.25 1.25 0 0 1-2.5 0zM8 9h8V7H8v2z" /></svg>
        Instalar o app no celular
      </button>
      {showHelp && (
        <div className="install-help">
          {deferredPrompt ? null : isIos ? (
            <p>
              No iPhone/iPad: toque no botão <strong>Compartilhar</strong> (ícone de uma seta
              saindo de um quadrado, na barra do Safari) e escolha <strong>“Adicionar à Tela de Início”</strong>.
            </p>
          ) : (
            <p>
              Se o botão não abrir o convite de instalação, use o menu do navegador (os três pontinhos)
              e escolha <strong>“Instalar aplicativo”</strong> ou <strong>“Adicionar à tela inicial”</strong>.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
