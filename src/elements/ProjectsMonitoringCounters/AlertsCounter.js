import './projectsMonitoringCounters.scss'
import StatsCard from '../../common/StatsCard/StatsCard'
import React from 'react'

import Loader from '../../common/Loader/Loader'

import { ReactComponent as Alerts } from 'igz-controls/images/alerts.svg'
import { ReactComponent as ClockIcon } from 'igz-controls/images/clock.svg'

const AlertsCounter = () => {
  const demoData = 10
  const demoLoading = false
  //todo:change to data

  const AlertTitle = (
    <div>
      <Alerts className="stats__header-icon" />
      Alerts
    </div>
  )
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
            {demoLoading ? (
              <Loader section small secondary />
            ) : (
              <span
                className="stats__link"
                onClick={() => {}}
                data-testid="scheduled_total_see_all"
              >
                {demoData}{' '}
              </span>
            )}
          </span>
        </StatsCard.Col>
        <StatsCard.Col>
          <h6 className="stats__subtitle">Jobs</h6>
          <span className="stats__counter">
            {demoLoading ? (
              <Loader section small secondary />
            ) : (
              <span
                className="stats__link"
                onClick={() => {}}
                data-testid="scheduled_total_see_all"
              >
                {demoData}{' '}
              </span>
            )}
          </span>
        </StatsCard.Col>
        <StatsCard.Col>
          <h6 className="stats__subtitle">Other</h6>
          <span className="stats__counter">
            {demoLoading ? (
              <Loader section small secondary />
            ) : (
              <span
                className="stats__link"
                onClick={() => {}}
                data-testid="scheduled_total_see_all"
              >
                {demoData}{' '}
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
