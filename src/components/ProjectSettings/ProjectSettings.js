import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState
} from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { useHistory, useLocation } from 'react-router-dom'

import ProjectSettingsGeneral from '../../elements/ProjectSettingsGeneral/ProjectSettingsGeneral'
import ProjectSettingsMembers from '../../elements/ProjectSettingsMembers/ProjectSettingsMembers'
import ProjectSettingsSecrets from '../../elements/ProjectSettingsSecrets/ProjectSettingsSecrets'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import ContentMenu from '../../elements/ContentMenu/ContentMenu'

import notificationActions from '../../actions/notification'
import projectsIguazioApi from '../../api/projects-iguazio-api'
import {
  PROJECTS_SETTINGS_MEMBERS_TAB,
  PROJECTS_SETTINGS_SECRETS_TAB
} from '../../constants'
import { generateMembers, page, tabs, validTabs } from './projectSettings.util'
import { isProjectValid } from '../../utils/handleRedirect'
import {
  initialMembersState,
  membersActions,
  membersReducer
} from '../../elements/MembersPopUp/membersReducer'

import './projectSettings.scss'

const ProjectSettings = ({
  frontendSpec,
  match,
  projectStore,
  setNotification
}) => {
  const [projectMembersIsShown, setProjectMembersIsShown] = useState(false)
  const [projectOwnerIsShown, setProjectOwnerIsShown] = useState(false)
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

  const fetchProjectMembers = useCallback(
    projectId => {
      return projectsIguazioApi
        .getProjectMembers(projectId)
        .then(membersResponse =>
          generateMembers(membersResponse, membersDispatch)
        )
        .catch(() =>
          setNotification({
            status: 400,
            id: Math.random(),
            message: 'Failed to fetch data'
          })
        )
    },
    [setNotification]
  )
  const fetchProjectMembersVisibility = project => {
    projectsIguazioApi
      .getProjectMembersVisibility(project)
      .then(() => {
        setProjectMembersIsShown(true)
      })
      .catch(() => {
        setProjectMembersIsShown(false)
      })
  }
  const fetchProjectOwnerVisibility = project => {
    projectsIguazioApi
      .getProjectOwnerVisibility(project)
      .then(() => {
        setProjectOwnerIsShown(true)
      })
      .catch(() => {
        setProjectOwnerIsShown(false)
      })
  }

  const fetchProjectUsersData = useCallback(() => {
    if (projectMembershipIsEnabled) {
      fetchProjectIdAndOwner().then(fetchProjectMembers)
      fetchProjectMembersVisibility(match.params.projectName)
      fetchProjectOwnerVisibility(match.params.projectName)
    }
  }, [
    fetchProjectIdAndOwner,
    fetchProjectMembers,
    match.params.projectName,
    projectMembershipIsEnabled
  ])

  const changeMembersCallback = () => {
    fetchProjectMembers(membersState.projectInfo.id)
  }

  const changeOwnerCallback = () => {
    fetchProjectIdAndOwner()
  }

  const resetProjectData = useCallback(() => {
    membersDispatch({
      type: membersActions.RESET_MEMBERS_STATE
    })
  }, [])

  useEffect(() => {
    fetchProjectUsersData()

    return () => {
      resetProjectData()
    }
  }, [fetchProjectUsersData, resetProjectData])

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
            projectMembersIsShown={projectMembersIsShown}
            setNotification={setNotification}
          />
        ) : match.params.pageTab === PROJECTS_SETTINGS_SECRETS_TAB ? (
          <ProjectSettingsSecrets
            match={match}
            setNotification={setNotification}
          />
        ) : (
          <ProjectSettingsGeneral
            changeOwnerCallback={changeOwnerCallback}
            match={match}
            membersState={membersState}
            projectMembershipIsEnabled={projectMembershipIsEnabled}
            projectOwnerIsShown={projectOwnerIsShown}
            setNotification={setNotification}
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
    setNotification: notificationActions.setNotification
  }
)(ProjectSettings)
