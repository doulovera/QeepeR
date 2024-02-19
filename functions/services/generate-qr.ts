import qr from 'qrcode'

type QrOptions = {
  dark: string
  light: string
}
export const generateQr = async (url: string, options?: QrOptions) => {
  const qrImage = await qr.toString(url, {
    type: 'svg',
    color: {
      dark: options?.dark || '#000',
      light: options?.light || '#fff'
    },
    margin: 1
  })

  return qrImage
}
