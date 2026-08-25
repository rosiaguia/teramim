import { useEffect, useState } from 'react'
import { fetchLogo } from '../api/client.js'

export default function AppLogo({ height = 30 }) {
  const [url, setUrl] = useState(null)
  const [ok, setOk] = useState(true)

  useEffect(() => {
    let active = true
    fetchLogo().then((u) => { if (active) { setUrl(u); setOk(true) } })
    return () => { active = false }
  }, [])

  if (url && ok) {
    return (
      <img
        className="app-logo"
        src={url}
        alt="P.A.R.E®"
        style={{ height }}
        onError={() => setOk(false)}
      />
    )
  }
  return null
}
