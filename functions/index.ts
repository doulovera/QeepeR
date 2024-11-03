import type { HonoContext } from './types'

import { Hono } from 'hono'
import { cors } from 'hono/cors'

import mainRoutes from './controllers/index.controller'
import codeGenRoutes from './controllers/code.controller'

import { authMiddleware } from './middlewares/auth'

import { getQrLink } from './lib/qr-link'

import * as ROUTES from './constants/routes'

const app = new Hono<HonoContext>()

app.use('*', cors())
app.use(`${ROUTES.GENERATION}/*`, authMiddleware)

app.route('/', mainRoutes())
app.route(ROUTES.GENERATION, codeGenRoutes())

app.get('/:key', async (c) => {
  const key = c.req.param('key')
  if (!key) return c.json({ error: 'Not found' }, 404)

  const qr = await getQrLink(c, key)
  if (!qr) return c.json({ error: 'Not found' }, 404)
  // TODO: add not found return 404 or redirect to main page
  // TODO: sumView here
  return c.redirect(qr)
})

export default app
