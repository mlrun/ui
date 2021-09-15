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
import { useHistory, useLocation } from 'react-router-dom'
import { forEach, groupBy } from 'lodash'

import ProjectView from './ProjectView'

import featureStoreActions from '../../actions/featureStore'
import notificationActions from '../../actions/notification'
import projectsAction from '../../actions/projects'
import projectsApi from '../../api/projects-api'
import projectsIguazioApi from '../../api/projects-iguazio-api'
import { getLinks, generateCreateNewOptions } from './project.utils'
import { generateKeyValues, parseKeyValues } from '../../utils'
import { KEY_CODES } from '../../constants'
import {
  initialMembersState,
  membersActions,
  membersReducer
} from '../../elements/MembersPopUp/membersReducer'

import { ReactComponent as User } from '../../images/user.svg'
import { ReactComponent as Users } from '../../images/users.svg'

import './project.scss'

const Project = ({
  addProjectLabel,
  appStore,
  editProjectLabels,
  featureStore,
  fetchProject,
  fetchProjectFeatureSets,
  fetchProjectFiles,
  fetchProjectModels,
  match,
  projectStore,
  removeFeatureStoreError,
  removeNewFeatureSet,
  removeProjectData,
  setNotification
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
    },
    source: {
      value: null,
      isEdit: false
    }
  })
  const [
    createFeatureSetPanelIsOpen,
    setCreateFeatureSetPanelIsOpen
  ] = useState(false)
  const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false)
  const [showManageMembers, setShowManageMembers] = useState(false)
  const [showChangeOwner, setShowChangeOwner] = useState(false)
  const [visibleChipsMaxLength, setVisibleChipsMaxLength] = useState(1)
  const history = useHistory()
  const inputRef = React.createRef()
  const location = useLocation()

  const { links, createNewOptions } = useMemo(() => {
    const links = getLinks(match)
    const createNewOptions = generateCreateNewOptions(
      history,
      match,
      setArtifactKind,
      setIsPopupDialogOpen,
      location,
      setCreateFeatureSetPanelIsOpen
    )

    return {
      links,
      createNewOptions
    }
  }, [history, location, match])

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
      },
      source: {
        value: prevState.source.value ?? projectStore.project.data.spec.source,
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

  const fetchProjectData = useCallback(() => {
    fetchProject(match.params.projectName)
    fetchProjectIdAndOwner().then(fetchProjectMembers)
  }, [fetchProject, fetchProjectIdAndOwner, match.params.projectName])

  const resetProjectData = useCallback(() => {
    removeProjectData()
    membersDispatch({
      type: membersActions.RESET_MEMBERS_STATE
    })
  }, [removeProjectData])

  useEffect(() => {
    fetchProjectData()

    return () => {
      resetProjectData()
    }
  }, [fetchProjectData, removeProjectData, resetProjectData])

  const handleSetProjectData = useCallback(() => {
    const data = {
      name: editProject.name.value ?? projectStore.project.data.metadata.name,
      goals: editProject.goals.value ?? projectStore.project.data.spec.goals,
      source: editProject.source.value ?? projectStore.project.data.spec.source,
      description:
        editProject.description.value ??
        projectStore.project.data.spec.description
    }

    closeEditMode()
    projectsApi
      .updateProject(match.params.projectName, {
        metadata: {
          name: data.name
        },
        spec: {
          description: data.description,
          goals: data.goals,
          source: data.source
        }
      })
      .then(() => {
        history.push(`/projects/${data.name}`)
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
          },
          source: {
            value: projectStore.project.data.spec.source,
            isEdit: false
          }
        })
      })
  }, [closeEditMode, editProject, history, match, projectStore.project])

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
      editProject.goals.isEdit ||
      editProject.source.isEdit
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

  const closePanel = () => {
    setCreateFeatureSetPanelIsOpen(false)
    removeNewFeatureSet()

    if (featureStore.error) {
      removeFeatureStoreError()
    }
  }

  const createFeatureSetSuccess = () => {
    setCreateFeatureSetPanelIsOpen(false)
    removeNewFeatureSet()

    setNotification({
      status: 200,
      id: Math.random(),
      message: 'Feature set successfully created'
    })
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
      },
      source: {
        ...prevState.source,
        isEdit: inputName === 'source'
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
        },
        source: {
          ...prevState.source,
          value: editProject.source.isEdit ? value : prevState.source.value
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
    fetchProjectData()
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
      name: editProject.name.value ?? projectStore.project.data.metadata.name,
      source: editProject.source.value ?? projectStore.project.data.spec.source
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
        goals: projectData.goals,
        source: projectData.source
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
      closePanel={closePanel}
      createFeatureSetPanelIsOpen={createFeatureSetPanelIsOpen}
      createFeatureSetSuccess={createFeatureSetSuccess}
      createNewOptions={createNewOptions}
      editProject={editProject}
      fetchProjectFeatureSets={fetchProjectFeatureSets}
      fetchProjectFiles={fetchProjectFiles}
      fetchProjectModels={fetchProjectModels}
      frontendSpec={appStore.frontendSpec}
      handleAddProjectLabel={handleAddProjectLabel}
      handleEditProject={handleEditProject}
      handleLaunchIDE={handleLaunchIDE}
      handleOnChangeProject={handleOnChangeProject}
      handleOnKeyDown={handleOnKeyDown}
      handleUpdateProjectLabels={handleUpdateProjectLabels}
      isPopupDialogOpen={isPopupDialogOpen}
      links={links}
      match={match}
      membersDispatch={membersDispatch}
      membersState={membersState}
      projectLabels={projectLabels}
      ref={inputRef}
      refresh={handleRefresh}
      setIsPopupDialogOpen={setIsPopupDialogOpen}
      setShowChangeOwner={setShowChangeOwner}
      setShowManageMembers={setShowManageMembers}
      showChangeOwner={showChangeOwner}
      showManageMembers={showManageMembers}
      visibleChipsMaxLength={visibleChipsMaxLength}
    />
  )
}

Project.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default connect(
  ({ appStore, featureStore, projectStore }) => ({
    appStore,
    featureStore,
    projectStore
  }),
  {
    ...featureStoreActions,
    ...notificationActions,
    ...projectsAction
  }
)(Project)
