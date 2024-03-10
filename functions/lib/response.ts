import type { QeeperCtx } from "../types";

export const successPayload = (
  c: QeeperCtx,
  payload: Record<string, any>,
  statusCode: number = 200,
) => {
  return c.json(payload, statusCode);
}

export const errorPayload = (
  c: QeeperCtx,
  error: Record<string, any>,
) => {
  if (error.statusCode === 500) console.error(error);
  return c.json({ type: error.name, success: false, message: error.message }, error.statusCode);
}
