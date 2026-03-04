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
import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import ProjectSettingsGeneral from '../../elements/ProjectSettingsGeneral/ProjectSettingsGeneral'
import ProjectSettingsMembers from '../../elements/ProjectSettingsMembers/ProjectSettingsMembers'
import ProjectSettingsSecrets from '../../elements/ProjectSettingsSecrets/ProjectSettingsSecrets'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import ContentMenu from '../../elements/ContentMenu/ContentMenu'
import { Button, ConfirmDialog, Loader } from 'igz-controls/components'

import {
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
import { DANGER_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { PROJECTS_SETTINGS_MEMBERS_TAB, PROJECTS_SETTINGS_SECRETS_TAB } from '../../constants'
import { fetchProjects } from '../../reducers/projectReducer'
import { onDeleteProject } from '../ProjectsPage/projects.util'
import { setNotification } from 'igz-controls/reducers/notificationReducer'
import { showErrorNotification } from 'igz-controls/utils/notification.util'

import './projectSettings.scss'

const ProjectSettings = () => {
  const [projectMembersIsShown, setProjectMembersIsShown] = useState(false)
  const [projectOwnerIsShown, setProjectOwnerIsShown] = useState(false)
  const [confirmData, setConfirmData] = useState(null)
  const [membersState, membersDispatch] = useReducer(membersReducer, initialMembersState)
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()
  const deletingProjectsRef = useRef({})
  const terminatePollRef = useRef(null)
  const projectStore = useSelector(state => state.projectStore)
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)

  const projectMembershipIsEnabled = useMemo(
    () =>
      frontendSpec?.feature_flags?.project_membership === 'enabled' || frontendSpec?.ce?.version,
    [frontendSpec]
  )

  const userIsProjectOwner = useMemo(() => {
    const activeUsername = membersState?.activeUser?.data?.attributes?.username
    const ownerUsername = membersState?.projectInfo?.owner?.username
    return Boolean(activeUsername && activeUsername === ownerUsername)
  }, [membersState])

  const projectMembersTabIsShown = useMemo(
    () => isProjectMembersTabShown(projectMembershipIsEnabled, userIsProjectOwner, membersState),
    [userIsProjectOwner, membersState, projectMembershipIsEnabled]
  )

  const fetchProjectPolicies = useCallback(() => {
    return projectsIguazioApi
      .getProjectPolicies(params.projectName)
      .then(policiesResponse => generateMembers(policiesResponse, membersDispatch))
      .catch(error => {
        showErrorNotification(dispatch, error, 'Failed to fetch project members')
        throw error
      })
  }, [dispatch, params.projectName])

  const fetchActiveUser = () => {
    projectsIguazioApi.getActiveUser().then(response => {
      const activeUser = response.data
      const relationships = activeUser.relationships || []

      const userGroupNames = new Set(
        relationships
          .filter(rel => rel['@type']?.includes('usergroup'))
          .map(rel => rel.spec?.name)
          .filter(Boolean)
      )

      const userPoliciesCollection = new Set(
        relationships
          .filter(rel => rel['@type']?.includes('policy.Policy'))
          .map(rel => rel.spec?.displayName)
          .filter(Boolean)
      )

      membersDispatch({
        type: membersActions.SET_ACTIVE_USER,
        payload: {
          data: {
            id: activeUser.metadata?.id,
            attributes: {
              username: activeUser.metadata?.username,
              user_policies_collection: userPoliciesCollection,
              user_group_names: userGroupNames
            }
          }
        }
      })
    })
  }

  const fetchProjectUsersData = useCallback(() => {
    if (projectMembershipIsEnabled) {
      fetchActiveUser()

      fetchProjectPolicies()
        .catch(() => {
          setProjectMembersIsShown(false)
          setProjectOwnerIsShown(false)
        })
        .finally(() =>
          membersDispatch({
            type: membersActions.GET_PROJECT_USERS_DATA_END
          })
        )
    }
  }, [fetchProjectPolicies, projectMembershipIsEnabled])

  useEffect(() => {
    const activeUsername = membersState?.activeUser?.data?.attributes?.username
    const projectId = membersState?.projectInfo?.id

    if (activeUsername && projectId) {
      setProjectOwnerIsShown(userIsProjectOwner)
      setProjectMembersIsShown(projectMembersTabIsShown)
    }
  }, [
    membersState?.activeUser?.data?.attributes?.username,
    membersState?.projectInfo?.id,
    userIsProjectOwner,
    projectMembersTabIsShown
  ])

  const changeMembersCallback = userIsStillMember => {
    membersDispatch({
      type: membersActions.GET_PROJECT_USERS_DATA_BEGIN
    })

    if (userIsStillMember) {
      fetchProjectPolicies()
        .then(() => {
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
        })
        .catch(() => {
          membersDispatch({
            type: membersActions.GET_PROJECT_USERS_DATA_END
          })
        })
    } else {
      dispatch(
        setNotification({
          status: 200,
          id: Math.random(),
          message: 'Members updated successfully'
        })
      )
      navigate('/projects/')
    }
  }

  const changeOwnerCallback = () => {
    const prevOwnerUsername = membersState.projectInfo.owner.username

    return fetchProjectPolicies().then(() => {
      if (!membersState.members.some(member => member.id === prevOwnerUsername)) {
        navigate('/projects/')
      }
    })
  }

  const resetProjectData = useCallback(() => {
    membersDispatch({
      type: membersActions.RESET_MEMBERS_STATE
    })
  }, [])

  const fetchMinimalProjects = useCallback(() => {
    dispatch(fetchProjects({ params: { format: 'minimal' } }))
  }, [dispatch])

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
    <>
      {confirmData && (
        <ConfirmDialog
          cancelButton={{
            handler: confirmData.rejectHandler,
            label: 'Cancel',
            variant: TERTIARY_BUTTON
          }}
          closePopUp={confirmData.rejectHandler}
          confirmButton={{
            handler: confirmData.confirmHandler,
            label: confirmData.btnConfirmLabel,
            variant: confirmData.btnConfirmType
          }}
          isOpen={Boolean(confirmData)}
          header={confirmData.header}
          message={confirmData.message}
        />
      )}

      {projectStore.projectsToDelete.includes(params.projectName) && <Loader />}

      <div className="content-wrapper">
        <div className="content__header">
          <Breadcrumbs />
        </div>
        <div className="content settings-content">
          <div className="content__action-bar-wrapper">
            <ContentMenu
              activeTab={params.pageTab}
              location={location}
              screen={page}
              tabs={tabs(projectMembersTabIsShown)}
            />
            <div className="action-bar">
              {projectMembershipIsEnabled && (
                <Button
                  variant={DANGER_BUTTON}
                  label="Delete project"
                  onClick={event => {
                    event.stopPropagation()
                    onDeleteProject(
                      params.projectName,
                      setConfirmData,
                      dispatch,
                      deletingProjectsRef,
                      terminatePollRef,
                      fetchMinimalProjects,
                      navigate
                    )
                  }}
                  className="delete-project-btn"
                  disabled={
                    (!frontendSpec?.ce?.version && !userIsProjectOwner) ||
                    projectStore.loading ||
                    projectStore.project.loading
                  }
                />
              )}
            </div>
          </div>
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
    </>
  )
}

export default ProjectSettings
