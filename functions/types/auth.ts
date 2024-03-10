export interface AuthUser {
  name: string,
  picture: string,
  iss: string,
  aud: string,
  auth_time: number,
  user_id: string,
  sub: string,
  iat: number,
  exp: number,
  email: string,
  email_verified: boolean,
  firebase: {
    identities: Record<string, string[]>,
    sign_in_provider: string
  },
  uid: string
}
