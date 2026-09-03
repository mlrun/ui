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
import { debounce, isEqual } from 'lodash'

import { parseIdentifier } from '../../../utils/parseUri'
import { showErrorNotification } from 'igz-controls/utils/notification.util'
import {
  DATES_FILTER,
  FILTER_ALL_ITEMS,
  APPLICATIONS_PAGE_PATH,
  NAME_FILTER,
  OWNER_FILTER,
  STATUS_FILTER
} from '../../../constants'
import { APPLICATION_STATUS, FAILED_API_STATES } from './applications.constants'

export const parseApplicationsQueryParams = (paramName, paramValue) => {
  if (paramName === STATUS_FILTER) {
    const parsed = paramValue?.split(',').filter(Boolean)
    return parsed?.length ? parsed : null
  }
  return paramValue
}

export const buildApiFilters = filters => {
  const apiFilters = {}

  if (filters[NAME_FILTER]) {
    apiFilters.name = `~${filters[NAME_FILTER]}`
  }

  const dateValue = filters[DATES_FILTER]?.value?.[0]
  if (dateValue instanceof Date) {
    apiFilters.since = dateValue.toISOString()
  }

  const dateUntilValue = filters[DATES_FILTER]?.value?.[1]
  if (dateUntilValue instanceof Date && !filters[DATES_FILTER]?.isPredefined) {
    apiFilters.until = dateUntilValue.toISOString()
  }

  const activeStatuses = Array.isArray(filters[STATUS_FILTER])
    ? filters[STATUS_FILTER].filter(s => s !== FILTER_ALL_ITEMS)
    : []

  if (activeStatuses.length > 0) {
    apiFilters.state = activeStatuses.flatMap(uiStatus => {
      if (uiStatus === APPLICATION_STATUS.RUNNING) return [APPLICATION_STATUS.READY]
      if (uiStatus === APPLICATION_STATUS.FAILED) return FAILED_API_STATES
      return [uiStatus]
    })
  }

  return apiFilters
}

export const filterApplications = (applications, filters) => {
  let filtered = applications ?? []

  const ownerSearch = filters[OWNER_FILTER]?.trim().toLowerCase()
  if (ownerSearch) {
    filtered = filtered.filter(app => (app.owner ?? '').toLowerCase().includes(ownerSearch))
  }

  const selectedStatuses = Array.isArray(filters[STATUS_FILTER])
    ? filters[STATUS_FILTER].filter(s => s !== FILTER_ALL_ITEMS)
    : []

  if (selectedStatuses.length > 0) {
    const expandedStatuses = selectedStatuses.flatMap(uiStatus => {
      if (uiStatus === APPLICATION_STATUS.FAILED) return FAILED_API_STATES
      if (uiStatus === APPLICATION_STATUS.RUNNING)
        return [APPLICATION_STATUS.RUNNING, APPLICATION_STATUS.READY]
      return [uiStatus]
    })

    filtered = filtered.filter(app => expandedStatuses.includes(app.state?.value))
  }

  return filtered
}

const DEBOUNCE_DELAY_MS = 30

export const checkForSelectedApplication = debounce(
  ({
    applicationName,
    applicationId,
    applications,
    navigate,
    projectName,
    setSelectedApplication,
    fetchSingleEnrichedFunction,
    dispatch,
    lastCheckedApplicationIdRef
  }) => {
    if (applicationId) {
      if (applications.length > 0 && lastCheckedApplicationIdRef.current !== applicationId) {
        const { uid: hash, tag } = parseIdentifier(applicationId)
        lastCheckedApplicationIdRef.current = applicationId

        const foundApplication = applications?.find(app => app.hash === hash)

        fetchSingleEnrichedFunction({
          name: applicationName,
          hash: hash,
          tag: foundApplication?.tag || tag,
          nuclioName: foundApplication?.nuclio_name
        })
          .then(selectedApplication => {
            if (!selectedApplication) {
              navigate(
                `/projects/${projectName}/${APPLICATIONS_PAGE_PATH}${window.location.search}`,
                { replace: true }
              )
            } else {
              setSelectedApplication(prevState =>
                isEqual(prevState, selectedApplication) ? prevState : selectedApplication
              )
            }
          })
          .catch(error => {
            setSelectedApplication({})
            navigate(
              `/projects/${projectName}/${APPLICATIONS_PAGE_PATH}${window.location.search}`,
              { replace: true }
            )
            showErrorNotification(dispatch, error, '', 'Failed to retrieve application data')
          })
      }
    } else {
      setSelectedApplication({})
    }
  },
  DEBOUNCE_DELAY_MS
)
