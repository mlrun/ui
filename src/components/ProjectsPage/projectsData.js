import React from 'react'

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
        onClick: archiveProject,
        hidden: project.status.state === 'archived'
      },
      {
        label: 'Unarchive',
        onClick: unarchiveProject,
        hidden: project.status.state === 'online'
      },
      {
        label: 'Delete',
        icon: <Delete />,
        hidden: project.status.state !== 'archived',
        onClick: deleteProject
      }
    ]
  })

  return actionsMenu
}
export const generateProjectsStates = () => [
  {
    id: 'allProjects',
    label: 'All Projects'
  },
  {
    id: 'archived',
    label: 'Archived Projects'
  }
]
export const successProjectDeletingMessage = 'Project deleted successfully'
export const failedProjectDeletingMessage = 'Failed to delete project'
