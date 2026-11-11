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
import path from 'node:path'
import { test as base, createBdd } from 'playwright-bdd'
import { delay_factor } from '../../config.js'

// `this` of the steps and hooks (Cucumber style)
export class World {
  constructor(page, testInfo, downloads) {
    this.page = page
    this.testInfo = testInfo
    this.downloads = downloads
    this.createdItems = []
    this.testContext = {}
    // the steps pass it to the actions unbound
    this.attach = this.attach.bind(this)
  }

  // same signature as Cucumber `attach`: a media type or `{ mediaType, fileName }`
  async attach(data, options = 'text/plain') {
    const { mediaType = 'text/plain', fileName = 'attachment' } =
      typeof options === 'string' ? { mediaType: options } : options

    await this.testInfo.attach(fileName, { body: data, contentType: mediaType })
  }
}

// including the expected failures (@knownBug)
const isFailed = testInfo => !['passed', 'skipped'].includes(testInfo.status)

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    const consoleLogs = []

    page.on('console', message =>
      consoleLogs.push(`${message.type().toUpperCase()} ${message.text()}`)
    )
    page.on('pageerror', error => consoleLogs.push(`PAGEERROR ${error.message}`))

    if (delay_factor !== 1) {
      const waitForTimeout = page.waitForTimeout.bind(page)

      page.waitForTimeout = ms => waitForTimeout(Math.round(ms * delay_factor))
    }

    await use(page)

    // failure evidence (the screenshot and the trace are attached by Playwright), for passed scenarios - only errors
    const failed = isFailed(testInfo)
    const logs = failed ? consoleLogs : consoleLogs.filter(log => /^(ERROR|PAGEERROR) /.test(log))

    if (failed) {
      await testInfo.attach('Page URL.txt', { body: page.url(), contentType: 'text/plain' })
    }

    // `screenshot: 'only-on-failure'` skips the expected failures
    if (failed && testInfo.expectedStatus === 'failed' && !page.isClosed()) {
      await testInfo.attach('screenshot', {
        body: await page.screenshot(),
        contentType: 'image/png'
      })
    }

    if (logs.length > 0) {
      await testInfo.attach('Browser console.log', {
        body: logs.join('\n'),
        contentType: 'text/plain'
      })
    }
  },
  // the saved files of the scenario: `{ dir, pending }`, `pending` - saving in progress
  downloads: async ({ page }, use, testInfo) => {
    const downloads = { dir: path.join(testInfo.outputDir, 'downloads'), pending: [] }

    page.on('download', download => {
      downloads.pending.push(
        download.saveAs(path.join(downloads.dir, download.suggestedFilename()))
      )
    })

    await use(downloads)
  },
  world: async ({ page, downloads }, use, testInfo) => {
    await use(new World(page, testInfo, downloads))
  }
})

export const { Given, When, Then, Before, After, BeforeAll, AfterAll } = createBdd(test, {
  worldFixture: 'world'
})
