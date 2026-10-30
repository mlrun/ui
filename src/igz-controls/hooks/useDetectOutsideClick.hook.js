/*
Copyright 2022 Iguazio Systems Ltd.
Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.
In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import { useEffect } from 'react'

/**
 * Hook for handling closing when clicking outside an element
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
