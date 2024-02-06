import { Hono } from 'hono'
import qr from 'qrcode'

import { set } from './db'

const app = new Hono()

app.post('/', async (c) => {
  const body = await c.req.json()
  if (!body) return c.json({ error: 'No body' }, 400)

  const { username, url, title, light, dark, permanent } = body

  const required = ['username', 'url', 'title']
  if (required.some((key) => !body[key])) {
    const missing = required.filter((key) => !body[key])
    return c.json({ error: `Missing required fields: ${missing.join(', ')}` }, 400)
  }

  const qrImage = await qr.toString(url, {
    type: 'svg',
    color: {
      light: light || '#ffffff',
      dark: dark || '#000000'
    }
  })

  if (permanent) await set('doulovera', 'site', url)

  return c.json({ svg: qrImage })
})

export default app
