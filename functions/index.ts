import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { auth } from './middlewares/auth'

import { generateQr } from './utils/generate-qr'
import { createQrLink, getQrLink, sumView } from './lib/qr-link'

export type WranglerEnv  ={
  FIREBASE_PROJECT_ID: string
  UPSTASH_REDIS_REST_URL: string
  UPSTASH_REDIS_REST_TOKEN: string
}

const app = new Hono<{ Bindings: WranglerEnv }>()

app.use('*', cors())

app.post('/', async (c) => {
  const body = await c.req.json()
  if (!body) return c.json({ error: 'Invalid request' }, 400)

  const { url } = body
  if (!url) return c.json({ error: 'Invalid request' }, 400)

  const svg = await generateQr(url)

  return c.json({ svg })
})

app.use('/perma', auth)
app.post('/perma', async (c) => {
  try {
    const body = await c.req?.json()
    if (!body) return c.json({ error: 'Invalid request' }, 400)

    const { url } = body
    if (!url) return c.json({ error: 'Invalid request, missing url' }, 400)

    // store extra info in firestore

    const key = await createQrLink(c, url)

    const appUrl = c.req.url.replace('/perma', '')
    const qrUrl = `${appUrl}/${key}`
    const svg = await generateQr(qrUrl)

    return c.json({ svg })
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

app.get('/:key', async (c) => {
  const key = c.req.param('key')
  if (!key) return c.json({ error: 'Not found' }, 404)

  const qr = await getQrLink(c, key)
  if (!qr) return c.json({ error: 'Not found' }, 404)

  return c.redirect(qr.url)
})

export default app
