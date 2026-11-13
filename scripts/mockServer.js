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
// The mock server (`npm run mock-server`): this process supervises it. The mock exits on `POST /reset-mock-state`
// (before every scenario, hooks.js) and a fresh one is started at once on the same port, so every scenario starts on a
// clean state and the memory doesn't grow over the run. Its own crash stops this process with its exit code (a run
// with a broken mock server fails instead of going on without it).
// MOCK_GENERATED_DATA=true - the first instance has the "auto-generated-data" project; then the reset request tells it
// (`generatedData`, the scenarios tagged `@generatedData`)
import { fork } from 'node:child_process'
import path from 'node:path'

const mockScript = path.join('tests', 'mockServer', 'mock.js')
let generatedData = process.env.MOCK_GENERATED_DATA === 'true'
let mock = null
let stopping = false

const start = () => {
  let restart = null

  mock = fork(mockScript, [], {
    env: {
      ...process.env,
      BABEL_ENV: 'test',
      NODE_ENV: 'test',
      MOCK_GENERATED_DATA: String(generatedData)
    }
  })
  mock.on('message', message => {
    if (message?.type === 'restart') restart = message
  })
  mock.on('exit', (code, signal) => {
    if (stopping) return process.exit(0)

    if (restart) {
      generatedData = restart.generatedData
      start()

      return
    }

    console.error(`The mock server exited (${signal ?? `code ${code}`}), stopping`)
    process.exit(code || 1)
  })
}

for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(signal, () => {
    stopping = true
    mock?.kill('SIGTERM')
    // the mock doesn't exit: don't keep the port
    setTimeout(() => {
      mock?.kill('SIGKILL')
      process.exit(0)
    }, 3000).unref()
  })
}

start()
