import type { WranglerEnv } from ".."

import { Redis } from "@upstash/redis/cloudflare"

const db = (url: string, token: string) => new Redis({ url, token })

/**
 * Sets a value in the database.
 * @param c - The context object that includes the environment variables.
 * @param key - The key of the value.
 * @param value - The value to be set.
 * @returns A Promise that resolves when the value is set.
 */
export const set = async (c: { env: WranglerEnv }, key: string, value: string) => {
  return db(c.env.UPSTASH_REDIS_REST_URL, c.env.UPSTASH_REDIS_REST_TOKEN).set(key, value)
}

/**
 * Gets a value from the database.
 * @param c - The context object that includes the environment variables.
 * @param key - The key of the value.
 * @returns A Promise that resolves with the value.
 */
export const get = async (c: { env: WranglerEnv }, key: string): Promise<string | null> => {
  return db(c.env.UPSTASH_REDIS_REST_URL, c.env.UPSTASH_REDIS_REST_TOKEN).get(key)
}