import { useEffect } from 'react'

/**
 * Hook for handling closing when clicking outside of an element
 * @function useDetectOutsideClick
 * @param {React.node} ref
 * @param {function} function to call on outside click
 * @returns {[isActive, el]} isActive state and el
 */
export const useDetectOutsideClick = (ref, handler) => {
  // const [isActive, setIsActive] = useState(initialState)
  useEffect(() => {
    const onClick = e => {
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
