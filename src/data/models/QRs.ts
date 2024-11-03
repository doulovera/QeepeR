import type { IQRs } from "./IQRs"

import { firestore } from "firebase-admin"
import { _db } from "@/lib/firebase/admin"
import { QR_COLLECTION, USER_COLLECTION } from "@/constants/collections"

export class QRs implements IQRs {
  alias: string
  destinationUrl: string
  userId: string
  disabled: boolean
  views: number | null
  createdAt: FirebaseFirestore.Timestamp

  constructor(alias: string, destinationUrl: string, userId: string) {
    this.alias = alias
    this.destinationUrl = destinationUrl
    this.userId = userId
    this.disabled = false
    this.views = null
    this.createdAt = firestore.Timestamp.now()
  }

  static collection() {
    return _db.collection(QR_COLLECTION)
  }

  static userLinksCollection(userId: string) {
    return _db.collection(USER_COLLECTION).doc(userId).collection(QR_COLLECTION)
  }

  async save(): Promise<void> {
    const batch = _db.batch()

    const linkRef = QRs.collection().doc(this.alias)
    batch.set(linkRef, {
      destinationUrl: this.destinationUrl,
      userId: this.userId,
      disabled: this.disabled,
      views: this.views,
      createdAt: this.createdAt,
    })

    const userLinkRef = QRs.userLinksCollection(this.userId).doc(this.alias)
    batch.set(userLinkRef, { alias: this.alias })

    await batch.commit()
  }

  static async getByAlias(alias: string): Promise<IQRs | null> {
    const doc = await QRs.collection().doc(alias).get()
    /// @ts-ignore
    return doc.exists ? ({ alias: doc.id, ...doc.data() } as IQRs) : null
  }

  static async getLinksByUser(userId: string): Promise<IQRs[]> {
    const userLinksSnapshot = await QRs.userLinksCollection(userId).get()
    const aliases = userLinksSnapshot.docs.map((doc) => doc.id)

    const linksSnapshot = await QRs.collection()
      .where(firestore.FieldPath.documentId(), "in", aliases)
      .get()
    /// @ts-ignore
    return linksSnapshot.docs.map((doc) => ({ alias: doc.id, ...doc.data() } as IQRs))
  }

  async update(fields: Partial<Pick<IQRs, "destinationUrl" | "disabled" | "views">>): Promise<void> {
    const linkRef = QRs.collection().doc(this.alias)
    await linkRef.update(fields)
  }

  static async deleteByAlias(alias: string, userId: string): Promise<void> {
    const batch = _db.batch()

    const linkRef = QRs.collection().doc(alias)
    batch.delete(linkRef)

    const userLinkRef = QRs.userLinksCollection(userId).doc(alias)
    batch.delete(userLinkRef)

    await batch.commit()
  }
}
