import qr from 'qrcode'

type QrOptions = {
  dark: string
  light: string
}
export async function generateQr (url: string, options?: QrOptions) {
  const qrImage = await qr.toString(url, {
    type: 'svg',
    color: {
      dark: options?.dark || '#000',
      light: options?.light || '#fff'
    },
    margin: 0.5
  })

  return qrImage
}
