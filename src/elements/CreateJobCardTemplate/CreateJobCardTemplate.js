import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import { truncateUid } from '../../utils'

import './createJobCardTemplate.scss'

const CreateJobCardTemplate = ({
  className,
  func,
  handleSelectGroupFunctions
}) => {
  const templateClassName = classnames('card-template', className)

  return (
    <div
      className={templateClassName}
      onClick={() => handleSelectGroupFunctions(func)}
    >
      <h6 className="card-template__header">
        {func.name || func?.metadata.name}
      </h6>
      {func.metadata && (
        <>
          <Tooltip
            template={<TextTooltipTemplate text={func.metadata.hash} />}
            className="card-template__hash"
          >
            <span>{truncateUid(func.metadata.hash)}</span>
          </Tooltip>
          <span className="card-template__tag">{func.metadata.tag}</span>
          <div className="card-template__description">
            {func.metadata.description}
          </div>
        </>
      )}
    </div>
  )
}

CreateJobCardTemplate.defaultProps = {
  className: ''
}

CreateJobCardTemplate.propTypes = {
  className: PropTypes.string,
  func: PropTypes.shape({}).isRequired,
  handleSelectGroupFunctions: PropTypes.func.isRequired
}

export default CreateJobCardTemplate
