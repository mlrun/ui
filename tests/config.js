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
export const timeout = 60000
export const browser = 'chrome'
export const headless = process.env.E2E_HEADLESS === 'true'
// multiplier for every `driver.sleep()` in steps/actions: 1 - default delays, 0 - no delays
export const delay_factor = Number(process.env.E2E_DELAY_FACTOR ?? 1)
export const screen_size = { width: 1600, height: 900 }
export const report = 'tests/reports/cucumber_report'
export const test_url = 'localhost'
export const test_port = '3000'

export default {
  timeout,
  browser,
  headless,
  delay_factor,
  screen_size,
  report,
  test_url,
  test_port
}
