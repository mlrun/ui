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
// E2E regression: runs the scenarios, then generates the Allure report (for failed runs as well) and opens it (not on
// CI, E2E_OPEN_REPORT=false - don't open), the exit code is the one of the tests.
// Extra arguments are passed to Playwright, e.g. `npm run test:regression -- --grep MLPr001`
//
// E2E_SHARDS=N - run the scenarios in N parallel shards. The scenarios share the state of the mock server, so every
// shard runs its own app and mock server: on E2E_APP_PORT + i and E2E_MOCK_PORT + i (i = 1..N). The shards write
// their results to the same Allure results directory, their console output is combined
import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'
import { spawn, spawnSync } from 'node:child_process'

import { reports_dir } from '../tests/config.js'
import { ConsoleRenderer, EVENT_PREFIX } from '../tests/reporters/console-renderer.js'

const isWindows = process.platform === 'win32'
const shardsCount = Number(process.env.E2E_SHARDS || 1)
const shouldOpenReport = !process.env.CI && process.env.E2E_OPEN_REPORT !== 'false'
const playwrightArgs = process.argv.slice(2)
const allureResultsDir = path.join(reports_dir, 'allure-results')
const allureReportDir = path.join(reports_dir, 'allure-report')

const npx = (...args) => spawnSync('npx', args, { stdio: 'inherit', shell: isWindows }).status ?? 1

// only the results of the current run, the report keeps the history of runs
fs.rmSync(allureResultsDir, { recursive: true, force: true })

const runShard = (shardIndex, renderer) =>
  new Promise(resolve => {
    const appPort = Number(process.env.E2E_APP_PORT || 3000) + shardIndex
    const mockPort = Number(process.env.E2E_MOCK_PORT || 30000) + shardIndex
    const child = spawn(
      'npx',
      [
        'playwright',
        'test',
        `--shard=${shardIndex}/${shardsCount}`,
        // the scenarios (not the feature files) are distributed between the shards, a feature file is too big a unit
        '--fully-parallel',
        `--output=${path.join(reports_dir, 'shards', String(shardIndex), 'test-results')}`,
        ...playwrightArgs
      ],
      {
        shell: isWindows,
        env: {
          ...process.env,
          E2E_APP_PORT: String(appPort),
          E2E_MOCK_PORT: String(mockPort),
          E2E_REPORTER_EVENTS: 'true',
          // the dev servers of the shards pre-bundle the dependencies at the start (`optimizeDeps.force`), they can't
          // share the Vite cache directory
          VITE_CACHE_DIR: path.join('node_modules', '.vite', `e2e-shard-${shardIndex}`)
        }
      }
    )

    for (const stream of [child.stdout, child.stderr]) {
      readline.createInterface({ input: stream }).on('line', line => {
        if (line.startsWith(EVENT_PREFIX)) {
          renderer.handle({ ...JSON.parse(line.slice(EVENT_PREFIX.length)), shard: shardIndex })
        } else if (line.trim() && !line.startsWith('[WebServer]')) {
          renderer.handle({ type: 'log', text: `[shard ${shardIndex}] ${line}` })
        }
      })
    }

    child.on('close', status => resolve(status ?? 1))
  })

let status = npx('bddgen')

if (status === 0) {
  if (shardsCount > 1) {
    const renderer = new ConsoleRenderer({ shards: shardsCount })
    const statuses = await Promise.all(
      Array.from({ length: shardsCount }, (_, index) => runShard(index + 1, renderer))
    )

    renderer.printSummary()
    status = statuses.find(shardStatus => shardStatus !== 0) ?? 0
  } else {
    status = npx('playwright', 'test', ...playwrightArgs)
  }
}

console.log('Generating the Allure report...')
spawnSync('npx', ['allure', 'generate', '--clean', allureResultsDir], {
  stdio: ['ignore', 'ignore', 'inherit'],
  shell: isWindows
})
console.log(`Allure report: ${allureReportDir} (npm run report:open)`)

// the report loads its files on demand, so it's served (allurerc.mjs)
if (shouldOpenReport && fs.existsSync(path.join(allureReportDir, 'index.html'))) {
  console.log('Opening the report, press Ctrl+C to stop the report server')
  // Ctrl+C stops the report server, the exit code is still the one of the tests
  process.on('SIGINT', () => {})
  npx('allure', 'open', allureReportDir)
}

process.exit(status)
