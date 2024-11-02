import { _db } from "@/lib/firebase/admin"
import { QR_COLLECTION, USER_COLLECTION } from "@/constants/collections"

export type QRDoc = {
  destinationUrl: string,
  disabled: boolean,
  created: string,
  user: string,
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

    const response = await _db.collection(QR_COLLECTION).doc(key).set({
      destinationUrl: url,
      disabled: false,
      created: new Date().toISOString(),
      user: `${USER_COLLECTION}/${uid}`,
    })

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
