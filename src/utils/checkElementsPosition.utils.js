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
// The function does not take in to account a target bottom position
export const isTargetElementInContainerElement = (targetElement, containerElement) => {
  if (containerElement && targetElement) {
    const {
      top: containerElementTop,
      left: containerElementLeft,
      right: containerElementRight,
      bottom: containerElementBottom
    } = containerElement.getBoundingClientRect()
    const {
      top: targetElementTop,
      left: targetElementLeft,
      right: targetElementRight
    } = targetElement.getBoundingClientRect()

    if (targetElementRight > containerElementRight || targetElementLeft < containerElementLeft)
      return false

    if (targetElementTop > containerElementBottom || targetElementTop < containerElementTop)
      return false

    return true
  }

  return false
}

export const isClickInsideContainer = (event, element) => {
  if (!element) return false

  const rect = element.getBoundingClientRect()
  const { clientX, clientY } = event

  return (
    clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom
  )
}
