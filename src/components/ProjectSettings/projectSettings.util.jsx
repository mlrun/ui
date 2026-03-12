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
import React from 'react'

import { membersActions } from '../../elements/MembersPopUp/membersReducer'

import {
  PROJECTS_SETTINGS_GENERAL_TAB,
  PROJECTS_SETTINGS_PAGE,
  PROJECTS_SETTINGS_MEMBERS_TAB,
  PROJECTS_SETTINGS_SECRETS_TAB,
  OWNER_ROLE,
  USER_ROLE,
  USER_GROUP_ROLE,
  ADMIN_ROLE
} from '../../constants'

import Settings from 'igz-controls/images/settings.svg?react'
import Secrets from 'igz-controls/images/lock-icon.svg?react'
import User from 'igz-controls/images/user.svg?react'
import Users from 'igz-controls/images/users.svg?react'

export const tabs = projectMembershipIsEnabled => [
  {
    id: PROJECTS_SETTINGS_GENERAL_TAB,
    label: 'General',
    icon: <Settings />
  },
  {
    id: PROJECTS_SETTINGS_MEMBERS_TAB,
    label: 'Members',
    icon: <Users />,
    hidden: !projectMembershipIsEnabled
  },
  {
    id: PROJECTS_SETTINGS_SECRETS_TAB,
    label: 'Secrets',
    icon: <Secrets />
  }
]

export const validTabs = [
  PROJECTS_SETTINGS_GENERAL_TAB,
  PROJECTS_SETTINGS_MEMBERS_TAB,
  PROJECTS_SETTINGS_SECRETS_TAB
]

export const page = PROJECTS_SETTINGS_PAGE

const addMember = (members, name, id, type, initialRole, role) => {
  members.push({
    name,
    id,
    type,
    initialRole,
    role,
    icon: type === USER_ROLE ? <User /> : <Users />,
    modification: ''
  })
}

export const generateMembers = (policiesResponse, membersDispatch) => {
  const members = []
  const memberSet = new Set()
  const policies = policiesResponse.data.items || []

  membersDispatch({
    type: membersActions.SET_PROJECT_AUTHORIZATION_ROLES,
    payload: policies
  })

  const ownerPolicy = policies.find(policy => policy.spec.displayName === OWNER_ROLE)
  const ownerMembers = ownerPolicy?.status?.assignedMembers || []
  const ownerMemberIds = new Set(ownerMembers.map(m => m.id))
  const ownerUsername = ownerMembers[0]?.id || ''

  membersDispatch({
    type: membersActions.SET_PROJECT_INFO,
    payload: {
      id: policies[0]?.spec?.projectName || '',
      owner: { id: ownerUsername, username: ownerUsername, firstName: '', lastName: '' }
    }
  })

  policies.forEach(policy => {
    const roleName = policy.spec.displayName
    const assignedMembers = policy.status?.assignedMembers || []

    assignedMembers.forEach(assignedMember => {
      if (memberSet.has(assignedMember.id)) return

      const memberType = assignedMember.kind === USER_ROLE ? USER_ROLE : USER_GROUP_ROLE
      const isOwner = ownerMemberIds.has(assignedMember.id)
      const effectiveRole = isOwner ? OWNER_ROLE : roleName

      addMember(
        members,
        assignedMember.id,
        assignedMember.id,
        memberType,
        effectiveRole,
        effectiveRole
      )
      memberSet.add(assignedMember.id)
    })
  })

  membersDispatch({
    type: membersActions.SET_MEMBERS_ORIGINAL,
    payload: members
  })
  membersDispatch({
    type: membersActions.SET_MEMBERS,
    payload: members
  })
}

export const isProjectMembersTabShown = (
  projectMembershipIsEnabled,
  userIsProjectOwner,
  { activeUser, members }
) => {
  if (!projectMembershipIsEnabled) {
    return false
  }

  const userIsProjectSecurityAdmin =
    activeUser.data?.attributes?.user_policies_collection?.has('Project Security Admin') ?? false
  const activeUsername = activeUser.data?.attributes?.username
  const userIsAdmin = members.some(
    member =>
      member.role === ADMIN_ROLE &&
      (member.id === activeUsername ||
        (member.type === USER_GROUP_ROLE &&
          activeUser.data?.attributes?.user_group_names?.has(member.id)))
  )

  return userIsProjectOwner || userIsAdmin || userIsProjectSecurityAdmin
}
