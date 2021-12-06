import { useEffect } from 'react'

/**
 * Hook for handling closing when clicking outside of an element
 * @function useDetectOutsideClick
 * @param {React.node} ref
 * @param {function} handler A callback function to use on outside click
 */
export const useDetectOutsideClick = (ref, handler) => {
  useEffect(() => {
    const onClick = e => {
      e.stopPropagation()
      // If the active element exists and is clicked outside of
      if (ref.current !== null && !ref.current.contains(e.target)) {
        handler(e)
      }
    }
    // If the item is active (ie open) then listen for clicks outside
    window.addEventListener('click', onClick)

    return () => {
      window.removeEventListener('click', onClick)
    }
  }, [ref, handler])
}
