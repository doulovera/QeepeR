import { Button } from '@/components/shared/button'
import { downloadPng, downloadSvg } from '@/utils/download-image'

export function DownloadButton({ svg }: { svg: string | null }) {
  const handleSave = () => {
    if (!svg) return
    // downloadSvg('qr-code', svg)
    downloadPng('qr-code', svg, { scale: 5 })
  }

  return (
    <Button disabled={!svg} onClick={handleSave}>
      <span className="flex justify-center w-full text-center">Download</span>
    </Button>
  )
}
