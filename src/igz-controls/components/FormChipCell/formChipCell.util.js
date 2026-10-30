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
export const uniquenessError = { name: 'uniqueness', label: 'Key must be unique' }

export const getTextWidth = elementWithText => {
  if (!elementWithText) {
    return 0
  }
  const hiddenElementId = 'chips-hidden-element'
  let hiddenElement = document.getElementById(hiddenElementId)

  if (!hiddenElement) {
    hiddenElement = document.createElement('span')
    const styles = {
      position: 'absolute',
      left: '-10000px',
      top: 'auto',
      visibility: 'hidden'
    }

    for (const [styleName, styleValue] of Object.entries(styles)) {
      hiddenElement.style[styleName] = styleValue
    }

    hiddenElement.style.font = window.getComputedStyle(elementWithText).font
    hiddenElement.id = hiddenElementId
    hiddenElement.tabIndex = -1
    document.body.append(hiddenElement)
  }

  hiddenElement.textContent = elementWithText.value

  return hiddenElement.offsetWidth ?? 0
}
