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
}
export function downloadPng(
  name: string,
  svg: string,
  { scale }: DownloadPngOptions = {},
) {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return false

    const img = new Image()
    img.src = `data:image/svg+xml;base64,${btoa(svg)}`
    img.onload = () => {
      canvas.width = img.width * (scale || 1)
      canvas.height = img.height * (scale || 1)
      ctx.drawImage(img, 0, 0)

      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = `${name}.png`
      a.click()
    }

    return true
  } catch (error) {
    console.error('Error downloading PNG:', error)
    return false
  }
}
