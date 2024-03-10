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

  return c.redirect(qr.url)
})

// endpoint to update url (with validation with firebase to check if it's user's url)
// endpoint to create/delete qr from redis for the disabled/enabled url (with validation with firebase to check if it's user's url)
// endpoint to enable/disable views for the url (with validation with firebase to check if it's user's url)

export default app
