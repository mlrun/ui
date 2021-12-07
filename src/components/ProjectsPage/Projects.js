import React, { useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import yaml from 'js-yaml'
import { orderBy } from 'lodash'
import axios from 'axios'

import ProjectsView from './ProjectsView'

import {
  generateProjectActionsMenu,
  successProjectDeletingMessage,
  projectsSortOptions,
  handleDeleteProjectError
} from './projectsData'
import nuclioActions from '../../actions/nuclio'
import notificationActions from '../../actions/notification'
import projectsAction from '../../actions/projects'
import { DANGER_BUTTON, PRIMARY_BUTTON } from '../../constants'

const Projects = ({
  changeProjectState,
  createNewProject,
  deleteProject,
  fetchNuclioFunctions,
  fetchProjects,
  fetchProjectsSummary,
  match,
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
  const [isDescendingOrder, setIsDescendingOrder] = useState(false)
  const [isNameValid, setNameValid] = useState(true)
  const [selectedProjectsState, setSelectedProjectsState] = useState(
    'allProjects'
  )
  const [sortProjectId, setSortProjectId] = useState('byName')
  const [source] = useState(axios.CancelToken.source())

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
          handleDeleteProjectError(
            error,
            handleDeleteProject,
            project,
            setConfirmData,
            setNotification
          )
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
    fetchProjectsSummary(source.token)
  }, [fetchNuclioFunctions, fetchProjects, fetchProjectsSummary, source.token])

  useEffect(() => {
    return () => {
      source.cancel('canceled')
    }
  }, [source])

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
    setNameValid(true)
    setCreateProject(false)
  }, [projectStore.newProject.error, removeNewProject, removeNewProjectError])

  const refreshProjects = () => {
    removeProjects()
    fetchProjects()
    fetchNuclioFunctions()
    fetchProjectsSummary(source.token)
  }

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
          name: projectStore.newProject.name
        },
        spec: {
          description: projectStore.newProject.description
        }
      }).then(result => {
        if (result) {
          setCreateProject(false)
          removeNewProject()
          refreshProjects()
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
      isDescendingOrder={isDescendingOrder}
      isNameValid={isNameValid}
      match={match}
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
  projectStore => ({
    ...projectStore
  }),
  {
    ...projectsAction,
    ...nuclioActions,
    ...notificationActions
  }
)(Projects)
