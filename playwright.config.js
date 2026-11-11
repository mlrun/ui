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
// E2E regression: the Gherkin scenarios in `tests/features` run by Playwright Test (playwright-bdd)
import path from 'node:path'
import { defineConfig, devices } from '@playwright/test'
import { defineBddConfig } from 'playwright-bdd'

import {
  delay_factor,
  headless,
  locale,
  mock_server_port,
  mock_server_url,
  reports_dir,
  screen_size,
  test_port,
  test_url,
  timezone
} from './tests/config.js'
import { allureResultsListener } from './tests/allure-results.js'

// the steps compute expected dates in Node, so it must use the same timezone as the browser
process.env.TZ = timezone

const baseURL = `http://${test_url}:${test_port}`
const isCI = Boolean(process.env.CI)
// E2E_PREVIEW=true - serve the production-like build (`build:regression`) instead of the dev server
const appCommand =
  process.env.E2E_PREVIEW === 'true'
    ? `npx vite preview --mode development --outDir build/regression --port ${test_port} --strictPort`
    : `npm start -- --port ${test_port} --strictPort`
// the app proxies the API requests to the mock server (`server.proxy` in vite.config.mjs, used by `vite preview` as well)
const mockIngress = host => `${mock_server_url}/${host}.default-tenant.app.vmdev36.lab.iguazeng.com`
const appEnv = {
  VITE_MLRUN_API_URL: mockIngress('mlrun-api-ingress'),
  VITE_NUCLIO_API_URL: mockIngress('nuclio-ingress'),
  VITE_IGUAZIO_API_URL: mockIngress('platform-api')
}

const testDir = defineBddConfig({
  features: 'tests/features/*.feature',
  steps: ['tests/features/support/*.js', 'tests/features/step-definitions/*.js'],
  outputDir: '.features-gen',
  // E2E_TAGS - tag expression, e.g. E2E_TAGS="@smoke and not @inProgress"
  tags: process.env.E2E_TAGS,
  missingSteps: 'fail-on-run'
})

export default defineConfig({
  testDir,
  outputDir: path.join(reports_dir, 'test-results'),
  // the scenarios share one stateful mock backend (reset before each scenario), so they can't run in parallel
  workers: 1,
  fullyParallel: false,
  retries: Number(process.env.E2E_RETRIES ?? 1),
  // a scenario that passes only on the retry is reported as flaky, in CI it fails the run (an intermittent issue)
  failOnFlakyTests: isCI,
  forbidOnly: isCI,
  // a scenario is a whole user flow with dozens of steps
  timeout: 10 * 60 * 1000,
  expect: { timeout: 10000 },
  // the report is Allure (`npm run report`), the shards of a parallel run (scripts/testRegression.js) write their
  // results to the same directory
  reporter: [
    ['./tests/reporters/console-reporter.js'],
    [
      'allure-playwright',
      {
        resultsDir: path.join(reports_dir, 'allure-results'),
        environmentInfo: {
          browser: 'chromium',
          headless: String(headless),
          delay_factor: String(delay_factor),
          timezone,
          locale,
          tags: process.env.E2E_TAGS || 'all',
          node: process.version
        },
        listeners: [allureResultsListener]
      }
    ]
  ],
  use: {
    baseURL,
    headless,
    viewport: screen_size,
    timezoneId: timezone,
    locale,
    actionTimeout: 15000,
    navigationTimeout: 60000,
    acceptDownloads: true,
    // the "Copy to clipboard" actions
    permissions: ['clipboard-read', 'clipboard-write'],
    screenshot: 'only-on-failure',
    // a trace of every failed attempt (Allure shows the attempts of a scenario), the sources of the generated specs are
    // useless and big
    trace: { mode: 'retain-on-failure', sources: false }
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: screen_size }
    }
  ],
  // already running servers are reused, e.g. `npm run mock-server` and `npm start` in other terminals
  webServer: [
    {
      command: 'npm run mock-server',
      url: `${mockIngress('mlrun-api-ingress')}/api/v1/frontend-spec`,
      env: { E2E_MOCK_PORT: mock_server_port },
      reuseExistingServer: !isCI,
      timeout: 60000
    },
    {
      command: appCommand,
      url: baseURL,
      env: appEnv,
      reuseExistingServer: !isCI,
      timeout: 3 * 60 * 1000
    }
  ]
})
