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
import { cutChips } from '../../utils/cutChips'

export const sizeChips = {
  1000: (elements, delimiter) => cutChips(elements, 8, delimiter),
  900: (elements, delimiter) => cutChips(elements, 7, delimiter),
  800: (elements, delimiter) => cutChips(elements, 6, delimiter),
  700: (elements, delimiter) => cutChips(elements, 6, delimiter),
  600: (elements, delimiter) => cutChips(elements, 5, delimiter),
  500: (elements, delimiter) => cutChips(elements, 4, delimiter),
  400: (elements, delimiter) => cutChips(elements, 3, delimiter),
  300: (elements, delimiter) => cutChips(elements, 2, delimiter),
  200: (elements, delimiter) => cutChips(elements, 1, delimiter),
  100: (elements, delimiter) => cutChips(elements, 0, delimiter),
  0: (elements, delimiter) => cutChips(elements, 0, delimiter)
}
