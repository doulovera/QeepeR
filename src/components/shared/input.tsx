interface Props {
  type?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: any) => void;
  className?: string;
  disabled?: boolean;
  description?: string;
}

export const Input = (
  {
    type = 'text',
    label,
    placeholder,
    value,
    onChange,
    className,
    disabled,
    description,
  }: Props,
) => {
  return (
    <label className="w-full my-5">
      {
        label && (
          <span className="block text-primary-50 mb-2 text-sm font-bold">
            {label}
          </span>
        )
      }
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={
          `px-3 py-4 h-14 w-full rounded-xl ${disabled ? 'bg-gray-700 cursor-not-allowed' : 'bg-primary-800'} ${className}`
        }
        disabled={disabled}
      />

      {
        description 
        ? <p className="ml-1 mt-2 text-xs">{description}</p>
        : null
      }
    </label>
  );
}

const ColorPicker = () => {
  
}
