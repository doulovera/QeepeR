import { Button } from "./button";

interface Props {
  type?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: any) => void;
  className?: string;
  disabled?: boolean;
  description?: string;
  name?: string;
  iconBtn?: React.ReactNode;
  iconBtnOnClick?: () => void;
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
    name,
    iconBtn,
    iconBtnOnClick,
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
      <div className="block relative">
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={
            `px-3 py-4 h-14 w-full rounded-xl ${disabled ? 'bg-gray-700 cursor-not-allowed text-gray-200' : 'bg-primary-800'} ${className}`
          }
          disabled={disabled}
        />

        {
          iconBtn
            ? (
              <span className="absolute right-2 top-0 bottom-0 grid place-content-center my-auto mx-0">
                <Button
                  type="button"
                  onClick={iconBtnOnClick}
                  className="bg-primary-950 hover:bg-primary-900"
                >
                  {iconBtn}
                </Button>
              </span>
            )
            : null
        }
      </div>

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
