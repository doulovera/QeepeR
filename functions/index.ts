import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { auth } from './middlewares/auth'

import { generateQr } from './services/generate-qr'
import { createQrLink } from './services/qr-link'

const app = new Hono<{ Bindings: { FIREBASE_PROJECT_ID: string } }>()

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

    const key = await createQrLink(url)

    const appUrl = c.req.url.replace('/perma', '')
    const qrUrl = `${appUrl}/${key}`
    const svg = await generateQr(qrUrl)

    return c.json({ svg })
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// redirection endpoint

export default app
