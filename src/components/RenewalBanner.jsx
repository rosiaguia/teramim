import { useEffect, useState } from 'react'
import { getOrCreateUser } from '../engine/store.js'
import { subscriptionStatus } from '../api/client.js'
import { getCheckoutUrl } from '../engine/store.js'

export default function RenewalBanner() {
  const [info, setInfo] = useState(null)

  useEffect(() => {
    const user = getOrCreateUser()
    if (!user.email || !user.email.includes('@')) return
    let active = true
    subscriptionStatus(user.email).then((res) => {
      if (!active) return
      setInfo(res)
    })
    return () => { active = false }
  }, [])

  if (!info || !info.access || !info.expiringSoon) return null

  const name = (info.name || '').split(' ')[0] || 'Querida'
  const days = info.daysLeft

  return (
    <div className="renewal-banner fade-in">
      <div className="renewal-banner-inner">
        <span className="renewal-banner-icone">✨</span>
        <p className="renewal-banner-text">
          Olá, <strong>{name}</strong>! Sua assinatura vence em <strong>{days} {days === 1 ? 'dia' : 'dias'}</strong>.
          Renove para continuar seu espaço de paz sem interrupção.
        </p>
        <a className="btn btn-lime btn-sm" href={getCheckoutUrl()} target="_blank" rel="noreferrer">
          Renovar agora
        </a>
      </div>
    </div>
  )
}
