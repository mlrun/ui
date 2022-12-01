import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import './functionCardTemplate.scss'

const FunctionCardTemplate = ({ className, dense, functionData, onSelectCard, selected }) => {
  const templateClassName = classnames(
    'job-card-template',
    dense && 'dense',
    selected && 'selected',
    className
  )

  return (
    <div className={templateClassName} onClick={() => onSelectCard()}>
      <div className="job-card-template__header">
        <Tooltip template={<TextTooltipTemplate text={functionData.header} />}>
          {functionData.header}
        </Tooltip>
      </div>
      <div className="job-card-template__sub-header">
        <Tooltip template={<TextTooltipTemplate text={functionData.subHeader} />}>
          {functionData.subHeader}
        </Tooltip>
      </div>
      {functionData.sideTag && (
        <div className="job-card-template__side-tag">{functionData.sideTag}</div>
      )}
      {functionData.description && (
        <div className="job-card-template__description">{functionData.description}</div>
      )}
    </div>
  )
}

FunctionCardTemplate.defaultProps = {
  className: '',
  dense: false,
  selected: false
}

FunctionCardTemplate.propTypes = {
  className: PropTypes.string,
  dense: PropTypes.bool,
  functionData: PropTypes.shape({
    header: PropTypes.string.isRequired,
    subHeader: PropTypes.string,
    description: PropTypes.string,
    sideTag: PropTypes.string
  }).isRequired,
  onSelectCard: PropTypes.func.isRequired,
  selected: PropTypes.bool
}

export default FunctionCardTemplate
