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
// The isolation check of the mock server (`npm run test:mock-isolation`): the Playwright workers of a parallel run
// share one mock server process, each with its own instance (scripts/mockServer.js). Without a browser and without
// an E2E run it starts the mock server in the E2E mode on a free port and, as worker 0 and worker 1 at the same time,
// checks that:
//  - a project created by worker 1 is not seen by worker 0;
//  - a reset of worker 0 keeps worker 1's instance and its project;
//  - the failure condition of worker 1 doesn't fail worker 0;
//  - a request without the worker header is refused;
//  - the memory of the process stays flat over many resets (the instances are freed).
// It prints the start time of an instance and the reset time. The exit code is 1 when a check fails
import net from 'node:net'
import { spawn, execFileSync } from 'node:child_process'

import { WORKER_HEADER } from '../tests/config.js'

const RESET_ROUNDS = Number(process.env.MOCK_ISOLATION_ROUNDS || 60)
const WARM_UP_ROUNDS = 10
// the RSS may grow by this much after the warm-up: the allocator keeps some freed memory, a leak of the instances
// (~40 MB each) passes it within a few rounds
const MAX_RSS_GROWTH_MB = 60
const API = '/mlrun-api-ingress.default-tenant.app.vmdev36.lab.iguazeng.com/api/v1'
const PROJECT = 'isolation-check-project'

const failures = []
const check = (condition, description) => {
  console.log(`  ${condition ? 'ok  ' : 'FAIL'} ${description}`)
  if (!condition) failures.push(description)
}

const getFreePort = () =>
  new Promise((resolve, reject) => {
    const server = net.createServer()

    server.once('error', reject)
    server.listen(0, () => {
      const { port } = server.address()

      server.close(() => resolve(port))
    })
  })

const port = await getFreePort()
const base = `http://localhost:${port}`
const front = spawn(process.execPath, ['scripts/mockServer.js'], {
  env: {
    ...process.env,
    E2E_MOCK_PORT: String(port),
    MOCK_STRICT_WORKERS: 'true',
    MOCK_GENERATED_DATA: 'false',
    MOCK_DEFECT: ''
  },
  stdio: ['ignore', 'ignore', 'inherit']
})

const request = async (worker, method, path, body) => {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: {
      'content-type': 'application/json',
      ...(worker === null ? {} : { [WORKER_HEADER]: String(worker) })
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  })
  const text = await response.text()
  let data = text

  try {
    data = JSON.parse(text)
  } catch {
    // a text answer, e.g. of `/set-failure-condition`
  }

  return { status: response.status, data }
}

const reset = (worker, generatedData = false) =>
  request(worker, 'POST', '/reset-mock-state', { generatedData }).then(({ status, data }) => {
    if (status !== 200)
      throw new Error(`reset of worker ${worker}: ${status} ${JSON.stringify(data)}`)

    return data
  })
const instanceOf = async worker => (await request(worker, 'GET', '/mock-instance')).data.instance
const projectNames = async worker =>
  (await request(worker, 'GET', `${API}/projects`)).data.projects.map(
    project => project.metadata.name
  )
const rssMB = () =>
  Number(execFileSync('ps', ['-o', 'rss=', '-p', String(front.pid)], { encoding: 'utf8' })) / 1024
const median = values => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)]

