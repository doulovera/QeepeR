type Sizes = "small" | "medium" | "large"

interface Props {
  svg: string
  size?: Sizes
}
export const QrImage = ({ svg, size = 'medium' }: Props) => {
  const sizes: Record<Sizes, string> = {
    small: "h-40 w-40",
    medium: "h-60 w-60",
    large: "h-80 w-80",
  }
  return (
    <div className={`${sizes[size]} bg-white rounded-md mx-auto overflow-hidden`}>
      <div dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  )
}