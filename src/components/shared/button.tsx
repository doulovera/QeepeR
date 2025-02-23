interface Props {
  children: React.ReactNode
  title?: string
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  onClick?: () => void
  color?: "primary" | "light" | "negative" | "danger"
  className?: string
  size?: "small" | "medium"
}

export const Button = (
  {
    children,
    title,
    disabled,
    type,
    onClick,
    color = 'primary',
    className = '',
    size = 'medium',
  }: Props
) => {
  const colors = {
    primary: {
      background: "bg-primary-400",
      disabled: "disabled:bg-primary-100",
    },
    light: {
      background: "bg-primary-100",
      disabled: "disabled:bg-primary-100",
    },
    negative: {
      background: "bg-gray-600 text-white",
      disabled: "disabled:bg-primary-100",
    },
    danger: {
      background: "bg-rose-500 text-white",
      disabled: "disabled:bg-primary-100",
    },
  }

  const sizes = {
    smaller: "py-2 px-2 text-xs",
    small: "py-3 px-3 text-xs",
    medium: "py-4 px-4 text-md",
  }

  return (
    <button
      className={`flex cursor-pointer items-center border-2 border-base-400 rounded-base ${colors[color].background} ${colors[color].disabled} ${sizes[size]} font-base shadow-dark transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-dark ${className}`}
      title={title}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
