import './projectsMonitoringCounters.scss'
import StatsCard from '../../common/StatsCard/StatsCard'
import React from 'react'

import { ReactComponent as ClockIcon } from 'igz-controls/images/clock.svg'

const AlertCounter = () => {
  return (
    <StatsCard className="monitoring-stats">
      <StatsCard.Header title="Alerts">
        <div className="project-card__info">
          <ClockIcon className="project-card__info-icon" />
          <span>Past 24 hours</span>
        </div>
      </StatsCard.Header>
      <StatsCard.Row>
        <StatsCard.Col></StatsCard.Col>
      </StatsCard.Row>
    </StatsCard>
  )
}

export default AlertCounter
