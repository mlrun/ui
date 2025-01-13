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
import { get, omit, last } from 'lodash'

import tasksApi from '../../api/tasks-api'
import {
  BAD_GATEWAY_ERROR_STATUS_CODE,
  SERVICE_UNAVAILABLE_ERROR_STATUS_CODE,
  GATEWAY_TIMEOUT_STATUS_CODE
} from 'igz-controls/constants'
import {
  BG_TASK_FAILED,
  BG_TASK_SUCCEEDED,
  isBackgroundTaskRunning,
  pollTask
} from '../../utils/poll.util'
import { PROJECT_ONLINE_STATUS, SET_PROJECT_TOTAL_ALERTS } from '../../constants'
import { DANGER_BUTTON, FORBIDDEN_ERROR_STATUS_CODE } from 'igz-controls/constants'
import { setNotification } from '../../reducers/notificationReducer'
import { showErrorNotification } from '../../utils/notifications.util'
import projectsAction from '../../actions/projects'

import { ReactComponent as ArchiveIcon } from 'igz-controls/images/archive-icon.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'
import { ReactComponent as DownloadIcon } from 'igz-controls/images/ml-download.svg'
import { ReactComponent as UnarchiveIcon } from 'igz-controls/images/unarchive-icon.svg'
import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'

export const mlrunUnhealthyErrors = [
  BAD_GATEWAY_ERROR_STATUS_CODE,
  SERVICE_UNAVAILABLE_ERROR_STATUS_CODE,
  GATEWAY_TIMEOUT_STATUS_CODE
]
export const projectDeletionKind = 'project.deletion'
export const projectDeletionWrapperKind = 'project.deletion.wrapper'
export const pageData = {
  page: 'PROJECTS'
}
export const generateProjectActionsMenu = (
  projects,
  deletingProjects,
  exportYaml,
  viewYaml,
  archiveProject,
  unarchiveProject,
  deleteProject
) => {
  const deletingProjectNames = Object.values(deletingProjects)
  let actionsMenu = {}

  projects.forEach(project => {
    const projectIsDeleting = deletingProjectNames.includes(project.metadata.name)

    actionsMenu[project.metadata.name] = [
      [
        {
          label: 'Archive',
          icon: <ArchiveIcon />,
          hidden: project.status.state === 'archived',
          disabled: projectIsDeleting,
          onClick: archiveProject
        },
        {
          label: 'Unarchive',
          icon: <UnarchiveIcon />,
          hidden: project.status.state === PROJECT_ONLINE_STATUS,
          disabled: projectIsDeleting,
          onClick: unarchiveProject
        },
        {
          label: 'Export YAML',
          icon: <DownloadIcon />,
          disabled: projectIsDeleting,
          onClick: exportYaml
        },
        {
          label: 'View YAML',
          icon: <Yaml />,
          disabled: projectIsDeleting,
          onClick: viewYaml
        },
        {
          label: 'Delete',
          icon: <Delete />,
          className: 'danger',
          hidden:
            window.mlrunConfig.nuclioMode === 'enabled' && project.metadata.name === 'default',
          disabled: projectIsDeleting,
          onClick: deleteProject
        }
      ]
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

export const handleDeleteProjectError = (
  error,
  handleDeleteProject,
  project,
  setConfirmData,
  dispatch,
  deleteNonEmpty,
  deletingProjectsRef,
  terminatePollRef,
  fetchMinimalProjects,
  navigate
) => {
  if (error.response?.status === 412 && !deleteNonEmpty) {
    setConfirmData({
      item: project,
      header: 'Delete project?',
      message:
        `You are trying to delete the non-empty project "${project.metadata.name}". Deleting it will also delete all of its resources, such as jobs, ` +
        'artifacts, and features.',
      btnConfirmLabel: 'Delete',
      btnConfirmType: DANGER_BUTTON,
      rejectHandler: () => {
        setConfirmData(null)
      },
      confirmHandler: () => {
        handleDeleteProject(
          project,
          true,
          setConfirmData,
          dispatch,
          deletingProjectsRef,
          terminatePollRef,
          fetchMinimalProjects,
          navigate
        )
      }
    })
  } else {
    const customErrorMsg =
      error.response?.status === FORBIDDEN_ERROR_STATUS_CODE
        ? `You do not have permission to delete the project ${project.metadata.name} `
        : `Failed to delete the project ${project.metadata.name}`

    showErrorNotification(dispatch, error, '', customErrorMsg, () =>
      handleDeleteProject(
        project,
        false,
        setConfirmData,
        dispatch,
        deletingProjectsRef,
        terminatePollRef,
        fetchMinimalProjects,
        navigate
      )
    )
  }
}

export const pollDeletingProjects = (terminatePollRef, deletingProjects, refresh, dispatch) => {
  const isDone = result => {
    const tasks = get(result, 'data.background_tasks', [])
    const finishedTasks = tasks.filter(
      task =>
        deletingProjects?.[task.metadata.name] &&
        [BG_TASK_SUCCEEDED, BG_TASK_FAILED].includes(task.status?.state)
    )

    if (finishedTasks.length > 0) {
      const tasksToExclude = []

      finishedTasks.forEach(task => {
        tasksToExclude.push(task.metadata.name)

        if (task.status.state === BG_TASK_SUCCEEDED) {
          dispatch(
            setNotification({
              status: 200,
              id: Math.random(),
              message: `Project "${
                deletingProjects?.[task.metadata.name]
              }" was deleted successfully`
            })
          )
        } else {
          showErrorNotification(
            dispatch,
            {},
            get(
              task,
              'status.error',
              `Failed to delete the project "${deletingProjects?.[task.metadata.name]}"`
            )
          )
        }
      })

      dispatch(projectsAction.setDeletingProjects(omit(deletingProjects, tasksToExclude)))
      refresh()
    }

    return finishedTasks.length > 0
  }

  terminatePollRef.current?.()
  terminatePollRef.current = null

  return pollTask(() => tasksApi.getBackgroundTasks(), isDone, {
    terminatePollRef
  })
}

export const generateAlerts = (data, dispatch) => {
  const projectAlerts = {}
  data.forEach(project => {
    const projectName = project.name
    projectAlerts[projectName] =
      (project.endpoint_alerts_count || 0) +
      (project.job_alerts_count || 0) +
      (project.other_alerts_count || 0)
  })

  dispatch({
    type: SET_PROJECT_TOTAL_ALERTS,
    payload: projectAlerts
  })
}

export const generateMonitoringCounters = (data, dispatch) => {
  const monitoringCounters = {
    jobs: {
      completed: 0,
      failed: 0,
      running: 0,
      total: 0
    },
    workflows: {
      completed: 0,
      failed: 0,
      running: 0,
      total: 0
    },
    scheduled: {
      jobs: 0,
      workflows: 0,
      total: 0
    },
    alerts: {
      endpoint: 0,
      jobs: 0,
      application: 0,
      total: 0
    }
  }

  data.forEach(project => {
    monitoringCounters.jobs.completed += project.runs_completed_recent_count || 0
    monitoringCounters.jobs.failed += project.runs_failed_recent_count || 0
    monitoringCounters.jobs.running += project.runs_running_count || 0
    monitoringCounters.jobs.total =
      monitoringCounters.jobs.completed +
      monitoringCounters.jobs.failed +
      monitoringCounters.jobs.running

    monitoringCounters.workflows.completed += project.pipelines_completed_recent_count || 0
    monitoringCounters.workflows.failed += project.pipelines_failed_recent_count || 0
    monitoringCounters.workflows.running += project.pipelines_running_count || 0
    monitoringCounters.workflows.total =
      monitoringCounters.workflows.completed +
      monitoringCounters.workflows.failed +
      monitoringCounters.workflows.running

    monitoringCounters.scheduled.jobs += project.distinct_scheduled_jobs_pending_count || 0
    monitoringCounters.scheduled.workflows +=
      project.distinct_scheduled_pipelines_pending_count || 0
    monitoringCounters.scheduled.total =
      monitoringCounters.scheduled.jobs + monitoringCounters.scheduled.workflows

    monitoringCounters.alerts.endpoint += project.endpoint_alerts_count || 0
    monitoringCounters.alerts.jobs += project.job_alerts_count || 0
    monitoringCounters.alerts.application += project.other_alerts_count || 0
    monitoringCounters.alerts.total =
      monitoringCounters.alerts.endpoint +
      monitoringCounters.alerts.jobs +
      monitoringCounters.alerts.application
  })

  dispatch(projectsAction.setJobsMonitoringData(monitoringCounters))
}

export const onDeleteProject = (project, setConfirmData, ...args) => {
  setConfirmData({
    item: project,
    header: 'Delete project?',
    message: `You are trying to delete the project "${project.metadata.name}". Deleted projects cannot be restored`,
    btnConfirmLabel: 'Delete',
    btnConfirmType: DANGER_BUTTON,
    rejectHandler: () => {
      setConfirmData(null)
    },
    confirmHandler: () => handleDeleteProject(project, false, setConfirmData, ...args)
  })
}

export const handleDeleteProject = (
  project,
  deleteNonEmpty,
  setConfirmData,
  dispatch,
  deletingProjectsRef,
  terminatePollRef,
  fetchMinimalProjects,
  navigate,
  refreshProjects
) => {
  setConfirmData && setConfirmData(null)

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

        const newDeletingProjects = {
          ...deletingProjectsRef.current,
          [response.data.metadata.name]: last(response.data.metadata.kind.split('.'))
        }

        dispatch(projectsAction.setDeletingProjects(newDeletingProjects))
        if (refreshProjects) {
          pollDeletingProjects(terminatePollRef, newDeletingProjects, refreshProjects, dispatch)
        }

        if (navigate) {
          navigate('/projects')
        }
      } else {
        fetchMinimalProjects()
        dispatch(
          setNotification({
            status: 200,
            id: Math.random(),
            message: `Project "${project.metadata.name}" was deleted successfully`
          })
        )
        if (navigate) {
          navigate('/projects')
        }
      }
    })
    .catch(error => {
      handleDeleteProjectError(
        error,
        handleDeleteProject,
        project,
        setConfirmData,
        dispatch,
        deleteNonEmpty,
        deletingProjectsRef,
        terminatePollRef,
        fetchMinimalProjects,
        navigate
      )
    })
}
