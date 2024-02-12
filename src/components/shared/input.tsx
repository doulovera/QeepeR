export const Input = (
  {
    type = 'text',
    label,
    placeholder,
    value,
    onChange,
    className,
    disabled,
  }: {
    type?: string;
    label?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: any) => void;
    className?: string;
    disabled?: boolean;
  },
) => {
  return (
    <label className="w-full">
      {
        label && (
          <span className="block text-primary-50 mb-2 text-sm font-medium">
            {label}
          </span>
        )
      }
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`px-3 py-4 h-14 w-full rounded-xl ${disabled ? 'bg-gray-700' : 'bg-primary-800'} ${className}`}
        disabled={disabled}
      />
    </label>
  );
}