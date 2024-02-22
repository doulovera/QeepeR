import { FirebaseUser } from "@/types/firebase";

export const normalizeGoogleUser = (user: FirebaseUser) => {
  /// @ts-ignore
  const { uid, displayName, email, photoURL, accessToken } = user

  if (!uid || !displayName || !email || !photoURL) return null

  return {
    uid,
    email,
    name: displayName,
    photoUrl: photoURL,
    accessToken
  }
}
