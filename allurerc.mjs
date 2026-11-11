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
// Allure report of the E2E regression run (`npm run report`, `npm run report:open`)
import { defineConfig } from 'allure'
import { escapeRegExp } from 'lodash-es'

import { KNOWN_FAILURE_FIXED_MESSAGE } from './tests/allure-results.js'

const FAILED = ['failed', 'broken']

export default defineConfig({
  name: 'MLRun UI E2E regression',
  output: './tests/reports/allure-report',
  // results of the previous runs: trends, new/fixed/flaky tests
  historyPath: './tests/reports/allure-history.jsonl',
  historyLimit: 30,
  hideLabels: ['_fallbackTestCaseId', 'titlePath', 'package', 'language', 'framework'],
  plugins: {
    awesome: {
      options: {
        reportName: 'MLRun UI E2E regression',
        groupBy: ['suite']
        // not `singleFile`: every failed attempt has a Playwright trace (10-40MB), a single file with them embedded
        // is too heavy for the browser, the separate files are loaded on demand (the report is served, `report:open`)
      }
    }
  },
  // failures are classified by the first matching rule, the tags are without "@"
  categories: {
    rules: [
      {
        id: 'known-bug-fixed',
        name: 'Known bug is not reproduced anymore (remove the tag)',
        matchers: {
          statuses: FAILED,
          message: new RegExp(escapeRegExp(KNOWN_FAILURE_FIXED_MESSAGE))
        }
      },
      {
        id: 'known-app-bugs',
        name: 'Known app bugs (@knownBug)',
        matchers: { statuses: ['failed'], labels: { tag: /^@?knownBug$/ } }
      },
      {
        id: 'not-implemented',
        name: 'Not implemented yet (@FAILED_TODO, @inProgress)',
        matchers: { statuses: FAILED, labels: { tag: /^@?(FAILED_TODO|inProgress)$/ } }
      },
      {
        id: 'infrastructure',
        name: 'Infrastructure (app/mock server, browser)',
        matchers: {
          statuses: FAILED,
          message:
            /ERR_CONNECTION_REFUSED|browserType\.launch|Target page, context or browser has been closed|Process from config\.webServer/
        }
      },
      {
        id: 'ui-elements',
        name: 'UI element not found / not interactable',
        matchers: {
          statuses: FAILED,
          message:
            /waiting for locator|strict mode violation|element is not (attached|visible|enabled|stable)|intercepts pointer events|Element is not displayed/
        }
      },
      {
        id: 'timeouts',
        name: 'Timeouts',
        matchers: {
          statuses: FAILED,
          message: /Timeout \d+ms exceeded|timed out|TimeoutError|\(waited \d+ms\)/
        }
      },
      {
        id: 'assertions',
        name: 'Assertion failures (unexpected value)',
        matchers: {
          statuses: FAILED,
          trace: /AssertionError|Arrays not equal|expect\(.+\)\.\w+\(.*\) failed/
        }
      }
    ]
  }
})
