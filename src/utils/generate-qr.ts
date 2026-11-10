import qr, { type QRCodeErrorCorrectionLevel } from 'qrcode'

type QrOptions = {
  dark?: string
  light?: string
  size?: number
  margin?: number
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel
}

function qrOptions(options?: QrOptions) {
  return {
    color: {
      dark: options?.dark || '#000',
      light: options?.light || '#fff',
    },
    margin: options?.margin ?? 0.5,
    width: options?.size,
    errorCorrectionLevel: options?.errorCorrectionLevel,
  }
}

export async function generateQr(content: string, options?: QrOptions) {
  return qr.toString(content, { ...qrOptions(options), type: 'svg' })
}

/** A data URL keeps this utility usable by both browser and Node callers. */
export async function generateQrPng(content: string, options?: QrOptions) {
  return qr.toDataURL(content, { ...qrOptions(options), type: 'image/png' })
}

/** Smallest width qrcode can honor: one pixel per module plus the margin. */
export function getMinQrSize(content: string, options?: QrOptions) {
  const { margin, errorCorrectionLevel } = qrOptions(options)
  const modules = qr.create(content, { errorCorrectionLevel }).modules.size
  return Math.ceil(modules + margin * 2)
}
