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
import {
  clearBackendAfterTest,
  resetMockState,
  setRequestsFailureCondition
} from '../common-tools/common-tools.js'

// the first page load after the dev server start is slow: Vite pre-bundles the dependencies (`optimizeDeps.force`)
// and may reload the page, so without waiting the first scenarios get a blank page
let isAppWarmedUp = false

Before({ timeout: 5 * 60 * 1000 }, async function () {
  // a fresh mock server, with the big "auto-generated-data" project only for the scenarios that need it
  await resetMockState({ generatedData: this.testInfo.tags.includes('@generatedData') })
  await this.page.goto('/')
  if (!isAppWarmedUp) {
    await this.page
      .locator('.projects__wrapper')
      .first()
      .waitFor({ state: 'attached', timeout: 4 * 60 * 1000 })
    isAppWarmedUp = true
  }
  await this.page.evaluate(() => {
    localStorage.setItem('igzFullVersion', '3.5.5')
  })
})

After(async function () {
  await clearBackendAfterTest(this.page, this.createdItems)
})

// the known bugs are expected to fail: they don't make the run red, and a known bug scenario that passes fails the run
// ("expected to fail"), so it's noticed that the bug is fixed and the tag can be removed. The console and the Allure
// report show them as failed known bugs (tests/reporters, tests/allure-results.js)
Before({ tags: '@knownBug or @FAILED_TODO' }, async function () {
  this.testInfo.fail(true, 'known bug (@knownBug/@FAILED_TODO): expected to fail')
})
// the browser clock is fake (it runs on, `move the browser time forward by N seconds` jumps it): the "MLRun seems to be
// down" popup is shown after 3 minutes of failed retries (`fetchProjectsSummary`, src/reducers/projectReducer.js), the
// scenario doesn't wait them in real time. The scenario opens the page after it, the clock is installed by then
Before('@mlrunUnhealthyTest', async function () {
  await this.page.clock.install()
  await setRequestsFailureCondition(true)
})

After('@mlrunUnhealthyTest', async function () {
  await setRequestsFailureCondition(false)
})
