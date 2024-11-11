import { Card } from "./card"

type Sizes = "small" | "medium" | "large"

interface Props {
  svg: string
  size?: Sizes
}
export const QrImage = ({ svg, size = 'medium' }: Props) => {
  return (
    <Card shadow={false}>
      <div className="h-64 w-64" dangerouslySetInnerHTML={{ __html: svg }} />
    </Card>
  )
}