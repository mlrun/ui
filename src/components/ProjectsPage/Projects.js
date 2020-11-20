import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import yaml from 'js-yaml'

import ProjectsView from './ProjectsView'

import {
  generateProjectActionsMenu,
  successProjectDeletingMessage,
  failedProjectDeletingMessage
} from './projectsData'
import nuclioActions from '../../actions/nuclio'
import notificationActions from '../../actions/notification'
import projectsAction from '../../actions/projects'

import './projects.scss'

const Projects = ({
  createNewProject,
  deleteProject,
  fetchProjectDataSets,
  fetchProjectFailedJobs,
  fetchNuclioFunctions,
  fetchProjectModels,
  fetchProjectRunningJobs,
  fetchProjects,
  match,
  projectStore,
  removeNewProject,
  removeNewProjectError,
  setNewProjectDescription,
  setNewProjectName,
  setNotification
}) => {
  const [convertedYaml, setConvertedYaml] = useState('')
  const [createProject, setCreateProject] = useState(false)
  const [isEmptyValue, setIsEmptyValue] = useState(false)

  const handleDeleteProject = useCallback(
    project => {
      deleteProject(project.name)
        .then(() => {
          fetchProjects()
          setNotification({
            status: 200,
            id: Math.random(),
            message: successProjectDeletingMessage
          })
        })
        .catch(() => {
          setNotification({
            status: 400,
            id: Math.random(),
            retry: () => handleDeleteProject(project),
            message: failedProjectDeletingMessage
          })
        })
    },
    [deleteProject, fetchProjects, setNotification]
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

  const actionsMenu = useMemo(
    () => generateProjectActionsMenu(convertToYaml, handleDeleteProject),
    [convertToYaml, handleDeleteProject]
  )

  useEffect(() => {
    fetchProjects()
  }, [fetchProjectRunningJobs, fetchProjects])

  const handleCreateProject = () => {
    if (projectStore.newProject.name.length === 0) {
      return setIsEmptyValue(true)
    } else if (isEmptyValue) {
      setIsEmptyValue(false)
    }

    createNewProject({
      name: projectStore.newProject.name,
      description: projectStore.newProject.description
    }).then(result => {
      if (result) {
        setCreateProject(false)
        removeNewProject()
        fetchProjects()
      }
    })
  }

  const closePopUp = useCallback(() => {
    if (projectStore.newProject.error) {
      removeNewProjectError()
    }

    removeNewProject()
    setIsEmptyValue(false)
    setCreateProject(false)
  }, [projectStore.newProject.error, removeNewProject, removeNewProjectError])

  return (
    <ProjectsView
      actionsMenu={actionsMenu}
      closePopUp={closePopUp}
      convertedYaml={convertedYaml}
      convertToYaml={convertToYaml}
      createProject={createProject}
      fetchNuclioFunctions={fetchNuclioFunctions}
      fetchProjectDataSets={fetchProjectDataSets}
      fetchProjectFailedJobs={fetchProjectFailedJobs}
      fetchProjectModels={fetchProjectModels}
      fetchProjectRunningJobs={fetchProjectRunningJobs}
      handleCreateProject={handleCreateProject}
      isEmptyValue={isEmptyValue}
      match={match}
      projectStore={projectStore}
      removeNewProjectError={removeNewProjectError}
      setCreateProject={setCreateProject}
      setNewProjectDescription={setNewProjectDescription}
      setNewProjectName={setNewProjectName}
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
