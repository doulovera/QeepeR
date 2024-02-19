import { Redis } from "@upstash/redis/cloudflare"

const UPSTASH_REDIS_REST_URL = "https://us1-fit-cicada-40624.upstash.io"
const UPSTASH_REDIS_REST_TOKEN = "AZ6wACQgNjdmZGI3YzAtN2VjZi00MGU1LTk2ZTAtZWIwZjEzMzVkYWFlMjM1YTc1OTEyODA1NDNlMDhiYTU2NDQ0NGIxZTFiYzI="

const db = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
})

/**
 * Sets a value in the database.
 * @param key - The key of the value.
 * @param value - The value to be set.
 * @returns A Promise that resolves when the value is set.
 */
export const set = async (key: string, value: string) => {
  return db.set(key, value)
}

/**
 * Gets a value from the database.
 * @param key - The key of the value.
 * @returns A Promise that resolves with the value.
 */
export const get = async (key: string) => {
  return db.get(key)
}