import React from 'react'
import './producertooltiptemplate.scss'
const ProducerTooltipTemplate = ({ kind, owner }) => {
  return (
    <div className="wrapper_producer">
      <div className="kind">
        <span>Kind:</span> {kind}
      </div>
      <div className="owner">
        <span>Owner:</span> {owner}
      </div>
    </div>
  )
}

export default ProducerTooltipTemplate
