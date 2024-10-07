'server-only'

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

import { FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID } from '@/constants/firebase'

const APP_NAME = 'qeeper-firebase'

export const firebaseApp = getApps().find((it) => it.name === APP_NAME) ||
  initializeApp(
    {
      credential: cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY
      })
    },
    APP_NAME,
  )

export const _auth = getAuth(firebaseApp)
