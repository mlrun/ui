import { AlertCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { DateRange } from 'react-day-picker'

import { DateTimePickerPanel } from '@igz-controls/components/CustomRangePicker/DateTimePickerPanel'
import { Button } from '@igz-controls/components/ui/button'
import { FILTER_BUTTON_APPLY, RESET } from '@igz-controls/constants'
import type { CustomDateRange } from '@igz-controls/types/table/timeFilter'
import {
  applyHourToDate,
  getDefaultSinceHour,
  getDefaultUntilHour,
  isoToHour,
  isoToLocalDate,
  toUTCISO
} from '@igz-controls/utils/date.utils'

type Props = {
  onApply?: (range: CustomDateRange) => void
  singleDate?: boolean
  onReset?: () => void
  initialRange?: CustomDateRange
}

const INITIAL_RANGE: DateRange = { from: undefined, to: undefined }
const FROM_AFTER_TO_ERROR = '"To" must be later than "From"'

const CustomRangePicker = ({ onApply, singleDate = false, onReset, initialRange }: Props) => {
  const defaultSinceHour = getDefaultSinceHour()
  const defaultUntilHour = getDefaultUntilHour()

  const [date, setDate] = useState<DateRange>({
    from: isoToLocalDate(initialRange?.since ?? ''),
    to: isoToLocalDate(initialRange?.until ?? '')
  })
  const [hours, setHours] = useState<{ from: string; to: string }>({
    from: isoToHour(initialRange?.since ?? '') || defaultSinceHour,
    to: isoToHour(initialRange?.until ?? '') || (singleDate ? '' : defaultUntilHour)
  })

  const errorMessage = useMemo(() => {
    if (singleDate || !date.from || !date.to) return ''

    const fromDate = applyHourToDate(date.from, hours.from, defaultSinceHour)
    const toDate = applyHourToDate(date.to, hours.to, defaultUntilHour)

    if (fromDate.getTime() > toDate.getTime()) {
      return FROM_AFTER_TO_ERROR
    }

    return ''
  }, [date.from, date.to, hours.from, hours.to, singleDate, defaultSinceHour, defaultUntilHour])

  const handleReset = () => {
    setDate(INITIAL_RANGE)
    setHours({ from: defaultSinceHour, to: singleDate ? '' : defaultUntilHour })
    onReset?.()
  }

  const handleSelectDateFrom = (selectedDate?: Date) =>
    setDate(prev => ({ from: selectedDate, to: prev.to }))

  const handleSelectDateTo = (selectedDate?: Date) =>
    setDate(prev => ({ from: prev.from, to: selectedDate }))

  const handleFromHourChange = (hour: string) => {
    setHours(prev => ({ ...prev, from: hour }))
  }

  const handleToHourChange = (hour: string) => {
    setHours(prev => ({ ...prev, to: hour }))
  }

  const hasNoDateSelected = !date.from && !date.to
  const isApplyDisabled = (singleDate ? !date.from : !date.from || !date.to) || !!errorMessage

  const handleApply = () => {
    if (errorMessage) return
    if (!date.from) return

    const since = applyHourToDate(date.from, hours.from, defaultSinceHour)

    if (singleDate) {
      onApply?.({ since: toUTCISO(since), until: '' })
      return
    }

    if (!date.to) return
    const until = applyHourToDate(date.to, hours.to, defaultUntilHour)

    onApply?.({ since: toUTCISO(since), until: toUTCISO(until) })
  }

  return (
    <div className="flex flex-col gap-6 bg-white p-6 w-fit">
      <div className={singleDate ? '' : 'grid grid-cols-2 gap-8'}>
        <DateTimePickerPanel
          label={singleDate ? '' : 'From:'}
          side="start"
          dateValue={date.from}
          range={date}
          hourValue={hours.from}
          singleDate={singleDate}
          onHourChange={handleFromHourChange}
          onSelectDate={handleSelectDateFrom}
        />

        {!singleDate && (
          <DateTimePickerPanel
            label="To:"
            side="end"
            dateValue={date.to}
            range={date}
            hourValue={hours.to}
            onHourChange={handleToHourChange}
            onSelectDate={handleSelectDateTo}
          />
        )}
      </div>

      {errorMessage && (
        <div
          className="flex items-center gap-3 rounded-md border border-red-300 bg-red-50 px-4 py-3"
          data-testid="custom-date-error"
        >
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <span className="text-sm font-medium text-red-600">{errorMessage}</span>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button
          variant="secondary"
          className="px-6 py-2 bg-white w-[90px] border-[1.5px] border-igz-gray text-[#4B4760] rounded-md hover:bg-[#483F561F]"
          data-testid="custom-date-reset-btn"
          onClick={handleReset}
          disabled={hasNoDateSelected}
        >
          {RESET}
        </Button>
        <Button
          className="px-6 py-2 bg-igz-light-purple w-[90px] text-white hover:bg-igz-dark-purple rounded-md"
          data-testid="custom-date-apply-btn"
          onClick={handleApply}
          disabled={isApplyDisabled}
        >
          {FILTER_BUTTON_APPLY}
        </Button>
      </div>
    </div>
  )
}

export default CustomRangePicker
