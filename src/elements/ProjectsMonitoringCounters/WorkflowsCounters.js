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
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { upperFirst } from 'lodash'

import Loader from '../../common/Loader/Loader'
import StatsCard from '../../common/StatsCard/StatsCard'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { generateMonitoringStats } from '../../utils/generateMonitoringData'
import { JOBS_MONITORING_WORKFLOWS_TAB } from '../../constants'

import { ReactComponent as ClockIcon } from 'igz-controls/images/clock.svg'

import './projectsMonitoringCounters.scss'

const WorkflowsCounters = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const projectStore = useSelector(store => store.projectStore)

  const workflowsStats = useMemo(
    () =>
      generateMonitoringStats(
        projectStore.jobsMonitoringData.workflows,
        navigate,
        dispatch,
        JOBS_MONITORING_WORKFLOWS_TAB
      ),
    [dispatch, navigate, projectStore.jobsMonitoringData.workflows]
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
        <StatsCard.Col>
          <h6 className="stats__subtitle">{upperFirst(JOBS_MONITORING_WORKFLOWS_TAB)}</h6>
          <span className="stats__counter">
            {projectStore.projectsSummary.loading ? (
              <Loader section small secondary />
            ) : (
              workflowsStats.all.counter
            )}
          </span>
          <ul className="projects-monitoring-legend__status">
            {workflowsStats.counters.map(({ counter, link, statusClass, tooltip }) => (
              <li className="link" onClick={link} key={`${statusClass}-jobs`}>
                {projectStore.projectsSummary.loading ? (
                  <Loader section small secondary />
                ) : (
                  <Tooltip template={<TextTooltipTemplate text={tooltip} />}>
                    <span>
                      {counter}
                      <i className={`state-${statusClass}`} />
                    </span>
                  </Tooltip>
                )}
              </li>
            ))}
          </ul>
        </StatsCard.Col>
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
