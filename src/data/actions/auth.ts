import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'

export async function logInWithGoogle (): Promise<void> {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)

    if (!result) {
      throw new Error('Failed to log in with Google')
    }

    const idToken = await result.user.getIdToken()

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken })
    })

    const data: { success: boolean, message: string } = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    window.location.reload()
  } catch (error) {
    console.error(error)
  }
}

export async function logOut (): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    window.location.reload()
  } catch (error) {
    console.error(error)
  }
}

