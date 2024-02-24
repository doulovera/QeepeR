import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { auth } from './middlewares/auth'

import { generateQr } from './utils/generate-qr'
import { createQrLink, getQrLink } from './lib/qr-link'
import { createQrInfoDB } from './lib/firestore'

export type WranglerEnv  ={
  FIREBASE_PROJECT_ID: string
  UPSTASH_REDIS_REST_URL: string
  UPSTASH_REDIS_REST_TOKEN: string

  FIREBASE_CLIENT_EMAIL: string
  FIREBASE_PRIVATE_KEYID: string
  FIREBASE_PRIVATE_KEY: string
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

app.get('/:key', async (c) => {
  const key = c.req.param('key')
  if (!key) return c.json({ error: 'Not found' }, 404)

  const qr = await getQrLink(c, key)
  if (!qr) return c.json({ error: 'Not found' }, 404)

  return c.redirect(qr.url)
})

app.use('/perma', auth)
app.post('/perma', async (c) => {
  try {
    const body = await c.req?.json()
    if (!body) return c.json({ error: 'Invalid request' }, 400)

    const { url } = body
    if (!url) return c.json({ error: 'Invalid request, missing url' }, 400)

    const key = await createQrLink(c, url)
    
    /// @ts-ignore ** TODO **
    await createQrInfoDB(c, { key, destinationUrl: url })

    const appUrl = c.req.url.replace('/perma', '')
    const qrUrl = `${appUrl}/${key}`
    const svg = await generateQr(qrUrl)

    return c.json({ svg })
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// endpoint to update url (with validation with firebase to check if it's user's url)
// endpoint to create/delete qr from redis for the disabled/enabled url (with validation with firebase to check if it's user's url)
// endpoint to enable/disable views for the url (with validation with firebase to check if it's user's url)

export default app
