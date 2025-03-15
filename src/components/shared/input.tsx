import { Button } from './button'

interface Props {
  type?: string
  label?: string
  placeholder?: string
  value?: string
  onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  disabled?: boolean
  description?: string
  name?: string
  iconBtn?: React.ReactNode
  iconBtnOnClick?: () => void
  required?: boolean
  showIconBtn?: boolean
}

export const Input = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  className,
  disabled,
  description,
  name,
  iconBtn,
  iconBtnOnClick,
  required,
  showIconBtn = true,
}: Props) => {
  return (
    <label className="w-full">
      {label && (
        <span className="block text-primary-50 mb-2 text-sm font-bold">
          {label}
        </span>
      )}
      <div className="block relative">
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="h-16 w-full rounded-base bg-white border-base border-base-400 p-3 font-base ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 outline-none disabled:cursor-not-allowed disabled:opacity-80 disabled:text-gray-800"
          disabled={disabled}
          required={required}
        />

        {iconBtn && showIconBtn ? (
          <span className="absolute right-3 top-0 bottom-1 grid place-content-center my-auto mx-0 animate-pop">
            <Button type="button" onClick={iconBtnOnClick} size="small">
              {iconBtn}
            </Button>
          </span>
        ) : null}
      </div>

      {description ? <p className="ml-1 mt-2 text-xs">{description}</p> : null}
    </label>
  )
}

const ColorPicker = () => {}
