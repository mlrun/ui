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
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import StatsCard from '../../common/StatsCard/StatsCard'
import Loader from '../../common/Loader/Loader'

import { generateMonitoringStats } from '../../utils/generateMonitoringData'
import { JOBS_MONITORING_SCHEDULED_TAB } from '../../constants'

import { ReactComponent as ClockIcon } from 'igz-controls/images/clock.svg'

import './projectsMonitoringCounters.scss'

const ScheduledJobsCounters = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const projectStore = useSelector(store => store.projectStore)

  const scheduledStats = useMemo(
    () =>
      generateMonitoringStats(
        projectStore.jobsMonitoringData.scheduled,
        navigate,
        dispatch,
        JOBS_MONITORING_SCHEDULED_TAB
      ),
    [dispatch, navigate, projectStore.jobsMonitoringData.scheduled]
  )

  return (
    <StatsCard className="monitoring-stats">
      <StatsCard.Header title="Scheduled">
        <div className="project-card__info">
          <ClockIcon className="project-card__info-icon" />
          <span>Next 24 hours</span>
        </div>

        {/* Todo: Use in the future
        <DatePicker
          date={filter.dates.value[0]}
          dateTo={filter.dates.value[1]}
          hasFutureOptions
          selectedOptionId={NEXT_24_HOUR_DATE_OPTION}
          label=""
          onChange={handleDateSelection}
          type="date-range-time"
          withLabels
        /> */}
      </StatsCard.Header>
      <StatsCard.Row>
        <StatsCard.Col>
          <h6 className="stats__subtitle">Jobs</h6>
          <span className="stats__counter">
            {projectStore.projectsSummary.loading ? (
              <Loader section small secondary />
            ) : (
              scheduledStats.jobs.counter
            )}
          </span>
        </StatsCard.Col>
        <StatsCard.Col>
          <h6 className="stats__subtitle">Workflows</h6>
          <span className="stats__counter">
            {projectStore.projectsSummary.loading ? (
              <Loader section small secondary />
            ) : (
              scheduledStats.workflows.counter
            )}
          </span>
        </StatsCard.Col>
      </StatsCard.Row>
      <StatsCard.Row>
        <StatsCard.Col>
          <span
            className="link"
            onClick={scheduledStats.jobs.link}
            data-testid="scheduled_jobs_see_all"
          >
            See all
          </span>
        </StatsCard.Col>
        <StatsCard.Col>
          <span
            className="link"
            onClick={scheduledStats.workflows.link}
            data-testid="scheduled_wf_see_all"
          >
            See all
          </span>
        </StatsCard.Col>
      </StatsCard.Row>
    </StatsCard>
  )
}

export default React.memo(ScheduledJobsCounters)
