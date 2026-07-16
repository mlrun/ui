import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  MaskedInput,
  isMaskComplete,
  type MaskItem
} from './MaskedInput'
import SelectIcon from '../../../images/select.svg?react'
import { cn } from '../../lib/utils'
import {
  buildHalfHourOptions,
  getTimePlaceholder,
  is12HourFormat,
  parseTimeInput
} from '../../utils/date.utils'

type Props = {
  value: string
  onChange: (value: string) => void
  className?: string
}

const PLACEHOLDER_CHAR = '_' as const

const use12h = is12HourFormat()

const timeMask12h = (value: string): MaskItem[] => {
  const firstChar = value[0]
  return [
    /[0-1]/,
    firstChar === '1' ? /[0-2]/ : /[0-9]/,
    ':',
    /[0-5]/,
    /[0-9]/,
    ' ',
    /[AaPp]/,
    /[Mm]/
  ]
}

const timeMask24h = (value: string): MaskItem[] => {
  const firstChar = value[0]
  return [/[0-2]/, firstChar === '2' ? /[0-3]/ : /[0-9]/, ':', /[0-5]/, /[0-9]/]
}

const timeMask = use12h ? timeMask12h : timeMask24h
const timePlaceholder = getTimePlaceholder()

export const TimePickerInput = ({ value, onChange, className }: Props) => {
  const [maskedValue, setMaskedValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const options = useMemo(() => buildHalfHourOptions(), [])

  useEffect(() => {
    setMaskedValue(value)
  }, [value])

  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !listRef.current || !value) return
    const activeEl = listRef.current.querySelector('[data-active="true"]')
    if (activeEl) activeEl.scrollIntoView({ block: 'nearest' })
  }, [isOpen, value])

  const handleMaskedChange = useCallback(
    (masked: string) => {
      setMaskedValue(masked)
      setIsOpen(false)
      if (isMaskComplete(masked, PLACEHOLDER_CHAR)) {
        const normalized = parseTimeInput(masked)
        if (normalized) onChange(normalized)
      }
    },
    [onChange]
  )

  const handleBlur = useCallback(() => {
    if (!maskedValue) return
    if (isMaskComplete(maskedValue, PLACEHOLDER_CHAR)) {
      const normalized = parseTimeInput(maskedValue)
      if (normalized) {
        setMaskedValue(normalized)
        onChange(normalized)
      } else {
        setMaskedValue(value)
      }
    } else {
      setMaskedValue(value)
    }
  }, [maskedValue, value, onChange])

  const handleOptionSelect = (option: string) => {
    setMaskedValue(option)
    onChange(option)
    setIsOpen(false)
  }

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <MaskedInput
        mask={timeMask}
        value={maskedValue}
        onChange={handleMaskedChange}
        onBlur={handleBlur}
        textPlaceholder={timePlaceholder}
        className={cn(
          'h-10 w-full pr-7 text-center text-[14px] border border-[#C4C2C8] rounded-md focus-visible:ring-1 focus-visible:ring-igz-light-purple focus-visible:outline-none',
          value ? 'text-igz-primary' : 'text-[#C4C2C8]'
        )}
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
        onMouseDown={e => e.preventDefault()}
        onClick={() => setIsOpen(prev => !prev)}
        tabIndex={-1}
      >
        <SelectIcon className="h-3 w-3 opacity-70" />
      </button>

      {isOpen && (
        <div
          ref={listRef}
          className="absolute top-full left-0 mt-1 w-full z-50 max-h-[200px] overflow-y-auto rounded-md border border-[#ccc] bg-white shadow-md"
        >
          {options.map(time => (
            <button
              key={time}
              type="button"
              data-active={time === value || undefined}
              className={cn(
                'w-full h-[46px] px-4 text-left text-[14px] hover:bg-igz-accent-hover cursor-pointer',
                time === value && 'bg-igz-accent-hover font-medium'
              )}
              onMouseDown={e => {
                e.preventDefault()
                handleOptionSelect(time)
              }}
            >
              {time}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
