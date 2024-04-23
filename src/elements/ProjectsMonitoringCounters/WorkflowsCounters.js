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
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { upperFirst } from 'lodash'
import moment from 'moment'

import Loader from '../../common/Loader/Loader'
import StatsCard from '../../common/StatsCard/StatsCard'

import projectsAction from '../../actions/projects'
import workflowActions from '../../actions/workflow'

import {
  generateMonitoringGroupedData,
  generateMonitoringStats
} from '../../utils/generateMonitoringData'
import { useFetchData } from '../../hooks/useFetchData.hook'
import { GROUP_BY_WORKFLOW, JOBS_MONITORING_WORKFLOWS_TAB, FILTER_ALL_ITEMS } from '../../constants'

import { ReactComponent as ClockIcon } from 'igz-controls/images/clock.svg'

import './projectsMonitoringCounters.scss'

const WorkflowsCounters = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [filter] = useState({
    groupBy: GROUP_BY_WORKFLOW,
    dates: {
      value: [new Date(moment().add(-1, 'days'))]
    },
    state: FILTER_ALL_ITEMS
  })
  const [groupedWorkflowsData, setGroupedWorkflowsData] = useState({
    all: [],
    running: [],
    failed: [],
    completed: []
  })
  const { loading: workflowsLoading } = useFetchData({
    filter,
    action: workflowActions.fetchWorkflows
  })
  const { data: workflows } = useSelector(store => store.workflowsStore.workflows)

  // const handleDateSelection = dates => {
  //   const generatedDates = [...dates]

  //   if (generatedDates.length === 1) {
  //     generatedDates.push(new Date())
  //   }

  //   setFilter(filters => ({ ...filters, dates: { value: generatedDates } }))
  // }

  const workflowsStats = useMemo(
    () =>
      generateMonitoringStats(
        groupedWorkflowsData,
        navigate,
        dispatch,
        JOBS_MONITORING_WORKFLOWS_TAB
      ),
    [dispatch, groupedWorkflowsData, navigate]
  )

  useEffect(() => {
    generateMonitoringGroupedData(workflows, setGroupedWorkflowsData, data =>
      dispatch(projectsAction.setJobsMonitoringData({ workflows: data }))
    )
  }, [dispatch, workflows])

  const getCounterTemplate = useCallback(
    type => {
      return (
        <>
          <h6 className="stats__subtitle">{upperFirst(type)}</h6>
          <span className="stats__counter">
            {workflowsLoading ? <Loader section small secondary /> : workflowsStats.all.counter}
          </span>
          <ul className="projects-monitoring-legend__status">
            {workflowsStats.counters.map(({ counter, link, statusClass }) => (
              <li className="link" onClick={link} key={`${statusClass}-jobs`}>
                {workflowsLoading ? <Loader section small secondary /> : counter}
                <i className={`state-${statusClass}`} />
              </li>
            ))}
          </ul>
        </>
      )
    },
    [workflowsStats, workflowsLoading]
  )

  return (
    <StatsCard className="monitoring-stats">
      <StatsCard.Header title="Workflows">
        <div className="project-card__info">
          <ClockIcon className="project-card__info-icon" />
          <span>Past 24 hours</span>
        </div>
        {/* Todo: Use in the future
        <DatePicker
          date={filter.dates.value[0]}
          dateTo={filter.dates.value[1]}
          selectedOptionId={PAST_24_HOUR_DATE_OPTION}
          label=""
          onChange={handleDateSelection}
          type="date-range-time"
          withLabels
        /> */}
      </StatsCard.Header>
      <StatsCard.Row>
        <StatsCard.Col>{getCounterTemplate(JOBS_MONITORING_WORKFLOWS_TAB)}</StatsCard.Col>
      </StatsCard.Row>
      <StatsCard.Row>
        <StatsCard.Col>
          <span className="link" onClick={workflowsStats.all.link} data-testid="workflows_see_all">
            See all
          </span>
        </StatsCard.Col>
      </StatsCard.Row>
    </StatsCard>
  )
}

export default React.memo(WorkflowsCounters)
