import { WORKER_BASE_URL } from "@/constants/app";

export function getWorkerUrl(urlPath: string) {
  let base = WORKER_BASE_URL
  if (!WORKER_BASE_URL) base = process.env.NEXT_PUBLIC_WORKER_URL
  return `${base}/${urlPath || ''}`
}