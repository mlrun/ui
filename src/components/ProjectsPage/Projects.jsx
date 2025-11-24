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
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty, last, orderBy } from 'lodash'
import FileSaver from 'file-saver'
import yaml from 'js-yaml'

import ProjectsView from './ProjectsView'

import {
  generateAlerts,
  generateMonitoringCounters,
  generateProjectActionsMenu,
  onDeleteProject,
  pollDeletingProjects,
  projectDeletionKind,
  projectDeletionWrapperKind,
  projectsSortOptions
} from './projects.util'
import { BG_TASK_RUNNING } from '../../utils/poll.util'
import { PROJECT_ONLINE_STATUS } from '../../constants'
import { ConfirmDialog } from 'igz-controls/components'
import { openPopUp } from 'igz-controls/utils/common.util'
import {
  FORBIDDEN_ERROR_STATUS_CODE,
  NOTFOUND_ERROR_STATUS_CODE,
  PRIMARY_BUTTON
} from 'igz-controls/constants'
import { fetchBackgroundTasks } from '../../reducers/tasksReducer'
import { setNotification } from 'igz-controls/reducers/notificationReducer'
import { showErrorNotification } from 'igz-controls/utils/notification.util'
import { useMode } from '../../hooks/mode.hook'
import { useNuclioMode } from '../../hooks/nuclioMode.hook'
import {
  changeProjectState,
  createNewProject,
  fetchProject,
  fetchProjects,
  fetchProjectsNames,
  fetchProjectsSummary,
  removeNewProjectError,
  removeProjects,
  setDeletingProjects
} from '../../reducers/projectReducer'
import { fetchAllNuclioFunctions } from '../../reducers/nuclioReducer'

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
  const [projectsRequestErrorMessage, setProjectsRequestErrorMessage] = useState('')

  const abortControllerRef = useRef(new AbortController())
  const terminatePollRef = useRef(null)
  const deletingProjectsRef = useRef({})
  const projectsAreRefreshedOnSearchRef = useRef(false)

  const dispatch = useDispatch()
  const { isDemoMode } = useMode()
  const { isNuclioModeDisabled } = useNuclioMode()
  const alertStore = useSelector(store => store.projectStore.projectTotalAlerts)
  const projectStore = useSelector(store => store.projectStore)
  const tasksStore = useSelector(store => store.tasksStore)

  useEffect(() => {
    deletingProjectsRef.current = projectStore.deletingProjects
  }, [projectStore.deletingProjects])

  const fetchMinimalProjects = useCallback(() => {
    dispatch(
      fetchProjects({
        params: { format: 'minimal' },
        setRequestErrorMessage: setProjectsRequestErrorMessage
      })
    )
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
      dispatch(fetchAllNuclioFunctions())
    }

    dispatch(removeProjects())
    fetchMinimalProjects()
    dispatch(
      fetchProjectsSummary({ signal: abortControllerRef.current.signal, refresh: refreshProjects })
    )
      .unwrap()
      .then(result => {
        if (result) {
          generateMonitoringCounters(result, dispatch)
          generateAlerts(result, dispatch)
        }
      })
      .catch(() => {})

    if (!isEmpty(deletingProjectsRef.current)) {
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
                ) &&
                backgroundTask?.status?.state === BG_TASK_RUNNING &&
                deletingProjectsRef.current[backgroundTask.metadata.name]
            )
            .reduce((acc, backgroundTask) => {
              acc[backgroundTask.metadata.name] = last(backgroundTask.metadata.kind.split('.'))

              return acc
            }, {})

          if (!isEmpty(newDeletingProjects)) {
            pollDeletingProjects(terminatePollRef, newDeletingProjects, refreshProjects, dispatch)
          } else {
            dispatch(setDeletingProjects({}))
          }
        })
        .catch(error => {
          showErrorNotification(dispatch, error, '')
        })
    }
  }, [isNuclioModeDisabled, dispatch, fetchMinimalProjects])

  const handleSearchOnChange = useCallback(
    name => {
      setFilterByName(name)

      if (!projectsAreRefreshedOnSearchRef.current && name.length >= 1) {
        refreshProjects()
        projectsAreRefreshedOnSearchRef.current = true
      }
    },
    [refreshProjects, setFilterByName]
  )

  const handleSelectSortOption = option => {
    setSortProjectId(option)

    if (option === 'byDate' && sortProjectId !== 'byDate') {
      setIsDescendingOrder(true)
    }
  }

  const handleArchiveProject = useCallback(
    project => {
      dispatch(changeProjectState({ project: project.metadata.name, status: 'archived' }))
        .unwrap()
        .then(() => {
          fetchMinimalProjects()
        })
        .catch(error => {
          const customErrorMsg =
            error.response?.status === FORBIDDEN_ERROR_STATUS_CODE
              ? `You do not have permission to archive project ${project.metadata.name}`
              : `Failed to archive project ${project.metadata.name}`

          showErrorNotification(dispatch, error, '', customErrorMsg, () =>
            handleArchiveProject(project)
          )
        })
      setConfirmData(null)
    },
    [dispatch, fetchMinimalProjects]
  )

  const handleUnarchiveProject = useCallback(
    project => {
      dispatch(
        changeProjectState({ project: project.metadata.name, status: PROJECT_ONLINE_STATUS })
      )
        .unwrap()
        .then(() => {
          fetchMinimalProjects()
        })
        .catch(error => {
          const customErrorMsg =
            error.response?.status === NOTFOUND_ERROR_STATUS_CODE
              ? `Failed to unarchive project ${project.metadata.name}. The project was not found.`
              : error.response?.status === FORBIDDEN_ERROR_STATUS_CODE
                ? `You do not have permission to unarchive project ${project.metadata.name}`
                : `Failed to unarchive project ${project.metadata.name}`

          showErrorNotification(dispatch, error, '', customErrorMsg, () =>
            handleUnarchiveProject(project)
          )
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
        item: project.metadata.name,
        header: 'Archive project',
        message:
          'Archived projects continue to consume resources.' +
          'To stop the project from consuming resources, delete its scheduled jobs and suspend its Nuclio functions.',
        btnConfirmLabel: 'Archive',
        btnConfirmType: PRIMARY_BUTTON,
        rejectHandler: () => {
          setConfirmData(null)
        },
        confirmHandler: () => handleArchiveProject(project)
      })
    },
    [handleArchiveProject]
  )

  const exportYaml = useCallback(
    projectMinimal => {
      if (projectMinimal?.metadata?.name) {
        dispatch(fetchProject({ project: projectMinimal.metadata.name }))
          .unwrap()
          .then(response => {
            var blob = new Blob([yaml.dump(response?.data, { lineWidth: -1 })])

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
      const yamlByteSizeLimit = 2000000
      if (projectMinimal?.metadata?.name) {
        dispatch(fetchProject({ project: projectMinimal.metadata.name }))
          .unwrap()
          .then(response => {
            if (response.headers.get('content-length') > yamlByteSizeLimit) {
              openPopUp(ConfirmDialog, {
                header: "The project YAML can't be displayed",
                message: "The file is too large to display. Press 'Export YAML' to download it.",
                confirmButton: {
                  handler: () => exportYaml(projectMinimal),
                  label: 'Export YAML'
                }
              })
            } else {
              convertToYaml(response?.data)
            }
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
    [convertToYaml, dispatch, exportYaml]
  )

  const handleOnDeleteProject = useCallback(
    project =>
      onDeleteProject(
        project.metadata.name,
        setConfirmData,
        dispatch,
        deletingProjectsRef,
        terminatePollRef,
        fetchMinimalProjects,
        null,
        refreshProjects
      ),
    [dispatch, fetchMinimalProjects, refreshProjects]
  )

  useEffect(() => {
    setActionsMenu(
      generateProjectActionsMenu(
        projectStore.projects,
        projectStore.deletingProjects,
        exportYaml,
        viewYaml,
        onArchiveProject,
        handleUnarchiveProject,
        handleOnDeleteProject
      )
    )
  }, [
    convertToYaml,
    handleOnDeleteProject,
    projectStore.deletingProjects,
    exportYaml,
    handleUnarchiveProject,
    isDemoMode,
    onArchiveProject,
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
      dispatch(removeNewProjectError())
    }

    setCreateProject(false)
  }, [dispatch, projectStore.newProject.error])

  const handleCreateProject = values => {
    dispatch(
      createNewProject({
        postData: {
          metadata: {
            name: values.name,
            labels:
              values.labels?.reduce((acc, labelData) => {
                acc[labelData.key] = labelData.value
                return acc
              }, {}) ?? {}
          },
          spec: {
            description: values.description
          }
        }
      })
    )
      .unwrap()
      .then(result => {
        if (result) {
          setCreateProject(false)
          refreshProjects()
          dispatch(fetchProjectsNames())
          dispatch(
            setNotification({
              status: 200,
              id: Math.random(),
              message: `Project "${result.metadata?.name}" was created successfully`
            })
          )
        }
      })
      .catch(() => {})
  }

  return (
    <ProjectsView
      actionsMenu={actionsMenu}
      alertStore={alertStore}
      closeNewProjectPopUp={closeNewProjectPopUp}
      confirmData={confirmData}
      convertedYaml={convertedYaml}
      convertToYaml={convertToYaml}
      createProject={createProject}
      filterByName={filterByName}
      filteredProjects={filteredProjects}
      filterMatches={filterMatches}
      handleCreateProject={handleCreateProject}
      handleSearchOnChange={handleSearchOnChange}
      handleSelectSortOption={handleSelectSortOption}
      isDescendingOrder={isDescendingOrder}
      projectsRequestErrorMessage={projectsRequestErrorMessage}
      projectStore={projectStore}
      refreshProjects={refreshProjects}
      selectedProjectsState={selectedProjectsState}
      setCreateProject={setCreateProject}
      setFilterMatches={setFilterMatches}
      setIsDescendingOrder={setIsDescendingOrder}
      setSelectedProjectsState={setSelectedProjectsState}
      sortProjectId={sortProjectId}
      tasksStore={tasksStore}
    />
  )
}

export default Projects
