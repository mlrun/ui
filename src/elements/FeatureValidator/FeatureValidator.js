import React from 'react'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import './FeatureValidator.scss'

const validatorStates = {
  info: 'Info',
  warn: 'Warning',
  fail: 'Fail'
}

const FeatureValidator = ({ validator = {} }) => {
  const validatorEntries = Object.entries(validator)
    .filter(([key]) => !['severity', 'kind'].includes(key))
    .map(([key, value]) => `${key}=${value}`)
  return (
    <div className="feature-validator">
      <Tooltip
        className="status"
        template={
          <TextTooltipTemplate text={validatorStates[validator.severity]} />
        }
      >
        <i className={validator.severity} />
      </Tooltip>
      {validator.kind}
      {validatorEntries.length > 0 && ` (${validatorEntries})`}
    </div>
  )
}
export default FeatureValidator
