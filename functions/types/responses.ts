import { QrObject } from "./firestore";

export interface GetQrInfoResponse extends QrObject {
  id: string
  image: false | string
  length: number
  page: number
  next: string | null
  previous: string | null
}