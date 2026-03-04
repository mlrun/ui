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
import { iguazioHttpClient } from '../httpClient'

const projectsIguazioApi = {
  updateProjectOwner: (projectName, owner) =>
    iguazioHttpClient.put(`/v1/authorization/projects/${projectName}/owner`, {
      owner,
      project: projectName
    }),
  getProjectPolicies: projectName =>
    iguazioHttpClient.get(`/v1/authorization/projects/${projectName}/policies`),
  setProjectMembership: (projectName, data) =>
    iguazioHttpClient.put(`/v1/authorization/projects/${projectName}/roles`, data),
  searchUsersMetadata: searchTerm =>
    iguazioHttpClient.get('/v1/profile/search-users-metadata', { params: { searchTerm } }),
  searchGroupsMetadata: searchTerm =>
    iguazioHttpClient.get('/v1/profile/search-groups-metadata', { params: { searchTerm } }),
  getActiveUser: () =>
    iguazioHttpClient.get('/v1/authentication/self', { params: { format: 'full' } })
}

export default projectsIguazioApi
