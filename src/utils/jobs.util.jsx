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
import { cloneDeep, debounce, omit } from 'lodash'

import {
  BE_PAGE,
  DATES_FILTER,
  FE_PAGE,
  FILTER_ALL_ITEMS,
  JOBS_MONITORING_JOBS_TAB,
  FUNCTION_TYPE_APPLICATION,
  JOBS_MONITORING_SCHEDULED_TAB,
  JOB_KIND_DASK,
  JOB_KIND_DATABRICKS,
  JOB_KIND_HANDLER,
  JOB_KIND_JOB,
  JOB_KIND_LOCAL,
  JOB_KIND_MPIJOB,
  JOB_KIND_NUCLIO,
  JOB_KIND_REMOTE,
  JOB_KIND_SERVING,
  JOB_KIND_SPARK,
  JOB_KIND_WORKFLOW,
  LABELS_FILTER,
  MONITOR_JOBS_TAB,
  NAME_FILTER,
  PROJECTS_FILTER_ALL_ITEMS,
  PROJECT_FILTER,
  STATUS_FILTER,
  TYPE_FILTER
} from '../constants'
import {
  ANY_TIME_DATE_OPTION,
  datePickerFutureOptions,
  datePickerPastOptions,
  getDatePickerFilterValue,
  NEXT_24_HOUR_DATE_OPTION,
  PAST_24_HOUR_DATE_OPTION,
  PAST_WEEK_DATE_OPTION
} from './datePicker.util'
import {
  generateTypeFilter,
  jobsStatuses,
  workflowsStatuses
} from '../components/FilterMenu/filterMenu.settings'
import { fetchJob } from '../reducers/jobReducer'
import { generateObjectNotInTheListMessage } from './generateMessage.util'
import { getCloseDetailsLink } from './link-helper.util'
import { parseJob } from './parseJob'
import { showErrorNotification } from 'igz-controls/utils/notification.util'

import Code from 'igz-controls/images/code.svg?react'
import Application from 'igz-controls/images/application-icon.svg?react'
import DatabricksIcon from 'igz-controls/images/databricks-icon.svg?react'
import Jupyter from 'igz-controls/images/jupyter.svg?react'
import Package from 'igz-controls/images/package.svg?react'
import Horovod from 'igz-controls/images/horovod.svg?react'
import Nuclio from 'igz-controls/images/nuclio.svg?react'
import Remote from 'igz-controls/images/ic_remote.svg?react'
import Serving from 'igz-controls/images/serving-icon.svg?react'
import Spark from 'igz-controls/images/spark.svg?react'
import Workflow from 'igz-controls/images/workflow-icon.svg?react'

export const typesOfJob = {
  '': { label: 'Local', icon: <Code /> },
  [FUNCTION_TYPE_APPLICATION]: { label: 'Application', icon: <Application /> },
  [JOB_KIND_DASK]: { label: 'Dask', icon: null },
  [JOB_KIND_DATABRICKS]: { label: 'Databricks', icon: <DatabricksIcon /> },
  [JOB_KIND_HANDLER]: { label: 'Handler', icon: <Jupyter /> },
  [JOB_KIND_JOB]: { label: 'Job', icon: <Package /> },
  [JOB_KIND_LOCAL]: { label: 'Local', icon: <Code /> },
  [JOB_KIND_MPIJOB]: { label: 'Horovod', icon: <Horovod /> },
  [JOB_KIND_NUCLIO]: { label: 'Nuclio', icon: <Nuclio /> },
  [JOB_KIND_REMOTE]: { label: 'Remote', icon: <Remote /> },
  [JOB_KIND_SERVING]: { label: 'Serving', icon: <Serving /> },
  [JOB_KIND_SPARK]: { label: 'Spark', icon: <Spark /> },
  [JOB_KIND_WORKFLOW]: { label: 'Workflow', icon: <Workflow /> }
}

export const checkForSelectedJob = debounce(
  (
    paginatedJobs,
    jobRuns,
    jobs,
    jobName,
    jobId,
    projectName,
    navigate,
    setSelectedJob,
    modifyAndSelectRun,
    searchParams,
    paginationConfigJobsRef,
    dispatch,
    setSearchParams,
    lastCheckedJobIdRef
  ) => {
    const runProject = projectName || searchParams.get(PROJECT_FILTER)

    if (jobId && runProject) {
      const searchBePage = parseInt(searchParams.get(BE_PAGE))
      const configBePage = paginationConfigJobsRef.current[BE_PAGE]
      const jobsList = jobName ? jobRuns : jobs

      if (jobsList && searchBePage === configBePage && lastCheckedJobIdRef.current !== jobId) {
        lastCheckedJobIdRef.current = jobId

        dispatch(
          fetchJob({
            project: runProject,
            jobId: jobId
          })
        )
          .unwrap()
          .then(job => {
            const parsedJob = parseJob(job)
            if (!parsedJob) {
              navigate(
                getCloseDetailsLink(
                  jobName || (projectName ? MONITOR_JOBS_TAB : JOBS_MONITORING_JOBS_TAB),
                  true
                ),
                { replace: true }
              )
            } else if (parsedJob) {
              const findJobIndex = jobsList =>
                jobsList.findIndex(job => {
                  return job.uid === jobId
                })

              const itemIndexInPaginatedList = findJobIndex(paginatedJobs)
              const itemIndexInMainList =
                itemIndexInPaginatedList !== -1 ? itemIndexInPaginatedList : findJobIndex(jobsList)

              if (itemIndexInPaginatedList === -1) {
                if (itemIndexInMainList > -1) {
                  const { fePageSize } = paginationConfigJobsRef.current

                  setSearchParams(prevSearchParams => {
                    prevSearchParams.set(FE_PAGE, Math.ceil((itemIndexInMainList + 1) / fePageSize))

                    return prevSearchParams
                  })
                } else {
                  parsedJob.ui.infoMessage = generateObjectNotInTheListMessage("job's run")
                }
              }

              modifyAndSelectRun(cloneDeep(parsedJob))
            }
          })
          .catch(error => {
            navigate(
              getCloseDetailsLink(
                jobName || (projectName ? MONITOR_JOBS_TAB : JOBS_MONITORING_JOBS_TAB),
                true
              ),
              { replace: true }
            )
            showErrorNotification(
              dispatch,
              error,
              '',
              'This run either does not exist or was deleted'
            )
          })
      }
    } else {
      setSelectedJob({})
    }
  },
  30
)

