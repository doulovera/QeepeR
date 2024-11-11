type Props = {
  children: React.ReactNode
  as?: React.ElementType
  shadow?: boolean
}

export function Card({ children, as: As = 'div', shadow = true }: Props) {
  return (
    <As
      className={`rounded-base border-2 border-base-400 bg-white p-4 text-md font-base ${shadow ? 'shadow-dark' : ''}`}
    >
      {children}
    </As>
  )
}