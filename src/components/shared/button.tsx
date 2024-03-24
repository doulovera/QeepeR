interface Props {
  children: React.ReactNode
  title?: string
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  onClick?: () => void
  className?: string
}

export const Button = ({ children, title, disabled, type, onClick, className }: Props) => {
  return (
    <button
      className={`
        text-white px-3 py-2 rounded-md 
        ${
          disabled
            ? 'bg-gray-700 cursor-not-allowed opacity-70'
            : 'bg-primary-800 hover:bg-primary-700 hover:shadow-lg'
        }
        ${className}
      `}
      title={title}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
