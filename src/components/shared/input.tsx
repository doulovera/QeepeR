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
  required?: boolean;
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
    required,
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
            `h-14 w-full rounded-base bg-white border-2 border-base-400 p-3 font-base ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 outline-none`
          }
          disabled={disabled}
          required={required}
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
