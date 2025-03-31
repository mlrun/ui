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
import { cloneDeep, debounce } from 'lodash'

import {
  BE_PAGE,
  DATES_FILTER,
  FE_PAGE,
  FILTER_ALL_ITEMS,
  JOBS_MONITORING_SCHEDULED_TAB,
  LABELS_FILTER,
  NAME_FILTER,
  PROJECT_FILTER,
  PROJECTS_FILTER_ALL_ITEMS,
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
import { getCloseDetailsLink } from './link-helper.util'
import { parseJob } from './parseJob'
import { fetchJob } from '../reducers/jobReducer'
import { showErrorNotification } from './notifications.util'
import { generateObjectNotInTheListMessage } from './generateMessage.util'

export const checkForSelectedJob = debounce(
  (
    paginatedJobs,
    jobRuns,
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

      if (jobRuns && searchBePage === configBePage && lastCheckedJobIdRef.current !== jobId) {
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
              navigate(getCloseDetailsLink(jobName, true), { replace: true })
            } else if (parsedJob) {
              const findJobIndex = jobsList =>
                jobsList.findIndex(job => {
                  return job.uid === jobId
                })

              const itemIndexInPaginatedList = findJobIndex(paginatedJobs)
              const itemIndexInMainList =
                itemIndexInPaginatedList !== -1 ? itemIndexInPaginatedList : findJobIndex(jobRuns)

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
  return {
    [NAME_FILTER]: { label: 'Name:', hidden: Boolean(jobName), initialValue: '' },
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
      hidden: Boolean(jobName)
    },
    [STATUS_FILTER]: { label: 'Status:', initialValue: [FILTER_ALL_ITEMS], isModal: true },
    [TYPE_FILTER]: { label: 'Type:', initialValue: FILTER_ALL_ITEMS, isModal: true },
    [LABELS_FILTER]: { label: 'Labels:', initialValue: '', isModal: true }
  }
}

export const getWorkflowsFiltersConfig = crossProjects => {
  return {
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
}

export const getScheduledFiltersConfig = crossProjects => {
  return {
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
    [TYPE_FILTER]: { label: 'Type:', initialValue: FILTER_ALL_ITEMS, isModal: true },
    [LABELS_FILTER]: { label: 'Labels:', initialValue: '', isModal: true }
  }
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
    return generateTypeFilter(JOBS_MONITORING_SCHEDULED_TAB).find(type => type.id === paramValue)
      ?.id
  }

  return paramValue
}
