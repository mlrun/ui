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
// E2E regression, the one command for local and CI runs (`npm run test:regression`, `npm run test:regression:ci`):
//  1. builds the app (`build:regression`, a few seconds, into `build`) and marks it as the E2E build (`build/.e2e-build`),
//     unless E2E_APP=dev or E2E_BUILD=false. A production `npm run build` uses the same folder and removes the marker:
//     E2E_BUILD=false refuses a build without it
//  2. generates the specs from the feature files (`bddgen`)
//  3. runs the scenarios headless: Playwright starts the mock server and the app (`webServer` in playwright.config.js)
//  4. generates the Allure report (for failed runs as well) and opens it (not on CI, not with E2E_OPEN_REPORT=false)
// The exit code is the one of the tests. The settings are environment variables (validated here, see README.md), extra
// arguments are passed to Playwright, e.g. `npm run test:regression -- --grep MLPr001 --repeat-each 3`
//
// E2E_WORKERS=N - Playwright runs the scenarios in N parallel workers (`--workers`), one app and one mock server serve
// them all: the mock server keeps a separate instance per worker (scripts/mockServer.js, the `x-e2e-worker` header).
// E2E_FULL_PER_WORKER=true - every scenario runs N times (`--repeat-each N`), e.g. to find the flaky ones
import fs from 'node:fs'
import net from 'node:net'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

import { appEnv, buildDir, buildMarker, reports_dir } from '../tests/config.js'
import { acquireRunLock, MAX_WORKERS } from '../tests/e2e-lock.js'

const isWindows = process.platform === 'win32'
const isCI = Boolean(process.env.CI)

const fail = message => {
  console.error(message)
  process.exit(1)
}

// the settings: a wrong value fails the run at once, before anything is started
const readInteger = (name, fallback, min, max) => {
  const raw = process.env[name]

  if (raw === undefined || raw === '') return fallback

  const value = Number(raw)

  if (!Number.isInteger(value) || value < min || value > max) {
    fail(`${name}=${raw} is not supported: an integer ${min}..${max}`)
  }

  return value
}

const readChoice = (name, fallback, choices) => {
  const value = process.env[name] || fallback

  if (!choices.includes(value)) fail(`${name}=${value} is not supported: ${choices.join(', ')}`)

  return value
}

// on CI the half of the CPUs: every worker is a Playwright worker process, a browser and a mock instance
const defaultWorkers = isCI
  ? Math.max(1, Math.min(MAX_WORKERS, Math.floor(os.availableParallelism() / 2)))
  : 1
// E2E_SHARDS - the previous name of E2E_WORKERS
const workersVariable = process.env.E2E_WORKERS === undefined ? 'E2E_SHARDS' : 'E2E_WORKERS'
const settings = {
  workers: readInteger(workersVariable, defaultWorkers, 1, MAX_WORKERS),
  retries: readInteger('E2E_RETRIES', 1, 0, 5),
  app: readChoice('E2E_APP', 'build', ['build', 'dev']),
  build: readChoice('E2E_BUILD', 'true', ['true', 'false']) === 'true',
  trace: readChoice('E2E_TRACE', 'on-first-retry', [
    'on-first-retry',
    'on-all-retries',
    'retain-on-failure',
    'retain-on-first-failure',
    'on',
    'off'
  ]),
  headless: readChoice('E2E_HEADLESS', 'true', ['true', 'false']) === 'true',
  // E2E_FULL_PER_WORKER=true - the whole regression N times at once (N = E2E_WORKERS), not shared between the
  // workers, e.g. to find the flaky scenarios
  fullPerWorker: readChoice('E2E_FULL_PER_WORKER', 'false', ['true', 'false']) === 'true'
}
const appPort = Number(process.env.E2E_APP_PORT || 3000)
const mockPort = Number(process.env.E2E_MOCK_PORT || 30000)

// one E2E run at a time: checked before anything is cleaned up, the Playwright run inherits the lock
let releaseRunLock

try {
  releaseRunLock = await acquireRunLock({ parallel: settings.workers > 1 })
} catch (error) {
  fail(error.message)
}

// stopped while the tests are running: the lock is released (the report phase has its own Ctrl+C handling)
const onStop = () => {
  releaseRunLock()
  process.exit(1)
}
const stopSignals = ['SIGINT', 'SIGTERM', 'SIGHUP']

stopSignals.forEach(signal => process.on(signal, onStop))
process.on('exit', releaseRunLock)
const shouldOpenReport = !isCI && process.env.E2E_OPEN_REPORT !== 'false'
const playwrightArgs = process.argv.slice(2)
const allureResultsDir = path.join(reports_dir, 'allure-results')
const allureReportDir = path.join(reports_dir, 'allure-report')

const npx = (args, env = process.env) =>
  spawnSync('npx', args, { stdio: 'inherit', shell: isWindows, env }).status ?? 1

const isPortBusy = port =>
  new Promise(resolve => {
    const socket = net.connect({ port, host: 'localhost' })

    socket.once('connect', () => {
      socket.destroy()
      resolve(true)
    })
    socket.once('error', () => resolve(false))
  })

// what listens on a busy port of the run: our mock server (it answers `/mock-front`) or app (the MLRun page) is reused
// by Playwright (not on CI), e.g. `npm start` in another terminal. Another program (e.g. an IDE's embedded browser
// took 127.0.0.1:30000) is not: Playwright starts the server next to it on the other address (::1), a request to
// 127.0.0.1 would reach that program - it is named, the run goes on
const describeListener = port => {
  if (isWindows) return 'another program'

  const lsof = spawnSync('lsof', ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN', '-Fpc'], {
    encoding: 'utf8'
  })
  const [pid, command] = ['p', 'c'].map(field =>
    (lsof.stdout ?? '')
      .split('\n')
      .find(line => line.startsWith(field))
      ?.slice(1)
  )

  return pid ? `${command} (pid ${pid})` : 'another program'
}

