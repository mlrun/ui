import { ReactNode, useEffect, useRef, useState } from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from '@igz-controls/components/ui/tooltip'
import { cn } from '@igz-controls/lib/utils'

type EllipsisTooltipProps = {
  children: ReactNode
  className?: string
}

const EllipsisTooltip = ({ children, className }: EllipsisTooltipProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isOverflowed, setIsOverflowed] = useState(false)

  useEffect(() => {
    const text = ref.current
    if (!text) return
    setIsOverflowed(text.scrollWidth > text.clientWidth)
  }, [children])

  const content = (
    <div ref={ref} className={cn('truncate overflow-hidden text-ellipsis w-full', className)}>
      {children}
    </div>
  )

  if (!isOverflowed) return content

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent className="break-words *:text-white [&_*]:text-white">
        <div className="select-text">{children}</div>
      </TooltipContent>
    </Tooltip>
  )
}

export default EllipsisTooltip
