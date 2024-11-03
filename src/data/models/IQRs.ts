export interface IQRs {
  destinationUrl: string
  userId: string
  disabled: boolean
  views: number | null
  createdAt: FirebaseFirestore.Timestamp
}
