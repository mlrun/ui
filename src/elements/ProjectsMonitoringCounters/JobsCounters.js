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
import React, { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { upperFirst } from 'lodash'
import moment from 'moment'

import DatePicker from '../../common/DatePicker/DatePicker'
import Loader from '../../common/Loader/Loader'
import StatsCard from '../../common/StatsCard/StatsCard'

import jobsActions from '../../actions/jobs'
import workflowActions from '../../actions/workflow'
import { PAST_24_HOUR_DATE_OPTION } from '../../utils/datePicker.util'
import { useFetchData } from '../../hooks/useFetchData.hook'
import { GROUP_BY_WORKFLOW, STATE_FILTER_ALL_ITEMS } from '../../constants'

import './projectsMonitoringCounters.scss'

const JobsCounters = () => {
  const [filter, setFilter] = useState({
    groupBy: GROUP_BY_WORKFLOW,
    dates: {
      value: [new Date(moment().add(-1, 'days'))]
    },
    state: STATE_FILTER_ALL_ITEMS
  })

  const navigate = useNavigate()
  const { loading: jobsLoading } = useFetchData({
    filter,
    action: jobsActions.fetchJobs
  })
  const { loading: workflowsLoading } = useFetchData({
    filter,
    action: workflowActions.fetchWorkflows
  })
  const { jobs } = useSelector(store => store.jobsStore)
  const { data: workflows } = useSelector(store => store.workflowsStore.workflows)

  const handleDateSelection = dates => {
    const generatedDates = [...dates]

    if (generatedDates.length === 1) {
      generatedDates.push(new Date())
    }

    setFilter(filters => ({ ...filters, dates: { value: generatedDates } }))
  }

  const jobStats = useMemo(
    () => ({
      all: {
        counter: jobs.length,
        link: () => navigate('/projects/jobs-monitoring/jobs')
      },
      counters: [
        {
          counter: jobs.filter(job => job.status?.state === 'running').length,
          link: () => navigate('/projects/jobs-monitoring/jobs'),
          statusClass: 'running'
        },
        {
          counter: jobs.filter(job => ['error', 'failed'].includes(job.status?.state)).length,
          link: () => navigate('/projects/jobs-monitoring/jobs'),
          statusClass: 'failed'
        },
        {
          counter: jobs.filter(job => job.status?.state === 'completed').length,
          link: () => navigate('/projects/jobs-monitoring/jobs'),
          statusClass: 'completed'
        }
      ]
    }),
    [jobs, navigate]
  )

  const workflowsStats = useMemo(
    () => ({
      all: {
        counter: workflows.length,
        link: () => navigate('/projects/jobs-monitoring/workflows')
      },
      counters: [
        {
          counter: workflows.filter(workflow => workflow.state?.value === 'running').length,
          link: () => navigate('/projects/jobs-monitoring/workflows'),
          statusClass: 'running'
        },
        {
          counter: workflows.filter(workflow => ['error', 'failed'].includes(workflow.state?.value))
            .length,
          link: () => navigate('/projects/jobs-monitoring/workflows'),
          statusClass: 'failed'
        },
        {
          counter: workflows.filter(workflow =>
            ['completed', 'succeeded'].includes(workflow.state?.value)
          ).length,
          link: () => navigate('/projects/jobs-monitoring/workflows'),
          statusClass: 'completed'
        }
      ]
    }),
    [workflows, navigate]
  )

  const getCounterTemplate = useCallback(
    type => {
      const stats = type === 'jobs' ? jobStats : workflowsStats

      return (
        <>
          <h6 className='stats__subtitle'>{upperFirst(type)}</h6>
          <span className='stats__counter'>
            {jobsLoading || workflowsLoading ? (
              <Loader section small secondary />
            ) : (
              stats.all.counter
            )}
          </span>
          <ul className='projects-monitoring-legend__status'>
            {stats.counters.map(({ counter, link, statusClass }) => (
              <li className='link' onClick={link} key={`${statusClass}-jobs`}>
                {jobsLoading || workflowsLoading ? <Loader section small secondary /> : counter}
                <i className={`state-${statusClass}`}></i>
              </li>
            ))}
          </ul>
        </>
      )
    },
    [jobStats, jobsLoading, workflowsStats, workflowsLoading]
  )

  return (
    <StatsCard className='monitoring-stats'>
      <StatsCard.Header title='Jobs and Workflows'>
        <DatePicker
          date={filter.dates.value[0]}
          dateTo={filter.dates.value[1]}
          selectedOptionId={PAST_24_HOUR_DATE_OPTION}
          label=''
          onChange={handleDateSelection}
          type='date-range-time'
          withLabels
        />
      </StatsCard.Header>
      <StatsCard.Body>
        <StatsCard.Col>{getCounterTemplate('jobs')}</StatsCard.Col>
        <StatsCard.Col>{getCounterTemplate('workflows')}</StatsCard.Col>
      </StatsCard.Body>
      <StatsCard.Footer>
        <StatsCard.Col>
          <span className='link' onClick={jobStats.all.link}>
            See all
          </span>
        </StatsCard.Col>
        <StatsCard.Col>
          <span className='link' onClick={workflowsStats.all.link}>
            See all
          </span>
        </StatsCard.Col>
      </StatsCard.Footer>
    </StatsCard>
  )
}

export default React.memo(JobsCounters)
