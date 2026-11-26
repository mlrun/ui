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
import axios from 'axios'
import { expect } from '@playwright/test'
import { test_port, test_url, workerHeaders } from '../../../config.js'

// The app in ORIS (Module Federation) mode: the platform API is `/oris-mlrun/api` (src/httpClient.js), which the app
// proxies to the mock server (`VITE_ORIS_API_URL`, vite.config.mjs and tests/config.js). The mock serves the leader's
// (Orca) project and membership endpoints there (tests/mockServer/orcaMock.js).
const ORIS_API_URL = `http://${test_url}:${test_port}/oris-mlrun/api/v1`
// Like the leader's ProjectState enum: only these may be requested
export const ORCA_DESIRED_STATES = { online: 2, archived: 4 }

const orisHttpClient = axios.create({ validateStatus: () => true })

// the requests go through the app to the mock server instance of this Playwright worker (scripts/mockServer.js)
orisHttpClient.interceptors.request.use(config => {
  config.headers.set(workerHeaders())

  return config
})

const expectStatus = (response, status, what) =>
  expect(response.status, `${what}: ${JSON.stringify(response.data)}`).toBe(status)

// the app in ORIS mode is set before any of its scripts run: `IS_MF_MODE` (src/constants.js) is computed once, when the
// module loads, from `window.mlrunConfig`. Only the app's own pages get it
export const enableOrisMode = async page => {
  await page.context().addInitScript(
    ({ origin }) => {
      if (location.origin === origin) {
        window.mlrunConfig = { betaMode: 'enabled', nuclioMode: 'enabled' }
      }
    },
    { origin: `http://${test_url}:${test_port}` }
  )
}

// A dev server or a build started without `VITE_ORIS_API_URL` (e.g. reused from another terminal) has no proxy for
// `/oris-mlrun`: the app answers with its own index.html instead of the mock's JSON
export const verifyOrisApiProxy = async () => {
  const response = await orisHttpClient.get(`${ORIS_API_URL}/projects/projects`, {
    headers: { Accept: 'application/json' }
  })

  expect(
    Array.isArray(response.data?.items),
    `The app does not proxy /oris-mlrun/api to the mock server (got ${response.status}, ` +
      `${String(response.headers['content-type'])}). Start it with the e2e environment (VITE_ORIS_API_URL in ` +
      'tests/config.js): stop an app server started without it, the run reuses it'
  ).toBe(true)
}

export const createLeaderProject = async (name, owner) => {
  const response = await orisHttpClient.post(`${ORIS_API_URL}/projects/projects`, {
    name,
    owner,
    description: `${name} description`
  })

  expectStatus(response, 202, `Creating the "${name}" project on the leader`)
}

export const getLeaderProject = async name => {
  const response = await orisHttpClient.get(`${ORIS_API_URL}/projects/projects/${name}`)

  expectStatus(response, 200, `Reading the "${name}" project from the leader`)

  return response.data
}

// what the owner box sends (`updateProjectOwner` in src/api/projects-iguazio-api.js)
export const transferLeaderProjectOwner = async (name, owner) => {
  const response = await orisHttpClient.put(
    `${ORIS_API_URL}/authorization/projects/${name}/owner`,
    { owner, project: name }
  )

  expectStatus(response, 200, `Transferring the "${name}" project to "${owner}"`)
}

// `membership` - member ids by the leader's role key (e.g. `viewer`), added to the roles they already have
export const addLeaderProjectMembers = async (name, membership) => {
  const response = await orisHttpClient.put(
    `${ORIS_API_URL}/authorization/projects/${name}/roles`,
    {
      membership: Object.fromEntries(
        Object.entries(membership).map(([role, values]) => [role, { values }])
      ),
      override: false
    }
  )

  expectStatus(response, 200, `Adding members to the "${name}" project`)
}

// member ids by role display name (e.g. `Viewer`)
export const getLeaderProjectMembers = async name => {
  const response = await orisHttpClient.get(
    `${ORIS_API_URL}/authorization/projects/${name}/policies`
  )

  expectStatus(response, 200, `Reading the members of the "${name}" project`)

  return Object.fromEntries(
    response.data.items.map(policy => [
      policy.spec.displayName,
      (policy.status?.assignedMembers ?? []).map(member => member.id)
    ])
  )
}

// Records the project updates the app sends to the leader (PUT/PATCH `/v1/projects/projects/<name>`) with their
// response status, newest last
export const recordLeaderProjectUpdates = (page, updates) => {
  page.on('response', response => {
    const request = response.request()
    const match = new URL(request.url()).pathname.match(
      /\/oris-mlrun\/api\/v1\/projects\/projects\/([^/]+)$/
    )

    if (match && ['PUT', 'PATCH'].includes(request.method())) {
      updates.push({
        project: decodeURIComponent(match[1]),
        method: request.method(),
        body: request.postDataJSON(),
        status: response.status()
      })
    }
  })
}
