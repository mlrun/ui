import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import yaml from 'js-yaml'

import ProjectsView from './ProjectsView'

import {
  generateProjectActionsMenu,
  generateProjectsStates,
  successProjectDeletingMessage,
  failedProjectDeletingMessage
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
  const [archiveProject, setArchiveProject] = useState(null)
  const [deleteNonEmptyProject, setDeleteNonEmptyProject] = useState(null)
  const [convertedYaml, setConvertedYaml] = useState('')
  const [createProject, setCreateProject] = useState(false)
  const [filteredProjects, setFilteredProjects] = useState([])
  const [isEmptyValue, setIsEmptyValue] = useState(false)
  const [selectedProjectsState, setSelectedProjectsState] = useState(
    'allProjects'
  )

  const projectsStates = useMemo(generateProjectsStates, [])

  const handleArchiveProject = useCallback(() => {
    changeProjectState(archiveProject.metadata.name, 'archived').then(() => {
      fetchProjects()
    })
    setArchiveProject(null)
  }, [archiveProject, changeProjectState, fetchProjects])

  const handleDeleteProject = useCallback(
    (project, deleteNonEmpty) => {
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
          if (
            error.response?.status === 412 &&
            error.response?.data?.detail?.includes(
              'can not be deleted since related resources found'
            )
          ) {
            setDeleteNonEmptyProject(project)
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

  const handleDeleteNonEmptyProject = useCallback(() => {
    setDeleteNonEmptyProject(null)
    handleDeleteProject(deleteNonEmptyProject, true)
  }, [deleteNonEmptyProject, handleDeleteProject])

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

  const handleCreateProject = () => {
    if (projectStore.newProject.name.length === 0) {
      return setIsEmptyValue(true)
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

  const closeArchiveProjectPopUp = useCallback(() => {
    setArchiveProject(null)
  }, [])

  const closeDeleteNonEmtpyProjectPopUp = useCallback(() => {
    setDeleteNonEmptyProject(null)
  }, [])

  const closeNewProjectPopUp = useCallback(() => {
    if (projectStore.newProject.error) {
      removeNewProjectError()
    }

    removeNewProject()
    setIsEmptyValue(false)
    setCreateProject(false)
  }, [projectStore.newProject.error, removeNewProject, removeNewProjectError])

  const onArchiveProject = useCallback(project => {
    setArchiveProject(project)
  }, [])

  useEffect(() => {
    setActionsMenu(
      generateProjectActionsMenu(
        projectStore.projects,
        convertToYaml,
        onArchiveProject,
        handleUnarchiveProject,
        handleDeleteProject
      )
    )
  }, [
    convertToYaml,
    onArchiveProject,
    handleDeleteProject,
    handleUnarchiveProject,
    projectStore.projects
  ])

  useEffect(() => {
    fetchProjects()
    fetchNuclioFunctions()
  }, [fetchNuclioFunctions, fetchProjects])

  useEffect(() => {
    setFilteredProjects(
      projectStore.projects.filter(project => {
        return (
          (selectedProjectsState === 'allProjects' &&
            project.status.state !== 'archived') ||
          project.status.state === selectedProjectsState
        )
      })
    )
  }, [projectStore.projects, selectedProjectsState])

  return (
    <ProjectsView
      actionsMenu={actionsMenu}
      archiveProject={archiveProject}
      closeArchiveProjectPopUp={closeArchiveProjectPopUp}
      closeDeleteNonEmtpyProjectPopUp={closeDeleteNonEmtpyProjectPopUp}
      closeNewProjectPopUp={closeNewProjectPopUp}
      convertedYaml={convertedYaml}
      convertToYaml={convertToYaml}
      createProject={createProject}
      deleteNonEmptyProject={deleteNonEmptyProject}
      fetchProjectDataSets={fetchProjectDataSets}
      fetchProjectFailedJobs={fetchProjectFailedJobs}
      fetchProjectFunctions={fetchProjectFunctions}
      fetchProjectModels={fetchProjectModels}
      fetchProjectRunningJobs={fetchProjectRunningJobs}
      filteredProjects={filteredProjects}
      handleDeleteNonEmptyProject={handleDeleteNonEmptyProject}
      handleArchiveProject={handleArchiveProject}
      handleCreateProject={handleCreateProject}
      isEmptyValue={isEmptyValue}
      match={match}
      nuclioStore={nuclioStore}
      projectStore={projectStore}
      projectsStates={projectsStates}
      removeNewProjectError={removeNewProjectError}
      selectedProjectsState={selectedProjectsState}
      setCreateProject={setCreateProject}
      setNewProjectDescription={setNewProjectDescription}
      setNewProjectName={setNewProjectName}
      setSelectedProjectsState={setSelectedProjectsState}
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
