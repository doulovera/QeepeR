import { Button } from '@/components/shared/button'
import { ButtonDropdown } from '@/components/shared/button-dropdown'
import { downloadPng, downloadSvg } from '@/utils/download-image'

export function DownloadButton({ svg }: { svg: string | null }) {
  const handleSave = () => {
    if (!svg) return
    // downloadSvg('qr-code', svg)
    downloadPng('qr-code', svg, { scale: 5 })
  }

  return (
    <ButtonDropdown
      disabled={!svg}
      onClick={handleSave}
      options={[
        { label: 'SVG', onClick: () => downloadSvg('qr-code', svg || '') },
        { label: 'PNG', onClick: handleSave },
      ]}
    >
      <span className="flex justify-center w-full text-center">Download</span>
    </ButtonDropdown>
  )
}
