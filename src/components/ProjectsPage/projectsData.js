import React from 'react'

import { DANGER_BUTTON } from '../../constants'

import { ReactComponent as Yaml } from '../../images/yaml.svg'
import { ReactComponent as Delete } from '../../images/delete.svg'

export const pageData = {
  page: 'PROJECTS'
}
export const generateProjectActionsMenu = (
  projects,
  toggleConvertToYaml,
  archiveProject,
  unarchiveProject,
  deleteProject
) => {
  let actionsMenu = {}

  projects.forEach(project => {
    actionsMenu[project.metadata.name] = [
      {
        label: 'View YAML',
        icon: <Yaml />,
        onClick: toggleConvertToYaml
      },
      {
        label: 'Archive',
        hidden: project.status.state === 'archived',
        onClick: archiveProject
      },
      {
        label: 'Unarchive',
        hidden: project.status.state === 'online',
        onClick: unarchiveProject
      },
      {
        label: 'Delete',
        icon: <Delete />,
        hidden:
          window.mlrunConfig.nuclioMode === 'enabled' &&
          project.metadata.name === 'default',
        onClick: deleteProject
      }
    ]
  })

  return actionsMenu
}
export const projectsStates = [
  {
    id: 'allProjects',
    label: 'All Projects'
  },
  {
    id: 'archived',
    label: 'Archived Projects'
  }
]
export const projectsSortOptions = [
  {
    id: 'byName',
    label: 'By name',
    path: 'metadata.name'
  },
  {
    id: 'byDate',
    label: 'By date',
    path: 'metadata.created'
  }
]
export const successProjectDeletingMessage = 'Project deleted successfully'
export const failedProjectDeletingMessage = 'Failed to delete project'

export const handleDeleteProjectError = (
  error,
  handleDeleteProject,
  project,
  setConfirmData,
  setNotification
) => {
  if (error.response?.status === 412) {
    setConfirmData({
      item: project,
      header: 'Delete project?',
      message:
        `You try to delete project "${project.metadata.name}". 'The project is not empty. Deleting it will also delete all of its resources, such as jobs, '` +
        'artifacts, and features.',
      btnConfirmLabel: 'Delete',
      btnConfirmType: DANGER_BUTTON,
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
}
