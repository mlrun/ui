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
import projectsIguazioApi from '../api/projects-iguazio-api'
import { IS_MF_MODE } from '../constants'

const WRITE_ROLES = ['Owner', 'Admin', 'Editor']

const getActiveUserIdentities = async () => {
  const response = await projectsIguazioApi.getActiveUser()
  const user = response.data
  const identities = new Set([user.metadata?.username])

  if (user.relationships) {
    user.relationships.forEach(relationship => {
      if (relationship['@type']?.includes('usergroup') && relationship.metadata?.id) {
        identities.add(relationship.metadata.id)
      }
    })
  }

  return identities
}

export const checkProjectWriteAccess = async projectName => {
  if (IS_MF_MODE) {
    const [identities, policiesResponse] = await Promise.all([
      getActiveUserIdentities(),
      projectsIguazioApi.getProjectPolicies(projectName)
    ])
    const policies = policiesResponse.data.items || []
    return policies.some(
      policy =>
        WRITE_ROLES.includes(policy.spec.displayName) &&
        policy.status?.assignedMembers?.some(member => identities.has(member.id))
    )
  } else {
    return projectsIguazioApi
      .getProjectOwnerVisibility(projectName)
      .then(() => true)
      .catch(() =>
        projectsIguazioApi
          .getProjectWorkflowsUpdateAuthorization(projectName)
          .then(() => true)
          .catch(() => false)
      )
  }
}
