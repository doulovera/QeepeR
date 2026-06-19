import { Slot } from '@radix-ui/react-slot'
import type { ComponentProps, ElementType } from 'react'

import { cn } from '@/lib'

type ButtonVariant = 'default' | 'neutral' | 'noShadow' | 'reverse' | 'destructive'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'small' | 'medium'
type LegacyColor = 'primary' | 'light' | 'negative' | 'danger'

const variants: Record<ButtonVariant, string> = {
  default:
    'border-2 border-border bg-main text-main-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none',
  noShadow: 'border-2 border-border bg-main text-main-foreground',
  neutral:
    'border-2 border-border bg-secondary-background text-foreground shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none',
  reverse:
    'border-2 border-border bg-main text-main-foreground hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-shadow',
  destructive:
    'border-2 border-border bg-rose-500 text-white shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none',
}

const legacyColorVariants: Record<LegacyColor, ButtonVariant> = {
  primary: 'default',
  light: 'neutral',
  negative: 'neutral',
  danger: 'destructive',
}

const sizes: Record<ButtonSize, string> = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3',
  small: 'h-9 px-3 text-xs',
  medium: 'h-12 px-4 text-md',
  lg: 'h-11 px-8',
  icon: 'size-10',
}

type ButtonProps = ComponentProps<'button'> & {
  asChild?: boolean
  color?: LegacyColor
  variant?: ButtonVariant
  size?: ButtonSize
}

function Button({
  className,
  color,
  variant = 'default',
  size = 'default',
  asChild = false,
  type,
  ...props
}: ButtonProps) {
  const Comp = (asChild ? Slot : 'button') as ElementType
  const resolvedVariant = color ? legacyColorVariants[color] : variant

  return (
    <Comp
      type={asChild ? undefined : type || 'button'}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-base text-sm font-base ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-shadow [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        variants[resolvedVariant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}

export { Button }
