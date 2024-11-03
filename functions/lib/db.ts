import type { WranglerBindings } from "../types"

export type QrResponse = string

const db = (c: { env: WranglerBindings }) => c.env.KV

const VIEWS_PREFIX = 'views:'

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


export const getViews = async (c: { env: WranglerBindings }, key: string): Promise<number | null> => {
  const value = await db(c).get(VIEWS_PREFIX + key)

  if (!value || value === 'null') {
    return null
  }

  return parseInt(value)
}

export const incrementViews = async (c: { env: WranglerBindings }, key: string): Promise<number | null> => {
  const views = await getViews(c, key)

  const viewsKey = VIEWS_PREFIX + key
  if (views === null) return views

  const newViews = views ?? 1
  await set(c, viewsKey, newViews.toString())

  return newViews
}

export const toggleViews = async (c: { env: WranglerBindings }, key: string): Promise<number | null> => {
  const viewsKey = VIEWS_PREFIX + key
  
  const views = await getViews(c, key)

  // if it's null (disabled), set it to 0
  if (views === null) {
    await set(c, viewsKey, '0')
    return 0
  }

  // if it's a number, set it to null
  await set(c, viewsKey, 'null')
  return null
}
