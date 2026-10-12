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

const FAILED = ['failed', 'broken']

export default defineConfig({
  name: 'MLRun UI E2E regression',
  output: './tests/reports/allure-report',
  // results of the previous runs: trends, new/fixed/flaky tests
  historyPath: './tests/reports/allure-history.jsonl',
  // failures are classified by the first matching rule
  categories: {
    rules: [
      {
        id: 'known-app-bugs',
        name: 'Known app bugs (tests/FOUND_BUGS.md)',
        matchers: { statuses: FAILED, labels: { tag: /^@knownBug$/ } }
      },
      {
        id: 'not-implemented',
        name: 'Not implemented yet (@FAILED_TODO, @inProgress)',
        matchers: { statuses: FAILED, labels: { tag: /^@(FAILED_TODO|inProgress)$/ } }
      },
      {
        id: 'infrastructure',
        name: 'Infrastructure (app/mock server, browser driver)',
        matchers: {
          statuses: FAILED,
          message: /ERR_CONNECTION_REFUSED|Server terminated early|session not created|Servers are not available/
        }
      },
      {
        id: 'timeouts',
        name: 'Timeouts',
        matchers: { statuses: FAILED, message: /timed out|TimeoutError/ }
      },
      {
        id: 'ui-elements',
        name: 'UI element not found / not interactable',
        matchers: {
          statuses: FAILED,
          trace:
            /NoSuchElementError|ElementNotInteractableError|ElementClickInterceptedError|StaleElementReferenceError|MoveTargetOutOfBoundsError|InvalidSelectorError/
        }
      },
      {
        id: 'assertions',
        name: 'Assertion failures (unexpected value)',
        matchers: { statuses: FAILED, trace: /AssertionError|Arrays not equal/ }
      }
    ]
  }
})
