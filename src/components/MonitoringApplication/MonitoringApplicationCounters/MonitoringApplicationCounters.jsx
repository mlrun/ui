import React from 'react'
import MonitoringApplicationCard from './MonitoringApplicationCard/MonitoringApplicationCard'

import './monitoringApplicationCard.scss'

const MonitoringApplicationCounters = () => {
  return (
    <div className="monitoring-application__statistics-section">
      <MonitoringApplicationCard
        counterData={[{ title: 24 }]}
        projectSummary={{}}
        title="Aplications"
      />
      <MonitoringApplicationCard
        counterData={[
          { title: 75, subtitle: 'Batch' },
          { title: 44, subtitle: 'Real-time' }
        ]}
        projectSummary={{}}
        title="Endpoints"
      />
      <MonitoringApplicationCard
        counterData={[{ title: 'Every hour' }]}
        projectSummary={{}}
        title="Running frequency"
      />
      <MonitoringApplicationCard
        counterData={[
          { title: 75, subtitle: 'Running', status: 'running' },
          { title: 44, subtitle: 'Failed', status: 'failed' }
        ]}
        projectSummary={{}}
        tip="Apps Status tip needs to be requested"
        title="Apps Status"
      />
      <MonitoringApplicationCard
        counterData={[{ title: '75' }]}
        isRed
        projectSummary={{}}
        tip="qqqqqqq"
        title="Alerts"
      />
    </div>
  )
}

export default MonitoringApplicationCounters
