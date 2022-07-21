import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { truncateUid } from '../../../utils'

import './jobWizardCardTemplate.scss'

const JobWizardCardTemplate = ({
  className,
  functionData,
  handleSelectGroupFunctions
}) => {
  const templateClassName = classnames('job-card-template', className)

  return (
    <div
      className={templateClassName}
      onClick={() => handleSelectGroupFunctions(functionData)}
    >
      <div className="job-card-template__header">
        <Tooltip
          template={
            <TextTooltipTemplate text={functionData.name || functionData?.metadata.name} />
          }
        >
          {functionData.name || functionData?.metadata.name}
        </Tooltip>
      </div>
      <div className="job-card-template__sub-header">
        <Tooltip
          template={
            <TextTooltipTemplate text={functionData.functions?.[0]?.metadata?.project || ''} />
          }
        >
          {functionData.functions?.[0]?.metadata?.project || ''}
        </Tooltip>
      </div>
      <div className="job-card-template__counter">+2</div>
      {functionData.metadata && (
        <>
          <Tooltip
            template={<TextTooltipTemplate text={functionData.metadata.hash} />}
            className="job-card-template__hash"
          >
            <span>{truncateUid(functionData.metadata.hash)}</span>
          </Tooltip>
          <span className="job-card-template__tag">{functionData.metadata.tag}</span>
          <div className="job-card-template__description">
            {functionData.metadata.description}
          </div>
        </>
      )}
    </div>
  )
}

JobWizardCardTemplate.defaultProps = {
  className: ''
}

JobWizardCardTemplate.propTypes = {
  className: PropTypes.string,
  functionData: PropTypes.shape({}).isRequired,
  handleSelectGroupFunctions: PropTypes.func.isRequired
}

export default JobWizardCardTemplate
