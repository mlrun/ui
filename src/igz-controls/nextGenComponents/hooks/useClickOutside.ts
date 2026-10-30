import { useEffect, useRef } from 'react'

const PORTAGED_UI_SELECTOR = [
  '[role="dialog"]',
  '[role="alertdialog"]',
  '[role="menu"]',
  '[role="listbox"]'
].join(',')

const isInsidePortalUI = (target: EventTarget | null) => {
  if (!(target instanceof Element)) return false

  return Boolean(target.closest(PORTAGED_UI_SELECTOR) || target.querySelector(PORTAGED_UI_SELECTOR))
}

const useClickOutside = (handler: (() => void) | undefined) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!handler) return
    const listener = (e: MouseEvent) => {
      const target = e.target
      if (!(target instanceof Node)) return
      if (ref.current?.contains(target)) return
      if (isInsidePortalUI(target)) return
      handler()
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [handler])

  return ref
}

export { useClickOutside }
