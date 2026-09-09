import * as React from 'react'

import { cn } from '../../lib/utils'

function Input({ className, type = 'text', ref, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        `
        flex h-10 w-full
        rounded-md
        border border-solid border-input
        bg-background
        px-3 py-2
        text-base
        placeholder:text-[#C4C2C8]
        disabled:cursor-not-allowed disabled:opacity-50
        file:border-0 file:bg-transparent file:text-sm file:font-medium file:foreground
        md:text-sm
      `,
        className
      )}
      {...props}
    />
  )
}

Input.displayName = 'Input'

export { Input }
