'server-only'

import { cookies } from 'next/headers'

const COOKIE_NAME = '__session'

export async function getSessionFromCookies() {
  const cookieStore = await cookies()

  return cookieStore.get(COOKIE_NAME)?.value
}

export async function createCookieSession(sessionCookie: string, expiresIn: number) {
  const cookieStore = await cookies()

  cookieStore.set(COOKIE_NAME, sessionCookie, {
    maxAge: expiresIn / 1000, // maxAge is in seconds, expiresIn in ms
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  })
}

export async function deleteCookieSession() {
  const cookieStore = await cookies()

  cookieStore.set(COOKIE_NAME, '', { maxAge: 0 })
}
