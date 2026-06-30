import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '@igz-controls/lib/utils'

interface CheckboxProps extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  loading?: boolean
}

const Checkbox = ({ className, loading = false, disabled, ...props }: CheckboxProps) => {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer border border-solid border-[#869CFF] dark:bg-input/30',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        'size-4 shrink-0 rounded-[2px] shadow-xs transition-shadow outline-none focus-visible:ring-[1px]',
        'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary dark:data-[state=checked]:bg-primary',
        'disabled:cursor-not-allowed disabled:border-[#ADABB0] disabled:data-[state=checked]:bg-[#ADABB0] disabled:data-[state=checked]:border-[#ADABB0]',
        loading && !disabled && 'opacity-50 pointer-events-none',
        className
      )}
      {...props}
      disabled={disabled}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
