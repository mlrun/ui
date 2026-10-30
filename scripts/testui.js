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
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

import config from '../tests/config.js'

const { report, browser, headless, delay_factor } = config
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test'
process.env.NODE_ENV = 'test'

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

// Load environment variables from .env* files.
dotenv.config({ path: ['.env.test.local', '.env.test', '.env'], quiet: true })

const argv = process.argv.slice(2)

// app and mock server must be up before the first scenario, `start:regression` starts all of them at once
const REQUIRED_SERVERS = ['http://localhost:3000', 'http://localhost:30000']
const SERVER_WAIT_TIMEOUT = 180000

// Resolve the local binary directly so we don't need a shell to find it on any platform
// (on Windows, the .bin shim is a .cmd/.ps1 file that a shell-less spawn can't launch).
const cucumberBin = path.join(
  __dirname,
  '../node_modules/.bin',
  process.platform === 'win32' ? 'cucumber-js.cmd' : 'cucumber-js'
)

// run all features in `tests` unless specific feature files are passed
const hasFeaturePaths = argv.some(arg => /\.feature(:\d+)*$/.test(arg))
// E2E_TAGS - cucumber tag expression, e.g. E2E_TAGS=@rerun to run only previously failed scenarios
const tagsArgs = process.env.E2E_TAGS ? ['--tags', process.env.E2E_TAGS] : []

// Allure results of the current run (the previous ones are removed), the report keeps the history of runs
const allureResultsDir = path.join(path.dirname(report), 'allure-results')
const allureFormatOptions = {
  resultsDir: allureResultsDir,
  environmentInfo: {
    browser,
    headless: String(headless),
    delay_factor: String(delay_factor),
    timezone: process.env.E2E_TZ || 'UTC',
    tags: process.env.E2E_TAGS || 'all',
    node: process.version
  }
}

// build cucumber executive command args
const cucumberArgs = [
  '--import',
  'tests/features/**/*.js',
  '-f',
  './tests/formatters/scenario-formatter.js',
  '-f',
  `rerun:${report}_rerun.txt`,
  '-f',
  // the formatter needs its own output target: only one formatter can write to the terminal
  // (otherwise it replaces the progress output of the scenario formatter); Allure writes its results to `resultsDir`
  `allure-cucumberjs/reporter:${path.join(path.dirname(report), 'allure-formatter.log')}`,
  '--format-options',
  JSON.stringify(allureFormatOptions),
  '-f',
  `json:${report}.json`,
  ...tagsArgs,
  ...(hasFeaturePaths ? [] : ['tests']),
  ...argv
]

// check and create report folder
const reportDir = report.split('/').slice(0, -1).join('/')
console.log(reportDir)
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir)
}
fs.rmSync(allureResultsDir, { recursive: true, force: true })

const isServerUp = url =>
  new Promise(resolve => {
    http
      .get(url, res => {
        res.resume()
        resolve(true)
      })
      .on('error', () => resolve(false))
  })

async function waitForServers() {
  const deadline = Date.now() + SERVER_WAIT_TIMEOUT
  let pending = REQUIRED_SERVERS

  while (pending.length) {
    const statuses = await Promise.all(pending.map(isServerUp))

    pending = pending.filter((url, index) => !statuses[index])

    if (!pending.length) break
    if (Date.now() > deadline) {
      console.error(
        `Servers are not available after ${SERVER_WAIT_TIMEOUT / 1000}s: ${pending.join(', ')}`
      )
      process.exit(1)
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log(`Servers are up: ${REQUIRED_SERVERS.join(', ')}`)
}

function runCrossPlatform() {
  try {
    execFileSync(cucumberBin, cucumberArgs, { stdio: 'inherit', shell: false })
    return true
  } catch (e) {
    return false
  }
}

// cucumber
waitForServers().then(runCrossPlatform)
