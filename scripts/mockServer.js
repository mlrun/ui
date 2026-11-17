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
// The mock server (`npm run mock-server`): one process for all the Playwright workers of a run. This front listens on
// E2E_MOCK_PORT and passes every request to the mock instance of its worker (the `x-e2e-worker` header, the
// Playwright `parallelIndex`). An instance is tests/mockServer/mock.js in its own worker thread: its own module graph,
// so its own copy of the data and of every module-level variable, timer and background task. The workers' scenarios
// run at the same time and never see each other's state.
//
// `POST /reset-mock-state` (before every scenario, hooks.js) terminates the instance of the worker and starts a fresh
// one, the answer comes once it listens: the scenario starts on a clean state, the other workers' instances are not
// touched, and the memory doesn't grow over the run (the whole isolate of the old instance is freed). An instance is
// started on the first request of its worker. `generatedData: true` in the reset body - the "auto-generated-data"
// project (the scenarios tagged `@generatedData`); MOCK_GENERATED_DATA=true - it for an instance started without a
// reset (manual use). MOCK_DEFECT (tests/mockServer/defects.js) applies to every instance.
//
// MOCK_STRICT_WORKERS=true (set by playwright.config.js and the E2E scripts): a request without the header is refused
// (400), so a request that lost it fails loudly instead of reaching another worker's state. Without it (a developer's
// `npm run mock-server` next to `npm start`) such a request goes to the instance of worker 0.
//
// Our own endpoints: `GET /mock-front` (no header needed) - the mode and the running instances, the readiness check of
// the run. A crash of an instance is printed and its worker's requests get 502 until its next reset, the other
// workers go on
import http from 'node:http'
import { Worker } from 'node:worker_threads'

import { WORKER_HEADER } from '../tests/config.js'
import { mockDefect } from '../tests/mockServer/defects.js'

const port = Number(process.env.E2E_MOCK_PORT || 30000)
const strict = process.env.MOCK_STRICT_WORKERS === 'true'
const defaultGeneratedData = process.env.MOCK_GENERATED_DATA === 'true'
const mockScript = new URL('../tests/mockServer/mock.js', import.meta.url)
// far above any E2E_MAX_WORKERS: a typo in the header is refused, it doesn't start an instance
const MAX_WORKER_INDEX = 63
// ~0.3-2 s on an idle machine, but over a minute was seen on a busy one: the whole mock.js is loaded again. Below the
// 5 minutes of the Before hook (hooks.js), so a start that never ends fails the scenario with this error, not the
// hook's timeout
const INSTANCE_START_TIMEOUT = 3 * 60 * 1000
// worker index -> `{ promise, entry }`: the instance being started or running, `entry` once it listens
// (`{ thread, port, instance, generatedData, crashed, startedIn }`)
const instances = new Map()
// the instances listen on 127.0.0.1 only, the sockets to an instance are reused between the requests
const agent = new http.Agent({ keepAlive: true })

const sendJson = (res, status, body) => {
  res.writeHead(status, { 'content-type': 'application/json' })
  res.end(JSON.stringify(body))
}

const startInstance = (index, generatedData) =>
  new Promise((resolve, reject) => {
    const startedAt = performance.now()
    const thread = new Worker(mockScript, {
      workerData: { generatedData },
      // the same environment as the mock server process had before (scripts/mockServer.js forked it with them)
      env: { ...process.env, BABEL_ENV: 'test', NODE_ENV: 'test' }
    })
    const entry = { thread, port: null, instance: null, generatedData, crashed: null }
    const timer = setTimeout(() => {
      thread.terminate()
      reject(
        new Error(
          `the mock instance of worker ${index} didn't start in ${INSTANCE_START_TIMEOUT} ms`
        )
      )
    }, INSTANCE_START_TIMEOUT)

    thread.on('message', message => {
      if (message?.type !== 'ready') return

      clearTimeout(timer)
      entry.port = message.port
      entry.instance = message.instance
      entry.startedIn = Math.round(performance.now() - startedAt)
      resolve(entry)
    })
    thread.on('error', error => {
      clearTimeout(timer)

      if (entry.port === null) return reject(error)

      // the handlers' timers run in the instance, an exception thrown by one of them ends only this thread
      entry.crashed = error
      console.error(`The mock instance of worker ${index} crashed:`, error)
    })
    thread.on('exit', code => {
      clearTimeout(timer)

      if (entry.port === null) {
        reject(
          new Error(`the mock instance of worker ${index} exited (code ${code}) while starting`)
        )
      } else if (!entry.terminated && !entry.crashed) {
        entry.crashed = new Error(`exited (code ${code})`)
        console.error(`The mock instance of worker ${index} exited (code ${code})`)
      }
    })
  })

const stopInstance = async slot => {
  const entry = await slot?.promise.catch(() => null)

  if (!entry) return null

  entry.terminated = true
  await entry.thread.terminate()

  return entry
}

