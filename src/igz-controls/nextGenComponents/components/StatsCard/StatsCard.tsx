import { type FunctionComponent, type ReactNode, type SVGProps } from 'react'

import Clock from '../../../images/clock.svg?react'
import { Card, CardContent, CardHeader, CardTitle } from '@igz-controls/components'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@igz-controls/components/ui/tooltip'
import { STATS_CARD_TIMESTAMP } from '@igz-controls/constants'
import { cn } from '@igz-controls/lib/utils'

type StatsCardProps = {
  children: ReactNode
  className?: string
  variant?: 'default' | 'compact'
  onClick?: () => void
}

const StatsCardBase = ({
  children,
  className,
  variant = 'default',
  onClick
}: Readonly<StatsCardProps>) => {
  return (
    <Card
      className={cn(
        'border bg-card text-card-foreground',
        variant === 'default' && 'flex-1 rounded-lg shadow-stat-card',
        variant === 'compact' && 'rounded-md w-fit',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Card>
  )
}

type HeaderProps = {
  children?: ReactNode
  title?: string
  icon?: FunctionComponent<SVGProps<SVGSVGElement>>
  showTimestamp?: boolean
  timestampLabel?: string
}

const Header = ({
  children,
  title,
  icon: Icon,
  showTimestamp = true,
  timestampLabel = STATS_CARD_TIMESTAMP
}: Readonly<HeaderProps>) => {
  return (
    <CardHeader className="flex justify-between items-center gap-x-2 flex-row pt-4 px-5">
      <CardTitle className="flex items-center gap-x-1 text-[15px] capitalize font-medium leading-[normal]">
        {Icon && <Icon className="shrink-0 w-4 h-4" />}
        <span>{title}</span>
      </CardTitle>
      {showTimestamp && (
        <span className="flex items-center gap-x-1 text-xs text-[#7F7989] truncate max-[1300px]:hidden group-data-[pinned=false]/sidebar-wrapper:max-[1300px]:flex group-data-[pinned=false]/sidebar-wrapper:max-[1100px]:hidden">
          <Clock className="h-2.5 w-2.5" />
          {timestampLabel}
        </span>
      )}
      {children}
    </CardHeader>
  )
}

type RowProps = {
  children: ReactNode
}

const Row = ({ children }: Readonly<RowProps>) => {
  return <div className="flex items-baseline justify-between px-5">{children}</div>
}

type MainCounterProps = {
  children: ReactNode
  className?: string
  id?: string
  onClick?: () => void
}

const MainCounter = ({ children, className, id, onClick }: Readonly<MainCounterProps>) => {
  return (
    <CardContent
      className={cn('flex justify-center pb-12 text-[27px] font-bold', className)}
      data-testid={id}
      onClick={onClick}
    >
      {children}
    </CardContent>
  )
}

type SecondaryCounterProps = {
  children: ReactNode
  className?: string
}

const SecondaryCounter = ({ children, className }: Readonly<SecondaryCounterProps>) => {
  return <div className={cn('text-[15px] font-medium', className)}>{children}</div>
}

type DetailsProps = {
  children: ReactNode
  className?: string
}

const Details = ({ children, className }: Readonly<DetailsProps>) => {
  return (
    <div
      className={cn(
        'mt-4 max-[1250px]:hidden group-data-[pinned=false]/sidebar-wrapper:max-[1250px]:block group-data-[pinned=false]/sidebar-wrapper:max-[1100px]:hidden',
        className
      )}
    >
      {children}
    </div>
  )
}

type CompactProps = {
  icon?: FunctionComponent<SVGProps<SVGSVGElement>>
  value: ReactNode
  tooltipLabel?: string
  className?: string
}

const Compact = ({ icon: Icon, value, tooltipLabel, className }: Readonly<CompactProps>) => {
  return (
    <div className={cn('flex items-center gap-x-2 px-4 py-2.5', className)}>
      {Icon && tooltipLabel ? (
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger type="button" className="cursor-default">
              <Icon className="shrink-0 w-5 h-5" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltipLabel}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        Icon && <Icon className="shrink-0 w-5 h-5" />
      )}
      <span className="text-xl font-semibold leading-none">{value}</span>
    </div>
  )
}

const StatsCard = Object.assign(StatsCardBase, {
  Header,
  Row,
  MainCounter,
  SecondaryCounter,
  Details,
  Compact
})

export default StatsCard
