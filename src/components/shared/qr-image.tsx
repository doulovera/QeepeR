import { Card } from "./card"

interface Props {
  svg: string
}
export const QrImage = ({ svg }: Props) => {
  return (
    <Card shadow={false} weight="normal" soft>
      <div className="h-full w-full aspect-square" dangerouslySetInnerHTML={{ __html: svg }} />
    </Card>
  )
}