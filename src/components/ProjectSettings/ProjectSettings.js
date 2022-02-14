import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  createRef
} from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { useHistory, useLocation } from 'react-router-dom'
import { forEach, groupBy } from 'lodash'

import ProjectSettingsGeneral from '../../elements/ProjectSettingsGeneral/ProjectSettingsGeneral'
import ProjectSettingsMembers from '../../elements/ProjectSettingsMembers/ProjectSettingsMembers'
import ProjectSettingsSecrets from '../../elements/ProjectSettingsSecrets/ProjectSettingsSecrets'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import ContentMenu from '../../elements/ContentMenu/ContentMenu'

import projectsAction from '../../actions/projects'
import projectsIguazioApi from '../../api/projects-iguazio-api'
import {
  PROJECTS_SETTINGS_MEMBERS_TAB,
  PROJECTS_SETTINGS_SECRETS_TAB
} from '../../constants'
import { page, tabs, validTabs } from './projectSettings.util'
import { isProjectValid } from '../../utils/handleRedirect'
import {
  initialMembersState,
  membersActions,
  membersReducer
} from '../../elements/MembersPopUp/membersReducer'

import { ReactComponent as User } from '../../images/user.svg'
import { ReactComponent as Users } from '../../images/users.svg'

import './projectSettings.scss'

const ProjectSettings = ({ match, frontendSpec, projectStore }) => {
  const location = useLocation()
  const history = useHistory()
  const [membersState, membersDispatch] = useReducer(
    membersReducer,
    initialMembersState
  )

  const projectMembershipIsEnabled = useMemo(
    () => frontendSpec?.feature_flags?.project_membership === 'enabled',
    [frontendSpec]
  )

  const fetchProjectIdAndOwner = useCallback(() => {
    return projectsIguazioApi
      .getProjects({
        params: { 'filter[name]': match.params.projectName, include: 'owner' }
      })
      .then(projects => {
        const currentProjectInfo = projects.data
        const currentProjectData = currentProjectInfo.data?.[0]
        const projectId = currentProjectData?.id
        const ownerId = currentProjectData?.relationships?.owner?.data?.id ?? ''
        const ownerInfo = currentProjectInfo?.included.find(
          data => data.id === ownerId
        )
        const {
          attributes: {
            username = '',
            first_name: firstName = '',
            last_name: lastName = ''
          } = {}
        } = ownerInfo ?? {}

        membersDispatch({
          type: membersActions.SET_PROJECT_INFO,
          payload: {
            id: projectId,
            owner: { id: ownerId, username, firstName, lastName }
          }
        })

        return projectId
      })
  }, [match.params.projectName])

  const fetchProjectMembers = projectId => {
    return projectsIguazioApi
      .getProjectMembers(projectId)
      .then(membersResponse => {
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

        projectAuthorizationRoles.forEach(role => {
          if (role.relationships) {
            forEach(role.relationships, relationData => {
              relationData.data.forEach(identity => {
                const identityList =
                  identity.type === 'user' ? users : userGroups

                const {
                  attributes: { name, username },
                  id,
                  type
                } = identityList.find(identityData => {
                  return identityData.id === identity.id
                })

                members.push({
                  name: type === 'user' ? username : name,
                  id: id,
                  type: type,
                  initialRole: role.attributes.name,
                  role: role.attributes.name,
                  icon: type === 'user' ? <User /> : <Users />,
                  modification: '',
                  actionElement: createRef()
                })
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
      })
  }

  const fetchProjectMembersVisibility = project => {
    projectsIguazioApi.getProjectMembersVisibility(project)
  }

  const fetchProjectOwnerVisibility = project => {
    projectsIguazioApi.getProjectOwnerVisibility(project)
  }

  const fetchProjectUsersData = useCallback(() => {
    if (projectMembershipIsEnabled) {
      fetchProjectIdAndOwner().then(fetchProjectMembers)
      fetchProjectMembersVisibility(match.params.projectName)
      fetchProjectOwnerVisibility(match.params.projectName)
    }
  }, [
    fetchProjectIdAndOwner,
    match.params.projectName,
    projectMembershipIsEnabled
  ])

  const changeMembersCallback = () => {
    fetchProjectMembers(membersState.projectInfo.id)
  }

  const changeOwnerCallback = () => {
    fetchProjectIdAndOwner()
  }

  useEffect(() => {
    fetchProjectUsersData()
  }, [fetchProjectUsersData])

  useEffect(() => {
    isProjectValid(
      history,
      projectStore.projectsNames.data,
      match.params.projectName
    )
  }, [history, match.params.projectName, projectStore.projectsNames.data])

  useEffect(() => {
    if (!validTabs.includes(match.params.pageTab)) {
      history.push(`/projects/${match.params.projectName}/settings/general`)
    }
  }, [history, match.params.pageTab, match.params.projectName])

  return (
    <div className="settings">
      <div className="settings__header">
        <Breadcrumbs match={match} />
      </div>
      <div className="settings__content">
        <ContentMenu
          activeTab={match.params.pageTab}
          location={location}
          match={match}
          screen={page}
          tabs={tabs}
        />
        {match.params.pageTab === PROJECTS_SETTINGS_MEMBERS_TAB ? (
          <ProjectSettingsMembers
            changeMembersCallback={changeMembersCallback}
            match={match}
            membersState={membersState}
            membersDispatch={membersDispatch}
            projectMembershipIsEnabled={projectMembershipIsEnabled}
          />
        ) : match.params.pageTab === PROJECTS_SETTINGS_SECRETS_TAB ? (
          <ProjectSettingsSecrets match={match} />
        ) : (
          <ProjectSettingsGeneral
            changeOwnerCallback={changeOwnerCallback}
            match={match}
            membersState={membersState}
            projectMembershipIsEnabled={projectMembershipIsEnabled}
          />
        )}
      </div>
    </div>
  )
}

ProjectSettings.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default connect(
  ({ appStore, projectStore }) => ({
    projectStore,
    frontendSpec: appStore.frontendSpec
  }),
  {
    ...projectsAction
  }
)(ProjectSettings)
