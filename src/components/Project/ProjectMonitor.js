import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
  useReducer,
  createRef
} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { forEach, groupBy } from 'lodash'

import ProjectMonitorView from './ProjectMonitorView'

import featureStoreActions from '../../actions/featureStore'
import projectsAction from '../../actions/projects'
import notificationActions from '../../actions/notification'
import functionsActions from '../../actions/functions'
import projectsIguazioApi from '../../api/projects-iguazio-api'
import {
  generateCreateNewOptions,
  handleFetchProjectError
} from './project.utils'
import { useDemoMode } from '../../hooks/demoMode.hook'
import {
  initialMembersState,
  membersActions,
  membersReducer
} from '../../elements/MembersPopUp/membersReducer'

import { ReactComponent as User } from '../../images/user.svg'
import { ReactComponent as Users } from '../../images/users.svg'

const ProjectMonitor = ({
  appStore,
  featureStore,
  fetchProject,
  fetchProjectSummary,
  fetchProjectFunctions,
  functionsStore,
  match,
  projectStore,
  removeFeatureStoreError,
  removeFunctionsError,
  removeNewFunction,
  removeNewFeatureSet,
  removeProjectSummary,
  removeProjectData,
  setNotification
}) => {
  const [membersState, membersDispatch] = useReducer(
    membersReducer,
    initialMembersState
  )

  const [artifactKind, setArtifactKind] = useState('')
  const [
    createFeatureSetPanelIsOpen,
    setCreateFeatureSetPanelIsOpen
  ] = useState(false)
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)
  const [projectMembersIsShown, setProjectMembersIsShown] = useState(false)
  const [projectOwnerIsShown, setProjectOwnerIsShown] = useState(false)
  const [showManageMembers, setShowManageMembers] = useState(false)
  const [showChangeOwner, setShowChangeOwner] = useState(false)
  const [isNewFunctionPopUpOpen, setIsNewFunctionPopUpOpen] = useState(false)
  const [showFunctionsPanel, setShowFunctionsPanel] = useState(false)
  const [confirmData, setConfirmData] = useState(null)
  const history = useHistory()
  const isDemoMode = useDemoMode()

  const { createNewOptions } = useMemo(() => {
    const createNewOptions = generateCreateNewOptions(
      history,
      match,
      setArtifactKind,
      setIsPopupDialogOpen,
      setCreateFeatureSetPanelIsOpen,
      setIsNewFunctionPopUpOpen
    )

    return {
      createNewOptions
    }
  }, [history, match])

  const projectMembershipIsEnabled = useMemo(
    () =>
      appStore.frontendSpec?.feature_flags?.project_membership === 'enabled',
    [appStore.frontendSpec]
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

  const fetchProjectData = useCallback(() => {
    fetchProject(match.params.projectName).catch(error => {
      handleFetchProjectError(error, history, setConfirmData)
    })
  }, [fetchProject, history, match.params.projectName])

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

  const resetProjectData = useCallback(() => {
    removeProjectData()
    membersDispatch({
      type: membersActions.RESET_MEMBERS_STATE
    })
  }, [removeProjectData])

  useEffect(() => {
    fetchProjectData()
    fetchProjectSummary(match.params.projectName)

    return () => {
      resetProjectData()
      removeProjectSummary()
    }
  }, [
    fetchProjectSummary,
    fetchProjectData,
    match.params.projectName,
    removeProjectSummary,
    resetProjectData
  ])

  useEffect(() => {
    fetchProjectUsersData()
  }, [fetchProjectUsersData])

  const changeMembersCallback = () => {
    fetchProjectMembers(membersState.projectInfo.id)
  }

  const changeOwnerCallback = () => {
    fetchProjectIdAndOwner()
  }

  const closeFeatureSetPanel = () => {
    setCreateFeatureSetPanelIsOpen(false)
    removeNewFeatureSet()

    if (featureStore.error) {
      removeFeatureStoreError()
    }
  }

  const closeFunctionsPanel = () => {
    setShowFunctionsPanel(false)
    removeNewFunction()

    if (functionsStore.error) {
      removeFunctionsError()
    }
  }

  const createFeatureSetSuccess = async () => {
    setCreateFeatureSetPanelIsOpen(false)
    removeNewFeatureSet()
  }

  const createFunctionSuccess = async () => {
    setShowFunctionsPanel(false)
    removeNewFunction()

    return setNotification({
      status: 200,
      id: Math.random(),
      message: 'Function created successfully'
    })
  }

  const handleDeployFunctionSuccess = async ready => {
    let { name, tag } = functionsStore.newFunction.metadata
    const tab = ready === false ? 'build-log' : 'overview'

    tag ||= 'latest'

    setShowFunctionsPanel(false)
    removeNewFunction()

    const funcs = await fetchProjectFunctions(match.params.projectName).catch(
      () => {
        setNotification({
          status: 200,
          id: Math.random(),
          message: 'Function deployment initiated successfully'
        })

        setNotification({
          status: 400,
          id: Math.random(),
          message: 'Failed to fetch functions'
        })
      }
    )

    if (funcs) {
      const currentItem = funcs.find(func => {
        return func.metadata.name === name && func.metadata.tag === tag
      })

      history.push(
        `/projects/${match.params.projectName}/functions/${currentItem.metadata.hash}/${tab}`
      )

      return setNotification({
        status: 200,
        id: Math.random(),
        message: 'Function deployment initiated successfully'
      })
    }
  }

  const handleDeployFunctionFailure = async () => {
    const { name, tag } = functionsStore.newFunction.metadata

    setShowFunctionsPanel(false)
    removeNewFunction()

    const funcs = await fetchProjectFunctions(match.params.projectName).catch(
      () => {
        setNotification({
          status: 400,
          id: Math.random(),
          message: 'Function deployment failed to initiate'
        })

        setNotification({
          status: 400,
          id: Math.random(),
          message: 'Failed to fetch functions'
        })
      }
    )

    if (funcs) {
      const currentItem = funcs.find(func => {
        return func.metadata.name === name && func.metadata.tag === tag
      })

      history.push(
        `/projects/${match.params.projectName}/functions/${currentItem.metadata.hash}/overview`
      )

      return setNotification({
        status: 400,
        id: Math.random(),
        message: 'Function deployment failed to initiate'
      })
    }
  }

  const handleLaunchIDE = useCallback(launch => {}, [])

  const handleRefresh = () => {
    removeProjectData()
    removeProjectSummary()
    fetchProjectData()
    fetchProjectSummary(match.params.projectName)
    fetchProjectUsersData()
  }

  return (
    <ProjectMonitorView
      artifactKind={artifactKind}
      changeMembersCallback={changeMembersCallback}
      changeOwnerCallback={changeOwnerCallback}
      closeFeatureSetPanel={closeFeatureSetPanel}
      closeFunctionsPanel={closeFunctionsPanel}
      confirmData={confirmData}
      createFeatureSetPanelIsOpen={createFeatureSetPanelIsOpen}
      createFeatureSetSuccess={createFeatureSetSuccess}
      createFunctionSuccess={createFunctionSuccess}
      createNewOptions={createNewOptions}
      handleDeployFunctionFailure={handleDeployFunctionFailure}
      handleDeployFunctionSuccess={handleDeployFunctionSuccess}
      handleLaunchIDE={handleLaunchIDE}
      isDemoMode={isDemoMode}
      isNewFunctionPopUpOpen={isNewFunctionPopUpOpen}
      isPopupDialogOpen={isPopupDialogOpen}
      match={match}
      membersDispatch={membersDispatch}
      membersState={membersState}
      projectSummary={projectStore.projectSummary}
      projectMembersIsShown={projectMembersIsShown}
      projectMembershipIsEnabled={projectMembershipIsEnabled}
      projectOwnerIsShown={projectOwnerIsShown}
      refresh={handleRefresh}
      setIsNewFunctionPopUpOpen={setIsNewFunctionPopUpOpen}
      setIsPopupDialogOpen={setIsPopupDialogOpen}
      setShowChangeOwner={setShowChangeOwner}
      setShowFunctionsPanel={setShowFunctionsPanel}
      setShowManageMembers={setShowManageMembers}
      showChangeOwner={showChangeOwner}
      showFunctionsPanel={showFunctionsPanel}
      showManageMembers={showManageMembers}
    />
  )
}

ProjectMonitor.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default connect(
  ({ appStore, functionsStore, featureStore, projectStore }) => ({
    appStore,
    featureStore,
    functionsStore,
    projectStore
  }),
  {
    ...featureStoreActions,
    ...functionsActions,
    ...projectsAction,
    ...notificationActions
  }
)(ProjectMonitor)
