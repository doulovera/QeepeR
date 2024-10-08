import type { KVNamespace } from "@cloudflare/workers-types"
import type { Context } from "hono"
import type { AuthUser } from "./auth"

type WranglerKV = {
  KV: KVNamespace
}

export type WranglerEnv = {
  FIREBASE_PROJECT_ID: string
  UPSTASH_REDIS_REST_URL: string
  UPSTASH_REDIS_REST_TOKEN: string

  FIREBASE_CLIENT_EMAIL: string
  FIREBASE_PRIVATE_KEYID: string
  FIREBASE_PRIVATE_KEY: string
}

type WranglerVariables = {
  auth: AuthUser
}

export type WranglerBindings = WranglerEnv & WranglerKV

export type HonoContext = {
  Bindings: WranglerBindings
  Variables: WranglerVariables
}

export type QeeperCtx = Context<HonoContext>
