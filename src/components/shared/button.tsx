interface Props {
  children: React.ReactNode
  title?: string
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  onClick?: () => void
}

export const Button = ({ children, title, disabled, type, onClick }: Props) => {
  return (
    <button
      className={`text-white px-4 py-2 rounded-md ${disabled ? 'bg-gray-700 cursor-not-allowed opacity-70' : 'bg-primary-800'}`}
      title={title}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
