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
import { connect, useDispatch } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import ProjectSettingsGeneral from '../../elements/ProjectSettingsGeneral/ProjectSettingsGeneral'
import ProjectSettingsMembers from '../../elements/ProjectSettingsMembers/ProjectSettingsMembers'
import ProjectSettingsSecrets from '../../elements/ProjectSettingsSecrets/ProjectSettingsSecrets'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import ContentMenu from '../../elements/ContentMenu/ContentMenu'

import {
  COMPLETED_STATE,
  generateMembers,
  isProjectMembersTabShown,
  page,
  tabs,
  validTabs
} from './projectSettings.util'
import {
  initialMembersState,
  membersActions,
  membersReducer
} from '../../elements/MembersPopUp/membersReducer'
import projectsIguazioApi from '../../api/projects-iguazio-api'
import { PROJECTS_SETTINGS_MEMBERS_TAB, PROJECTS_SETTINGS_SECRETS_TAB } from '../../constants'
import { setNotification } from '../../reducers/notificationReducer'
import { showErrorNotification } from '../../utils/notifications.util'

import './projectSettings.scss'

const ProjectSettings = ({ frontendSpec }) => {
  const [projectMembersIsShown, setProjectMembersIsShown] = useState(false)
  const [projectOwnerIsShown, setProjectOwnerIsShown] = useState(false)
  const [membersState, membersDispatch] = useReducer(membersReducer, initialMembersState)
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()

  const projectMembershipIsEnabled = useMemo(
    () => frontendSpec?.feature_flags?.project_membership === 'enabled',
    [frontendSpec]
  )
  const projectMembersTabIsShown = useMemo(
    () => isProjectMembersTabShown(projectMembershipIsEnabled, membersState),
    [membersState, projectMembershipIsEnabled]
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
        const payload = {
          id: projectId,
          owner: { id: ownerId, username, firstName, lastName }
        }

        membersDispatch({
          type: membersActions.SET_PROJECT_INFO,
          payload
        })

        return payload
      })
  }, [params.projectName])

  const fetchProjectMembers = useCallback(
    (projectId, owner) => {
      return projectsIguazioApi
        .getProjectMembers(projectId)
        .then(membersResponse => generateMembers(membersResponse, membersDispatch, owner))
        .catch(error => showErrorNotification(dispatch, error, 'Failed to fetch project members'))
    },
    [dispatch]
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
  const fetchActiveUser = () => {
    projectsIguazioApi.getActiveUser().then(response => {
      const activeUser = response.data
      activeUser.data.attributes.user_policies_collection = new Set([
        ...activeUser.data.attributes.assigned_policies,
        ...(activeUser.included?.reduce?.(
          (policies, group) => [...policies, ...group.attributes.assigned_policies],
          []
        ) || [])
      ])
      
      membersDispatch({
        type: membersActions.SET_ACTIVE_USER,
        payload: activeUser
      })
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
      fetchProjectOwnerVisibility(params.projectName)
      fetchProjectIdAndOwner()
        .then(({ id: projectId, owner }) => {
          fetchActiveUser()
          fetchProjectMembersVisibility(params.projectName)

          return fetchProjectMembers(projectId, owner)
        })
        .catch(() => {
          setProjectMembersIsShown(false)
        })
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
          fetchProjectMembers(membersState.projectInfo.id, membersState.projectInfo.owner).then(
            () => {
              membersDispatch({
                type: membersActions.GET_PROJECT_USERS_DATA_END
              })
              dispatch(
                setNotification({
                  status: 200,
                  id: Math.random(),
                  message: 'Members updated successfully'
                })
              )
            }
          )
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

    return fetchProjectIdAndOwner().then(() => {
      if (!membersState.users.some(member => member.id === prevOwner)) {
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
          tabs={tabs(projectMembersTabIsShown)}
        />
        {params.pageTab === PROJECTS_SETTINGS_MEMBERS_TAB && projectMembersTabIsShown ? (
          <ProjectSettingsMembers
            changeMembersCallback={changeMembersCallback}
            loading={membersState.loading}
            membersState={membersState}
            membersDispatch={membersDispatch}
            projectMembersIsShown={projectMembersIsShown}
          />
        ) : params.pageTab === PROJECTS_SETTINGS_SECRETS_TAB ? (
          <ProjectSettingsSecrets setNotification={setNotification} />
        ) : (
          <ProjectSettingsGeneral
            changeOwnerCallback={changeOwnerCallback}
            membersState={membersState}
            projectMembershipIsEnabled={projectMembershipIsEnabled}
            projectOwnerIsShown={projectOwnerIsShown}
          />
        )}
      </div>
    </div>
  )
}

export default connect(
  ({ appStore }) => ({
    frontendSpec: appStore.frontendSpec
  }),
  null
)(ProjectSettings)
