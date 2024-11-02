import type { Context } from "hono";

export async function authMiddleware (c: Context, next: () => void) {
  const token = c.req.header('Authorization')
  if (!token) return c.json({ error: 'Unauthorized' }, 401)
    
    const TOKEN_KEY = c.env.TOKEN_KEY

  if (token.replace('Bearer ', '') !== TOKEN_KEY) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  return next()
}