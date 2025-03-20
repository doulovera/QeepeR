type Props = {
  children: React.ReactNode
  as?: React.ElementType
  shadow?: boolean
  weight?: 'thin' | 'light' | 'normal' | 'bold'
  background?: `bg-${string}`
  componentProps?: Record<string, unknown>
}

export function Card({
  children,
  as: As = 'div',
  shadow = true,
  weight = 'thin',
  background = 'bg-white',
  componentProps = {},
}: Props) {
  const borderWeights = {
    thin: 'border-base',
    light: 'border-2',
    normal: 'border-4',
    bold: 'border-8',
  }
  return (
    <As
      className={`rounded-base ${borderWeights[weight]} ${background} border-base-400 p-2 text-md font-base ${shadow ? 'shadow-dark' : ''}`}
      {...componentProps}
    >
      {children}
    </As>
  )
}
