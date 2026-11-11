import type { HonoContext } from './types'

import { Hono } from 'hono'
import { cors } from 'hono/cors'

import codeGenRoutes from './controllers/code.controller'

import { authMiddleware } from './middlewares/auth'

import { getQrLink, isValidDestination, isValidKey, sumView } from './lib/qr-link'

import * as ROUTES from './constants/routes'

const app = new Hono<HonoContext>()

const LANDING_PAGE = 'https://qr.doulo.dev'

// Link previews (WhatsApp, Slack…), crawlers and scripts are not people scanning.
const BOT_UA = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|discord|slack|twitter|linkedin|embedly|skype|curl|wget|python|httpclient|headless/i

/** A small page for whoever scans a QR that no longer leads anywhere (instead of a JSON error). */
const notFoundPage = (lang: string) => {
  const es = /^es\b/i.test(lang.trim())
  const title = es ? 'Este código QR no existe o está pausado' : 'This QR code does not exist or is paused'
  const text = es ? 'Puede que lo hayan pausado o borrado. Vuelve a escanearlo más tarde.' : 'Its owner may have paused or deleted it. Try scanning it again later.'
  return `<!doctype html><html lang="${es ? 'es' : 'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;font:16px/1.5 system-ui,sans-serif;background:#f4f4f0;color:#111;padding:24px}main{max-width:420px;text-align:center}h1{font-size:22px;margin:0 0 8px}p{color:#555;margin:0 0 18px}a{color:#111;font-weight:700}</style>
</head><body><main><h1>${title}</h1><p>${text}</p><a href="${LANDING_PAGE}">QeepeR</a></main></body></html>`
}

app.use('*', cors())
app.use(`${ROUTES.GENERATION}/*`, authMiddleware)

app.route(ROUTES.GENERATION, codeGenRoutes())

app.get('/', (c) => {
  return c.redirect(LANDING_PAGE)
})

app.get('/:key', async (c) => {
  const key = c.req.param('key')
  const lang = c.req.header('Accept-Language') || 'en'
  const notFound = () => {
    c.header('Cache-Control', 'no-store')
    return c.html(notFoundPage(lang), 404)
  }
  if (!isValidKey(key)) return notFound()

  const qr = await getQrLink(c, key)
  // Also refuse anything that is not http(s), even if it was stored before validation existed.
  if (!qr || !isValidDestination(qr)) return notFound()

  // Count the scan after answering, so the redirect is not slowed down.
  // HEAD requests and link previews don't count.
  const ua = c.req.header('User-Agent') || ''
  if (c.req.method === 'GET' && !BOT_UA.test(ua)) {
    const count = sumView(c, { key, qr }).catch((error) => console.error(error))
    try { c.executionCtx.waitUntil(count) } catch { /* outside Workers: let it finish on its own */ }
  }

  // No caching: a changed destination applies on the next scan.
  c.header('Cache-Control', 'no-store')
  return c.redirect(qr, 302)
})

export default app
