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
      className="flex cursor-pointer items-center rounded-base border-2 border-base-400 bg-primary-400 px-4 py-2 text-md font-base shadow-dark transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-dark"
      title={title}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
