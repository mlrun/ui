import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as React from 'react'

import { cn } from '../../lib/utils'

const Tabs = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) => {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-0', className)}
      {...props}
    />
  )
}

const TabsList = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) => {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'flex w-fit items-center gap-3 bg-transparent border-b border-gray-200',
        className
      )}
      {...props}
    />
  )
}

const TabsTrigger = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) => {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'relative inline-flex select-none items-center justify-center whitespace-nowrap mr-2 pb-1 text-[16px] text-gray-500',
        'hover:text-[#4B4760]',
        'data-[state=active]:text-[#4B4760]',
        "after:content-[''] after:absolute after:-bottom-[1px] after:left-0 after:h-[2px] after:bg-[#869CFF] after:w-0 data-[state=active]:after:w-full",
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:rounded-sm',
        'first:px-4',
        className
      )}
      {...props}
    />
  )
}

const TabsContent = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) => {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none py-6', className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
