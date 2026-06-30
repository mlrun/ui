import { useCallback, useEffect, useState } from 'react'
import type { DateRange } from 'react-day-picker'

import {
  MaskedInput,
  isMaskComplete,
  type MaskItem
} from '@igz-controls/components/CustomRangePicker/MaskedInput'
import { TimePickerInput } from '@igz-controls/components/CustomRangePicker/TimePickerInput'
import { Calendar } from '@igz-controls/components/ui/calendar'
import { cn } from '@igz-controls/lib/utils'
import {
  formatLocalDate,
  getDatePlaceholder,
  getSupportedLocale,
  parseLocalDate
} from '@igz-controls/utils/date.utils'

type Props = {
  label: string
  side: 'start' | 'end'
  dateValue?: Date
  range?: DateRange
  hourValue: string
  singleDate?: boolean
  onHourChange: (value: string) => void
  onSelectDate: (selectedDate?: Date) => void
}

const PLACEHOLDER_CHAR = '_' as const

const buildLocalDateMask = (): ((value: string) => MaskItem[]) => {
  const isUS = getSupportedLocale() === 'en-US'

  if (isUS) {
    return (value: string): MaskItem[] => {
      const monthFirst = value[0]
      const dayFirst = value[3]
      return [
        /[0-1]/,
        monthFirst === '1' ? /[0-2]/ : /\d/,
        '/',
        /[0-3]/,
        dayFirst === '3' ? /[0-1]/ : /\d/,
        '/',
        /[1-2]/,
        /\d/,
        /\d/,
        /\d/
      ]
    }
  }

  return (value: string): MaskItem[] => {
    const dayFirst = value[0]
    const monthFirst = value[3]
    return [
      /[0-3]/,
      dayFirst === '3' ? /[0-1]/ : /\d/,
      '/',
      /[0-1]/,
      monthFirst === '1' ? /[0-2]/ : /\d/,
      '/',
      /[1-2]/,
      /\d/,
      /\d/,
      /\d/
    ]
  }
}

const dateMask = buildLocalDateMask()
const datePlaceholder = getDatePlaceholder()

export const DateTimePickerPanel = ({
  label,
  side,
  dateValue,
  range,
  hourValue,
  singleDate,
  onHourChange,
  onSelectDate
}: Props) => {
  const [maskedDate, setMaskedDate] = useState(dateValue ? formatLocalDate(dateValue) : '')
  const [displayedMonth, setDisplayedMonth] = useState<Date>(dateValue ?? new Date())

  useEffect(() => {
    setMaskedDate(dateValue ? formatLocalDate(dateValue) : '')
    if (dateValue) {
      setDisplayedMonth(dateValue)
    }
  }, [dateValue])

  const handleMaskedDateChange = useCallback(
    (masked: string) => {
      setMaskedDate(masked)
      if (!masked) {
        onSelectDate(undefined)
        return
      }
      if (isMaskComplete(masked, PLACEHOLDER_CHAR)) {
        const parsed = parseLocalDate(masked)
        if (parsed) onSelectDate(parsed)
      }
    },
    [onSelectDate]
  )

  const handleDateBlur = useCallback(() => {
    if (!maskedDate) {
      onSelectDate(undefined)
      return
    }
    if (isMaskComplete(maskedDate, PLACEHOLDER_CHAR)) {
      const parsed = parseLocalDate(maskedDate)
      if (parsed) {
        setMaskedDate(formatLocalDate(parsed))
        onSelectDate(parsed)
      } else {
        setMaskedDate(dateValue ? formatLocalDate(dateValue) : '')
      }
    } else {
      setMaskedDate(dateValue ? formatLocalDate(dateValue) : '')
    }
  }, [maskedDate, dateValue, onSelectDate])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        <MaskedInput
          mask={dateMask}
          value={maskedDate}
          onChange={handleMaskedDateChange}
          onBlur={handleDateBlur}
          textPlaceholder={datePlaceholder}
          className={cn(
            'h-10 flex-1 w-[116px] text-center text-[14px] border border-[#C4C2C8] rounded-md focus-visible:ring-1 focus-visible:ring-igz-light-purple focus-visible:outline-none',
            dateValue ? 'text-igz-primary' : 'text-[#C4C2C8]'
          )}
        />

        <TimePickerInput value={hourValue} onChange={onHourChange} className="w-[110px]" />
      </div>

      <Calendar
        mode="single"
        month={displayedMonth}
        onMonthChange={setDisplayedMonth}
        selected={dateValue}
        onSelect={onSelectDate}
        className="[--calendar-padding:0rem] border-none"
        classNames={{
          weekday: 'text-[#ADABB0] uppercase font-normal text-[12px] w-full',
          caption_label: 'text-igz-primary font-normal text-[20px]'
        }}
        range={range}
        activeRangeSide={side}
        captionPrefix={label}
        singleDate={singleDate}
      />
    </div>
  )
}
