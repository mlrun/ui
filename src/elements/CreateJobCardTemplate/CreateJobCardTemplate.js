import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import { truncateUid } from '../../utils'

import './createJobCardTemplate.scss'

const CreateJobCardTemplate = ({ func, handleSelectFunction }) => {
  console.log(func)
  return (
    <div className="card-template" onClick={() => handleSelectFunction(func)}>
      <h6 className="card-template__header">{func?.metadata?.name}</h6>
      <i className={func?.status?.status} />
      <Tooltip
        template={<TextTooltipTemplate text={func.metadata.hash} />}
        clas
        sName="card-template__hash"
      >
        <span>{truncateUid(func.metadata.hash)}</span>
      </Tooltip>
      <span className="card-template__tag">{func.metadata.tag}</span>
    </div>
  )
}

CreateJobCardTemplate.defaultProps = {
  status: ''
}

CreateJobCardTemplate.propTypes = {
  func: PropTypes.shape({}).isRequired,
  handleSelectFunction: PropTypes.func.isRequired
}

export default CreateJobCardTemplate
