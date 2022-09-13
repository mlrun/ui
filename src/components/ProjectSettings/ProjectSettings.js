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
import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { connect } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import ProjectSettingsGeneral from '../../elements/ProjectSettingsGeneral/ProjectSettingsGeneral'
import ProjectSettingsMembers from '../../elements/ProjectSettingsMembers/ProjectSettingsMembers'
import ProjectSettingsSecrets from '../../elements/ProjectSettingsSecrets/ProjectSettingsSecrets'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import ContentMenu from '../../elements/ContentMenu/ContentMenu'

import notificationActions from '../../actions/notification'
import projectsIguazioApi from '../../api/projects-iguazio-api'
import { PROJECTS_SETTINGS_MEMBERS_TAB, PROJECTS_SETTINGS_SECRETS_TAB } from '../../constants'
import { COMPLETED_STATE, generateMembers, page, tabs, validTabs } from './projectSettings.util'
import { isProjectValid } from '../../utils/handleRedirect'
import {
  initialMembersState,
  membersActions,
  membersReducer
} from '../../elements/MembersPopUp/membersReducer'

import './projectSettings.scss'

const ProjectSettings = ({ frontendSpec, projectStore, setNotification }) => {
  const [projectMembersIsShown, setProjectMembersIsShown] = useState(false)
  const [projectOwnerIsShown, setProjectOwnerIsShown] = useState(false)
  const [membersState, membersDispatch] = useReducer(membersReducer, initialMembersState)
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()

  const projectMembershipIsEnabled = useMemo(
    () => frontendSpec?.feature_flags?.project_membership === 'enabled',
    [frontendSpec]
  )

  const fetchProjectIdAndOwner = useCallback(() => {
    return projectsIguazioApi
      .getProjects({
        params: { 'filter[name]': params.projectName, include: 'owner' }
      })
      .then(projects => {
        const currentProjectInfo = projects.data
        const currentProjectData = currentProjectInfo.data?.[0]
        const projectId = currentProjectData?.id
        const ownerId = currentProjectData?.relationships?.owner?.data?.id ?? ''
        const ownerInfo = currentProjectInfo?.included.find(data => data.id === ownerId)
        const {
          attributes: { username = '', first_name: firstName = '', last_name: lastName = '' } = {}
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
  }, [params.projectName])

  const fetchProjectMembers = useCallback(
    projectId => {
      return projectsIguazioApi
        .getProjectMembers(projectId)
        .then(membersResponse => generateMembers(membersResponse, membersDispatch))
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
      fetchProjectMembersVisibility(params.projectName)
      fetchProjectOwnerVisibility(params.projectName)
      fetchProjectIdAndOwner()
        .then(fetchProjectMembers)
        .finally(() =>
          membersDispatch({
            type: membersActions.GET_PROJECT_USERS_DATA_END
          })
        )
    }
  }, [fetchProjectIdAndOwner, fetchProjectMembers, params.projectName, projectMembershipIsEnabled])

  const changeMembersCallback = jobId => {
    const fetchJob = () => {
      projectsIguazioApi.getProjectJob(jobId).then(response => {
        if (response.data.data.attributes.state !== COMPLETED_STATE) {
            setTimeout(fetchJob, 1000)
        } else {
          fetchProjectMembers(membersState.projectInfo.id).then(() => {
            membersDispatch({
              type: membersActions.GET_PROJECT_USERS_DATA_END
            })
            setNotification({
              status: 200,
              id: Math.random(),
              message: 'Members updated successfully'
            })
          })
        }
      })
    }

    membersDispatch({
      type: membersActions.GET_PROJECT_USERS_DATA_BEGIN
    })

    fetchJob()
  }

  const changeOwnerCallback = () => {
    const prevOwner = membersState.projectInfo.owner.id

    fetchProjectIdAndOwner().then(() => {
      if (!membersState.members.some(member => member.id === prevOwner)) {
        navigate('/projects/')
      }
    })
  }

  const resetProjectData = useCallback(() => {
    membersDispatch({
      type: membersActions.RESET_MEMBERS_STATE
    })
  }, [])

  useEffect(() => {
    membersDispatch({
      type: membersActions.GET_PROJECT_USERS_DATA_BEGIN
    })
    fetchProjectUsersData()

    return () => {
      resetProjectData()
    }
  }, [fetchProjectUsersData, resetProjectData])

  useEffect(() => {
    isProjectValid(navigate, projectStore.projectsNames.data, params.projectName)
  }, [navigate, params.projectName, projectStore.projectsNames.data])

  useEffect(() => {
    if (!validTabs.includes(params.pageTab)) {
      navigate(`/projects/${params.projectName}/settings/general`)
    }
  }, [navigate, params.pageTab, params.projectName])

  return (
    <div className="settings">
      <div className="settings__header">
        <Breadcrumbs />
      </div>
      <div className="settings__content">
        <ContentMenu
          activeTab={params.pageTab}
          location={location}
          screen={page}
          tabs={tabs(projectMembershipIsEnabled)}
        />
        {params.pageTab === PROJECTS_SETTINGS_MEMBERS_TAB && projectMembershipIsEnabled ? (
          <ProjectSettingsMembers
            changeMembersCallback={changeMembersCallback}
            loading={membersState.loading}
            membersState={membersState}
            membersDispatch={membersDispatch}
            projectMembersIsShown={projectMembersIsShown}
            setNotification={setNotification}
          />
        ) : params.pageTab === PROJECTS_SETTINGS_SECRETS_TAB ? (
          <ProjectSettingsSecrets setNotification={setNotification} />
        ) : (
          <ProjectSettingsGeneral
            changeOwnerCallback={changeOwnerCallback}
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

export default connect(
  ({ appStore, projectStore }) => ({
    projectStore,
    frontendSpec: appStore.frontendSpec
  }),
  {
    setNotification: notificationActions.setNotification
  }
)(ProjectSettings)
