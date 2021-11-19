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

import ProjectView from './ProjectView'

import featureStoreActions from '../../actions/featureStore'
import projectsAction from '../../actions/projects'
import projectsApi from '../../api/projects-api'
import projectsIguazioApi from '../../api/projects-iguazio-api'
import {
  getLinks,
  generateCreateNewOptions,
  handleFetchProjectError
} from './project.utils'
import { generateKeyValues, parseKeyValues } from '../../utils'
import { useDemoMode } from '../../hooks/demoMode.hook'
import { KEY_CODES } from '../../constants'
import {
  initialMembersState,
  membersActions,
  membersReducer
} from '../../elements/MembersPopUp/membersReducer'
import notificationActions from '../../actions/notification'
import functionsActions from '../../actions/functions'

import { ReactComponent as User } from '../../images/user.svg'
import { ReactComponent as Users } from '../../images/users.svg'

const Project = ({
  addProjectLabel,
  appStore,
  editProjectLabels,
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
  setNotification,
  setProjectData
}) => {
  const [membersState, membersDispatch] = useReducer(
    membersReducer,
    initialMembersState
  )
  const [artifactKind, setArtifactKind] = useState('')
  const [editProject, setEditProject] = useState({
    name: {
      value: null,
      isEdit: false
    },
    description: {
      value: null,
      isEdit: false
    },
    goals: {
      value: null,
      isEdit: false
    }
  })
  const [
    createFeatureSetPanelIsOpen,
    setCreateFeatureSetPanelIsOpen
  ] = useState(false)
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)
  const [projectMembersIsShown, setProjectMembersIsShown] = useState(false)
  const [projectOwnerIsShown, setProjectOwnerIsShown] = useState(false)
  const [showManageMembers, setShowManageMembers] = useState(false)
  const [showChangeOwner, setShowChangeOwner] = useState(false)
  const [visibleChipsMaxLength, setVisibleChipsMaxLength] = useState(1)
  const [isNewFunctionPopUpOpen, setIsNewFunctionPopUpOpen] = useState(false)
  const [showFunctionsPanel, setShowFunctionsPanel] = useState(false)
  const [confirmData, setConfirmData] = useState(null)
  const history = useHistory()
  const inputRef = React.createRef()
  const isDemoMode = useDemoMode()

  const { links, createNewOptions } = useMemo(() => {
    const links = getLinks(match)
    const createNewOptions = generateCreateNewOptions(
      history,
      match,
      setArtifactKind,
      setIsPopupDialogOpen,
      setCreateFeatureSetPanelIsOpen,
      setIsNewFunctionPopUpOpen
    )

    return {
      links,
      createNewOptions
    }
  }, [history, match])

  const projectMembershipIsEnabled = useMemo(
    () =>
      appStore.frontendSpec?.feature_flags?.project_membership === 'enabled',
    [appStore.frontendSpec]
  )

  const closeEditMode = useCallback(() => {
    setEditProject(prevState => ({
      name: {
        value: prevState.name.value ?? projectStore.project.data.metadata.name,
        isEdit: false
      },
      description: {
        value:
          prevState.description.value ??
          projectStore.project.data.spec.description,
        isEdit: false
      },
      goals: {
        value: prevState.goals.value ?? projectStore.project.data.spec.goals,
        isEdit: false
      }
    }))
  }, [projectStore.project])

  const fetchProjectIdAndOwner = useCallback(() => {
    return projectsIguazioApi
      .getProjects({
        params: { 'filter[name]': match.params.projectName, include: 'owner' }
      })
      .then(projects => {
        const currentProjectInfo = projects.data
        const currentProjectData = currentProjectInfo.data?.[0]
        const projectId = currentProjectData.id
        const ownerId = currentProjectData.relationships?.owner?.data?.id ?? ''
        const ownerInfo = currentProjectInfo.included.find(
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

  const handleSetProjectData = useCallback(() => {
    const data = {
      name: editProject.name.value ?? projectStore.project.data.metadata.name,
      goals: editProject.goals.value ?? projectStore.project.data.spec.goals,
      description:
        editProject.description.value ??
        projectStore.project.data.spec.description
    }

    setProjectData({
      ...projectStore.project,
      data: {
        ...projectStore.project.data,
        spec: {
          ...projectStore.project.data.spec,
          description: data.description,
          goals: data.goals
        },
        metadata: {
          ...projectStore.project.data.metadata,
          labels: {
            ...projectStore.project.data.metadata.labels,
            ...data.labels
          }
        }
      }
    })
    closeEditMode()
    projectsApi
      .updateProject(match.params.projectName, {
        metadata: {
          name: data.name
        },
        spec: {
          description: data.description,
          goals: data.goals,
          source: projectStore.project.data.spec.source
        }
      })
      .catch(() => {
        setEditProject({
          name: {
            value: projectStore.project.data.metadata.name,
            isEdit: false
          },
          description: {
            value: projectStore.project.data.spec.description,
            isEdit: false
          },
          goals: {
            value: projectStore.project.data.spec.goals,
            isEdit: false
          }
        })
      })
  }, [
    closeEditMode,
    editProject.description.value,
    editProject.goals.value,
    editProject.name.value,
    match.params.projectName,
    projectStore.project,
    setProjectData
  ])

  const handleDocumentClick = useCallback(
    event => {
      if (inputRef.current && event.target !== inputRef.current) {
        handleSetProjectData()
      }
    },
    [handleSetProjectData, inputRef]
  )

  useEffect(() => {
    if (
      editProject.name.isEdit ||
      editProject.description.isEdit ||
      editProject.goals.isEdit
    ) {
      document.addEventListener('click', handleDocumentClick)
    }

    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [editProject, handleDocumentClick])

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

  const handleAddProjectLabel = (label, labels) => {
    const objectLabels = generateKeyValues(labels)
    const newLabel = {
      [label.split(':')[0]]: label.split(':')[1].replace(' ', '')
    }

    setVisibleChipsMaxLength(null)
    addProjectLabel(newLabel, objectLabels)
  }

  const handleEditProject = useCallback(inputName => {
    setEditProject(prevState => ({
      ...prevState,
      name: {
        ...prevState.name,
        isEdit: inputName === 'name'
      },
      description: {
        ...prevState.description,
        isEdit: inputName === 'description'
      },
      goals: {
        ...prevState.goals,
        isEdit: inputName === 'goals'
      }
    }))
  }, [])

  const handleLaunchIDE = useCallback(launch => {}, [])

  const handleOnChangeProject = useCallback(
    value => {
      setEditProject(prevState => ({
        ...prevState,
        name: {
          ...prevState.name,
          value: editProject.name.isEdit ? value : prevState.name.value
        },
        description: {
          ...prevState.description,
          value: editProject.description.isEdit
            ? value
            : prevState.description.value
        },
        goals: {
          ...prevState.goals,
          value: editProject.goals.isEdit ? value : prevState.goals.value
        }
      }))
    },
    [editProject]
  )

  const handleOnKeyDown = useCallback(
    event => {
      if (event.keyCode === KEY_CODES.ENTER) {
        handleSetProjectData()
      }
    },
    [handleSetProjectData]
  )

  const handleRefresh = () => {
    removeProjectData()
    removeProjectSummary()
    fetchProjectData()
    fetchProjectSummary(match.params.projectName)
    fetchProjectUsersData()
  }

  const handleUpdateProjectLabels = labels => {
    const objectLabels = {}

    labels.forEach(label => {
      const splitedLabel = label.split(':')

      objectLabels[splitedLabel[0]] = splitedLabel[1].replace(' ', '')
    })

    const projectData = {
      description:
        editProject.description.value ??
        projectStore.project.data.spec.description,
      goals: editProject.goals.value ?? projectStore.project.data.spec.goals,
      name: editProject.name.value ?? projectStore.project.data.metadata.name
    }
    const data = {
      ...projectStore.project.data,
      metadata: {
        ...projectStore.project.data.metadata,
        labels: objectLabels,
        name: projectData.name
      },
      spec: {
        ...projectStore.project.data.spec,
        description: projectData.description,
        goals: projectData.goals
      }
    }

    setVisibleChipsMaxLength(1)
    editProjectLabels(match.params.projectName, { ...data }, objectLabels)
  }

  const projectLabels = useMemo(
    () =>
      projectStore.project.data?.metadata.labels
        ? parseKeyValues(projectStore.project.data.metadata.labels || {})
        : [],
    [projectStore.project.data]
  )

  return (
    <ProjectView
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
      editProject={editProject}
      handleAddProjectLabel={handleAddProjectLabel}
      handleDeployFunctionFailure={handleDeployFunctionFailure}
      handleDeployFunctionSuccess={handleDeployFunctionSuccess}
      handleEditProject={handleEditProject}
      handleLaunchIDE={handleLaunchIDE}
      handleOnChangeProject={handleOnChangeProject}
      handleOnKeyDown={handleOnKeyDown}
      handleUpdateProjectLabels={handleUpdateProjectLabels}
      isDemoMode={isDemoMode}
      isNewFunctionPopUpOpen={isNewFunctionPopUpOpen}
      isPopupDialogOpen={isPopupDialogOpen}
      links={links}
      match={match}
      membersDispatch={membersDispatch}
      membersState={membersState}
      projectSummary={projectStore.projectSummary}
      projectLabels={projectLabels}
      projectMembersIsShown={projectMembersIsShown}
      projectMembershipIsEnabled={projectMembershipIsEnabled}
      projectOwnerIsShown={projectOwnerIsShown}
      ref={inputRef}
      refresh={handleRefresh}
      setIsNewFunctionPopUpOpen={setIsNewFunctionPopUpOpen}
      setIsPopupDialogOpen={setIsPopupDialogOpen}
      setShowChangeOwner={setShowChangeOwner}
      setShowFunctionsPanel={setShowFunctionsPanel}
      setShowManageMembers={setShowManageMembers}
      showChangeOwner={showChangeOwner}
      showFunctionsPanel={showFunctionsPanel}
      showManageMembers={showManageMembers}
      visibleChipsMaxLength={visibleChipsMaxLength}
    />
  )
}

Project.propTypes = {
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
)(Project)
