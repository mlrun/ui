import { ComponentPropsWithoutRef, ReactNode, useRef, useState } from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { cn } from '../../lib/utils'

type EllipsisTooltipProps = {
  children: ReactNode
  className?: string
} & Omit<ComponentPropsWithoutRef<typeof TooltipContent>, 'children'>

const EllipsisTooltip = ({ children, className, ...tooltipContentProps }: EllipsisTooltipProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isOverflowed, setIsOverflowed] = useState(false)

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsOverflowed(false)
      return
    }
    if (ref.current) setIsOverflowed(ref.current.scrollWidth > ref.current.clientWidth)
  }

  const content = (
    <div ref={ref} className={cn('truncate overflow-hidden text-ellipsis w-full', className)}>
      {children}
    </div>
  )

  return (
    <Tooltip open={isOverflowed} onOpenChange={handleOpenChange}>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent
        className="break-words *:text-white [&_*]:text-white"
        {...tooltipContentProps}
      >
        <div className="select-text">{children}</div>
      </TooltipContent>
    </Tooltip>
  )
}

export default EllipsisTooltip