export const getJobKindFromLabels = (labels = []) => {
  return labels.find(label => label.includes('kind:'))?.replace('kind: ', '') ?? ''
}

export const getJobsFiltersConfig = (jobName, crossProjects) => {
  const filters = {
    [NAME_FILTER]: {
      label: 'Name:',
      initialValue: '',
      hidden: Boolean(jobName)
    },
    [DATES_FILTER]: {
      label: 'Start time:',
      initialValue: getDatePickerFilterValue(
        datePickerPastOptions,
        crossProjects ? PAST_24_HOUR_DATE_OPTION : PAST_WEEK_DATE_OPTION
      )
    },
    [PROJECT_FILTER]: {
      label: 'Project:',
      initialValue: PROJECTS_FILTER_ALL_ITEMS,
      isModal: true,
      hidden: Boolean(jobName),
      applyHidden: true
    },
    [STATUS_FILTER]: { label: 'Status:', initialValue: [FILTER_ALL_ITEMS], isModal: true },
    [TYPE_FILTER]: { label: 'Type:', initialValue: FILTER_ALL_ITEMS, isModal: true },
    [LABELS_FILTER]: { label: 'Labels:', initialValue: '', isModal: true }
  }

  if (!crossProjects) {
    return omit(filters, [PROJECT_FILTER])
  }

  return filters
}

export const getWorkflowsFiltersConfig = crossProjects => {
  const filters = {
    [NAME_FILTER]: { label: 'Name:', initialValue: '' },
    [DATES_FILTER]: {
      label: 'Created at:',
      initialValue: getDatePickerFilterValue(
        datePickerPastOptions,
        crossProjects ? PAST_24_HOUR_DATE_OPTION : PAST_WEEK_DATE_OPTION
      )
    },
    [PROJECT_FILTER]: { label: 'Project:', initialValue: PROJECTS_FILTER_ALL_ITEMS, isModal: true },
    [STATUS_FILTER]: { label: 'Status:', initialValue: [FILTER_ALL_ITEMS], isModal: true },
    [LABELS_FILTER]: { label: 'Labels:', initialValue: '', isModal: true }
  }

  if (!crossProjects) {
    return omit(filters, [PROJECT_FILTER])
  }

  return filters
}

export const getScheduledFiltersConfig = crossProjects => {
  const filters = {
    [NAME_FILTER]: { label: 'Name:', initialValue: '' },
    [DATES_FILTER]: {
      label: 'Scheduled at:',
      isFuture: true,
      initialValue: getDatePickerFilterValue(
        datePickerFutureOptions,
        crossProjects ? NEXT_24_HOUR_DATE_OPTION : ANY_TIME_DATE_OPTION,
        true
      )
    },
    [PROJECT_FILTER]: { label: 'Project:', initialValue: PROJECTS_FILTER_ALL_ITEMS, isModal: true },
    [TYPE_FILTER]: { label: 'Type:', initialValue: [FILTER_ALL_ITEMS], isModal: true },
    [LABELS_FILTER]: { label: 'Labels:', initialValue: '', isModal: true }
  }

  if (!crossProjects) {
    return omit(filters, [PROJECT_FILTER])
  }

  return filters
}

export const parseJobsQueryParamsCallback = (paramName, paramValue) => {
  if (paramName === STATUS_FILTER) {
    const filteredStatuses = paramValue
      ?.split(',')
      .filter(paramStatus => jobsStatuses.find(status => status.id === paramStatus))

    return filteredStatuses?.length ? filteredStatuses : null
  }

  if (paramName === TYPE_FILTER) {
    return generateTypeFilter().find(type => type.id === paramValue)?.id
  }

  return paramValue
}

export const parseWorkflowsQueryParamsCallback = (paramName, paramValue) => {
  if (paramName === STATUS_FILTER) {
    const filteredStatuses = paramValue
      ?.split(',')
      .filter(paramStatus => workflowsStatuses.find(status => status.id === paramStatus))

    return filteredStatuses?.length ? filteredStatuses : null
  }

  return paramValue
}

export const parseScheduledQueryParamsCallback = (paramName, paramValue) => {
  if (paramName === TYPE_FILTER) {
    const filteredStatuses = paramValue
      ?.split(',')
      .filter(paramStatus => generateTypeFilter(JOBS_MONITORING_SCHEDULED_TAB).find(type => type.id === paramStatus))

    return filteredStatuses?.length ? filteredStatuses : null
  }

  return paramValue
}
