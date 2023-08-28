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
import React from 'react'

import { DANGER_BUTTON, FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'

import { ReactComponent as ArchiveIcon } from 'igz-controls/images/archive-icon.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'
import { ReactComponent as DownloadIcon } from 'igz-controls/images/ml-download.svg'
import { ReactComponent as UnarchiveIcon } from 'igz-controls/images/unarchive-icon.svg'
import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'

export const pageData = {
  page: 'PROJECTS'
}
export const generateProjectActionsMenu = (
  projects,
  exportYaml,
  viewYaml,
  archiveProject,
  unarchiveProject,
  deleteProject,
  isDemoMode
) => {
  let actionsMenu = {}

  projects.forEach(project => {
    actionsMenu[project.metadata.name] = [
      {
        label: 'Archive',
        icon: <ArchiveIcon />,
        hidden: project.status.state === 'archived',
        onClick: archiveProject
      },
      {
        label: 'Unarchive',
        icon: <UnarchiveIcon />,
        hidden: project.status.state === 'online',
        onClick: unarchiveProject
      },
      {
        label: 'Delete',
        icon: <Delete />,
        className: 'danger',
        hidden: window.mlrunConfig.nuclioMode === 'enabled' && project.metadata.name === 'default',
        onClick: deleteProject
      },
      {
        label: 'Export YAML',
        icon: <DownloadIcon />,
        onClick: exportYaml
      },
      {
        label: 'View YAML',
        icon: <Yaml />,
        onClick: viewYaml
      }
    ]
  })

  return actionsMenu
}
export const projectsStates = [
  {
    id: 'active',
    label: 'Active'
  },
  {
    id: 'archived',
    label: 'Archived'
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
    label: 'By created date',
    path: 'metadata.created'
  }
]
export const successProjectDeletingMessage = 'Project deleted successfully'

export const handleDeleteProjectError = (
  error,
  handleDeleteProject,
  project,
  setConfirmData,
  setNotification,
  dispatch
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
    dispatch(
      setNotification({
        status: 400,
        id: Math.random(),
        retry: () => handleDeleteProject(project),
        message:
          error.response?.status === FORBIDDEN_ERROR_STATUS_CODE
            ? `You are not allowed to delete ${project.metadata.name} project`
            : `Failed to delete ${project.metadata.name} project`
      })
    )
  }
}
