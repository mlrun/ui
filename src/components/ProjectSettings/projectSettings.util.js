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
import React, { createRef } from 'react'
import { forEach, groupBy } from 'lodash'

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

import { ReactComponent as Settings } from 'igz-controls/images/settings.svg'
import { ReactComponent as Secrets } from 'igz-controls/images/lock-icon.svg'
import { ReactComponent as User } from 'igz-controls/images/user.svg'
import { ReactComponent as Users } from 'igz-controls/images/users.svg'

export const COMPLETED_STATE = 'completed'

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
    modification: '',
    actionElement: createRef()
  })
}

export const generateMembers = (membersResponse, membersDispatch, owner) => {
  const members = []
  const {
    project_authorization_role: projectAuthorizationRoles = [],
    user: users = [],
    user_group: userGroups = []
  } = groupBy(membersResponse.data.included, includeItem => {
    return includeItem.type
  })
  membersDispatch({
    type: membersActions.SET_PROJECT_AUTHORIZATION_ROLES,
    payload: projectAuthorizationRoles
  })
  membersDispatch({
    type: membersActions.SET_USERS,
    payload: users
  })
  membersDispatch({
    type: membersActions.SET_USER_GROUPS,
    payload: userGroups
  })

  if (owner.id && !isOwnerInMembersList(owner.id, users)) {
    addMember(members, owner.username, owner.id, USER_ROLE, OWNER_ROLE, OWNER_ROLE)
  }

  projectAuthorizationRoles.forEach(role => {
    if (role.relationships) {
      forEach(role.relationships, relationData => {
        relationData.data.forEach(identity => {
          const identityList = identity.type === USER_ROLE ? users : userGroups

          const {
            attributes: { name, username },
            id,
            type
          } = identityList.find(identityData => {
            return identityData.id === identity.id
          })

          addMember(
            members,
            type === USER_ROLE ? username : name,
            id,
            type,
            owner.id === id ? OWNER_ROLE : role.attributes.name,
            owner.id === id ? OWNER_ROLE : role.attributes.name
          )
        })
      })
    }
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
  { activeUser, members, projectInfo }
) => {
  if (!projectMembershipIsEnabled) {
    return false
  }

  const userIsProjectSecurityAdmin =
    activeUser.data?.attributes?.user_policies_collection?.has('Project Security Admin') ?? false
  const userIsAdmin = members.some(
    member =>
      member.role === ADMIN_ROLE &&
      (member.id === activeUser.data?.id ||
        (member.type === USER_GROUP_ROLE &&
          activeUser.data?.relationships?.user_groups?.data?.some?.(
            group => group.id === member.id
          )))
  )
  const userIsOwner = activeUser.data?.id === projectInfo.owner.id

  return userIsOwner || userIsAdmin || userIsProjectSecurityAdmin
}

const isOwnerInMembersList = (ownerId, membersList) => {
  return membersList.some(member => {
    return member.id === ownerId
  })
}
