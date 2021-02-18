import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import yaml from 'js-yaml'

import ProjectsView from './ProjectsView'

import {
  generateProjectActionsMenu,
  generateProjectsStates,
  successProjectDeletingMessage,
  failedProjectDeletingMessage,
  generateProjectsSortOptions
} from './projectsData'
import nuclioActions from '../../actions/nuclio'
import notificationActions from '../../actions/notification'
import projectsAction from '../../actions/projects'

const Projects = ({
  changeProjectState,
  createNewProject,
  deleteProject,
  fetchNuclioFunctions,
  fetchProjectDataSets,
  fetchProjectFailedJobs,
  fetchProjectFunctions,
  fetchProjectModels,
  fetchProjectRunningJobs,
  fetchProjects,
  match,
  nuclioStore,
  projectStore,
  removeNewProject,
  removeNewProjectError,
  setNewProjectDescription,
  setNewProjectName,
  setNotification
}) => {
  const [actionsMenu, setActionsMenu] = useState({})
  const [confirmData, setConfirmData] = useState(null)
  const [convertedYaml, setConvertedYaml] = useState('')
  const [createProject, setCreateProject] = useState(false)
  const [filteredProjects, setFilteredProjects] = useState([])
  const [filterByName, setFilterByName] = useState('')
  const [filterMatches, setFilterMatches] = useState([])
  const [isDescendingOrder, setIsDescendingOrder] = useState(true)
  const [isEmptyValue, setIsEmptyValue] = useState(false)
  const [selectedProjectsState, setSelectedProjectsState] = useState(
    'allProjects'
  )
  const [sortProjectData, setSortProjectData] = useState({
    id: 'byName',
    label: 'By name',
    sortPath: 'name'
  })

  const projectsStates = useMemo(generateProjectsStates, [])
  const projectsSortOptions = useMemo(generateProjectsSortOptions, [])

  const handleArchiveProject = useCallback(
    project => {
      changeProjectState(project.metadata.name, 'archived').then(() => {
        fetchProjects()
      })
      setConfirmData(null)
    },
    [changeProjectState, fetchProjects]
  )

  const handleDeleteProject = useCallback(
    (project, deleteNonEmpty) => {
      setConfirmData(null)
      deleteProject(project.metadata.name, deleteNonEmpty)
        .then(() => {
          fetchProjects()
          setNotification({
            status: 200,
            id: Math.random(),
            message: successProjectDeletingMessage
          })
        })
        .catch(error => {
          if (error.response?.status === 412) {
            setConfirmData({
              item: project,
              title: `Delete project "${project.metadata.name}"?`,
              description:
                'The project is not empty. Deleting it will also delete all of its resources, such as jobs, ' +
                'artifacts, and features.',
              btnConfirmLabel: 'Delete',
              btnConfirmClassNames: 'btn_danger',
              rejectHandler: () => {
                setConfirmData(null)
              },
              confirmHandler: project => {
                handleDeleteProject(project, true)
              }
            })
          } else {
            setNotification({
              status: 400,
              id: Math.random(),
              retry: () => handleDeleteProject(project),
              message: failedProjectDeletingMessage
            })
          }
        })
    },
    [deleteProject, fetchProjects, setNotification]
  )

  const handleUnarchiveProject = useCallback(
    project => {
      changeProjectState(project.metadata.name, 'online').then(() => {
        fetchProjects()
      })
    },
    [changeProjectState, fetchProjects]
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

  const handleCreateProject = e => {
    e.preventDefault()

    if (!e.currentTarget.checkValidity()) {
      return false
    }

    if (projectStore.newProject.name.length === 0) {
      setIsEmptyValue(true)
      return false
    } else if (isEmptyValue) {
      setIsEmptyValue(false)
    }

    createNewProject({
      metadata: {
        name: projectStore.newProject.name
      },
      spec: {
        description: projectStore.newProject.description
      }
    }).then(result => {
      if (result) {
        setCreateProject(false)
        removeNewProject()
        fetchProjects()
      }
    })
  }

  const closeNewProjectPopUp = useCallback(() => {
    if (projectStore.newProject.error) {
      removeNewProjectError()
    }

    removeNewProject()
    setIsEmptyValue(false)
    setCreateProject(false)
  }, [projectStore.newProject.error, removeNewProject, removeNewProjectError])

  const onArchiveProject = useCallback(
    project => {
      setConfirmData({
        item: project,
        title: 'Archive project',
        description:
          "Note that moving a project to archive doesn't stop it from consuming resources. We recommend that " +
          "before setting the project as archive you'll remove scheduled jobs and suspend Nuclio functions.",
        btnConfirmLabel: 'Archive',
        btnConfirmClassNames: 'btn_primary',
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
        title: `Delete project "${project.metadata.name}"?`,
        description: 'Deleted projects can not be restored.',
        btnConfirmLabel: 'Delete',
        btnConfirmClassNames: 'btn_danger',
        rejectHandler: () => {
          setConfirmData(null)
        },
        confirmHandler: handleDeleteProject
      })
    },
    [handleDeleteProject]
  )

  useEffect(() => {
    setActionsMenu(
      generateProjectActionsMenu(
        projectStore.projects,
        convertToYaml,
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
    projectStore.projects
  ])

  useEffect(() => {
    fetchProjects()
    fetchNuclioFunctions()
  }, [fetchNuclioFunctions, fetchProjects])

  const filterProjectsHandler = useCallback(
    project => {
      return filterByName.length > 0
        ? (project.metadata.name.includes(filterByName) &&
            selectedProjectsState === 'allProjects' &&
            project.status.state !== 'archived') ||
            project.status.state === selectedProjectsState
        : (selectedProjectsState === 'allProjects' &&
            project.status.state !== 'archived') ||
            project.status.state === selectedProjectsState
    },
    [filterByName, selectedProjectsState]
  )

  const sortProjectsHandler = useCallback(
    (a, b, sortPath) => {
      return isDescendingOrder
        ? a.metadata[sortPath] < b.metadata[sortPath]
          ? -1
          : 1
        : a.metadata[sortPath] < b.metadata[sortPath]
        ? 1
        : -1
    },
    [isDescendingOrder]
  )

  useEffect(() => {
    setFilteredProjects(
      projectStore.projects
        .filter(project => filterProjectsHandler(project))
        .sort((a, b) => sortProjectsHandler(a, b, sortProjectData.sortPath))
    )
  }, [
    filterByName,
    filterProjectsHandler,
    isDescendingOrder,
    projectStore.projects,
    selectedProjectsState,
    sortProjectData.sortPath,
    sortProjectsHandler
  ])

  useEffect(() => {
    if (filterByName.length > 0) {
      setFilterMatches(filteredProjects.map(func => func.metadata.name))
    }
  }, [filterByName, filteredProjects])

  const handleSearchOnChange = value => {
    if (value.length === 0) {
      setFilterByName('')
      setFilterMatches([])

      if (filteredProjects.length > 0) {
        setFilteredProjects([])
      }
    } else {
      setFilterByName(value)
    }
  }

  const refreshProjects = () => {
    fetchProjects()
  }

  const setSortProjectDataHandler = id => {
    setSortProjectData(projectsSortOptions.find(option => option.id === id))
  }

  return (
    <ProjectsView
      actionsMenu={actionsMenu}
      closeNewProjectPopUp={closeNewProjectPopUp}
      confirmData={confirmData}
      convertedYaml={convertedYaml}
      convertToYaml={convertToYaml}
      createProject={createProject}
      fetchProjectDataSets={fetchProjectDataSets}
      fetchProjectFailedJobs={fetchProjectFailedJobs}
      fetchProjectFunctions={fetchProjectFunctions}
      fetchProjectModels={fetchProjectModels}
      fetchProjectRunningJobs={fetchProjectRunningJobs}
      filterByName={filterByName}
      filteredProjects={filteredProjects}
      filterMatches={filterMatches}
      handleCreateProject={handleCreateProject}
      handleSearchOnChange={handleSearchOnChange}
      isDescendingOrder={isDescendingOrder}
      isEmptyValue={isEmptyValue}
      match={match}
      nuclioStore={nuclioStore}
      projectStore={projectStore}
      projectsSortOptions={projectsSortOptions}
      projectsStates={projectsStates}
      refreshProjects={refreshProjects}
      removeNewProjectError={removeNewProjectError}
      selectedProjectsState={selectedProjectsState}
      setCreateProject={setCreateProject}
      setFilterMatches={setFilterMatches}
      setIsDescendingOrder={setIsDescendingOrder}
      setNewProjectDescription={setNewProjectDescription}
      setNewProjectName={setNewProjectName}
      setSelectedProjectsState={setSelectedProjectsState}
      setSortProjectDataHandler={setSortProjectDataHandler}
      sortProjectData={sortProjectData}
    />
  )
}

Projects.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default connect(
  (projectStore, nuclioStore) => ({
    ...projectStore,
    ...nuclioStore
  }),
  {
    ...projectsAction,
    ...nuclioActions,
    ...notificationActions
  }
)(Projects)
