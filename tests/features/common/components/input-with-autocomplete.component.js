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
import { locatorBuilder } from '../../common-tools/common-tools'

export default function(inputStructure) {
  const options = locatorBuilder`${0} ${1} ${2}`
  const option = locatorBuilder`${0} ${1}:nth-of-type(${2}) ${3}`

  const element = {}

  element.root = By.css(inputStructure.root)

  element.inputField = By.css(
    `${inputStructure.root} ${inputStructure.elements.input}`
  )

  element.options = By.css(
    options(
      inputStructure.elements.options,
      inputStructure.elements.option_name
    )
  )

  element.option = function(index) {
    return By.css(
      option(
        inputStructure.elements.options,
        index,
        inputStructure.elements.option_name
      )
    )
  }

  return element
}
