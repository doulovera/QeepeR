import { FirebaseUser } from "@/types/firebase";

export const normalizeGoogleUser = (user: FirebaseUser) => {
  const { uid, displayName, email, photoURL } = user

  if (!uid || !displayName || !email || !photoURL) return null

  return {
    uid,
    email,
    name: displayName,
    photoUrl: photoURL,
  }
}
