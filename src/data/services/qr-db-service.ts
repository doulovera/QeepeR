import { QRs } from "../models/QRs"

export type QRDoc = {
  destinationUrl: string,
  disabled: boolean,
  views: boolean,
  user: string,
  created: string,
}

interface QRInfoCreation {
  url: string,
  uid: string,
}
export const addQR = async (key: string, qr: QRInfoCreation) => {
  try {
    const { url, uid } = qr

    if (!uid) {
      throw new Error('Unauthorized')
    }

    const link = new QRs(key, url, uid)
    await link.save()

    return link
  } catch (error) {
    console.error('Error adding document: ', error)
  }
}

export const listUserQrs = async (uid: string) => {
  try {
    const fetchedQrs = await QRs.getLinksByUser(uid)
    return fetchedQrs
  } catch (error) {
    console.error('Error getting documents: ', error)
  }
}