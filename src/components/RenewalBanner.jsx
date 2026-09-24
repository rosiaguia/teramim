import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getOrCreateUser, getCheckoutUrl } from '../engine/store.js'
import { subscriptionStatus, fetchConfig } from '../api/client.js'

export default function RenewalBanner() {
  const [info, setInfo] = useState(null)
  const [url, setUrl] = useState(getCheckoutUrl())

  useEffect(() => {
    const user = getOrCreateUser()
    if (!user.email || !user.email.includes('@')) return
    let active = true
    subscriptionStatus(user.email).then((res) => {
      if (!active) return
      setInfo(res)
    })
    fetchConfig().then((c) => {
      if (active && c && c.checkoutUrl) setUrl(c.checkoutUrl)
    })
    return () => { active = false }
  }, [])

  if (!info || !info.access || !info.expiringSoon) return null

  const days = info.daysLeft

  return (
    <div className="renewal-banner fade-in">
      <div className="renewal-banner-inner">
        <span className="renewal-banner-icone">✨</span>
        <p className="renewal-banner-text">
          Olá, <strong>Lindo Ser</strong>... Sua assinatura vence em <strong>{days} {days === 1 ? 'dia' : 'dias'}</strong>.
          Se você paga no cartão, a renovação é automática — não precisa fazer nada.
          Se paga por Pix ou boleto, toque em Renovar agora para continuar seu espaço de paz sem interrupção.
        </p>
        {url ? (
          <a className="btn btn-lime btn-sm" href={url} target="_blank" rel="noreferrer">
            Renovar agora
          </a>
        ) : (
          <Link className="btn btn-lime btn-sm" to="/assinar">
            Renovar agora
          </Link>
        )}
      </div>
    </div>
  )
}
