import { Hono } from 'hono'
import { cors } from 'hono/cors'

import qr from 'qrcode'

const app = new Hono()

app.use('*', cors())

app.post('/', async (c) => {
  const body = await c.req.json()
  if (!body) return c.json({ error: 'Invalid request' }, 400)

  const { url } = body
  
  const qrImage = await qr.toString(url, {
    type: 'svg',
    color: {
      dark: '#000',
      light: '#fff'
    },
    margin: 1
  })

  return c.json({ svg: qrImage })
})

export default app
