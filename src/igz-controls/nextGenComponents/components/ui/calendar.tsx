import * as React from 'react'
import type { DateRange } from 'react-day-picker'
import { DayButton as DayButtonImport, DayPicker, getDefaultClassNames } from 'react-day-picker'

import CalendarChevronSvg from '../../../images/calendar-chevron.svg?react'
import { Button } from '@igz-controls/components/ui/button'
import { cn } from '@igz-controls/lib/utils'
import { getSupportedLocale } from '@igz-controls/utils/date.utils'

type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant']
  singleDate?: boolean
  /**
   * If provided, Calendar will paint the range (middle) and optionally an "active" endpoint.
   */
  range?: DateRange
  /**
   * Which endpoint should be shown as the active circle in this calendar.
   * - "start" paints range.from as a filled circle
   * - "end" paints range.to as a filled circle
   */
  activeRangeSide?: 'start' | 'end'
  /**
   * Caption prefix like "From:" / "To:" (used when captionLayout="label")
   */
  captionPrefix?: string
  /**
   * When true, forces weekday to be a single letter (like the screenshot).
   */
  weekdaySingleLetter?: boolean
}

const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  formatters,
  components,
  range,
  activeRangeSide,
  captionPrefix,
  weekdaySingleLetter = true,
  singleDate = false,
  modifiers,
  modifiersClassNames,
  ...props
}: CalendarProps) => {
  const defaultClassNames = getDefaultClassNames()

  const computedModifiers = React.useMemo(() => {
    const from = range?.from
    const to = range?.to

    const rangeModifiers: Record<string, Date | ((day: Date) => boolean) | undefined> = {}

    if (from && to) {
      rangeModifiers.range_middle = (day: Date) => day > from && day < to
      rangeModifiers.range_from = from
      rangeModifiers.range_to = to
    }

    let active: Record<string, Date | undefined> = {}

    if (activeRangeSide === 'start') {
      active = { active_start: from }
    } else if (activeRangeSide === 'end') {
      active = { active_end: to }
    }

    return {
      ...modifiers,
      ...rangeModifiers,
      ...active
    }
  }, [activeRangeSide, modifiers, range?.from, range?.to])

  const computedModifiersClassNames = React.useMemo(() => {
    return {
      ...modifiersClassNames,
      range_middle: 'rounded-none text-[#869CFF]'
    }
  }, [modifiersClassNames])

  const computedFormatters = React.useMemo(() => {
    const locale = getSupportedLocale()
    return {
      formatMonthDropdown: (date: Date) => date.toLocaleString(locale, { month: 'short' }),
      ...(weekdaySingleLetter
        ? { formatWeekdayName: (d: Date) => d.toLocaleDateString(locale, { weekday: 'narrow' }) }
        : {}),
      ...(captionPrefix
        ? {
            formatCaption: (m: Date) =>
              `${captionPrefix} ${m.toLocaleDateString(locale, { month: 'short', year: 'numeric' })}`
          }
        : {}),
      ...formatters
    }
  }, [captionPrefix, formatters, weekdaySingleLetter])

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      modifiers={computedModifiers}
      modifiersClassNames={computedModifiersClassNames}
      formatters={computedFormatters}
      className={cn(
        'bg-background group/calendar p-0 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      classNames={{
        root: cn(defaultClassNames.root),
        months: cn('relative flex flex-col gap-4 md:flex-row', defaultClassNames.months),
        month: cn('flex w-full flex-col gap-4', defaultClassNames.month),
        nav: cn(
          'absolute inset-x-0 top-0 flex w-full items-start justify-between z-20',
          defaultClassNames.nav
        ),
        button_previous: cn(
          'flex items-center justify-center h-[--cell-size] w-[--cell-size]',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          'flex items-center justify-center h-[--cell-size] w-[--cell-size]',
          defaultClassNames.button_next
        ),
        month_caption: cn(
          'flex h-[--cell-size] w-full items-center justify-center px-5',
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          'flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium',
          defaultClassNames.dropdowns
        ),
        dropdown: cn('bg-popover absolute inset-0 opacity-0', defaultClassNames.dropdown),
        table: 'w-full border-collapse',
        weekdays: cn('flex border-b border-slate-100 pb-2', defaultClassNames.weekdays),
        weekday: cn(
          'text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal',
          defaultClassNames.weekday
        ),
        day: cn(
          'group/day relative aspect-square flex-1 select-none p-0 text-center flex items-center justify-center',
          !singleDate &&
            'has-[button[data-range-start]]:bg-[#869CFF33] has-[button[data-range-end]]:bg-[#869CFF33] has-[button[data-range-middle]]:bg-[#869CFF33]',
          !singleDate &&
            'has-[button[data-range-start]]:rounded-l-full has-[button[data-range-end]]:rounded-r-full',
          !singleDate && 'has-[button[data-selected-single]]:bg-transparent',
          defaultClassNames.day
        ),
        week: cn('flex w-full mt-1', defaultClassNames.week),
        range_start: 'bg-transparent',
        range_middle: 'bg-transparent',
        range_end: 'bg-transparent',
        outside: cn(
          'text-muted-foreground aria-selected:text-muted-foreground',
          defaultClassNames.outside
        ),
        disabled: cn('text-muted-foreground opacity-50', defaultClassNames.disabled),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames
      }}
      components={{
        Root: CalendarRoot,
        DayButton: CalendarDayButton,
        Chevron: CalendarChevron,
        ...components
      }}
      {...props}
    />
  )
}

const CalendarDayButton = ({
  className: btnClassName,
  modifiers: dayModifiers,
  ...rest
}: React.ComponentProps<typeof DayButtonImport>) => {
  const isSelected = dayModifiers.active_start || dayModifiers.active_end || dayModifiers.selected
  const isInRange =
    dayModifiers.range_from ||
    dayModifiers.range_to ||
    dayModifiers.range_middle ||
    dayModifiers.active_start ||
    dayModifiers.active_end

  return (
    <Button
      variant="ghost"
      size="icon"
      data-range-start={dayModifiers.range_from || dayModifiers.active_start || undefined}
      data-range-end={dayModifiers.range_to || dayModifiers.active_end || undefined}
      data-range-middle={dayModifiers.range_middle || undefined}
      data-selected-single={(dayModifiers.selected && !isInRange) || undefined}
      disabled={dayModifiers.outside}
      className={cn(
        'relative flex aspect-square h-8 w-full items-center justify-center p-0 font-normal transition-none z-10 hover:bg-igz-accent-hover',
        isSelected && '!bg-[#869CFF] !text-white rounded-full z-20 hover:!bg-[#869CFF]',
        btnClassName,
        dayModifiers.range_middle && '!text-[#869CFF]'
      )}
      {...rest}
    />
  )
}

type CalendarRootProps = React.HTMLAttributes<HTMLDivElement> & {
  rootRef?: React.Ref<HTMLDivElement>
}

const CalendarChevron = ({
  orientation,
  className
}: {
  className?: string
  orientation?: 'up' | 'down' | 'left' | 'right'
}) => (
  <CalendarChevronSvg
    className={cn('text-[#7F7989]', orientation === 'left' && 'rotate-180', className)}
  />
)

const CalendarRoot = ({ className, rootRef, ...rest }: CalendarRootProps) => {
  return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...rest} />
}

export { Calendar }
