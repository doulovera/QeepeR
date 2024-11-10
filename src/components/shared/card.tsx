type Props = {
  children: React.ReactNode
  as?: React.ElementType
}

export function Card({ children, as: As = 'div' }: Props) {
  return (
    <As className="rounded-base border-2 border-base-400 bg-white p-4 text-md font-base shadow-dark">
      {children}
    </As>
  )
}