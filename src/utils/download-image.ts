'use client'

export function downloadSvg(name: string, svg: string) {
  try {
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name}.svg`
    a.click()
    URL.revokeObjectURL(url)
    return true
  } catch (error) {
    console.error('Error downloading SVG:', error)
    return false
  }
}

type DownloadPngOptions = {
  scale?: number
  size?: number
}
export function downloadPng(
  name: string,
  svg: string,
  { scale = 5, size = 1024 }: DownloadPngOptions = {},
) {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return false

    const img = new Image()
    const svgBlob = new Blob([svg], {
      type: 'image/svg+xml;charset=utf-8',
    })
    const url = URL.createObjectURL(svgBlob)

    img.onload = () => {
      const imageSize = Math.max(
        img.naturalWidth || img.width || 0,
        img.naturalHeight || img.height || 0,
      )
      const outputSize = Math.max(size, imageSize * scale)

      canvas.width = outputSize
      canvas.height = outputSize
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, outputSize, outputSize)
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(img, 0, 0, outputSize, outputSize)

      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = `${name}.png`
      a.click()
      URL.revokeObjectURL(url)
    }
    img.onerror = () => URL.revokeObjectURL(url)
    img.src = url

    return true
  } catch (error) {
    console.error('Error downloading PNG:', error)
    return false
  }
}
