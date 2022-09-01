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
import PropTypes from 'prop-types'
import classnames from 'classnames'

import ScheduleJobSimple from '../ScheduleJobSimple/ScheduleJobSimple'
import ScheduleCron from '../ScheduleCron/ScheduleCron'
import { Button } from 'igz-controls/components'

import { SECONDARY_BUTTON } from 'igz-controls/constants'
import { tabs } from './scheduleJobData'

import { ReactComponent as Schedule } from 'igz-controls/images/clock.svg'

import './scheduleJob.scss'
import JobsPanelCredentialsAccessKey from '../../elements/JobsPanelCredentialsAccessKey/JobsPanelCredentialsAccessKey'

const ScheduleJobView = ({
  activeTab,
  cron,
  date,
  daysOfWeek,
  handleDaysOfWeek,
  isRecurring,
  onSchedule,
  panelDispatch,
  panelState,
  recurringDispatch,
  recurringState,
  setActiveTab,
  setCron,
  setDate,
  setIsRecurring,
  setTime,
  setValidation,
  validation,
  time
}) => {
  return (
    <div className="schedule jobs-panel__schedule">
      <div className="schedule-tabs">
        {tabs.map(tab => {
          const tabItemClassNames = classnames(
            'schedule-tabs__item',
            activeTab === tab.id && 'schedule-tabs__item_active'
          )

          return (
            <div
              className={tabItemClassNames}
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
          <ScheduleJobSimple
            date={date}
            daysOfWeek={daysOfWeek}
            handleDaysOfWeek={handleDaysOfWeek}
            isRecurring={isRecurring}
            recurringDispatch={recurringDispatch}
            recurringState={recurringState}
            setDate={setDate}
            setIsRecurring={setIsRecurring}
            setTime={setTime}
            time={time}
          />
        )}
        {activeTab === tabs[1].id && (
          <ScheduleCron cron={cron} setCron={setCron} />
        )}
      </div>
      <JobsPanelCredentialsAccessKey
        isScheduled
        panelDispatch={panelDispatch}
        panelState={panelState}
        setValidation={setValidation}
        validation={validation}
      />
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

ScheduleJobView.propTypes = {
  activeTab: PropTypes.string.isRequired,
  cron: PropTypes.string.isRequired,
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  daysOfWeek: PropTypes.array.isRequired,
  handleDaysOfWeek: PropTypes.func.isRequired,
  isRecurring: PropTypes.string.isRequired,
  onSchedule: PropTypes.func.isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  recurringDispatch: PropTypes.func.isRequired,
  recurringState: PropTypes.shape({}).isRequired,
  setActiveTab: PropTypes.func.isRequired,
  setCron: PropTypes.func.isRequired,
  setDate: PropTypes.func.isRequired,
  setIsRecurring: PropTypes.func.isRequired,
  setTime: PropTypes.func.isRequired,
  time: PropTypes.string.isRequired
}

export default ScheduleJobView
