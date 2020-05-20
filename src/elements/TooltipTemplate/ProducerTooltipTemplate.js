import React from 'react'
import PropTypes from 'prop-types'

import './producerTooltipTemplate.scss'

const ProducerTooltipTemplate = ({ kind, owner }) => {
  return (
    <div className="tooltip-container">
      <div className="tooltip-container__kind">
        <span>Kind:</span> {kind}
      </div>
      <div className="tooltip-container__owner">
        <span>Owner:</span> {owner}
      </div>
    </div>
  )
}

ProducerTooltipTemplate.defaultProps = {
  kind: '',
  owner: ''
}

ProducerTooltipTemplate.propTypes = {
  kind: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired
}

export default ProducerTooltipTemplate
