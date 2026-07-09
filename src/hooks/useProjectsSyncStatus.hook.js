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
import { useEffect, useMemo, useRef, useState } from 'react'

import tasksApi from '../api/tasks-api'
import eventsApi from '../api/events-api'
import { getProjectSyncTooltip } from '../components/ProjectsPage/projects.util'
import { pollTask, BG_TASK_FAILED } from '../utils/poll.util'
import { NOTFOUND_ERROR_STATUS_CODE } from 'igz-controls/constants'
import { PROJECT_SYNC_POLL_INTERVAL_MS, PROJECT_TRANSITIONAL_STATUSES } from '../constants'

const selectTransitionalProjects = projects =>
  projects.filter(project => PROJECT_TRANSITIONAL_STATUSES.includes(project.status?.state))

const fetchBackgroundTaskState = async opId => {
  if (!opId) {
    return null
  }

  try {
    const { data } = await tasksApi.getBackgroundTask(opId)

    return data?.status?.state ?? null
  } catch (error) {
    if (error.response?.status === NOTFOUND_ERROR_STATUS_CODE) {
      return BG_TASK_FAILED
    }
    console.error('Failed to fetch project background task status', error)

    return null
  }
}

const fetchProjectNamesWithSyncIssues = async () => {
  try {
    const { data } = await eventsApi.getProjectSyncIssues()

    return new Set(data?.activations?.map(a => a.parameters?.project).filter(Boolean) ?? [])
  } catch (error) {
    console.error('Failed to fetch project sync events', error)

    return new Set()
  }
}

const fetchProjectSyncTooltipEntry = async (project, syncIssuesPromise) => {
  const [backgroundTaskState, syncIssues] = await Promise.all([
    fetchBackgroundTaskState(project.status?.op_id),
    syncIssuesPromise
  ])

  const tooltip = getProjectSyncTooltip(
    project,
    backgroundTaskState,
    syncIssues.has(project.metadata?.name)
  )

  return [project.metadata?.name, tooltip]
}

const fetchProjectSyncStatusMap = async transitionalProjects => {
  const syncIssuesPromise = fetchProjectNamesWithSyncIssues()

  const tooltipEntries = await Promise.all(
    transitionalProjects.map(project => fetchProjectSyncTooltipEntry(project, syncIssuesPromise))
  )

  return Object.fromEntries(tooltipEntries.filter(([, tooltip]) => Boolean(tooltip)))
}

export const useProjectsSyncStatus = (projects, refreshProjects) => {
  const [projectSyncStatusMap, setProjectSyncStatusMap] = useState({})
  const latestProjectsRef = useRef(projects)

  useEffect(() => {
    latestProjectsRef.current = projects
  }, [projects])

  const hasTransitionalProjects = useMemo(
    () => selectTransitionalProjects(projects).length > 0,
    [projects]
  )

  useEffect(() => {
    if (!hasTransitionalProjects) {
      setProjectSyncStatusMap({})

      return
    }

    let isActive = true
    const terminatePollRef = { current: null }

    const pollProjectSyncStatus = async () => {
      const transitionalProjects = selectTransitionalProjects(latestProjectsRef.current)

      if (!transitionalProjects.length) {
        return null
      }

      refreshProjects()

      const syncStatusMap = await fetchProjectSyncStatusMap(transitionalProjects)

      if (isActive) {
        setProjectSyncStatusMap(syncStatusMap)
      }

      return syncStatusMap
    }

    pollTask(pollProjectSyncStatus, result => result === null, {
      delay: PROJECT_SYNC_POLL_INTERVAL_MS,
      terminatePollRef
    }).catch(() => {})

    return () => {
      isActive = false
      terminatePollRef.current?.()
    }
  }, [hasTransitionalProjects, refreshProjects])

  return { projectSyncStatusMap }
}
