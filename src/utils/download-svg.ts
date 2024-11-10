'use client'

export const downloadSvg = (name: string, svg: string) => {
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