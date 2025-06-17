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
import { useSelector } from 'react-redux'

import Loader from '../../common/Loader/Loader'
import StatsCard from '../../common/StatsCard/StatsCard'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { generateMonitoringStats } from '../../utils/generateMonitoringData'
import { JOBS_MONITORING_JOBS_TAB } from '../../constants'

import ClockIcon from 'igz-controls/images/clock.svg?react'
import classNames from 'classnames'

import './projectsMonitoringCounters.scss'

const RunCounter = () => {
  const navigate = useNavigate()
  const projectStore = useSelector(store => store.projectStore)

  const jobStats = useMemo(
    () =>
      generateMonitoringStats(
        projectStore.jobsMonitoringData.jobs,
        navigate,
        JOBS_MONITORING_JOBS_TAB
      ),
    [navigate, projectStore.jobsMonitoringData.jobs]
  )

  return (
    <StatsCard className="monitoring-stats">
      <div>
        <StatsCard.Header
          title="Runs"
          tip="Number of Job runs, clicking on the counters navigates to jobs screen."
        >
          <div className="project-card__info">
            <ClockIcon className="project-card__info-icon" />
            <span>Past 24 hrs</span>
          </div>
        </StatsCard.Header>
        <StatsCard.Row>
          <div
            className="stats__link stats__counter_header"
            data-testid="scheduled_total_counter"
            onClick={jobStats.total.link}
          >
            <div className="stats__counter">
              {projectStore.projectsSummary.loading ? (
                <Loader section small secondary />
              ) : (
                jobStats.total.counter.toLocaleString()
              )}
            </div>
          </div>
        </StatsCard.Row>

        <div className="stats__details">
          {jobStats.counters.map(({ counter, label, link, statusClass, tooltip }, index) => {
            const isLast = index === jobStats.counters.length - 1
            const linkClassName = classNames('stats__link', !isLast && 'stats__line')
            return (
              <StatsCard.Row key={`${statusClass}-jobs`}>
                <div
                  className={linkClassName}
                  onClick={link}
                  data-testid={`wf_${statusClass}_counter`}
                >
                  <div data-testid={`wf_${statusClass}_status`} className="stats__status">
                    <Tooltip textShow template={<TextTooltipTemplate text={tooltip} />}>
                      <h6 className="stats__subtitle">{label}</h6>
                      <i className={`state-${statusClass}`} />
                    </Tooltip>
                  </div>
                  <div className="stats__counter">
                    {projectStore.projectsSummary.loading ? (
                      <Loader section small secondary />
                    ) : (
                      counter.toLocaleString()
                    )}
                  </div>
                </div>
              </StatsCard.Row>
            )
          })}
        </div>
      </div>
    </StatsCard>
  )
}

export default React.memo(RunCounter)
