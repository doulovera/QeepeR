type Props = {
  children: React.ReactNode
  as?: React.ElementType
  shadow?: boolean
  soft?: boolean
  weight?: 'light' | 'normal' | 'bold'
}

export function Card({ children, as: As = 'div', shadow = true, soft, weight = 'light' }: Props) {
  const borderWeights = {
    light: 'border-2',
    normal: 'border-4',
    bold: 'border-8',
  }
  return (
    <As
      className={`rounded-base ${borderWeights[weight]} ${soft ? 'border-slate-300' : 'border-base-400'} bg-white p-4 text-md font-base ${shadow ? 'shadow-dark' : ''}`}
    >
      {children}
    </As>
  )
}