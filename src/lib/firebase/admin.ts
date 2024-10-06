'server-only'

import { cookies } from 'next/headers'

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const APP_NAME = 'qeeper-firebase'
export const COOKIE_NAME = '__session'

export const firebaseApp = getApps().find((it) => it.name === APP_NAME) ||
  initializeApp(
    { credential: cert(process.env.FIREBASE_SERVICE_ACCOUNT!) },
    APP_NAME,
  )

export const auth = getAuth(firebaseApp)

async function getSessionFromCookies() {
  try {
    return cookies().get(COOKIE_NAME)?.value
  } catch (error) {
    return undefined
  }
}

export async function getUserByCookie(propCookie: string | undefined = undefined) {
  const cookie = propCookie ?? (await getSessionFromCookies())

  if (!cookie) return false

  try {
    const user = await auth.verifySessionCookie(cookie, true)
    return user
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function getUserByToken(token: string) {
  try {
    const isUserAuthenticated = await auth.verifyIdToken(token, true)

    if (!isUserAuthenticated) return null

    const decodedIdToken = await auth.verifySessionCookie(token)
    const currentUser = await auth.getUser(decodedIdToken.uid)

    return currentUser
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export async function createSessionCookie(idToken: string, expiresIn: number) {
  return auth.createSessionCookie(idToken, { expiresIn })
}
