/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
    10|distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import { iguazioHttpClient } from '../httpClient'
import {
  toOrcaCreatePayload,
  toOrcaStatePayload,
  toOrcaUpdatePayload
} from '../utils/orcaProjectPayload.util'

const PROJECTS_URL = '/v1/projects/projects'
const EXECUTIONS_URL = '/v1/trackable-actions/executions'

const readLeaderProject = project =>
  iguazioHttpClient.get(`${PROJECTS_URL}/${project}`).then(({ data }) => data)

// Project mutations are served by the leader (Orca) rather than by MLRun. Each one answers 202 with
// the project body, whose `status.opId` identifies the operation to track. Reads deliberately stay
// on MLRun, so only these keys override the MLRun api.
export const orcaProjectMutations = {
  changeProjectState: (project, state) =>
    iguazioHttpClient.patch(
      `${PROJECTS_URL}/${project.metadata.name}`,
      toOrcaStatePayload(state, project)
    ),
  createProject: postData => iguazioHttpClient.post(PROJECTS_URL, toOrcaCreatePayload(postData)),
  // TODO: Orca does not honour `x-mlrun-deletion-strategy` yet, so a non-empty project cannot be
  // refused and re-confirmed the way MLRun does. The header is sent already so that the existing
  // confirmation flow starts working unchanged once the leader adds support.
  deleteProject: (project, deleteNonEmpty) =>
    iguazioHttpClient.delete(`${PROJECTS_URL}/${project}`, {
      headers: {
        'x-mlrun-deletion-strategy': deleteNonEmpty ? 'cascade' : 'restricted'
      }
    }),
  editProject: (projectName, data) =>
    iguazioHttpClient.put(`${PROJECTS_URL}/${projectName}`, toOrcaUpdatePayload(data)),
  updateProject: (projectName, data) =>
    iguazioHttpClient.patch(`${PROJECTS_URL}/${projectName}`, toOrcaUpdatePayload(data))
}

const orcaProjectsApi = {
  ...orcaProjectMutations,
  getActionExecutions: params => iguazioHttpClient.get(EXECUTIONS_URL, { params }),
  getProject: readLeaderProject
}

export default orcaProjectsApi
