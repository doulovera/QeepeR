export interface QrObject {
  created: string
  disabled: boolean
  destinationUrl: string
  user: `/users/${string}`
}

export interface DocumentList<T = {}> {
  documents: {
    name: string
    fields: T
    createTime: string
    updateTime: string
  }[]
}
