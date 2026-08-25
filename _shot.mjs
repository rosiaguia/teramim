import { chromium } from 'playwright-core'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 390, height: 844 } })
await p.goto('http://localhost:5173/#/app/respiracao', { waitUntil: 'networkidle' })
await p.evaluate(() => { localStorage.setItem('teramim_onboarded', '1'); localStorage.setItem('user', JSON.stringify({ id: 't', name: 'Rosi', email: 'r@r.com' })) })
await p.reload({ waitUntil: 'networkidle' })
await p.evaluate(() => { [...document.querySelectorAll('.resp-card-btn')][0]?.click() })
await p.waitForTimeout(800)
await p.screenshot({ path: '_breathe.png' })
const info = await p.evaluate(() => ({
  hasPainting: !!document.querySelector('.breathe-painting svg'),
  hasOverlay: !!document.querySelector('.breathe-sec-overlay'),
  hasImg: !!document.querySelector('.breathe-img'),
  sun: !!document.querySelector('.b-sun'),
  rays: !!document.querySelector('.b-rays'),
  bridge: !!document.querySelector('path[d*="Q 300 272"]')
}))
console.log(JSON.stringify(info))
await b.close()
