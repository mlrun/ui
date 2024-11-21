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

import React from 'react'
import { useSelector } from 'react-redux'

import Loader from '../../common/Loader/Loader'
import StatsCard from '../../common/StatsCard/StatsCard'

import { ReactComponent as Alerts } from 'igz-controls/images/alerts.svg'
import { ReactComponent as ClockIcon } from 'igz-controls/images/clock.svg'

import './projectsMonitoringCounters.scss'

const AlertsCounters = () => {
  const projectStore = useSelector(store => store.projectStore)
  // TODO:Implement the generateAlertsStats function in task ML-8100
  return (
    <StatsCard className="monitoring-stats alerts-card">
      <StatsCard.Header>
        <div className="project-card__title-icon">
          <Alerts className="stats__header-icon" />
          Alerts
        </div>
        <div className="project-card__info">
          <ClockIcon className="project-card__info-icon" />
          <span>Last 24 hours</span>
        </div>
      </StatsCard.Header>
      <StatsCard.Row>
        <StatsCard.Col>
          <h6 className="stats__subtitle">Endpoint</h6>
          <span className="stats__counter">
            {projectStore.projectsSummary.loading ? (
              <Loader section small secondary />
            ) : (
              <span
                className="stats__link"
                onClick={() => {}} // @TODO: will be implemented in ML-8100
                data-testid="alerts_endpoint_see_all"
              >
                {projectStore.jobsMonitoringData.alerts.endpoint}
              </span>
            )}
          </span>
        </StatsCard.Col>
        <StatsCard.Col>
          <h6 className="stats__subtitle">Jobs</h6>
          <span className="stats__counter">
            {projectStore.projectsSummary.loading ? (
              <Loader section small secondary />
            ) : (
              <span
                className="stats__link"
                onClick={() => {}} // @TODO: will be implemented in ML-8100
                data-testid="alerts_jobs_see_all"
              >
                {(projectStore.jobsMonitoringData.alerts.jobs || 0).toLocaleString()}
              </span>
            )}
          </span>
        </StatsCard.Col>
        <StatsCard.Col>
          <h6 className="stats__subtitle">Application</h6>
          <span className="stats__counter">
            {projectStore.projectsSummary.loading ? (
              <Loader section small secondary />
            ) : (
              <span
                className="stats__link"
                onClick={() => {}} // @TODO: will be implemented in ML-8100
                data-testid="alerts_application_see_all"
              >
                {(projectStore.jobsMonitoringData.alerts.application || 0).toLocaleString()}
              </span>
            )}
          </span>
        </StatsCard.Col>
        <StatsCard.Col>
          <h6 className="stats__subtitle">Total</h6>
          <span className="stats__counter">
            {projectStore.projectsSummary.loading ? (
              <Loader section small secondary />
            ) : (
              <span
                className="stats__link"
                onClick={() => {}} // @TODO: will be implemented in ML-8100
                data-testid="alerts_total_see_all"
              >
                {(projectStore.jobsMonitoringData.alerts.total || 0).toLocaleString()}
              </span>
            )}
          </span>
        </StatsCard.Col>
      </StatsCard.Row>
      <StatsCard.Row>
        <StatsCard.Col />
      </StatsCard.Row>
    </StatsCard>
  )
}

export default React.memo(AlertsCounters)
