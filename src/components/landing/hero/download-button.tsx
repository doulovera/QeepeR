import { Button } from '@/components/ui/button'
import { downloadPng } from '@/utils/download-image'

interface Props {
  svg: string | null
  disabled?: boolean
  size?: 'small'
}

export function DownloadButton({ svg, disabled, size }: Props) {
  const handleSave = () => {
    if (!svg) return
    downloadPng('qr-code', svg, { scale: 5 })
  }

  return (
    <Button
      disabled={!svg || disabled}
      onClick={handleSave}
      size={size || 'default'}
    >
      <span className="flex justify-center w-full text-center">Download</span>
    </Button>
  )
}
