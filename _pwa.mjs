import { chromium } from 'playwright-core'
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: 390, height: 844 } })
const p = await ctx.newPage()
const events = []
p.on('console', m => events.push('console: ' + m.text()))
let promptFired = false
await p.addInitScript(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    window.__promptFired = true
    e.preventDefault()
  })
})
await p.goto('https://5173-61a34a429e54f4cf.monkeycode-ai.live/#/app', { waitUntil: 'networkidle' })
await p.waitForTimeout(3000)
const info = await p.evaluate(async () => {
  const sw = await navigator.serviceWorker.getRegistration()
  const manifest = await fetch('/manifest.webmanifest').then(r => r.status).catch(() => 'err')
  return {
    promptFired: !!window.__promptFired,
    swRegistered: !!sw,
    swActive: sw ? !!sw.active : false,
    manifestStatus: manifest,
    isSecure: location.protocol === 'https:'
  }
})
console.log(JSON.stringify(info, null, 2))
await b.close()
