import './projectsMonitoringCounters.scss'
import StatsCard from '../../common/StatsCard/StatsCard'
import React from 'react'

import { ReactComponent as ClockIcon } from 'igz-controls/images/clock.svg'
import Loader from '../../common/Loader/Loader'

const AlertsCounter = () => {
  const demoData = 10
  const demoFalse = false
  return (
    <StatsCard className="monitoring-stats">
      <StatsCard.Header title="Alerts">
        <div className="project-card__info">
          <ClockIcon className="project-card__info-icon" />
          <span>Past 24 hours</span>
        </div>
      </StatsCard.Header>
      <StatsCard.Row>
        <StatsCard.Col>
          <h6 className="stats__subtitle">Endpoint</h6>
          <span className="stats__counter">
            {demoFalse ? (
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
            {demoFalse ? (
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
            {demoFalse ? (
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
    </StatsCard>
  )
}

export default AlertsCounter
