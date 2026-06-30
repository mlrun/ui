import { format, parse } from 'date-fns'

const DEFAULT_LOCALE = 'en-US'

export const getSupportedLocale = (): string => {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE
  const SUPPORTED_LOCALES = new Set(['en-GB', 'en-US'])
  const userLocales = navigator.languages ?? [navigator.language]
  const match = userLocales.find(locale => SUPPORTED_LOCALES.has(locale))
  return match ?? DEFAULT_LOCALE
}

export const is12HourFormat = (): boolean =>
  !!new Intl.DateTimeFormat(getSupportedLocale(), { hour: 'numeric' }).resolvedOptions().hour12

const getTimeFormat = (): string => (is12HourFormat() ? 'hh:mm a' : 'HH:mm')

export const formatLocalDate = (d: Date): string =>
  new Intl.DateTimeFormat(getSupportedLocale(), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    numberingSystem: 'latn',
    calendar: 'gregory'
  }).format(d)

export const parseLocalDate = (text: string): Date | null => {
  const match = text.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return null

  const [, first, second, yearStr] = match
  const isUS = getSupportedLocale() === 'en-US'
  const month = (isUS ? parseInt(first, 10) : parseInt(second, 10)) - 1
  const day = isUS ? parseInt(second, 10) : parseInt(first, 10)
  const year = parseInt(yearStr, 10)

  const date = new Date(year, month, day)
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return null
  }
  return date
}

/** @deprecated Use formatLocalDate */
export const formatDateDDMMYYYY = formatLocalDate

/** @deprecated Use parseLocalDate */
export const parseDateDDMMYYYY = parseLocalDate

export const getDatePlaceholder = (): string =>
  getSupportedLocale() === 'en-US' ? 'mm/dd/yyyy' : 'dd/mm/yyyy'

export const getTimePlaceholder = (): string => (is12HourFormat() ? 'hh:mm AM' : 'HH:mm')

export const getDefaultSinceHour = (): string => (is12HourFormat() ? '12:00 AM' : '00:00')

export const getDefaultUntilHour = (): string => (is12HourFormat() ? '11:30 PM' : '23:30')

const HALF_HOUR_SLOTS_PER_DAY = 24 * 2

export const buildHalfHourOptions = (): string[] => {
  const fmt = getTimeFormat()
  return Array.from({ length: HALF_HOUR_SLOTS_PER_DAY }, (_, i) =>
    format(new Date(2000, 0, 1, Math.floor(i / 2), (i % 2) * 30), fmt)
  )
}

/** @deprecated Use buildHalfHourOptions */
export const buildHalfHourOptions12h = buildHalfHourOptions

export const toUTCISO = (d: Date): string => d.toISOString()

/** @deprecated Use toUTCISO */
export const toLocalISO = toUTCISO

const TIME_PARSE_FORMATS = ['hh:mm a', 'h:mm a', 'HH:mm', 'H:mm'] as const

export const applyHourToDate = (date: Date, hour: string, defaultHour?: string): Date => {
  const effectiveHour = hour || defaultHour
  if (!effectiveHour) return date
  for (const fmt of TIME_PARSE_FORMATS) {
    const parsed = parse(effectiveHour, fmt, date)
    if (!Number.isNaN(parsed.getTime())) return parsed
  }
  return date
}

export const isoToLocalDate = (iso: string): Date | undefined => {
  if (!iso) return undefined
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return undefined
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export const isoToHour = (iso: string): string => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return format(new Date(2000, 0, 1, d.getHours(), d.getMinutes()), getTimeFormat())
}

export const parseTimeInput = (text: string): string => {
  const trimmed = text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/(\d)([AaPp][Mm])/, '$1 $2')
  if (!trimmed) return ''

  const ref = new Date(2000, 0, 1)

  for (const fmt of TIME_PARSE_FORMATS) {
    const parsed = parse(trimmed, fmt, ref)
    if (!Number.isNaN(parsed.getTime()) && parsed.getFullYear() === 2000) {
      return format(parsed, getTimeFormat())
    }
  }

  return ''
}

const SHORT_DATE_FORMAT: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }

export const formatCustomRangeLabel = (since: string, until?: string): string => {
  const from = isoToLocalDate(since)
  if (!from) return ''

  const locale = getSupportedLocale()
  const fromStr = from.toLocaleDateString(locale, SHORT_DATE_FORMAT)

  if (!until) return fromStr

  const to = isoToLocalDate(until)
  if (!to) return fromStr

  return `${fromStr} - ${to.toLocaleDateString(locale, SHORT_DATE_FORMAT)}`
}
