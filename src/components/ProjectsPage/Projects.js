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
import React, { useEffect, useState, useCallback } from 'react'
import { connect, useDispatch } from 'react-redux'
import yaml from 'js-yaml'
import { orderBy } from 'lodash'
import axios from 'axios'
import { useParams } from 'react-router-dom'

import ProjectsView from './ProjectsView'

import {
  generateProjectActionsMenu,
  handleDeleteProjectError,
  projectsSortOptions,
  successProjectDeletingMessage
} from './projectsData'
import nuclioActions from '../../actions/nuclio'
import projectsAction from '../../actions/projects'
import { DANGER_BUTTON, FORBIDDEN_ERROR_STATUS_CODE, PRIMARY_BUTTON } from 'igz-controls/constants'
import { setNotification } from '../../reducers/notificationReducer'

import { useNuclioMode } from '../../hooks/nuclioMode.hook'

const Projects = ({
  changeProjectState,
  createNewProject,
  deleteProject,
  fetchNuclioFunctions,
  fetchProject,
  fetchProjects,
  fetchProjectsNames,
  fetchProjectsSummary,
  projectStore,
  removeNewProject,
  removeNewProjectError,
  removeProjects,
  setNewProjectDescription,
  setNewProjectLabels,
  setNewProjectName
}) => {
  const [actionsMenu, setActionsMenu] = useState({})
  const [confirmData, setConfirmData] = useState(null)
  const [convertedYaml, setConvertedYaml] = useState('')
  const [createProject, setCreateProject] = useState(false)
  const [filteredProjects, setFilteredProjects] = useState([])
  const [filterByName, setFilterByName] = useState('')
  const [filterMatches, setFilterMatches] = useState([])
  const [isDescendingOrder, setIsDescendingOrder] = useState(false)
  const [isNameValid, setNameValid] = useState(true)
  const [selectedProjectsState, setSelectedProjectsState] = useState('active')
  const [sortProjectId, setSortProjectId] = useState('byName')
  const [source] = useState(axios.CancelToken.source())
  const urlParams = useParams()
  const dispatch = useDispatch()

  const { isNuclioModeDisabled } = useNuclioMode()

  const fetchMinimalProjects = useCallback(() => {
    fetchProjects({ format: 'minimal' })
  }, [fetchProjects])

  const isValidProjectState = useCallback(
    project => {
      return (
        (selectedProjectsState === 'active' && project.status.state !== 'archived') ||
        project.status.state === selectedProjectsState
      )
    },
    [selectedProjectsState]
  )

  const handleFilterProject = useCallback(
    project => {
      return filterByName.length > 0
        ? project.metadata.name.includes(filterByName) && isValidProjectState(project)
        : isValidProjectState(project)
    },
    [filterByName, isValidProjectState]
  )

  const handleSortProjects = useCallback(
    projects => {
      const sortPath = projectsSortOptions.find(option => option.id === sortProjectId).path

      return orderBy(projects, [sortPath], [isDescendingOrder ? 'desc' : 'asc'])
    },
    [isDescendingOrder, sortProjectId]
  )

  const refreshProjects = useCallback(() => {
    if (!isNuclioModeDisabled) {
      fetchNuclioFunctions()
    }

    removeProjects()
    fetchMinimalProjects()
    fetchProjectsSummary(source.token)
  }, [
    fetchNuclioFunctions,
    fetchMinimalProjects,
    fetchProjectsSummary,
    isNuclioModeDisabled,
    removeProjects,
    source.token
  ])

  const handleSearchOnFocus = useCallback(() => {
    refreshProjects()
  }, [refreshProjects])

  const handleSelectSortOption = option => {
    setSortProjectId(option)

    if (option === 'byDate' && sortProjectId !== 'byDate') {
      setIsDescendingOrder(true)
    }
  }

  const handleArchiveProject = useCallback(
    project => {
      changeProjectState(project.metadata.name, 'archived')
        .then(() => {
          fetchMinimalProjects()
        })
        .catch(error => {
          dispatch(
            setNotification({
              status: 400,
              id: Math.random(),
              retry: () => handleArchiveProject(project),
              message:
                error.response?.status === FORBIDDEN_ERROR_STATUS_CODE
                  ? `You are not allowed to archive ${project.metadata.name} project`
                  : `Failed to archive ${project.metadata.name} project`
            })
          )
        })
      setConfirmData(null)
    },
    [changeProjectState, dispatch, fetchMinimalProjects]
  )

  const handleDeleteProject = useCallback(
    (project, deleteNonEmpty) => {
      setConfirmData(null)
      deleteProject(project.metadata.name, deleteNonEmpty)
        .then(() => {
          fetchMinimalProjects()
          dispatch(
            setNotification({
              status: 200,
              id: Math.random(),
              message: successProjectDeletingMessage
            })
          )
        })
        .catch(error => {
          handleDeleteProjectError(
            error,
            handleDeleteProject,
            project,
            setConfirmData,
            setNotification,
            dispatch
          )
        })
    },
    [deleteProject, dispatch, fetchMinimalProjects]
  )

  const handleUnarchiveProject = useCallback(
    project => {
      changeProjectState(project.metadata.name, 'online').then(() => {
        fetchMinimalProjects()
      })
    },
    [changeProjectState, fetchMinimalProjects]
  )

  const convertToYaml = useCallback(
    project => {
      if (convertedYaml.length > 0) {
        return setConvertedYaml('')
      }

      setConvertedYaml(yaml.dump(project, { lineWidth: -1 }))
    },
    [convertedYaml.length]
  )

  const onArchiveProject = useCallback(
    project => {
      setConfirmData({
        item: project,
        header: 'Archive project',
        message:
          "Note that moving a project to archive doesn't stop it from consuming resources. We recommend that " +
          "before setting the project as archive you'll remove scheduled jobs and suspend Nuclio functions.",
        btnConfirmLabel: 'Archive',
        btnConfirmType: PRIMARY_BUTTON,
        rejectHandler: () => {
          setConfirmData(null)
        },
        confirmHandler: handleArchiveProject
      })
    },
    [handleArchiveProject]
  )

  const onDeleteProject = useCallback(
    project => {
      setConfirmData({
        item: project,
        header: 'Delete project?',
        message: `You try to delete project "${project.metadata.name}". Deleted projects can not be restored.`,
        btnConfirmLabel: 'Delete',
        btnConfirmType: DANGER_BUTTON,
        rejectHandler: () => {
          setConfirmData(null)
        },
        confirmHandler: handleDeleteProject
      })
    },
    [handleDeleteProject]
  )

  const viewYaml = useCallback(
    projectMinimal => {
      if (projectMinimal?.metadata?.name) {
        fetchProject(projectMinimal.metadata.name)
          .then(project => {
            convertToYaml(project)
          })
          .catch(() => {
            setConvertedYaml('')

            dispatch(
              setNotification({
                status: 400,
                id: Math.random(),
                retry: () => viewYaml(projectMinimal),
                message: "Failed to fetch project's YAML"
              })
            )
          })
      } else {
        setConvertedYaml('')
      }
    },
    [convertToYaml, dispatch, fetchProject]
  )

  useEffect(() => {
    setActionsMenu(
      generateProjectActionsMenu(
        projectStore.projects,
        viewYaml,
        onArchiveProject,
        handleUnarchiveProject,
        onDeleteProject
      )
    )
  }, [
    convertToYaml,
    onArchiveProject,
    onDeleteProject,
    handleUnarchiveProject,
    projectStore.projects,
    viewYaml
  ])

  useEffect(() => {
    if (!isNuclioModeDisabled) {
      fetchNuclioFunctions()
    }

    fetchMinimalProjects()
    fetchProjectsSummary(source.token)
  }, [
    fetchMinimalProjects,
    fetchNuclioFunctions,
    fetchProjectsSummary,
    isNuclioModeDisabled,
    source.token
  ])

  useEffect(() => {
    return () => {
      source.cancel('canceled')
    }
  }, [source])

  useEffect(() => {
    setFilteredProjects(handleSortProjects(projectStore.projects.filter(handleFilterProject)))
  }, [handleFilterProject, handleSortProjects, projectStore.projects])

  useEffect(() => {
    if (filterByName.length > 0) {
      setFilterMatches(filteredProjects.map(func => func.metadata.name))
    }
  }, [filterByName, filteredProjects])

  const closeNewProjectPopUp = useCallback(() => {
    if (projectStore.newProject.error) {
      removeNewProjectError()
    }

    removeNewProject()
    setNameValid(true)
    setCreateProject(false)
  }, [projectStore.newProject.error, removeNewProject, removeNewProjectError])

  const handleCreateProject = e => {
    e.preventDefault()

    if (e.currentTarget.checkValidity()) {
      if (projectStore.newProject.name.length === 0) {
        setNameValid(false)
        return false
      } else if (isNameValid) {
        setNameValid(true)
      }

      createNewProject({
        metadata: {
          name: projectStore.newProject.name,
          labels: projectStore.newProject.labels
        },
        spec: {
          description: projectStore.newProject.description
        }
      }).then(result => {
        if (result) {
          setCreateProject(false)
          removeNewProject()
          refreshProjects()
          fetchProjectsNames()
        }
      })
    }
  }

  return (
    <ProjectsView
      actionsMenu={actionsMenu}
      closeNewProjectPopUp={closeNewProjectPopUp}
      confirmData={confirmData}
      convertedYaml={convertedYaml}
      convertToYaml={convertToYaml}
      createProject={createProject}
      filterByName={filterByName}
      filteredProjects={filteredProjects}
      filterMatches={filterMatches}
      handleCreateProject={handleCreateProject}
      handleSelectSortOption={handleSelectSortOption}
      handleSearchOnFocus={handleSearchOnFocus}
      isDescendingOrder={isDescendingOrder}
      isNameValid={isNameValid}
      projectStore={projectStore}
      refreshProjects={refreshProjects}
      removeNewProjectError={removeNewProjectError}
      selectedProjectsState={selectedProjectsState}
      setCreateProject={setCreateProject}
      setFilterByName={setFilterByName}
      setFilterMatches={setFilterMatches}
      setIsDescendingOrder={setIsDescendingOrder}
      setNameValid={setNameValid}
      setNewProjectDescription={setNewProjectDescription}
      setNewProjectName={setNewProjectName}
      setNewProjectLabels={setNewProjectLabels}
      setSelectedProjectsState={setSelectedProjectsState}
      sortProjectId={sortProjectId}
      urlParams={urlParams}
    />
  )
}

export default connect(
  projectStore => ({
    ...projectStore
  }),
  {
    ...projectsAction,
    ...nuclioActions
  }
)(Projects)
