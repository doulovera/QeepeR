const STRING_LENGTH = 8
const CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
// Largest multiple of CHARACTERS.length below 256: bytes above it are skipped so
// every character is equally likely (plain `byte % 62` favors the first ones).
const UNBIASED_LIMIT = 256 - (256 % CHARACTERS.length)

/**
 * Random key for a short link. Uses the Web Crypto CSPRNG (available in
 * Workers) instead of Math.random, so keys can't be predicted from previous
 * ones and listing someone else's QRs by guessing gets much harder.
 */
export const getRandomString = (length: number = STRING_LENGTH) => {
  let result = ''
  while (result.length < length) {
    const bytes = crypto.getRandomValues(new Uint8Array(length * 2))
    for (const byte of bytes) {
      if (byte >= UNBIASED_LIMIT) continue
      result += CHARACTERS[byte % CHARACTERS.length]
      if (result.length === length) break
    }
  }
  return result
}
