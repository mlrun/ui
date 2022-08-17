import React from 'react'
import cronstrue from 'cronstrue'

import { FormInput } from 'igz-controls/components'
import { SCHEDULE_DATA } from '../../types'

const ScheduleWizardCronstring = ({ scheduleData }) => {
  return (
    <>
      <FormInput label="Expression" name="scheduleData.cron" placeholder="10 * * * *" />
      <p className="cron-text">
        {cronstrue.toString(scheduleData.cron, {
          throwExceptionOnParseError: false
        })}
      </p>
      <div>
        You can use{' '}
        <a
          className="link cron-link"
          rel="noopener noreferrer"
          target="_blank"
          href="https://www.freeformatter.com/cron-expression-generator-quartz.html"
        >
          this external website
        </a>{' '}
        to generate cronstring
      </div>
    </>
  )
}

ScheduleWizardCronstring.propTypes = {
  scheduleData: SCHEDULE_DATA.isRequired
}

export default ScheduleWizardCronstring
