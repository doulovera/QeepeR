import { Card } from '../ui/card'

interface Props {
  svg: string
}
export const QrImage = ({ svg }: Props) => {
  return (
    <Card shadow={false}>
      <div
        data-qr-preview
        className="h-full w-full aspect-square"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: svg is sanitized
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </Card>
  )
}
