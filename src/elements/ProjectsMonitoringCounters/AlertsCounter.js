import './projectsMonitoringCounters.scss'
import StatsCard from '../../common/StatsCard/StatsCard'
// import React, { useMemo } from 'react'

import Loader from '../../common/Loader/Loader'

import { ReactComponent as Alerts } from 'igz-controls/images/alerts.svg'
import { ReactComponent as ClockIcon } from 'igz-controls/images/clock.svg'
import { useSelector } from 'react-redux'

const AlertTitle = (
  <div>
    <Alerts className="stats__header-icon" />
    Alerts
  </div>
)

const AlertsCounter = () => {
  const projectStore = useSelector(store => store.projectStore)
  return (
    <StatsCard className="monitoring-stats alerts-card">
      <StatsCard.Header title={AlertTitle}>
        <div className="project-card__info">
          <ClockIcon className="project-card__info-icon" />
          <span>Past 24 hours</span>
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
                onClick={() => {}} //todo
                data-testid="scheduled_total_see_all"
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
                onClick={() => {}}
                data-testid="scheduled_total_see_all"
              >
                {projectStore.jobsMonitoringData.alerts.jobs}{' '}
              </span>
            )}
          </span>
        </StatsCard.Col>
        <StatsCard.Col>
          <h6 className="stats__subtitle">Other</h6>
          <span className="stats__counter">
            {projectStore.projectsSummary.loading ? (
              <Loader section small secondary />
            ) : (
              <span
                className="stats__link"
                onClick={() => {}}
                data-testid="scheduled_total_see_all"
              >
                {projectStore.jobsMonitoringData.alerts.application}
              </span>
            )}
          </span>
        </StatsCard.Col>
      </StatsCard.Row>
      <div className="space"></div>
    </StatsCard>
  )
}

export default AlertsCounter