const probe = async (url, isOurs) => {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(1500) })

    return isOurs(await response.text())
  } catch {
    return false
  }
}

if (!isCI) {
  const reused = []
  const foreign = []

  if (await isPortBusy(mockPort)) {
    if (await probe(`http://localhost:${mockPort}/mock-front`, body => body.includes('"front"'))) {
      reused.push(`mock server :${mockPort}`)
    } else if (
      await probe(`http://localhost:${mockPort}/mock-instance`, body => body.includes('"instance"'))
    ) {
      // a mock server of an older version: one state for every request, the workers would share it
      fail(
        `An older mock server runs on :${mockPort} (${describeListener(mockPort)}): it keeps one state for all the ` +
          'workers. Stop it, the run starts the current one'
      )
    } else {
      foreign.push(`:${mockPort} (mock server) is used by ${describeListener(mockPort)}`)
    }
  }

  if (await isPortBusy(appPort)) {
    const isApp = await probe(`http://localhost:${appPort}/`, body => /mlrun/i.test(body))

    if (isApp) reused.push(`app :${appPort}`)
    else foreign.push(`:${appPort} (app) is used by ${describeListener(appPort)}`)
  }

  if (reused.length) {
    console.warn(
      `Note: already running servers are reused (${reused.join(', ')}), the scenarios run against them` +
        (settings.app === 'build' ? ', not against the build of this run' : '')
    )
  }

  if (foreign.length) {
    console.warn(
      `Warning: ${foreign.join('; ')}. The run starts its servers next to it, but a request to 127.0.0.1 can reach ` +
        'that program: close it or use other ports (E2E_APP_PORT, E2E_MOCK_PORT)'
    )
  }
}

console.log(
  `E2E regression: app=${settings.app}, workers=${settings.workers}` +
    (settings.fullPerWorker && settings.workers > 1
      ? ` (the whole regression ${settings.workers} times)`
      : '') +
    `, retries=${settings.retries}, ` +
    `trace=${settings.trace}, ${settings.headless ? 'headless' : 'headed'}, ` +
    `tags=${process.env.E2E_TAGS || 'all'}${isCI ? ', CI' : ''}` +
    (playwrightArgs.length ? `, Playwright arguments: ${playwrightArgs.join(' ')}` : '')
)

// the settings resolved here are the ones of playwright.config.js
const runEnv = {
  ...process.env,
  E2E_APP: settings.app,
  E2E_RETRIES: String(settings.retries),
  E2E_TRACE: settings.trace,
  E2E_HEADLESS: String(settings.headless)
}

if (settings.app === 'build') {
  if (settings.build) {
    const startedAt = Date.now()
    const buildLog = path.join(reports_dir, 'build.log')

    fs.mkdirSync(reports_dir, { recursive: true })
    process.stdout.write('Building the app... ')
    // a failed build leaves no marker, even if Vite didn't empty the folder
    fs.rmSync(buildMarker, { force: true })

    // every variable of the app is set (tests/config.js), the local `.env*` files are not used
    const build = spawnSync('npm', ['run', 'build:regression'], {
      encoding: 'utf8',
      shell: isWindows,
      env: { ...process.env, ...appEnv }
    })

    fs.writeFileSync(buildLog, `${build.stdout ?? ''}${build.stderr ?? ''}`)

    if (build.status !== 0) {
      console.log('failed')
      fail(
        `${(build.stdout ?? '') + (build.stderr ?? '')}`.trim().split('\n').slice(-30).join('\n') +
          `\nThe build failed, the whole log: ${buildLog}`
      )
    }

    fs.writeFileSync(
      buildMarker,
      `The E2E build (npm run build:regression by scripts/testRegression.js), built at ${new Date().toISOString()}\n`
    )
    console.log(`done in ${((Date.now() - startedAt) / 1000).toFixed(1)}s`)
  } else if (!fs.existsSync(path.join(buildDir, 'index.html'))) {
    fail(
      `E2E_BUILD=false, but there is no build in ${buildDir}: run without E2E_BUILD=false (or \`npm run test:regression\` once)`
    )
  } else if (!fs.existsSync(buildMarker)) {
    fail(
      `E2E_BUILD=false, but ${buildDir} is not the E2E build (no ${buildMarker}), e.g. a production \`npm run build\`: ` +
        'run without E2E_BUILD=false (or `npm run test:regression` once)'
    )
  } else {
    console.log(`The app is not rebuilt (E2E_BUILD=false), the build in ${buildDir} is used`)
  }
}

// only the results of the current run, the report keeps the history of runs
fs.rmSync(allureResultsDir, { recursive: true, force: true })

let status = npx(['bddgen'], runEnv)

if (status === 0) {
  status = npx(
    [
      'playwright',
      'test',
      `--workers=${settings.workers}`,
      // every scenario N times, the runs are shared between the workers: the whole regression N times at once
      ...(settings.fullPerWorker && settings.workers > 1
        ? [`--repeat-each=${settings.workers}`]
        : []),
      ...playwrightArgs
    ],
    runEnv
  )
}

// the tests are over: the next run can start while the report is generated and served (it can be open for long)
releaseRunLock()
stopSignals.forEach(signal => process.off(signal, onStop))

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
  npx(['allure', 'open', allureReportDir])
}

process.exit(status)
