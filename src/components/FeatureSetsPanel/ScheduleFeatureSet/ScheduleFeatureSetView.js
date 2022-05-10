import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import ScheduleFeatureSetSimple from '../ScheduleFeatureSetSimple/ScheduleFeatureSetSimple'
import ScheduleCron from '../../ScheduleCron/ScheduleCron'
import { Button, RoundedIcon } from 'igz-controls/components'

import { tabs } from './scheduleFeatureSet.util'
import { SECONDARY_BUTTON } from 'igz-controls/constants'

import { ReactComponent as Schedule } from 'igz-controls/images/clock.svg'
import { ReactComponent as CloseIcon } from 'igz-controls/images/close.svg'

import './scheduleFeatureSet.scss'

const ScheduleFeatureSetView = ({
  activeTab,
  cron,
  daysOfWeek,
  handleDaysOfWeek,
  onSchedule,
  recurringDispatch,
  recurringState,
  setActiveTab,
  setCron,
  setShowSchedule
}) => {
  return (
    <div className="schedule feature-set-panel__schedule">
      <div className="schedule-title">
        <span>Schedule</span>
        <RoundedIcon
          onClick={() => setShowSchedule(false)}
          tooltipText="Close"
          className="schedule-title__icon"
        >
          <CloseIcon />
        </RoundedIcon>
      </div>
      <div className="schedule-tabs">
        {tabs.map(tab => {
          const tabClassNames = classnames(
            'schedule-tabs__item',
            activeTab === tab.id && 'schedule-tabs__item_active'
          )

          return (
            <div
              className={tabClassNames}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </div>
          )
        })}
      </div>
      <div className="schedule-content">
        <h3>
          {activeTab === tabs[0].id ? 'Simple ' : 'Advanced '}
          Schedule
        </h3>
        {activeTab === tabs[0].id && (
          <ScheduleFeatureSetSimple
            daysOfWeek={daysOfWeek}
            handleDaysOfWeek={handleDaysOfWeek}
            recurringDispatch={recurringDispatch}
            recurringState={recurringState}
          />
        )}
        {activeTab === tabs[1].id && (
          <ScheduleCron cron={cron} setCron={setCron} />
        )}
      </div>
      <Button
        variant={SECONDARY_BUTTON}
        label={
          <>
            <Schedule />
            <span>Schedule </span>
          </>
        }
        onClick={onSchedule}
        className="btn__schedule"
      />
    </div>
  )
}

ScheduleFeatureSetView.propTypes = {
  activeTab: PropTypes.string.isRequired,
  cron: PropTypes.string.isRequired,
  daysOfWeek: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleDaysOfWeek: PropTypes.func.isRequired,
  onSchedule: PropTypes.func.isRequired,
  recurringDispatch: PropTypes.func.isRequired,
  recurringState: PropTypes.shape({}).isRequired,
  setActiveTab: PropTypes.func.isRequired,
  setCron: PropTypes.func.isRequired,
  setShowSchedule: PropTypes.func.isRequired
}

export default ScheduleFeatureSetView
