import { _db } from "@/lib/firebase/admin"
import { QR_COLLECTION, USER_COLLECTION } from "@/constants/collections"

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

    const qrDocValues: QRDoc = {
      destinationUrl: url,
      disabled: false,
      created: new Date().toISOString(),
      user: `${USER_COLLECTION}/${uid}`,
      views: false,
    }

    const response = await _db.collection(QR_COLLECTION).doc(key).set(qrDocValues)

    await addQRToUserList(key, uid)

    return response
  } catch (error) {
    console.error('Error adding document: ', error)
  }
}

export const addQRToUserList = async (key: string, uid: string) => {
  try {
    const response = await _db
      .collection(USER_COLLECTION)
      .doc(uid)
      .collection(QR_COLLECTION)
      .doc(key)
      .set({
        qr: `${QR_COLLECTION}/${key}`,
      })

    return response
  } catch (error) {
    console.error('Error adding document: ', error)
  }
}
