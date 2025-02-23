type Props = {
  children: React.ReactNode
  as?: React.ElementType
  shadow?: boolean
  weight?: 'light' | 'normal' | 'bold'
  background?: `bg-${string}`
}

export function Card({
  children,
  as: As = 'div',
  shadow = true,
  weight = 'light',
  background = 'bg-white',
}: Props) {
  const borderWeights = {
    light: 'border-2',
    normal: 'border-4',
    bold: 'border-8',
  }
  return (
    <As
      className={`rounded-base ${borderWeights[weight]} ${background} border-base-400 p-2 text-md font-base ${shadow ? 'shadow-dark' : ''}`}
    >
      {children}
    </As>
  )
}
