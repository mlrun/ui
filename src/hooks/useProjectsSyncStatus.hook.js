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
    return error.response?.status === NOTFOUND_ERROR_STATUS_CODE ? BG_TASK_FAILED : null
  }
}

const fetchProjectSyncIssueNames = async () => {
  try {
    const { data } = await eventsApi.getProjectSyncIssues()

    return new Set(
      data?.activations?.map(activation => activation.parameters?.project).filter(Boolean)
    )
  } catch {
    return new Set()
  }
}

const toSyncStatusMap = entries =>
  Object.fromEntries(entries.filter(([, tooltip]) => Boolean(tooltip)))

const fetchProjectSyncTooltipEntry = async (project, syncIssueNamesPromise) => {
  const [backgroundTaskState, syncIssueNames] = await Promise.all([
    fetchBackgroundTaskState(project.status?.op_id),
    syncIssueNamesPromise
  ])

  const tooltip = getProjectSyncTooltip(
    project,
    backgroundTaskState,
    syncIssueNames.has(project.metadata?.name)
  )

  return [project.metadata?.name, tooltip]
}

const fetchSyncStatusMap = async transitionalProjects => {
  const syncIssueNamesPromise = fetchProjectSyncIssueNames()

  const entries = await Promise.all(
    transitionalProjects.map(project => fetchProjectSyncTooltipEntry(project, syncIssueNamesPromise))
  )

  return toSyncStatusMap(entries)
}

const getBaselineSyncStatusMap = transitionalProjects =>
  toSyncStatusMap(
    transitionalProjects.map(project => [
      project.metadata?.name,
      getProjectSyncTooltip(project, null, false)
    ])
  )

const mergeSyncStatusMaps = (baselineMap, polledMap) =>
  Object.fromEntries(
    Object.keys(baselineMap).map(name => [name, polledMap[name] ?? baselineMap[name]])
  )

export const useProjectsSyncStatus = (projects, refreshProjects) => {
  const [polledSyncStatusMap, setPolledSyncStatusMap] = useState({})
  const latestProjectsRef = useRef(projects)

  useEffect(() => {
    latestProjectsRef.current = projects
  }, [projects])

  const transitionalProjects = useMemo(() => selectTransitionalProjects(projects), [projects])
  const hasTransitionalProjects = transitionalProjects.length > 0

  const baselineSyncStatusMap = useMemo(
    () => getBaselineSyncStatusMap(transitionalProjects),
    [transitionalProjects]
  )

  useEffect(() => {
    if (!hasTransitionalProjects) {
      setPolledSyncStatusMap({})

      return
    }

    let isActive = true
    const terminatePollRef = { current: null }

    const pollProjectSyncStatus = async () => {
      const currentTransitionalProjects = selectTransitionalProjects(latestProjectsRef.current)

      if (!currentTransitionalProjects.length) {
        return null
      }

      refreshProjects()

      const syncStatusMap = await fetchSyncStatusMap(currentTransitionalProjects)

      if (isActive) {
        setPolledSyncStatusMap(syncStatusMap)
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

  const projectSyncStatusMap = useMemo(
    () => mergeSyncStatusMaps(baselineSyncStatusMap, polledSyncStatusMap),
    [baselineSyncStatusMap, polledSyncStatusMap]
  )

  return { projectSyncStatusMap }
}
