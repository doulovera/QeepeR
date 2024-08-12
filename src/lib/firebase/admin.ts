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
    console.log('🟡🟡🟡 getSessionFromCookies')
    return undefined
  }
}

export async function getIsUserAuthenticated(propSession: string | undefined = undefined) {
  const session = propSession ?? (await getSessionFromCookies())

  if (!session) return false

  try {
    const isNotRevoked = await auth.verifyIdToken(session, true)
    return isNotRevoked
  } catch (error) {
    console.error(error)
    return false
  }
}

export async function getCurrentUser() {
  try {
    const session = await getSessionFromCookies()

    const isUserAuthenticated = await getIsUserAuthenticated(session)

    if (!isUserAuthenticated || !session) return null

    const decodedIdToken = await auth.verifySessionCookie(session)
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
