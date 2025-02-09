'use client'

import { useState } from 'react'

export const Switch = ({
  name,
  label,
  checked = false,
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
  const [isChecked, setIsChecked] = useState<boolean>(checked)

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = !isChecked
    setIsChecked(newValue)
    if (onChange) onChange(evt)
  }

  return (
    <label
      className={`relative inline-flex items-center w-full max-w-full ${disabled ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className="relative flex items-center">
        <input
          name={name}
          type="checkbox"
          checked={isChecked}
          className="sr-only peer disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
          onChange={handleChange}
        />
        <div
          className="peer inline-flex items-center shrink-0 h-6 w-12 rounded-full border-2 border-base-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 peer-checked:bg-primary-400 bg-primary-100 cursor-pointer peer-checked:after:translate-x-[130%] rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[4px] after:start-[6px] after:bg-white after:border-black after:border-2 after:rounded-lg after:h-4 after:w-4 after:transition-all"
        />
      </div>
      <div className="ms-3">
        <span className="text-sm font-bold">{label}</span>
        {description ? <p className="text-xs">{description}</p> : null}
      </div>
    </label>
  )
}
