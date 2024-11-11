'use server'

import { _auth } from "@/lib/firebase/admin"
import { createCookieSession, deleteCookieSession, getSessionFromCookies } from "@/data/services/session-service"

export async function getUserByCookie(propCookie: string | undefined = undefined) {
  const cookie = propCookie ?? (await getSessionFromCookies())

  if (!cookie) return false

  try {
    const user = await _auth.verifySessionCookie(cookie, true)
    return user
  } catch (error) {
    switch ((error as Error & { code: string }).code) {
      case 'auth/popup-closed-by-user':
      case 'auth/cancelled-popup-request':
        console.log('User closed the login popup') // catch this error properly
        return false
      case 'auth/session-cookie-expired':
        await deleteCookieSession()
        return false
    }

    console.error(error)
    return false
  }
}

export async function getUserByToken(token: string) {
  try {
    const isUserAuthenticated = await _auth.verifyIdToken(token, true)

    if (!isUserAuthenticated) return null

    const decodedIdToken = await _auth.verifySessionCookie(token)
    const currentUser = await _auth.getUser(decodedIdToken.uid)

    return currentUser
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export async function createSession(idToken: string) {
  const expiresIn  = 60 * 60 * 24 * 5 * 1000 // 5 days
  const sessionCookie = await _auth.createSessionCookie(idToken, { expiresIn })
  await createCookieSession(sessionCookie, expiresIn)
}
