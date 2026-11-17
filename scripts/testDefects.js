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
// Defect injection run: every defect of tests/mockServer/defects.js is injected into the mock server in turn and its
// scenarios are run against it. Each of them must fail: a scenario that passes on the broken mock doesn't check what it
// claims to (a false pass). The scenarios pass without the defects (the regression).
//
//   npm run test:defects                                  all the defects
//   E2E_DEFECTS=function-deletion-fails npm run test:defects   some of them (comma separated)
//
// One scenario at a time (one worker), the prebuilt app (`npm run build:regression` first) or a running one. The mock
// server is started here (with the defect), a running one is not reused: stop it first
import fs from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import { spawn, spawnSync } from 'node:child_process'

import { mock_server_port, mock_server_url, reports_dir, WORKER_HEADER } from '../tests/config.js'
import { acquireRunLock } from '../tests/e2e-lock.js'
import { DEFECTS } from '../tests/mockServer/defects.js'

const isWindows = process.platform === 'win32'
const selected = (process.env.E2E_DEFECTS || Object.keys(DEFECTS).join(','))
  .split(',')
  .map(name => name.trim())
  .filter(Boolean)
const unknown = selected.filter(name => !DEFECTS[name])

if (unknown.length) {
  console.error(
    `E2E_DEFECTS: not supported: ${unknown.join(', ')}. Supported: ${Object.keys(DEFECTS).join(', ')}`
  )
  process.exit(2)
}

const isPortBusy = port =>
  new Promise(resolve => {
    const socket = net.connect({ port: Number(port), host: 'localhost' })

    socket.once('connect', () => {
      socket.destroy()
      resolve(true)
    })
    socket.once('error', () => resolve(false))
  })

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

// the mock server with the defect, once it answers with it. In the E2E mode, as the regression runs it
// (playwright.config.js): every request must say its worker
const startMock = async defect => {
  const mock = spawn('node', ['scripts/mockServer.js'], {
    env: {
      ...process.env,
      MOCK_DEFECT: defect,
      MOCK_GENERATED_DATA: 'false',
      MOCK_STRICT_WORKERS: 'true'
    },
    stdio: ['ignore', 'ignore', 'inherit']
  })
  const deadline = Date.now() + 60000

  while (Date.now() < deadline) {
    if (mock.exitCode !== null) throw new Error(`the mock server exited (${mock.exitCode})`)

    // an instance is started on the first request of a worker: the data defects are applied by then
    const answer = await fetch(`${mock_server_url}/mock-instance`, {
      headers: { [WORKER_HEADER]: '0' }
    })
      .then(response => response.json())
      .catch(() => null)

    if (answer) {
      if (answer.defect !== defect) {
        mock.kill()
        throw new Error(`the mock server runs with defect "${answer.defect}", not "${defect}"`)
      }

      return mock
    }

    await sleep(300)
  }

  mock.kill()
  throw new Error('the mock server did not start in 60 s')
}

const stopMock = async mock => {
  mock.kill('SIGTERM')

  for (let i = 0; i < 50 && (await isPortBusy(mock_server_port)); i++) await sleep(100)
}

// the outcome of every scenario of the JSON report: "caught" - it failed, "missed" - it passed on the broken mock
const readOutcomes = report => {
  const outcomes = []
  const walk = suite => {
    ;(suite.suites ?? []).forEach(walk)
    ;(suite.specs ?? []).forEach(spec =>
      spec.tests.forEach(test => {
        const result = test.results.at(-1)
        const error = result?.errors?.[0]?.message ?? result?.error?.message ?? ''

        outcomes.push({
          scenario: spec.title.split(' - ')[0],
          status: result?.status ?? 'not run',
          // the ANSI colors of the message
          // eslint-disable-next-line no-control-regex
          error: error.replace(/\u001b\[[0-9;]*m/g, '').split('\n')[0]
        })
      })
    )
  }

  ;(report.suites ?? []).forEach(walk)

  return outcomes
}

const runDefect = async defect => {
  const { scenarios } = DEFECTS[defect]
  const mock = await startMock(defect)

  try {
    const run = spawnSync(
      'npx',
      [
        'playwright',
        'test',
        '--grep',
        `(${scenarios.join('|')}) - `,
        '--workers=1',
        '--retries=0',
        '--reporter=json'
      ],
      {
        shell: isWindows,
        encoding: 'utf8',
        maxBuffer: 256 * 1024 * 1024,
        // not CI: the running mock server (with the defect) is reused
        env: { ...process.env, CI: '', MOCK_DEFECT: defect }
      }
    )
    const report = JSON.parse(run.stdout || '{}')
    const outcomes = readOutcomes(report)
    const notRun = scenarios.filter(id => !outcomes.some(outcome => outcome.scenario === id))

    if (!outcomes.length) {
      throw new Error(`no scenario was run: ${run.stderr || report.errors?.[0]?.message || ''}`)
    }

    return [...outcomes, ...notRun.map(scenario => ({ scenario, status: 'not found', error: '' }))]
  } finally {
    await stopMock(mock)
  }
}

const main = async () => {
  if (await isPortBusy(mock_server_port)) {
    console.error(
      `A mock server runs on port ${mock_server_port}: stop it, the defect injection run starts its own (with the defect)`
    )
    process.exit(2)
  }

  const releaseLock = await acquireRunLock()

  try {
    if (spawnSync('npx', ['bddgen'], { stdio: 'inherit', shell: isWindows }).status !== 0) {
      process.exit(1)
    }

    const rows = []

    for (const defect of selected) {
      console.log(`\n${defect}: ${DEFECTS[defect].description}`)

      const outcomes = await runDefect(defect).catch(error => [
        { scenario: DEFECTS[defect].scenarios.join(', '), status: 'error', error: error.message }
      ])

      outcomes.forEach(outcome => {
        const verdict = ['failed', 'timedOut'].includes(outcome.status)
          ? 'caught'
          : outcome.status === 'passed'
            ? 'MISSED'
            : outcome.status

        rows.push({ defect, ...outcome, verdict })
        console.log(
          `  ${verdict.padEnd(9)} ${outcome.scenario}${outcome.error ? `  ${outcome.error.slice(0, 160)}` : ''}`
        )
      })
    }

    fs.mkdirSync(reports_dir, { recursive: true })
    fs.writeFileSync(path.join(reports_dir, 'defects.json'), JSON.stringify(rows, null, 2))

    const notCaught = rows.filter(row => row.verdict !== 'caught')

    console.log(
      `\n${rows.length - notCaught.length}/${rows.length} caught (${path.join(reports_dir, 'defects.json')})`
    )

    if (notCaught.length) process.exitCode = 1
  } finally {
    releaseLock()
  }
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
