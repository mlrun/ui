import React, { useState } from 'react'
import PropTypes from 'prop-types'

import ScheduleJobNormal from '../ScheduleJobNormal/ScheduleJobNormal'

import scheduleData from './scheduleData.json'

import './scheduleJob.scss'

const ScheduleJob = ({ match }) => {
  const [activeTab, setActiveTab] = useState(scheduleData.tabs[0].id)
  const [scheduleNormalTab] = scheduleData.tabs

  return (
    <div className="schedule_container">
      <div className="schedule_tabs">
        {scheduleData.tabs.map(tab => (
          <div
            key={tab.id}
            className={`schedule_tabs_item ${activeTab === tab.id && 'active'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      {activeTab === scheduleNormalTab.id && (
        <ScheduleJobNormal match={match} />
      )}
    </div>
  )
}

ScheduleJob.propTypes = {
  match: PropTypes.shape({}).isRequired
}

export default ScheduleJob
