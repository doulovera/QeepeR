import qr from 'qrcode'

export default async function generateQR(request: Request) {
  const { url } = await request.json() as { url: string };

  if (!url) {
    throw new Error("No URL provided");
  }

  const qrImage = await qr.toString(url, {
    type: 'svg',
    color: {
      light: '#fff',
      dark: '#000'
    },
  })

  return qrImage
}