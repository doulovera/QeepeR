import type { WranglerBindings } from "../types"

export type QrResponse = string

const db = (c: { env: WranglerBindings }) => c.env.KV

/**
 * Sets a value in the database.
 * @param c - The context object that includes the environment variables.
 * @param key - The key of the value.
 * @param value - The value to be set.
 * @returns A Promise that resolves when the value is set.
 */
export const set = async (c: { env: WranglerBindings }, key: string, value: QrResponse) => {
  try {
    await db(c).put(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

/**
 * Gets a value from the database.
 * @param c - The context object that includes the environment variables.
 * @param key - The key of the value.
 * @returns A Promise that resolves with the value.
 */
export const get = async (c: { env: WranglerBindings }, key: string): Promise<QrResponse | null> => {
  const value = await db(c).get(key)

  return value
    ? JSON.parse(value)
    : null
}

/**
 * Delete a record from the database.
 * @param c - The context object that includes the environment variables.
 * @param key - The key of the value.
 * @returns A Promise that resolves with the value.
 */
export const del = async (c: { env: WranglerBindings }, key: string): Promise<boolean> => {
  await db(c).delete(key)
  return true
}