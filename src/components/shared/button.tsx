interface Props {
  children: React.ReactNode
  title?: string
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  onClick?: () => void
  color?: "primary" | "light"
}

export const Button = (
  { children, title, disabled, type, onClick, color = 'primary' }: Props
) => {
  const colors = {
    primary: {
      background: "bg-primary-400",
      disabled: "disabled:bg-primary-100",
    },
    light: {
      background: "bg-primary-100",
      disabled: "disabled:bg-primary-100",
    }
  }

  return (
    <button
      className={`flex cursor-pointer items-center rounded-base border-2 border-base-400 ${colors[color].background} ${colors[color].disabled} px-4 py-2 text-md font-base shadow-dark transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-dark`}
      title={title}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
