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
import React, { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import ScheduledJobsTable from '../../../elements/ScheduledJobsTable/ScheduledJobsTable'

import { GROUP_BY_NONE, REQUEST_CANCELED, SCHEDULE_TAB } from '../../../constants'
import { JobsContext } from '../Jobs'
import { createJobsScheduleTabContent } from '../../../utils/createJobsContent'
import { setFilters } from '../../../reducers/filtersReducer'

const ScheduledJobs = () => {
  const [dataIsLoaded, setDataIsLoaded] = useState(false)
  const [schedulesFilterMenu, schedulesFilterMenuModal] = useSelector(state => [
    state.filtersStore.filterMenu[SCHEDULE_TAB],
    state.filtersStore.filterMenuModal[SCHEDULE_TAB]
  ])
  const {
    abortControllerRef,
    scheduledJobs,
    refreshScheduled: refreshJobs,
    requestErrorMessage,
    setJobs,
    scheduledFiltersConfig
  } = React.useContext(JobsContext)
  const dispatch = useDispatch()
  const params = useParams()

  const tableContent = useMemo(() => createJobsScheduleTabContent(scheduledJobs), [scheduledJobs])

  useEffect(() => {
    if (!dataIsLoaded) {
      refreshJobs({
        ...schedulesFilterMenu.values,
        ...schedulesFilterMenuModal.values
      })
      setDataIsLoaded(true)
    }
  }, [dataIsLoaded, refreshJobs, schedulesFilterMenu, schedulesFilterMenuModal.values])

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
      filterMenuName={SCHEDULE_TAB}
      filtersConfig={scheduledFiltersConfig}
      jobs={scheduledJobs}
      requestErrorMessage={requestErrorMessage}
      refreshJobs={refreshJobs}
      tableContent={tableContent}
    />
  )
}

ScheduledJobs.propTypes = {}

export default React.memo(ScheduledJobs)
