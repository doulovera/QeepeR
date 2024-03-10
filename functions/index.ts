import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { auth } from './middlewares/auth'

import { generateQr } from './utils/generate-qr'
import { createQrLink, getQrLink } from './lib/qr-link'
import { createQrInfoDB, getUserQrListDB } from './lib/firestore'

export type WranglerEnv = {
  FIREBASE_PROJECT_ID: string
  UPSTASH_REDIS_REST_URL: string
  UPSTASH_REDIS_REST_TOKEN: string

  FIREBASE_CLIENT_EMAIL: string
  FIREBASE_PRIVATE_KEYID: string
  FIREBASE_PRIVATE_KEY: string
}

interface AuthUser {
  name: string,
  picture: string,
  iss: string,
  aud: string,
  auth_time: number,
  user_id: string,
  sub: string,
  iat: number,
  exp: number,
  email: string,
  email_verified: boolean,
  firebase: {
    identities: Record<string, string[]>,
    sign_in_provider: string
  },
  uid: string
}

type WranglerVariables = {
  auth: AuthUser
}

export type HonoContext = {
  Bindings: WranglerEnv
  Variables: WranglerVariables
}

const app = new Hono<HonoContext>()

app.use('*', cors())

app.post('/', async (c) => {
  const body = await c.req.json()
  if (!body) return c.json({ error: 'Invalid request' }, 400)

  const { url } = body
  if (!url) return c.json({ error: 'Invalid request' }, 400)

  const svg = await generateQr(url)

  return c.json({ svg })
})

app.use('/list', auth)
app.use('/perma', auth)

app.post('/perma', async (c) => {
  try {
    const body = await c.req?.json()
    if (!body) return c.json({ error: 'Invalid request' }, 400)

    const { url } = body
    if (!url) return c.json({ error: 'Invalid request, missing url' }, 400)

    const key = await createQrLink(c, url)
    
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

app.get('/list', async (c) => {
  try {
    const qrList = await getUserQrListDB(c)
    
    const img = c.req.query('img')

    if (img) {
      const qrListWithQr = await Promise.all(qrList.map(async (qr) => {
        const svg = await generateQr(qr.destinationUrl)
        return { ...qr, svg }
      }))

      return c.json(qrListWithQr)
    }

    return c.json(qrList)
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

// endpoint to update url (with validation with firebase to check if it's user's url)
// endpoint to create/delete qr from redis for the disabled/enabled url (with validation with firebase to check if it's user's url)
// endpoint to enable/disable views for the url (with validation with firebase to check if it's user's url)

export default app
