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
import { By } from 'selenium-webdriver'

export default function(inputStructure) {
  const element = {}
  element.root = By.css(inputStructure.root)
  element.inputField = By.css(
    `${inputStructure.root} ${inputStructure.elements.input}`
  )
  if (inputStructure.elements.inc_btn && inputStructure.elements.dec_btn) {
    element.inc_btn = By.css(
      `${inputStructure.root} ${inputStructure.elements.inc_btn}`
    )
    element.dec_btn = By.css(
      `${inputStructure.root} ${inputStructure.elements.dec_btn}`
    )
  }
  if (inputStructure.elements.label) {
    element.inputLabel = By.css(
      `${inputStructure.root} ${inputStructure.elements.label}`
    )
  }
  if (inputStructure.elements.hint) {
    element.hintButton = By.css(
      `${inputStructure.root} ${inputStructure.elements.hint}`
    )
  }
  if (inputStructure.elements.hint_text) {
    element.hintText = By.css(
      `${inputStructure.root} ${inputStructure.elements.hint_text}`
    )
  }
  if (inputStructure.elements.warningHint) {
    element.warningHint = By.css(
      `${inputStructure.root} ${inputStructure.elements.warningHint}`
    )
    element.warningText = By.css(
      // `${inputStructure.root} ${inputStructure.elements.warningText}`
      `${inputStructure.elements.warningText}`
    )
  }
  return element
}
