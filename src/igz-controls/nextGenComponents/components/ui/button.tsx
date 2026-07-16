import { Slot } from '@radix-ui/react-slot'
import { TooltipContentProps } from '@radix-ui/react-tooltip'
import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:border disabled:bg-white disabled:text-igz-gray disabled:[&_svg]:text-igz-secondary [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 min-w-[100px] disabled:border-primary',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:border-destructive',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:border-background',
        secondary:
          'border border-solid border-[#ccc] bg-secondary text-secondary-foreground hover:bg-[#483F561F] min-w-[50px] disabled:border-secondary',
        ghost: 'hover:bg-accent hover:text-accent-foreground disabled:border-transparent',
        link: 'text-igz-primary underline-offset-4 hover:underline disabled:border-transparent',
        rounded:
          'rounded-full hover:bg-igz-gray-light [&_svg]:size-[16px] transition-bg duration-300 ease-in-out disabled:border-igz-gray-light'
      },
      size: {
        default: 'h-10 px-4 py-3',
        sm: 'h-9 px-4 py-2.5',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10 p-0 m-0'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants>,
    Omit<TooltipContentProps, keyof React.ButtonHTMLAttributes<HTMLButtonElement>> {
  asChild?: boolean
  tooltip?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, tooltip = '', side = 'top', asChild = false, disabled, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    const buttonEl = (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          tooltip && disabled && 'disabled:pointer-events-auto'
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      />
    )

    if (!tooltip) return buttonEl

    return (
      <Tooltip>
        <TooltipTrigger asChild>{buttonEl}</TooltipTrigger>
        <TooltipContent side={side}>{tooltip}</TooltipContent>
      </Tooltip>
    )
  }
)
Button.displayName = 'Button'

export { Button }
