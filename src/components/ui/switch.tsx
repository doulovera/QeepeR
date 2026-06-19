'use client'

import * as SwitchPrimitive from '@radix-ui/react-switch'
import type * as React from 'react'

import { cn } from '@/lib'

type SwitchProps = Omit<
  React.ComponentProps<typeof SwitchPrimitive.Root>,
  'onChange'
> & {
  label?: string
  description?: string
  name?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

function Switch({
  className,
  label,
  description,
  name,
  checked,
  defaultChecked,
  onCheckedChange,
  onChange,
  ...props
}: SwitchProps) {
  const handleCheckedChange = (value: boolean) => {
    onCheckedChange?.(value)
    if (onChange) {
      onChange({
        target: { checked: value, name },
      } as React.ChangeEvent<HTMLInputElement>)
    }
  }

  return (
    <div className="flex items-start gap-3">
      <SwitchPrimitive.Root
        type="button"
        data-slot="switch"
        name={name}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={handleCheckedChange}
        className={cn(
          'peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-base border-2 border-border bg-secondary-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-main data-[state=unchecked]:bg-secondary-background',
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className="pointer-events-none block h-4 w-4 rounded-[3px] border-2 border-border bg-white ring-0 transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1"
        />
      </SwitchPrimitive.Root>
      {(label || description) && (
        <span className="flex flex-col gap-1">
          {label && <span className="font-heading leading-none">{label}</span>}
          {description && (
            <span className="text-sm text-foreground/70">{description}</span>
          )}
        </span>
      )}
    </div>
  )
}

export { Switch }
