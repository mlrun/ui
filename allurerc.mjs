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
  // only the known bugs are put apart: the report shows by itself what failed, what was flaky (passed on a retry) and
  // what passed. First matching rule wins
  categories: {
    rules: [
      {
        // a known bug that passed (tests/allure-results.js), it doesn't fail the run
        id: 'known-bug-fixed',
        name: 'Known bug passed (remove the tag if it keeps passing)',
        matchers: {
          statuses: ['passed'],
          message: new RegExp(escapeRegExp(KNOWN_FAILURE_FIXED_MESSAGE))
        }
      },
      {
        // by the tag only. Only 'failed': tests/allure-results.js sets it for a failure that was expected; a 'broken'
        // one (the test timed out) is a failure of the run
        id: 'known-bugs',
        name: 'Known bugs (@knownBug, @FAILED_TODO)',
        matchers: { statuses: ['failed'], labels: { tag: /^@?(knownBug|FAILED_TODO)$/ } }
      }
    ]
  }
})
