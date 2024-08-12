import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'

export async function logInWithGoogle (): Promise<boolean> {
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

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message)
    }

    return data.success
  } catch (error) {
    console.error(error) 
    return false
  }
}

export async function logOut (): Promise<void> {
  try {
    // fetch('/api/auth/logout', {
  } catch (error) {
    console.error(error)
    
  }
}
