export interface IApiKey {
  uid: string
  name: string
  hash: string
  prefix: string
  createdAt: FirebaseFirestore.Timestamp
  lastUsedAt: FirebaseFirestore.Timestamp | null
  revokedAt: FirebaseFirestore.Timestamp | null
}

// Only display metadata crosses the server-action boundary.
export interface ClientApiKey {
  id: string
  name: string
  prefix: string
  createdAt: string
  lastUsedAt: string | null
  revokedAt: string | null
}
