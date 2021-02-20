import React, { useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import yaml from 'js-yaml'
import { orderBy } from 'lodash'

import ProjectsView from './ProjectsView'

import {
  generateProjectActionsMenu,
  successProjectDeletingMessage,
  failedProjectDeletingMessage,
  projectsSortOptions
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
  removeProjects,
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
  const [sortProjectId, setSortProjectId] = useState('byName')

  const isValidProjectState = useCallback(
    project => {
      return (
        (selectedProjectsState === 'allProjects' &&
          project.status.state !== 'archived') ||
        project.status.state === selectedProjectsState
      )
    },
    [selectedProjectsState]
  )

  const handleFilterProject = useCallback(
    project => {
      return filterByName.length > 0
        ? project.metadata.name.includes(filterByName) &&
            isValidProjectState(project)
        : isValidProjectState(project)
    },
    [filterByName, isValidProjectState]
  )

  const handleSortProjects = useCallback(
    projects => {
      const sortPath = projectsSortOptions.find(
        option => option.id === sortProjectId
      ).path

      return orderBy(projects, [sortPath], [isDescendingOrder ? 'desc' : 'asc'])
    },
    [isDescendingOrder, sortProjectId]
  )

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

  useEffect(() => {
    setFilteredProjects(
      handleSortProjects(projectStore.projects.filter(handleFilterProject))
    )
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
    setIsEmptyValue(false)
    setCreateProject(false)
  }, [projectStore.newProject.error, removeNewProject, removeNewProjectError])

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

  const handleSearchOnChange = value => {
    setFilterByName(value)
  }

  const refreshProjects = () => {
    removeProjects()
    fetchProjects()
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
      refreshProjects={refreshProjects}
      removeNewProjectError={removeNewProjectError}
      selectedProjectsState={selectedProjectsState}
      setCreateProject={setCreateProject}
      setFilterMatches={setFilterMatches}
      setIsDescendingOrder={setIsDescendingOrder}
      setNewProjectDescription={setNewProjectDescription}
      setNewProjectName={setNewProjectName}
      setSelectedProjectsState={setSelectedProjectsState}
      setSortProjectId={setSortProjectId}
      sortProjectId={sortProjectId}
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
