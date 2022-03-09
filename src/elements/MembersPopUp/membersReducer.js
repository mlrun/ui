import { groupBy } from 'lodash'

/*
 * - projectInfo              : additional information about the project such as ID and Owner of the project
 *                              (data is received from iguazio API).
 * - projectAuthorizationRoles: the list of modification roles (Admin, Editor, Viewer). Each of them contains the list
 *                              of users/user groups that have this role
 * - users                    : the list of user members (original list from response)
 * - useGroups                : the list of user-group members (original list from response)
 * - membersOriginal          : the list of users and user-groups that is used to revert changes
 * - members                  : the list of users and user-groups that is displayed in the table of the `Member` dialog
 * - groupedOriginalMembers   : grouped members list by their role, which is used to display the number of
 *                              users/user-groups for each role at the top of `Member` dialog
 *                              (ex: 2 editors, 3 viewers, 1 admins)
 * - groupedVisibleMembers    : grouped members list by their role, which is used to generate the request body.
 * */
export const initialMembersState = {
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
    case membersActions.SET_MEMBERS:
      return {
        ...state,
        members: payload,
        groupedVisibleMembers: groupBy(
          payload.filter(member => member.modification !== 'delete'),
          item => item.role
        ),
        modifiedRoles: Array.from(
          payload.reduce((prevValue, member) => {
            if (member.modification) {
              prevValue.add(member.role)

              if (member.initialRole) {
                prevValue.add(member.initialRole)
              }
            }

            return prevValue
          }, new Set())
        )
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
