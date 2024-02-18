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
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import DatePicker from '../../../common/DatePicker/DatePicker'
import Loader from '../../../common/Loader/Loader'
import StatsCard from '../../../elements/StatsCard/StatsCard'

import jobsActions from '../../../actions/jobs'
import workflowActions from '../../../actions/workflow'

import { GROUP_BY_WORKFLOW, REQUEST_CANCELED, STATE_FILTER_ALL_ITEMS } from '../../../constants'
import { getJobsStatsConfig } from '../projects.util'

const ProjectsMonitoring = () => {
  const [jobsFilter, setJobsFilter] = useState({
    dates: {
      value: [new Date(moment().add(-1, 'days'))]
    }
  })
  const [workflowsFilter, setWorkflowsFilter] = useState({
    groupBy: GROUP_BY_WORKFLOW,
    dates: {
      value: [new Date(moment().add(-1, 'days'))]
    },
    state: STATE_FILTER_ALL_ITEMS
  })
  const [scheduledFilter, setScheduledFilter] = useState({
    dates: {
      value: [new Date(), new Date(moment().add(1, 'days'))]
    }
  })
  const [loadingState, setLoadingState] = useState({
    jobs: true,
    workflows: true,
    scheduled: true
  })

  const dispatch = useDispatch({})
  const navigate = useNavigate({})
  const jobsAbortControllerRef = useRef()
  const workflowsAbortControllerRef = useRef()

  const { jobs, scheduled } = useSelector(store => store.jobsStore)
  const { data: workflows } = useSelector(store => store.workflowsStore.workflows)

  const handleDateSelection = id => dates => {
    const requestToAbort = id === 'jobs' ? jobsAbortControllerRef : workflowsAbortControllerRef
    requestToAbort.current.abort(REQUEST_CANCELED)

    const generatedDates = [...dates]

    if (generatedDates.length === 1) {
      !id.includes('scheduled')
        ? generatedDates.push(new Date())
        : generatedDates.unshift(new Date())
    }

    const setFilters = id.includes('jobs')
      ? setJobsFilter
      : id.includes('workflows')
      ? setWorkflowsFilter
      : setScheduledFilter

    setFilters(filters => ({ ...filters, dates: { value: generatedDates } }))

    !id.includes('scheduled') &&
      setLoadingState(state => ({
        ...state,
        [id]: true
      }))
  }

  const statsConfig = useMemo(
    () =>
      getJobsStatsConfig(
        handleDateSelection,
        jobs,
        jobsFilter,
        navigate,
        scheduled,
        scheduledFilter,
        workflows,
        workflowsFilter
      ),
    [jobs, jobsFilter, navigate, scheduled, scheduledFilter, workflows, workflowsFilter]
  )

  useEffect(() => {
    jobsAbortControllerRef.current = new AbortController()

    dispatch(
      jobsActions.fetchJobs('*', jobsFilter, {
        signal: jobsAbortControllerRef.current.signal
      })
    ).then(data => {
      if (data) {
        setLoadingState(state => ({
          ...state,
          jobs: false
        }))
      }
    })
  }, [dispatch, jobsFilter])

  useEffect(() => {
    workflowsAbortControllerRef.current = new AbortController()

    dispatch(
      workflowActions.fetchWorkflows('*', workflowsFilter, {
        signal: workflowsAbortControllerRef.current.signal
      })
    ).then(data => {
      if (data) {
        setLoadingState(state => ({
          ...state,
          workflows: false
        }))
      }
    })
  }, [dispatch, workflowsFilter])

  useEffect(() => {
    dispatch(jobsActions.fetchScheduledJobs('*')).then(() => {
      setLoadingState(state => ({
        ...state,
        scheduled: false
      }))
    })
  }, [dispatch])

  useEffect(() => {
    return () => {
      jobsAbortControllerRef.current.abort(REQUEST_CANCELED)
      workflowsAbortControllerRef.current.abort(REQUEST_CANCELED)
    }
  }, [])

  return (
    <div className='projects-jobs-container'>
      <div className='projects-jobs-legend'>
        <h5 className='projects-jobs-legend__title'>Monitoring</h5>
        <ul className='projects-jobs-stats__counters'>
          <li>
            Running <i className='state-running-job'></i>
          </li>
          <li>
            Failed <i className='state-failed-job'></i>
          </li>
          <li>
            Completed <i className='state-completed-job'></i>
          </li>
        </ul>
      </div>
      <div className='projects-jobs-stats'>
        {statsConfig.map(stats => (
          <StatsCard key={stats.id}>
            <>
              <div className='projects-jobs-stats__row'>
                <h5 className='projects-jobs-stats__title'>{stats.title}</h5>
                <DatePicker
                  date={stats.filters.dates.value[0]}
                  dateTo={stats.filters.dates.value[1]}
                  selectedOptionId={stats.filters.selectedOptionId}
                  label=''
                  onChange={stats.filters.handler(stats.id)}
                  type='date-range-time'
                  optionsType={stats.id === 'scheduled' ? 'next' : 'past'}
                  withLabels
                />
              </div>
              {stats.id !== 'scheduled' ? (
                <>
                  <div className='projects-jobs-stats__row  projects-jobs-stats__full-row'>
                    <div className='projects-jobs-stats__counter'>
                      <span className='projects-jobs-stats__counter-display'>
                        {loadingState[stats.id] ? (
                          <Loader section small secondary />
                        ) : (
                          stats.counters.all.counter
                        )}
                      </span>
                    </div>
                  </div>
                  <div className='projects-jobs-stats__row'>
                    <ul className='projects-jobs-stats__counters'>
                      <li className='link' onClick={stats.counters.running.link}>
                        {loadingState[stats.id] ? (
                          <Loader section small secondary />
                        ) : (
                          stats.counters.running.counter
                        )}
                        <i className='state-running-job'></i>
                      </li>
                      <li className='link' onClick={stats.counters.failed.link}>
                        {loadingState[stats.id] ? (
                          <Loader section small secondary />
                        ) : (
                          stats.counters.failed.counter
                        )}
                        <i className='state-failed-job'></i>
                      </li>
                      <li className='link' onClick={stats.counters.completed.link}>
                        {loadingState[stats.id] ? (
                          <Loader section small secondary />
                        ) : (
                          stats.counters.completed.counter
                        )}
                        <i className='state-completed-job'></i>
                      </li>
                    </ul>
                    <span className='link' onClick={stats.counters.all.link}>
                      See all
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className='projects-jobs-stats__row projects-jobs-stats__full-row'>
                    <div className='projects-jobs-stats__counter'>
                      <span className='projects-jobs-stats__counter-display'>
                        {loadingState[stats.id] ? (
                          <Loader section small secondary />
                        ) : (
                          stats.counters.jobs.counter
                        )}
                      </span>
                      <h6 className='projects-jobs-stats__subtitle'>Jobs</h6>
                    </div>
                    <div className='projects-jobs-stats__counter'>
                      <span className='projects-jobs-stats__counter-display'>
                        {loadingState[stats.id] ? (
                          <Loader section small secondary />
                        ) : (
                          stats.counters.workflows.counter
                        )}
                      </span>
                      <h6 className='projects-jobs-stats__subtitle'>Workflows</h6>
                    </div>
                  </div>
                  <div className='projects-jobs-stats__row'>
                    <div className='projects-jobs-stats__counter'>
                      <span className='link' onClick={stats.counters.jobs.link}>
                        See all
                      </span>
                    </div>
                    <div className='projects-jobs-stats__counter'>
                      <span className='link' onClick={stats.counters.workflows.link}>
                        See all
                      </span>
                    </div>
                  </div>
                </>
              )}
            </>
          </StatsCard>
        ))}
      </div>
    </div>
  )
}

export default ProjectsMonitoring
