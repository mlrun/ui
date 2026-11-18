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
import { Before, After } from './world.js'
import { resetMockState, setRequestsFailureCondition } from '../common-tools/common-tools.js'
import { appMode, test_port, test_url } from '../../config.js'

// the scenarios run against the Iguazio platform, not the Community Edition: the app reads `igzFullVersion` from the
// localStorage (`isCommunityEdition`, `isIgzVersionCompatible`), partly at the module load, so it must be there before
// the app's code runs on the first load. A script of the browser context, added before anything loads a page (the
// dev warm-up below, the steps): it runs before the app's code on every load, also in the tabs the app opens, as the
// localStorage of the origin is shared by them. Neither the app nor the steps write or remove the value, so setting it
// on every load is the same as setting it once and keeping it. Only on the app origin: the localStorage of about:blank
// (the page before the first navigation) is not accessible
const appOrigin = `http://${test_url}:${test_port}`
const igzFullVersion = '3.5.5'

// the dev server only (E2E_APP=dev): the first page load after its start is slow, Vite pre-bundles the dependencies
// (`optimizeDeps.force`) and may reload the page, so without waiting the first scenarios get a blank page. Per worker
// process: the first scenario of every worker loads the app once more and waits, the app server is shared, so only the
// very first one waits long. The prebuilt app (`vite preview`) needs no warm-up, the hook doesn't load a page: every
// scenario loads the app by its first navigation (`open url`), the steps before it only call the API
let isAppWarmedUp = false

Before({ timeout: 5 * 60 * 1000 }, async function () {
  // a fresh mock server instance of this worker, with the big "auto-generated-data" project only for the scenarios
  // that need it
  await resetMockState({ generatedData: this.testInfo.tags.includes('@generatedData') })
  await this.page.context().addInitScript(
    ({ origin, version }) => {
      if (location.origin === origin) localStorage.setItem('igzFullVersion', version)
    },
    { origin: appOrigin, version: igzFullVersion }
  )

  if (appMode === 'dev' && !isAppWarmedUp) {
    await this.page.goto('/')
    await this.page
      .locator('.projects__wrapper')
      .first()
      .waitFor({ state: 'attached', timeout: 4 * 60 * 1000 })
    isAppWarmedUp = true
  }
})

// the known bugs are expected to fail: they don't make the run red, and a known bug scenario that passes fails the run
// ("expected to fail"), so it's noticed that the bug is fixed and the tag can be removed. The console and the Allure
// report show them as failed known bugs (tests/reporters, tests/allure-results.js)
Before({ tags: '@knownBug or @FAILED_TODO' }, async function () {
  this.testInfo.fail(true, 'known bug (@knownBug/@FAILED_TODO): expected to fail')
})
// the browser clock is fake (it runs on, `move the browser time forward by N seconds` jumps it): the "MLRun seems to be
// down" popup is shown after 3 minutes of failed retries (`fetchProjectsSummary`, src/reducers/projectReducer.js), the
// scenario doesn't wait them in real time. The scenario opens the page after it, the clock is installed by then.
// The failure condition is of this worker's mock server instance only, the next reset drops it too
Before('@mlrunUnhealthyTest', async function () {
  await this.page.clock.install()
  await setRequestsFailureCondition(true)
})

After('@mlrunUnhealthyTest', async function () {
  await setRequestsFailureCondition(false)
})
