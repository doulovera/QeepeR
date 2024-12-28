import type firebase from 'firebase/compat/app'

export const transformTimestamp = (timestamp: firebase.firestore.Timestamp) => {
  if (!timestamp) return ''
  return timestamp.toDate().toString()
}