const main = async () => {
  for (let attempt = 0; ; attempt++) {
    const answer = await fetch(`${base}/mock-front`).then(
      response => response.json(),
      () => null
    )

    if (answer?.strict) break
    if (attempt > 100 || front.exitCode !== null) throw new Error('the mock server did not start')

    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log(
    `Mock server on :${port} (pid ${front.pid}), RSS without instances: ${rssMB().toFixed(0)} MB`
  )

  // both workers start at the same time, as the first scenarios of a parallel run do
  const [first0, first1] = await Promise.all([reset(0), reset(1)])

  console.log(
    `First start: worker 0 ${first0.resetIn} ms, worker 1 ${first1.resetIn} ms (concurrently), ` +
      `RSS with 2 instances: ${rssMB().toFixed(0)} MB`
  )

  console.log('Isolation:')

  const created = await request(1, 'POST', `${API}/projects`, {
    metadata: { name: PROJECT },
    spec: { description: 'created by worker 1' }
  })

  check(created.status === 201, `worker 1 creates the project "${PROJECT}" (${created.status})`)
  check((await projectNames(1)).includes(PROJECT), 'worker 1 sees its project')
  check(!(await projectNames(0)).includes(PROJECT), "worker 0 doesn't see worker 1's project")

  const instance1 = await instanceOf(1)
  const instance0 = await instanceOf(0)
  const reset0 = await reset(0)

  check(
    reset0.previous === instance0 &&
      reset0.instance !== instance0 &&
      (await instanceOf(0)) === reset0.instance,
    'a reset of worker 0 gives it a new instance'
  )
  check(
    (await instanceOf(1)) === instance1,
    "worker 1's instance is unchanged by the reset of worker 0"
  )
  check(
    (await projectNames(1)).includes(PROJECT),
    "worker 1's project survives the reset of worker 0"
  )

  const failing = await request(1, 'POST', '/set-failure-condition', { shouldFail: true })

  check(failing.status === 200, 'worker 1 sets the failure condition')
  check(
    (await request(1, 'GET', `${API}/frontend-spec`)).status === 502,
    'worker 1 fails its requests'
  )
  check((await request(0, 'GET', `${API}/frontend-spec`)).status === 200, 'worker 0 still answers')
  await request(1, 'POST', '/set-failure-condition', { shouldFail: false })
  check((await request(1, 'GET', `${API}/frontend-spec`)).status === 200, 'worker 1 answers again')

  const withoutHeader = await request(null, 'GET', `${API}/frontend-spec`)

  check(
    withoutHeader.status === 400 && String(withoutHeader.data.message).includes(WORKER_HEADER),
    `a request without the "${WORKER_HEADER}" header is refused (${withoutHeader.status})`
  )
  check(
    (await request('x', 'GET', `${API}/frontend-spec`)).status === 400,
    'a wrong worker index is refused'
  )
  check(
    (await request(null, 'POST', '/reset-mock-state', {})).status === 400,
    'a reset without the header is refused'
  )

  const generated = await reset(1, true)
  const generatedRuns = async worker =>
    (await request(worker, 'GET', `${API}/projects/auto-generated-data/runs`)).data.runs?.length ??
    0
  const [runs0, runs1] = await Promise.all([generatedRuns(0), generatedRuns(1)])

  check(
    (await request(1, 'GET', '/mock-instance')).data.generatedData === true &&
      (await request(0, 'GET', '/mock-instance')).data.generatedData === false &&
      runs1 > 0 &&
      runs0 === 0,
    `the generated data is per instance (its runs: worker 1 ${runs1}, worker 0 ${runs0})`
  )
  console.log(`  reset with the generated data: ${generated.resetIn} ms`)

  console.log(`Resets: ${RESET_ROUNDS} rounds, both workers at once`)

  const resetTimes = []
  let baseline = 0

  for (let round = 0; round < RESET_ROUNDS; round++) {
    // the other worker keeps answering while one is reset
    const [a, b] = await Promise.all([reset(0), reset(1), request(1, 'GET', `${API}/projects`)])

    resetTimes.push(a.resetIn, b.resetIn)

    if (round === WARM_UP_ROUNDS - 1) baseline = rssMB()
  }

  const final = rssMB()

  console.log(
    `  reset: median ${median(resetTimes)} ms, max ${Math.max(...resetTimes)} ms; ` +
      `RSS after ${WARM_UP_ROUNDS} rounds ${baseline.toFixed(0)} MB, after ${RESET_ROUNDS} ${final.toFixed(0)} MB`
  )
  check(
    final - baseline < MAX_RSS_GROWTH_MB,
    `the memory stays flat over the resets (+${(final - baseline).toFixed(0)} MB, at most +${MAX_RSS_GROWTH_MB})`
  )

  const status = await fetch(`${base}/mock-front`).then(response => response.json())

  check(
    Object.keys(status.workers).length === 2 &&
      Object.values(status.workers).every(worker => worker && !worker.crashed),
    'no instance crashed, 2 instances alive'
  )
}

try {
  await main()
} catch (error) {
  failures.push(error.message)
  console.error(error)
} finally {
  front.kill('SIGTERM')
}

console.log(failures.length ? `\nFAILED: ${failures.length} check(s)` : '\nPASSED')
process.exit(failures.length ? 1 : 0)
