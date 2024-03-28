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
import { groupBy } from 'lodash'

/*
 * - activeUser               : logged in user data
 * - projectInfo              : additional information about the project such as ID and Owner of the project
 *                              (data is received from iguazio API).
 * - users                    : the list of user members (original list from response)
 * - useGroups                : the list of user-group members (original list from response)
 * - membersOriginal          : the list of users and user-groups that is used to revert changes
 * - members                  : the list of users and user-groups that is displayed in the table of the `Member` dialog (includes owner)
 * - groupedOriginalMembers   : grouped members list by their role, which is used to display the number of
 *                              users/user-groups for each role at the top of `Member` dialog
 *                              (ex: 2 editors, 3 viewers, 1 admins)
 * */
export const initialMembersState = {
  activeUser: {},
  projectInfo: {
    id: '',
    owner: {
      id: '',
      username: '',
      firstName: '',
      lastName: ''
    }
  },
  projectAuthorizationRoles: [],
  users: [],
  userGroups: [],
  membersOriginal: [],
  members: [],
  groupedOriginalMembers: [],
  groupedVisibleMembers: [],
  loading: false
}

export const membersActions = {
  GET_PROJECT_USERS_DATA_BEGIN: 'GET_PROJECT_USERS_DATA_BEGIN',
  GET_PROJECT_USERS_DATA_END: 'GET_PROJECT_USERS_DATA_END',
  RESET_MEMBERS_STATE: 'RESET_MEMBERS_STATE',
  SET_ACTIVE_USER: 'SET_ACTIVE_USER',
  SET_MEMBERS: 'SET_MEMBERS',
  SET_MEMBERS_ORIGINAL: 'SET_MEMBERS_ORIGINAL',
  SET_PROJECT_AUTHORIZATION_ROLES: 'SET_PROJECT_AUTHORIZATION_ROLES',
  SET_PROJECT_INFO: 'SET_PROJECT_INFO',
  SET_USERS: 'SET_USERS',
  SET_USER_GROUPS: 'SET_USER_GROUPS'
}

export const membersReducer = (state, { type, payload }) => {
  switch (type) {
    case membersActions.RESET_MEMBERS_STATE:
      return {
        ...initialMembersState
      }
    case membersActions.GET_PROJECT_USERS_DATA_BEGIN:
      return {
        ...state,
        loading: true
      }
    case membersActions.GET_PROJECT_USERS_DATA_END:
      return {
        ...state,
        loading: false
      }
    case membersActions.SET_ACTIVE_USER:
      return {
        ...state,
        activeUser: payload
      }
    case membersActions.SET_MEMBERS:
      return {
        ...state,
        members: payload
      }
    case membersActions.SET_MEMBERS_ORIGINAL:
      return {
        ...state,
        membersOriginal: payload,
        groupedOriginalMembers: groupBy(payload, item => item.role)
      }
    case membersActions.SET_PROJECT_AUTHORIZATION_ROLES:
      return {
        ...state,
        projectAuthorizationRoles: payload
      }
    case membersActions.SET_PROJECT_INFO:
      return {
        ...state,
        projectInfo: payload
      }
    case membersActions.SET_USERS:
      return {
        ...state,
        users: payload
      }
    case membersActions.SET_USER_GROUPS:
      return {
        ...state,
        userGroups: payload
      }
    default:
      return state
  }
}
