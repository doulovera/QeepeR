'server-only'

import { cookies } from 'next/headers'

const COOKIE_NAME = '__session'

export async function getSessionFromCookies() {
  cookies().get(COOKIE_NAME)?.value
}

export async function createCookieSession(sessionCookie: string, expiresIn: number) {
  cookies().set(COOKIE_NAME, sessionCookie, {
    maxAge: expiresIn,
    httpOnly: true,
    secure: true,
  })
}

export async function deleteCookieSession() {
  cookies().set(COOKIE_NAME, '', { maxAge: 0 })
}
