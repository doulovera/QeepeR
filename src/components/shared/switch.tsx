'use client'

import { useState } from 'react'

export const Switch = ({
  name,
  label,
  checked,
  onChange,
  description,
  disabled,
}: {
  name?: string
  label?: string
  description?: string
  checked?: boolean
  onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked || false)

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(evt)
    setIsChecked(!isChecked)
  }

  return (
    <label
      className={`relative inline-flex items-center w-full max-w-full my-5 ${disabled ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className="relative">
        <input
          name={name}
          type="checkbox"
          checked={isChecked}
          value=""
          className="sr-only peer"
          disabled={disabled}
          onChange={handleChange}
        />
        <div className="w-20 h-10 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-xl peer peer-checked:after:translate-x-[145%] rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:start-[6px] after:bg-white after:border-gray-300 after:border after:rounded-lg after:w-7 after:h-7 after:transition-all border-gray-600 peer-checked:bg-primary-700" />
      </div>
      <div className="ms-3">
        <span className="text-sm font-bold text-gray-300">{label}</span>
        {description ? <p className="text-xs">{description}</p> : null}
      </div>
    </label>
  )
}
