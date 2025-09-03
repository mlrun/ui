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

export default function(dropdownStructure) {
  const root = dropdownStructure.optionsInRoot
    ? dropdownStructure.root
    : '#overlay_container'
  const open_button = locatorBuilder`${0} ${1}`
  const options = locatorBuilder`${0} ${1} ${2}`
  const option = locatorBuilder`${0} ${1}:nth-of-type(${2}) ${3}`
  return {
    root: By.css(dropdownStructure.root),
    open_button: By.css(
      open_button(
        dropdownStructure.root,
        dropdownStructure.dropdownElements.open_button
      )
    ),
    options: By.css(
      options(
        root,
        dropdownStructure.dropdownElements.options,
        dropdownStructure.dropdownElements.option_name
      )
    ),
    option: function(index) {
      return By.css(
        option(
          root,
          dropdownStructure.dropdownElements.options,
          index,
          dropdownStructure.dropdownElements.option_name
        )
      )
    }
  }
}
