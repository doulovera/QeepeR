import { GoogleAuthProvider, browserLocalPersistence, onAuthStateChanged, setPersistence, signInWithRedirect, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { normalizeGoogleUser } from '@/utils/normalizeAuthUser'
import { User } from '@/types/user'

export const logInWithGoogle = async () => {
  await setPersistence(auth, browserLocalPersistence)

  const provider = new GoogleAuthProvider()
  return signInWithRedirect(auth, provider)
}

export const logOut = async () => {
  await signOut(auth)
  return null
}

export const onAuthChanged = (onChange: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    const normalizedUser = user ? normalizeGoogleUser(user) : null
    onChange(normalizedUser)
  })
}
