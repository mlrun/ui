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
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import ScheduledJobsTable from '../../../elements/ScheduledJobsTable/ScheduledJobsTable'

import { GROUP_BY_NONE, REQUEST_CANCELED, SCHEDULE_TAB } from '../../../constants'
import { JobsContext } from '../Jobs'
import { createJobsScheduleTabContent } from '../../../utils/createJobsContent'
import { setFilters } from '../../../reducers/filtersReducer'
import { useFiltersFromSearchParams } from '../../../hooks/useFiltersFromSearchParams.hook'

const ScheduledJobs = () => {
  const [dataIsLoaded, setDataIsLoaded] = useState(false)
  const {
    abortControllerRef,
    scheduledJobs,
    refreshScheduled: refreshJobs,
    requestErrorMessage,
    setJobs,
    scheduledFiltersConfig,
    tabData
  } = React.useContext(JobsContext)
  const dispatch = useDispatch()
  const params = useParams()
  const filters = useFiltersFromSearchParams(
    tabData[SCHEDULE_TAB]?.filtersConfig,
    tabData[SCHEDULE_TAB]?.parseQueryParamsCallback
  )

  useEffect(() => {
    if (!dataIsLoaded) {
      refreshJobs(filters)
      setDataIsLoaded(true)
    }
  }, [dataIsLoaded, filters, refreshJobs])

  useEffect(() => {
    const abortControllerRefCurrent = abortControllerRef.current

    return () => {
      setJobs([])
      setDataIsLoaded(false)
      abortControllerRefCurrent.abort(REQUEST_CANCELED)
    }
  }, [abortControllerRef, params.projectName, setJobs])

  useEffect(() => {
    dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
  }, [dispatch])

  return (
    <ScheduledJobsTable
      context={JobsContext}
      createTableContent={() => createJobsScheduleTabContent(scheduledJobs)}
      filters={filters}
      filtersConfig={scheduledFiltersConfig}
      jobs={scheduledJobs}
      requestErrorMessage={requestErrorMessage}
      refreshJobs={refreshJobs}
    />
  )
}

ScheduledJobs.propTypes = {}

export default React.memo(ScheduledJobs)