const setInstance = (index, promise) => {
  const slot = { promise, entry: null }

  instances.set(index, slot)
  promise.then(
    entry => (slot.entry = entry),
    () => {
      // the next request of the worker tries again
      if (instances.get(index) === slot) instances.delete(index)
    }
  )

  return slot
}

const getInstance = index =>
  (instances.get(index) ?? setInstance(index, startInstance(index, defaultGeneratedData))).promise

// the instance of the request: the header, or worker 0 for a manual run. A wrong value is an error, never a guess
const getWorkerIndex = req => {
  const value = req.headers[WORKER_HEADER]

  if (value === undefined) {
    return strict
      ? {
          error:
            `The request has no "${WORKER_HEADER}" header: the mock server keeps a separate state per Playwright ` +
            'worker (MOCK_STRICT_WORKERS=true), every request of a scenario must say its worker (tests/config.js)'
        }
      : { index: 0 }
  }

  const index = /^\d+$/.test(value) ? Number(value) : NaN

  return index <= MAX_WORKER_INDEX
    ? { index }
    : { error: `"${WORKER_HEADER}: ${value}" is not a worker index (0..${MAX_WORKER_INDEX})` }
}

const readBody = req =>
  new Promise((resolve, reject) => {
    const chunks = []

    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString()))
    req.on('error', reject)
  })

// a fresh instance for the worker: the old one is terminated first (its port, timers and memory go with it), the
// requests that come meanwhile wait for the new one
const resetInstance = async (index, req, res) => {
  let generatedData = false

  try {
    generatedData = JSON.parse((await readBody(req)) || '{}').generatedData === true
  } catch {
    return sendJson(res, 400, { message: 'The reset body is not JSON' })
  }

  const startedAt = performance.now()
  const previous = instances.get(index)
  const next = setInstance(
    index,
    stopInstance(previous).then(() => startInstance(index, generatedData))
  )

  try {
    const [old, entry] = await Promise.all([previous?.promise.catch(() => null), next.promise])

    sendJson(res, 200, {
      worker: index,
      instance: entry.instance,
      previous: old?.instance ?? null,
      generatedData,
      resetIn: Math.round(performance.now() - startedAt),
      startedIn: entry.startedIn
    })
  } catch (error) {
    sendJson(res, 500, {
      message: `The mock instance of worker ${index} didn't start: ${error.stack}`
    })
  }
}

// it doesn't wait for the instances being started: it's the readiness check of the front
const describeFront = () => {
  const workers = {}

  for (const [index, { entry }] of instances) {
    workers[index] = entry
      ? {
          instance: entry.instance,
          generatedData: entry.generatedData,
          crashed: entry.crashed ? String(entry.crashed.message ?? entry.crashed) : null
        }
      : 'starting'
  }

  return { front: true, strict, defect: mockDefect, workers }
}

const forward = (index, entry, req, res) => {
  const upstream = http.request(
    {
      host: '127.0.0.1',
      port: entry.port,
      method: req.method,
      path: req.url,
      headers: req.headers,
      agent
    },
    upstreamRes => {
      res.writeHead(upstreamRes.statusCode, upstreamRes.headers)
      upstreamRes.pipe(res)
    }
  )

  upstream.on('error', error => {
    // e.g. a request of the previous scenario's page that was still open when its instance was reset
    if (res.headersSent) res.destroy()
    else sendJson(res, 502, { message: `The mock instance of worker ${index}: ${error.message}` })
  })
  // the client gave up (a closed page): the instance doesn't need to answer
  res.on('close', () => {
    if (!res.writableFinished) upstream.destroy()
  })
  req.pipe(upstream)
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/mock-front') {
      return sendJson(res, 200, describeFront())
    }

    const { index, error } = getWorkerIndex(req)

    if (error) return sendJson(res, 400, { message: error })

    if (req.method === 'POST' && req.url === '/reset-mock-state') {
      return await resetInstance(index, req, res)
    }

    const entry = await getInstance(index)

    if (entry.crashed) {
      return sendJson(res, 502, {
        message: `The mock instance of worker ${index} crashed, it's restarted on the next reset: ${entry.crashed.stack ?? entry.crashed}`
      })
    }

    forward(index, entry, req, res)
  } catch (error) {
    if (res.headersSent) res.destroy()
    else sendJson(res, 500, { message: `The mock server front: ${error.stack}` })
  }
})

// the clients (the app's proxy, the axios of the steps) reuse their sockets to the front: an idle socket closed here
// (the default 5 s) at the moment a client sends the next request on it would fail that request. They close their idle
// sockets themselves
server.keepAliveTimeout = 0

server.listen(port, () => {
  console.log(
    `Mock server listening at http://localhost:${port}, an instance per "${WORKER_HEADER}"` +
      (strict ? ' (required)' : ' (missing: worker 0)')
  )
})

for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(signal, () => process.exit(0))
}
