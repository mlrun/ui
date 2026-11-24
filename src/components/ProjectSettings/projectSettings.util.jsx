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
import { forEach, groupBy, minBy } from 'lodash-es'

import { membersActions } from '../../elements/MembersPopUp/membersReducer'

import {
  IS_MF_MODE,
  PROJECTS_SETTINGS_GENERAL_TAB,
  PROJECTS_SETTINGS_PAGE,
  PROJECTS_SETTINGS_MEMBERS_TAB,
  PROJECTS_SETTINGS_SECRETS_TAB,
  OWNER_ROLE,
  USER_ROLE,
  USER_GROUP_ROLE,
  ADMIN_ROLE,
  BUILDER_ROLE,
  CURATOR_ROLE,
  EDITOR_ROLE,
  VIEWER_ROLE
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

const addMember = (members, name, id, type, initialRole, role, roles) => {
  members.push({
    name,
    id,
    type,
    initialRole,
    role,
    ...(roles && { roles }),
    icon: type === USER_ROLE ? <User /> : <Users />,
    modification: ''
  })
}

// The leader's project roles, highest first. Each role's permissions include the ones below it, and
// Editor and Builder grant the same.
const ROLES_BY_PRECEDENCE = [ADMIN_ROLE, EDITOR_ROLE, BUILDER_ROLE, CURATOR_ROLE, VIEWER_ROLE]

const getRolePrecedence = role => {
  const precedence = ROLES_BY_PRECEDENCE.indexOf(role)

  return precedence === -1 ? ROLES_BY_PRECEDENCE.length : precedence
}

/**
 * The role a member is shown with when they hold several: Admin, then Editor or Builder, then
 * Curator, then Viewer, then any other role in the order the policies came in.
 * @param {string[]} roles - the display names of the roles the member holds.
 * @returns {string|undefined}
 */
export const getHighestRole = roles => minBy(roles, getRolePrecedence)

export const getMemberDisplayName = ({ name, id }) => {
  const formattedName = (name ?? '').trim().replace(/^\//, '').replaceAll('/', ' / ')

  return formattedName || id || ''
}

const generateMembersMF = (policiesResponse, membersDispatch, projectName) => {
  const members = []
  const membersById = new Map()
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
      id: projectName,
      owner: { id: ownerUsername, username: ownerUsername, firstName: '', lastName: '' }
    }
  })

  // A member can hold several roles, e.g. a previous owner keeps Admin on top of what they had.
  // All of them are kept so that a Save leaves the ones the user did not touch in place.
  policies.forEach(policy => {
    const roleName = policy.spec.displayName
    const assignedMembers = policy.status?.assignedMembers || []

    assignedMembers.forEach(assignedMember => {
      if (!membersById.has(assignedMember.id)) {
        membersById.set(assignedMember.id, { assignedMember, roles: [] })
      }

      if (roleName !== OWNER_ROLE) {
        membersById.get(assignedMember.id).roles.push(roleName)
      }
    })
  })

  membersById.forEach(({ assignedMember, roles }) => {
    const memberType = assignedMember.kind === USER_ROLE ? USER_ROLE : USER_GROUP_ROLE
    const role = ownerMemberIds.has(assignedMember.id) ? OWNER_ROLE : getHighestRole(roles)

    addMember(
      members,
      getMemberDisplayName(assignedMember),
      assignedMember.id,
      memberType,
      role,
      role,
      roles
    )
  })

  membersDispatch({
    type: membersActions.SET_MEMBERS_ORIGINAL,
    payload: members
  })
  membersDispatch({
    type: membersActions.SET_MEMBERS,
    payload: members
  })

  return members
}

const isOwnerInMembersList = (ownerId, membersList) => {
  return membersList.some(member => {
    return member.id === ownerId
  })
}

const generateMembersIGZ3 = (membersResponse, membersDispatch, owner) => {
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

export const generateMembers = IS_MF_MODE ? generateMembersMF : generateMembersIGZ3

/**
 * Whether the active user still has a role in the project, directly or through one of their groups.
 * Any role counts, so this holds whatever role the leader leaves a previous owner with.
 * @param {Object} activeUser - the active user, as kept in the members state.
 * @param {Object[]} members - the project members.
 * @returns {boolean}
 */
export const isActiveUserProjectMember = (activeUser, members) => {
  const attributes = activeUser?.data?.attributes

  return members.some(
    member =>
      member.id === attributes?.username ||
      (member.type === USER_GROUP_ROLE && Boolean(attributes?.user_group_ids?.has(member.id)))
  )
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

  const userIsAdmin = IS_MF_MODE
    ? (() => {
        const activeUsername = activeUser.data?.attributes?.username
        return members.some(
          member =>
            member.role === ADMIN_ROLE &&
            (member.id === activeUsername ||
              (member.type === USER_GROUP_ROLE &&
                activeUser.data?.attributes?.user_group_ids?.has(member.id)))
        )
      })()
    : members.some(
        member =>
          member.role === ADMIN_ROLE &&
          (member.id === activeUser.data?.id ||
            (member.type === USER_GROUP_ROLE &&
              activeUser.data?.relationships?.user_groups?.data?.some?.(
                group => group.id === member.id
              )))
      )

  return userIsProjectOwner || userIsAdmin || userIsProjectSecurityAdmin
}
