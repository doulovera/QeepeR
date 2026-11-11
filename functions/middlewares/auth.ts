import type { Context, Next } from "hono";

/** Same-length comparison that takes the same time wherever the first difference is. */
function safeEqual(a: string, b: string) {
  const enc = new TextEncoder()
  const x = enc.encode(a), y = enc.encode(b)
  let diff = x.length ^ y.length
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0)
  return diff === 0
}

export async function authMiddleware (c: Context, next: Next) {
  const TOKEN_KEY = c.env.TOKEN_KEY
  // Without a configured token, nobody gets in.
  if (!TOKEN_KEY) return c.json({ error: 'Unauthorized' }, 401)

  const header = c.req.header('Authorization') || ''
  const token = header.replace(/^Bearer\s+/i, '')
  if (!token || !safeEqual(token, TOKEN_KEY)) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  // Awaited so the route's response (and its errors) go back through Hono.
  await next()
}
