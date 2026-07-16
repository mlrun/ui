import type { ClipboardEvent, KeyboardEvent } from 'react'
import { useCallback, useRef, useState } from 'react'

import { cn } from '../../lib/utils'

export type MaskItem = RegExp | string

export const isMaskComplete = (value: string, placeholderChar = '_'): boolean =>
  value.length > 0 && !value.includes(placeholderChar)

type Props = {
  mask: MaskItem[] | ((value: string) => MaskItem[])
  value: string
  onChange: (conformedValue: string) => void
  onBlur?: () => void
  placeholderChar?: string
  textPlaceholder?: string
  className?: string
}

const PLACEHOLDER = '_'

const resolveMask = (mask: Props['mask'], value: string): MaskItem[] =>
  typeof mask === 'function' ? mask(value) : mask

const buildPlaceholder = (mask: MaskItem[], pc: string): string =>
  mask.map(m => (typeof m === 'string' ? m : pc)).join('')

const conformToMask = (raw: string, resolvedMask: MaskItem[], placeholderChar: string): string =>
  raw
    .split('')
    .map((c, i) => {
      if (typeof resolvedMask[i] === 'string') return resolvedMask[i] as string
      if (c === placeholderChar) return placeholderChar
      if ((resolvedMask[i] as RegExp).test(c)) return c
      return placeholderChar
    })
    .join('')

export const MaskedInput = ({
  mask,
  value,
  onChange,
  onBlur,
  placeholderChar = PLACEHOLDER,
  textPlaceholder,
  className
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const maskArr = resolveMask(mask, value)
  const maskPlaceholder = buildPlaceholder(maskArr, placeholderChar)
  const maskedDisplay = value || maskPlaceholder

  const showTextPlaceholder = !!textPlaceholder && !value && !isFocused
  const inputValue = showTextPlaceholder ? '' : maskedDisplay

  const nextEditablePos = useCallback((from: number, maskItems: MaskItem[]): number => {
    let pos = from
    while (pos < maskItems.length && typeof maskItems[pos] === 'string') pos++
    return pos
  }, [])

  const prevEditablePos = useCallback((from: number, maskItems: MaskItem[]): number => {
    let pos = from
    while (pos >= 0 && typeof maskItems[pos] === 'string') pos--
    return pos
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const input = e.target as HTMLInputElement
      const pos = input.selectionStart ?? 0

      if (e.key === 'Backspace') {
        e.preventDefault()
        const editPos = prevEditablePos(pos - 1, maskArr)
        if (editPos >= 0) {
          const chars = maskedDisplay.split('')
          chars[editPos] = placeholderChar
          const newVal = chars.join('')
          const resolvedMask = resolveMask(mask, newVal)
          const resolvedPlaceholder = buildPlaceholder(resolvedMask, placeholderChar)
          const corrected = conformToMask(newVal, resolvedMask, placeholderChar)
          onChange(corrected === resolvedPlaceholder ? '' : corrected)
          requestAnimationFrame(() => input.setSelectionRange(editPos, editPos))
        }
        return
      }

      if (e.key === 'Delete') {
        e.preventDefault()
        const editPos = nextEditablePos(pos, maskArr)
        if (editPos < maskArr.length) {
          const chars = maskedDisplay.split('')
          chars[editPos] = placeholderChar
          const newVal = chars.join('')
          const resolvedMask = resolveMask(mask, newVal)
          const resolvedPlaceholder = buildPlaceholder(resolvedMask, placeholderChar)
          const corrected = conformToMask(newVal, resolvedMask, placeholderChar)
          onChange(corrected === resolvedPlaceholder ? '' : corrected)
          requestAnimationFrame(() => input.setSelectionRange(editPos, editPos))
        }
        return
      }

      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') return

      if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        const editPos = nextEditablePos(pos, maskArr)
        if (editPos >= maskArr.length) return

        const regex = maskArr[editPos] as RegExp
        if (!regex.test(e.key)) return

        const chars = maskedDisplay.split('')
        chars[editPos] = e.key
        const newVal = chars.join('')

        const resolvedMask = resolveMask(mask, newVal)
        const corrected = conformToMask(newVal, resolvedMask, placeholderChar)

        onChange(corrected)
        const nextPos = nextEditablePos(editPos + 1, resolvedMask)
        requestAnimationFrame(() => input.setSelectionRange(nextPos, nextPos))
      }
    },
    [mask, maskArr, maskedDisplay, onChange, placeholderChar, nextEditablePos, prevEditablePos]
  )

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      const pasted = e.clipboardData.getData('text')
      const input = e.target as HTMLInputElement
      let pos = input.selectionStart ?? 0
      const chars = maskedDisplay.split('')

      for (const char of pasted) {
        pos = nextEditablePos(pos, maskArr)
        if (pos >= maskArr.length) break
        if ((maskArr[pos] as RegExp).test(char)) {
          chars[pos] = char
          pos++
        }
      }

      const newVal = chars.join('')
      const resolvedMask = resolveMask(mask, newVal)
      const corrected = conformToMask(newVal, resolvedMask, placeholderChar)

      onChange(corrected)
      const cursorPos = nextEditablePos(pos, resolvedMask)
      requestAnimationFrame(() => input.setSelectionRange(cursorPos, cursorPos))
    },
    [mask, maskArr, maskedDisplay, onChange, placeholderChar, nextEditablePos]
  )

  const handleFocus = useCallback(() => {
    setIsFocused(true)
    requestAnimationFrame(() => {
      const pos = maskedDisplay.indexOf(placeholderChar)
      const cursorPos = pos === -1 ? maskedDisplay.length : pos
      inputRef.current?.setSelectionRange(cursorPos, cursorPos)
    })
  }, [maskedDisplay, placeholderChar])

  const handleBlurInternal = useCallback(() => {
    setIsFocused(false)
    onBlur?.()
  }, [onBlur])

  return (
    <input
      ref={inputRef}
      value={inputValue}
      placeholder={textPlaceholder}
      onChange={() => {}}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onFocus={handleFocus}
      onBlur={handleBlurInternal}
      className={cn(
        'flex h-10 rounded-md border border-solid border-input bg-background px-3 py-2 text-base placeholder:text-[#C4C2C8] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className
      )}
      spellCheck={false}
      autoComplete="off"
    />
  )
}
