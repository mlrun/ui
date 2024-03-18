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
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import moment from 'moment'

import DatePicker from '../../common/DatePicker/DatePicker'
import Loader from '../../common/Loader/Loader'
import StatsCard from '../../common/StatsCard/StatsCard'

import jobsActions from '../../actions/jobs'
import { NEXT_24_HOUR_DATE_OPTION } from '../../utils/datePicker.util'
import { useFetchData } from '../../hooks/useFetchData.hook'
import { jobHasWorkflowLabel } from '../../utils/parseJob'

import './projectsMonitoringCounters.scss'

const ScheduledJobsCounters = () => {
  const [filter, setFilter] = useState({
    dates: {
      value: [new Date(), new Date(moment().add(1, 'days'))]
    }
  })

  const navigate = useNavigate()

  const { loading } = useFetchData({
    filter: filter,
    action: jobsActions.fetchScheduledJobs
  })
  const { scheduled: scheduledJobs } = useSelector(store => store.jobsStore)

  const handleDateSelection = dates => {
    const generatedDates = [...dates]

    if (generatedDates.length === 1) {
      generatedDates.unshift(new Date())
    }

    setFilter(filters => ({ ...filters, dates: { value: generatedDates } }))
  }

  const filterScheduledByDate = (scheduled, scheduledFilter) => {
    if (!scheduledFilter.dates.value[0] && !scheduledFilter.dates.value[1]) return scheduled

    return scheduled.filter(job => {
      const runTime = new Date(job.next_run_time)

      const start = new Date(scheduledFilter.dates.value[0])
      const end = new Date(scheduledFilter.dates.value[1])

      return runTime > start && runTime < end ? job : null
    })
  }

  const stats = useMemo(
    () => ({
      jobs: {
        counter: filterScheduledByDate(scheduledJobs, filter).filter(
          job => job.kind === 'job' && !jobHasWorkflowLabel(job)
        ).length,
        link: () => navigate('/projects/jobs-monitoring/scheduled')
      },
      workflows: {
        counter: filterScheduledByDate(scheduledJobs, filter).filter(job =>
          jobHasWorkflowLabel(job)
        ).length,
        link: () => navigate('/projects/jobs-monitoring/scheduled')
      }
    }),
    [filter, navigate, scheduledJobs]
  )

  return (
    <StatsCard className='monitoring-stats'>
      <StatsCard.Header title='Scheduled'>
        <DatePicker
          date={filter.dates.value[0]}
          dateTo={filter.dates.value[1]}
          hasFutureOptions
          selectedOptionId={NEXT_24_HOUR_DATE_OPTION}
          label=''
          onChange={handleDateSelection}
          type='date-range-time'
          withLabels
        />
      </StatsCard.Header>
      <StatsCard.Body>
        <StatsCard.Col>
          <h6 className='stats__subtitle'>Jobs</h6>
          <span className='stats__counter'>
            {loading ? <Loader section small secondary /> : stats.jobs.counter}
          </span>
        </StatsCard.Col>
        <StatsCard.Col>
          <h6 className='stats__subtitle'>Workflows</h6>
          <span className='stats__counter'>
            {loading ? <Loader section small secondary /> : stats.workflows.counter}
          </span>
        </StatsCard.Col>
      </StatsCard.Body>
      <StatsCard.Footer>
        <StatsCard.Col>
          <span className='link' onClick={stats.jobs.link}>
            See all
          </span>
        </StatsCard.Col>
        <StatsCard.Col>
          <span className='link' onClick={stats.workflows.link}>
            See all
          </span>
        </StatsCard.Col>
      </StatsCard.Footer>
    </StatsCard>
  )
}

export default React.memo(ScheduledJobsCounters)
