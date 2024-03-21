import type { HonoContext } from './types'

import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { auth } from './middlewares/auth'

import mainRoutes from './controllers/index.controller'
import genRoutes from './controllers/gen.controller'

import { getQrLink } from './lib/qr-link'

import * as ROUTES from './constants/routes'

const app = new Hono<HonoContext>()

app.use('*', cors())
app.use(`${ROUTES.GENERATION}/*`, auth)

app.route('/', mainRoutes())
app.route(ROUTES.GENERATION, genRoutes())

app.get('/:key', async (c) => {
  const key = c.req.param('key')
  if (!key) return c.json({ error: 'Not found' }, 404)

  const qr = await getQrLink(c, key)
  if (!qr) return c.json({ error: 'Not found' }, 404)

  // if not found return 404

  return c.redirect(qr.url)
})

export default app
