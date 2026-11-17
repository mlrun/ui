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
// Timeouts - the maximum time to wait, not a pause: Playwright waits for the elements by itself (the actions wait for the
// element to be actionable, the web-first assertions and `expect.poll` retry) and fails after the timeout.
// Set once here, a step/action passes its own timeout only when it needs a different one (see below)
// - every action (click, hover, waitFor, evaluate...): `use.actionTimeout` in playwright.config.js
export const actionTimeout = 15000
// - `page.goto`, `goBack`...: `use.navigationTimeout`
export const navigationTimeout = 60000
// - every assertion that retries (`expect(locator)...`, `expect.poll`, `retryAssertion`): `expect.timeout`.
//   The same as the action timeout: the assertion includes waiting for the element to appear, as the read inside the
//   previous retry loop did (it waited for the element up to the action timeout). Only a failing check waits that long
export const expectTimeout = actionTimeout
// - the app finishes loading (the loader is gone, the sidebar is rendered): the slowest screens
export const timeout = 60000
// local timeouts, shorter on purpose:
// - one attempt to read an element inside a retry: a missing element fails fast and the retry reads the page again
export const readTimeout = 1000
// E2E_HEADLESS=false - show the browser (headless by default)
export const headless = process.env.E2E_HEADLESS !== 'false'
// expected dates in the feature files are in UTC
export const timezone = process.env.E2E_TZ || 'UTC'
// the expected numbers and dates in the feature files are formatted in this locale
export const locale = process.env.E2E_LOCALE || 'en-US'
export const screen_size = { width: 1600, height: 900 }
export const reports_dir = 'tests/reports'
// the E2E build (`build:regression`): Vite's default output folder, the one whose index.html the `base-href-first` plugin
// of vite.config.mjs patches. A production `npm run build` writes to the same folder, so `npm run test:regression`
// marks its build with this file (scripts/testRegression.js), and a run that doesn't build (E2E_BUILD=false, a direct
// `playwright test`) refuses a build without it. Vite empties the folder on every build, a production build removes it
export const buildDir = 'build'
export const buildMarker = `${buildDir}/.e2e-build`
// E2E_APP - the app the scenarios run against (playwright.config.js):
// - `build` (default): the prebuilt app (`build:regression`, built by `npm run test:regression`) served by `vite preview`:
//   ~190 MB and ~60 requests per page load (every scenario starts with an empty browser cache)
// - `dev`: the dev server (`npm start`), e.g. to debug with the app sources: ~2 GB and ~530 requests per page load
export const appMode = process.env.E2E_APP || 'build'
export const test_url = 'localhost'
// E2E_APP_PORT, E2E_MOCK_PORT - e.g. to run next to another app/mock server that uses the default ports
export const test_port = process.env.E2E_APP_PORT || '3000'
export const mock_server_port = process.env.E2E_MOCK_PORT || '30000'
export const mock_server_url = `http://localhost:${mock_server_port}`
// the mock server's path of a host: the app proxies the API requests to it (`server.proxy` in vite.config.mjs, used by
// `vite preview` as well), the mock serves each host under its path
const mockIngress = host => `${mock_server_url}/${host}.default-tenant.app.vmdev36.lab.iguazeng.com`
// the environment of the app the scenarios run against: the build (`build:regression`, scripts/testRegression.js) and
// its server, or the dev server (playwright.config.js). Every variable that the app (`import.meta.env`) and
// vite.config.mjs read is set here, so a run doesn't depend on the local `.env*` files (gitignored, a CI checkout has
// none): the variables already in process.env win over the files in Vite's `loadEnv`. Nothing goes to another host
export const appEnv = {
  // no Module Federation type generation worker (~1 GB per dev server), see vite.config.mjs
  MF_DTS: 'false',
  // the app is served from the root (`--base /`): `/config.json`, `/api`, `/nuclio`, `/function-catalog`...
  VITE_PUBLIC_URL: '',
  VITE_MLRUN_API_URL: mockIngress('mlrun-api-ingress'),
  VITE_NUCLIO_API_URL: mockIngress('nuclio-ingress'),
  VITE_IGUAZIO_API_URL: mockIngress('platform-api'),
  // the function templates (`/function-catalog/<name>/function.yaml`, e.g. editing a schedule of a `hub://` function):
  // the mock serves them under the MLRun ingress (`/:function/function.yaml`, `/catalog.json`)
  VITE_FUNCTION_CATALOG_URL: mockIngress('mlrun-api-ingress'),
  // the `x-v3io-session-key` header of the API proxy: the mock server doesn't check it
  VITE_MLRUN_V3IO_ACCESS_KEY: ''
}
// the mock server keeps a separate instance per Playwright worker (scripts/mockServer.js): every request of a scenario
// to it (the browser, the API steps, the mock control requests) says its worker in this header
export const WORKER_HEADER = 'x-e2e-worker'
// the header of the current Playwright worker (`TEST_PARALLEL_INDEX`, set by Playwright in its worker processes)
export const workerHeaders = () => {
  const index = process.env.TEST_PARALLEL_INDEX

  if (index === undefined) {
    throw new Error(
      `Not in a Playwright worker: no TEST_PARALLEL_INDEX for the "${WORKER_HEADER}" header of the mock server`
    )
  }

  return { [WORKER_HEADER]: index }
}
