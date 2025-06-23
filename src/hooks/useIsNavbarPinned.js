import { useEffect, useState } from 'react'

const useIsNavbarPinned = () => {
  const [isPinned, setIsPinned] = useState(false)

  useEffect(() => {
    const check = () => {
      setIsPinned(!!document.querySelector('.navbar_pinned'))
    }

    check()

    const observer = new MutationObserver(check)

    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  return isPinned
}

export default useIsNavbarPinned
