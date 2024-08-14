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
import React, { useCallback, useState, useMemo, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { connect, useDispatch } from 'react-redux'

import FilterMenu from '../../FilterMenu/FilterMenu'
import ScheduledJobsTable from '../../../elements/ScheduledJobsTable/ScheduledJobsTable'

import {
  GROUP_BY_NONE,
  JOBS_PAGE,
  LABELS_FILTER,
  NAME_FILTER,
  SCHEDULE_TAB,
  REQUEST_CANCELED
} from '../../../constants'
import { JobsContext } from '../Jobs'
import { createJobsScheduleTabContent } from '../../../utils/createJobsContent'
import { parseJob } from '../../../utils/parseJob'
import { scheduledJobsActionCreator } from './scheduledJobs.util'
import { setFilters } from '../../../reducers/filtersReducer'

const ScheduledJobs = ({ fetchScheduledJobs }) => {
  const [jobs, setJobs] = useState([])
  const [dataIsLoaded, setDataIsLoaded] = useState(false)
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const abortControllerRef = useRef(new AbortController())

  const dispatch = useDispatch()
  const params = useParams()

  const tableContent = useMemo(() => createJobsScheduleTabContent(jobs), [jobs])

  const filters = useMemo(
    () => [
      { type: NAME_FILTER, label: 'Name:' },
      { type: LABELS_FILTER, label: 'Labels:' }
    ],
    []
  )

  const refreshJobs = useCallback(
    filters => {
      setJobs([])
      abortControllerRef.current = new AbortController()

      fetchScheduledJobs(params.projectName, filters, {
        ui: {
          controller: abortControllerRef.current,
          setRequestErrorMessage
        }
      }).then(jobs => {
        if (jobs) {
          setJobs(jobs.map(job => parseJob(job, SCHEDULE_TAB)))
        }
      })
    },
    [fetchScheduledJobs, params.projectName]
  )

  useEffect(() => {
    if (!dataIsLoaded) {
      refreshJobs()
      setDataIsLoaded(true)
    }
  }, [dataIsLoaded, refreshJobs])

  useEffect(() => {
    return () => {
      setJobs([])
      setDataIsLoaded(false)
      abortControllerRef.current.abort(REQUEST_CANCELED)
    }
  }, [params.projectName])

  useEffect(() => {
    dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
  }, [dispatch])

  return (
    <>
      <div className="content__action-bar-wrapper">
        <div className="action-bar">
          <FilterMenu
            filters={filters}
            onChange={refreshJobs}
            page={JOBS_PAGE}
            withoutExpandButton
          />
        </div>
      </div>
      <ScheduledJobsTable
        context={JobsContext}
        filters={filters}
        jobs={jobs}
        requestErrorMessage={requestErrorMessage}
        refreshJobs={refreshJobs}
        tableContent={tableContent}
      />
    </>
  )
}

ScheduledJobs.propTypes = {}

export default connect(null, {
  ...scheduledJobsActionCreator
})(React.memo(ScheduledJobs))
