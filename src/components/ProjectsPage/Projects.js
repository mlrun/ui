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
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty, last, orderBy } from 'lodash'
import FileSaver from 'file-saver'
import yaml from 'js-yaml'

import ProjectsView from './ProjectsView'

import {
  generateProjectActionsMenu,
  handleDeleteProjectError,
  pollDeletingProjects,
  projectDeletionKind,
  projectDeletionWrapperKind,
  projectsSortOptions
} from './projects.util'
import nuclioActions from '../../actions/nuclio'
import projectsAction from '../../actions/projects'
import { BG_TASK_RUNNING, isBackgroundTaskRunning } from '../../utils/poll.util'
import { DANGER_BUTTON, FORBIDDEN_ERROR_STATUS_CODE, PRIMARY_BUTTON } from 'igz-controls/constants'
import { fetchBackgroundTasks } from '../../reducers/tasksReducer'
import { setNotification } from '../../reducers/notificationReducer'
import { showErrorNotification } from '../../utils/notifications.util'
import { useMode } from '../../hooks/mode.hook'
import { useNuclioMode } from '../../hooks/nuclioMode.hook'

const Projects = () => {
  const [actionsMenu, setActionsMenu] = useState({})
  const [confirmData, setConfirmData] = useState(null)
  const [convertedYaml, setConvertedYaml] = useState('')
  const [createProject, setCreateProject] = useState(false)
  const [filteredProjects, setFilteredProjects] = useState([])
  const [filterByName, setFilterByName] = useState('')
  const [filterMatches, setFilterMatches] = useState([])
  const [isDescendingOrder, setIsDescendingOrder] = useState(false)
  const [selectedProjectsState, setSelectedProjectsState] = useState('active')
  const [sortProjectId, setSortProjectId] = useState('byName')
  const [deletingProjects, setDeletingProjects] = useState({})

  const abortControllerRef = useRef(new AbortController())
  const terminatePollRef = useRef(null)

  const dispatch = useDispatch()
  const { isDemoMode } = useMode()
  const { isNuclioModeDisabled } = useNuclioMode()
  const projectStore = useSelector(store => store.projectStore)
  const tasksStore = useSelector(store => store.tasksStore)

  const fetchMinimalProjects = useCallback(() => {
    dispatch(projectsAction.fetchProjects({ format: 'minimal' }))
  }, [dispatch])

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
        ? project.metadata.name.toLocaleLowerCase().includes(filterByName.toLocaleLowerCase()) &&
            isValidProjectState(project)
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
    abortControllerRef.current = new AbortController()

    if (!isNuclioModeDisabled) {
      dispatch(nuclioActions.fetchNuclioFunctions())
    }

    dispatch(projectsAction.removeProjects())
    fetchMinimalProjects()
    dispatch(projectsAction.fetchProjectsSummary(abortControllerRef.current.signal, refreshProjects))

    dispatch(fetchBackgroundTasks({}))
      .unwrap()
      .then(backgroundTasks => {
        const wrapperIsUsed = backgroundTasks.some(backgroundTask =>
          backgroundTask.metadata.kind.startsWith(projectDeletionWrapperKind)
        )

        const newDeletingProjects = backgroundTasks
          .filter(
            backgroundTask =>
              backgroundTask.metadata.kind.startsWith(
                wrapperIsUsed ? projectDeletionWrapperKind : projectDeletionKind
              ) && backgroundTask.status.state === BG_TASK_RUNNING
          )
          .reduce((acc, backgroundTask) => {
            acc[backgroundTask.metadata.name] = last(backgroundTask.metadata.kind.split('.'))

            return acc
          }, {})

        setDeletingProjects(newDeletingProjects)

        if (!isEmpty(newDeletingProjects)) {
          pollDeletingProjects(terminatePollRef, newDeletingProjects, refreshProjects, dispatch)
        }
      })
      .catch(error => {
        showErrorNotification(dispatch, error, '')
      })
  }, [fetchMinimalProjects, isNuclioModeDisabled, dispatch])

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
      dispatch(projectsAction.changeProjectState(project.metadata.name, 'archived'))
        .then(() => {
          fetchMinimalProjects()
        })
        .catch(error => {
          const customErrorMsg =
            error.response?.status === FORBIDDEN_ERROR_STATUS_CODE
              ? `You are not allowed to archive ${project.metadata.name} project`
              : `Failed to archive ${project.metadata.name} project`

          showErrorNotification(dispatch, error, '', customErrorMsg, () =>
            handleArchiveProject(project)
          )
        })
      setConfirmData(null)
    },
    [dispatch, fetchMinimalProjects]
  )

  const handleDeleteProject = useCallback(
    (project, deleteNonEmpty) => {
      setConfirmData(null)

      dispatch(projectsAction.deleteProject(project.metadata.name, deleteNonEmpty))
        .then(response => {
          if (isBackgroundTaskRunning(response)) {
            dispatch(
              setNotification({
                status: 200,
                id: Math.random(),
                message: 'Project deletion in progress'
              })
            )

            setDeletingProjects(prevDeletingProjects => {
              const newDeletingProjects = {
                ...prevDeletingProjects,
                [response.data.metadata.name]: last(response.data.metadata.kind.split('.'))
              }

              pollDeletingProjects(terminatePollRef, newDeletingProjects, refreshProjects, dispatch)

              return newDeletingProjects
            })
          } else {
            fetchMinimalProjects()
            dispatch(
              setNotification({
                status: 200,
                id: Math.random(),
                message: `Project "${project}" was deleted successfully`
              })
            )
          }
        })
        .catch(error => {
          handleDeleteProjectError(
            error,
            handleDeleteProject,
            project,
            setConfirmData,
            dispatch,
            deleteNonEmpty
          )
        })
    },
    [dispatch, fetchMinimalProjects, refreshProjects]
  )

  const handleUnarchiveProject = useCallback(
    project => {
      dispatch(projectsAction.changeProjectState(project.metadata.name, 'online')).then(() => {
        fetchMinimalProjects()
      })
    },
    [dispatch, fetchMinimalProjects]
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

  const exportYaml = useCallback(
    projectMinimal => {
      if (projectMinimal?.metadata?.name) {
        dispatch(projectsAction.fetchProject(projectMinimal.metadata.name))
          .then(project => {
            var blob = new Blob([yaml.dump(project, { lineWidth: -1 })])

            FileSaver.saveAs(blob, `${projectMinimal.metadata.name}.yaml`)
          })
          .catch(error => {
            showErrorNotification(dispatch, error, '', "Failed to fetch project's YAML", () =>
              exportYaml(projectMinimal)
            )
          })
      }
    },
    [dispatch]
  )

  const viewYaml = useCallback(
    projectMinimal => {
      if (projectMinimal?.metadata?.name) {
        dispatch(projectsAction.fetchProject(projectMinimal.metadata.name))
          .then(project => {
            convertToYaml(project)
          })
          .catch(error => {
            setConvertedYaml('')

            showErrorNotification(dispatch, error, '', "Failed to fetch project's YAML", () =>
              viewYaml(projectMinimal)
            )
          })
      } else {
        setConvertedYaml('')
      }
    },
    [convertToYaml, dispatch]
  )

  const removeNewProjectError = useCallback(
    () => dispatch(projectsAction.removeNewProjectError()),
    [dispatch]
  )

  useEffect(() => {
    setActionsMenu(
      generateProjectActionsMenu(
        projectStore.projects,
        deletingProjects,
        exportYaml,
        viewYaml,
        onArchiveProject,
        handleUnarchiveProject,
        onDeleteProject
      )
    )
  }, [
    convertToYaml,
    deletingProjects,
    exportYaml,
    handleUnarchiveProject,
    isDemoMode,
    onArchiveProject,
    onDeleteProject,
    projectStore.projects,
    viewYaml
  ])

  useEffect(() => {
    refreshProjects()
  }, [refreshProjects])

  useEffect(() => {
    return () => {
      abortControllerRef.current.abort()
    }
  }, [])

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

    setCreateProject(false)
  }, [projectStore.newProject.error, removeNewProjectError])

  const handleCreateProject = (e, formState) => {
    e.preventDefault()

    if (e.currentTarget.checkValidity() && formState.valid) {
      dispatch(
        projectsAction.createNewProject({
          metadata: {
            name: formState.values.name,
            labels:
              formState.values.labels?.reduce((acc, labelData) => {
                acc[labelData.key] = labelData.value
                return acc
              }, {}) ?? {}
          },
          spec: {
            description: formState.values.description
          }
        })
      ).then(result => {
        if (result) {
          setCreateProject(false)
          refreshProjects()
          dispatch(projectsAction.fetchProjectsNames())
        }
      })
    }
  }

  return (
    <ProjectsView
      actionsMenu={actionsMenu}
      closeNewProjectPopUp={closeNewProjectPopUp}
      confirmData={confirmData}
      convertToYaml={convertToYaml}
      convertedYaml={convertedYaml}
      createProject={createProject}
      filterByName={filterByName}
      filterMatches={filterMatches}
      filteredProjects={filteredProjects}
      handleCreateProject={handleCreateProject}
      handleSearchOnFocus={handleSearchOnFocus}
      handleSelectSortOption={handleSelectSortOption}
      isDescendingOrder={isDescendingOrder}
      isDemoMode={isDemoMode}
      projectStore={projectStore}
      refreshProjects={refreshProjects}
      removeNewProjectError={removeNewProjectError}
      selectedProjectsState={selectedProjectsState}
      setCreateProject={setCreateProject}
      setFilterByName={setFilterByName}
      setFilterMatches={setFilterMatches}
      setIsDescendingOrder={setIsDescendingOrder}
      setSelectedProjectsState={setSelectedProjectsState}
      sortProjectId={sortProjectId}
      tasksStore={tasksStore}
    />
  )
}

export default Projects
