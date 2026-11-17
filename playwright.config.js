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
import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, devices } from '@playwright/test'
import { defineBddConfig } from 'playwright-bdd'

import {
  actionTimeout,
  appEnv,
  appMode,
  buildDir,
  buildMarker,
  expectTimeout,
  headless,
  navigationTimeout,
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
// the app the scenarios run against: `appMode` (E2E_APP) in tests/config.js
if (!['build', 'dev'].includes(appMode)) {
  throw new Error(`E2E_APP=${appMode} is not supported: build, dev`)
}

// a `playwright test` run (not `bddgen` or knip, which only read this file): only the E2E build (its marker,
// tests/config.js), never a production build in the same folder
const isTestRun = /playwright/.test(process.argv[1] ?? '') && process.argv.includes('test')

if (isTestRun && appMode === 'build' && !fs.existsSync(path.join(buildDir, 'index.html'))) {
  throw new Error(
    `The app is not built (${buildDir}): run \`npm run test:regression\` once (it builds the app) or use E2E_APP=dev`
  )
}

if (isTestRun && appMode === 'build' && !fs.existsSync(buildMarker)) {
  throw new Error(
    `${buildDir} is not the E2E build (no ${buildMarker}), e.g. a production \`npm run build\`: run ` +
      '`npm run test:regression` once (it builds the app) or use E2E_APP=dev'
  )
}

const appCommand =
  appMode === 'build'
    ? `npx vite preview --mode development --outDir ${buildDir} --port ${test_port} --strictPort`
    : `npm start -- --port ${test_port} --strictPort`

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
  // one E2E run at a time (the memory), `npm run test:regression` holds the lock in `scripts/testRegression.js`
  globalSetup: './tests/global-setup.js',
  outputDir: path.join(reports_dir, 'test-results'),
  // the parallel run is `--workers N` (E2E_WORKERS, scripts/testRegression.js): one app and one mock server serve all the
  // workers, the mock server keeps a separate instance per worker (the `x-e2e-worker` header, scripts/mockServer.js).
  // The scenarios (not the feature files) are spread over the workers: each scenario starts on a fresh instance and
  // doesn't depend on the others
  workers: 1,
  fullyParallel: true,
  retries: Number(process.env.E2E_RETRIES ?? 1),
  // a scenario that passes only on the retry is reported as flaky, in CI it fails the run (an intermittent issue)
  failOnFlakyTests: isCI,
  forbidOnly: isCI,
  // a scenario is a whole user flow with dozens of steps
  timeout: 10 * 60 * 1000,
  expect: { timeout: expectTimeout },
  // the report is Allure (`npm run report`)
  reporter: [
    ['./tests/reporters/console-reporter.js'],
    // the failures as annotations of the GitHub Actions job
    ...(process.env.GITHUB_ACTIONS ? [['github']] : []),
    [
      'allure-playwright',
      {
        resultsDir: path.join(reports_dir, 'allure-results'),
        environmentInfo: {
          browser: 'chromium',
          headless: String(headless),
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
    actionTimeout,
    navigationTimeout,
    acceptDownloads: true,
    // the "Copy to clipboard" actions
    permissions: ['clipboard-read', 'clipboard-write'],
    screenshot: 'only-on-failure',
    // E2E_TRACE - Playwright trace mode. `on-first-retry`: only the retry of a failed scenario is traced (a passing
    // scenario records nothing), `retain-on-failure`: every attempt is traced, kept for the failed ones. The sources of
    // the generated specs are useless and big
    trace: { mode: process.env.E2E_TRACE || 'on-first-retry', sources: false }
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
      // an instance per worker, restarted before every scenario (scripts/mockServer.js), the "auto-generated-data"
      // project only for the scenarios tagged `@generatedData`. MOCK_STRICT_WORKERS: a request that doesn't say its
      // worker is refused, it can't reach another worker's state. `/mock-front` answers without the header, the
      // instances are started on the first request of their worker
      command: 'npm run mock-server',
      url: `${mock_server_url}/mock-front`,
      env: {
        E2E_MOCK_PORT: mock_server_port,
        MOCK_GENERATED_DATA: 'false',
        MOCK_STRICT_WORKERS: 'true'
      },
      reuseExistingServer: !isCI,
      timeout: 60000
    },
    {
      command: appCommand,
      url: baseURL,
      // every variable of the app, the local `.env*` files are not used (tests/config.js)
      env: appEnv,
      reuseExistingServer: !isCI,
      timeout: 3 * 60 * 1000
    }
  ]
})
