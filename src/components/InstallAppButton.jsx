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
      <button type="button" className="btn btn-lime btn-lg btn-block" onClick={handleInstall}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 3c-.55 0-1 .45-1 1v8.17l-2.29-2.29a1 1 0 1 0-1.42 1.42l4 4a1 1 0 0 0 1.42 0l4-4a1 1 0 1 0-1.42-1.42L13 12.17V4c0-.55-.45-1-1-1zM5 19h14a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2z" /></svg>
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
