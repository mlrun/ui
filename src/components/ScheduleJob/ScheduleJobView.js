import React from 'react'
import PropTypes from 'prop-types'

import ScheduleJobSimple from '../ScheduleJobSimple/ScheduleJobSimple'
import ScheduleCron from '../ScheduleCron/ScheduleCron'

const ScheduleJobView = ({
  activeTab,
  cron,
  date,
  isRecurring,
  match,
  onChangeStep,
  scheduleRepeatEnd,
  scheduleRepeatInterval,
  scheduleRepeatStep,
  scheduleTabs,
  setDate,
  setIsRecurring,
  setScheduleRepeatEnd,
  setScheduleRepeatInterval,
  setTime,
  time
}) => {
  return (
    <>
      {activeTab === scheduleTabs[0].id && (
        <ScheduleJobSimple
          date={date}
          isRecurring={isRecurring}
          match={match}
          onChangeStep={onChangeStep}
          scheduleRepeatEnd={scheduleRepeatEnd}
          scheduleRepeatInterval={scheduleRepeatInterval}
          scheduleRepeatStep={scheduleRepeatStep}
          setDate={setDate}
          setIsRecurring={setIsRecurring}
          setScheduleRepeatEnd={setScheduleRepeatEnd}
          setScheduleRepeatInterval={setScheduleRepeatInterval}
          setTime={setTime}
          time={time}
        />
      )}
      {activeTab === scheduleTabs[1].id && <ScheduleCron cron={cron} />}
    </>
  )
}

ScheduleJobView.propTypes = {
  activeTab: PropTypes.string.isRequired,
  cron: PropTypes.shape({}).isRequired,
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  isRecurring: PropTypes.string.isRequired,
  match: PropTypes.shape({}).isRequired,
  onChangeStep: PropTypes.func.isRequired,
  scheduleRepeatEnd: PropTypes.string.isRequired,
  scheduleRepeatInterval: PropTypes.string.isRequired,
  scheduleRepeatStep: PropTypes.shape({}).isRequired,
  scheduleTabs: PropTypes.array.isRequired,
  setDate: PropTypes.func.isRequired,
  setIsRecurring: PropTypes.func.isRequired,
  setScheduleRepeatEnd: PropTypes.func.isRequired,
  setScheduleRepeatInterval: PropTypes.func.isRequired,
  setTime: PropTypes.func.isRequired,
  time: PropTypes.string.isRequired
}

export default ScheduleJobView
