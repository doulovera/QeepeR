import { Button, type ButtonProps } from './button'

interface Props extends ButtonProps {
  options: { label: string; onClick: () => void }[]
}

export function ButtonDropdown({ options, ...buttonProps }: Props) {
  return (
    <div className="flex gap-2">
      <Button {...buttonProps}>{buttonProps.children}</Button>

      <div>
        {options.map((option, index) => (
          <button key={index} type="button" onClick={option.onClick}>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
