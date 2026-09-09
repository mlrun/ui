/*
Copyright 2019 Iguazio Systems Ltd.

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
import { useLayoutEffect, useState } from 'react'

export const useElementWidth = elementRef => {
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    const element = elementRef.current

    if (!element) {
      return
    }

    const setMeasuredWidth = measuredWidth => {
      if (measuredWidth) {
        setWidth(prevWidth => (measuredWidth !== prevWidth ? measuredWidth : prevWidth))
      }
    }

    setMeasuredWidth(element.getBoundingClientRect().width)

    const observer = new ResizeObserver(entries => {
      setMeasuredWidth(entries[0]?.contentRect.width)
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [elementRef])

  return width
}
