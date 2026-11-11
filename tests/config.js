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
// default timeout of the explicit waits in steps/actions
export const timeout = 60000
export const headless = process.env.E2E_HEADLESS === 'true'
// multiplier for every `page.waitForTimeout()` in steps/actions: 1 - default delays, 0 - no delays
export const delay_factor = Number(process.env.E2E_DELAY_FACTOR ?? 1)
// expected dates in the feature files are in UTC
export const timezone = process.env.E2E_TZ || 'UTC'
// the expected numbers and dates in the feature files are formatted in this locale
export const locale = process.env.E2E_LOCALE || 'en-US'
export const screen_size = { width: 1600, height: 900 }
export const reports_dir = 'tests/reports'
export const test_url = 'localhost'
// E2E_APP_PORT, E2E_MOCK_PORT - e.g. to run next to another app/mock server that uses the default ports
export const test_port = process.env.E2E_APP_PORT || '3000'
export const mock_server_port = process.env.E2E_MOCK_PORT || '30000'
export const mock_server_url = `http://localhost:${mock_server_port}`
