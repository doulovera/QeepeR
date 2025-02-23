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

export const updateQRUrlInDB = async (key: string, url: string) => {
  try {
    const qr = await QRs.getByAlias(key)
    if (!qr) {
      throw new Error('QR code not found')
    }

    const link = new QRs(key, url, qr.userId)
    await link.update({ destinationUrl: url })

    return true
  } catch (error) {
    console.error('Error updating QR URL: ', error)
    return false
  }
}

export const deleteQRInDB = async (key: string) => {
  try {
    const qr = await QRs.getByAlias(key)
    if (!qr) {
      throw new Error('QR code not found')
    }

    await QRs.deleteByAlias(key, qr.userId)
    return true
  } catch (error) {
    console.error('Error deleting QR code: ', error)
    return false
  }
}
