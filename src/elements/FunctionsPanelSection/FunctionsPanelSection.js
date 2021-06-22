import React from 'react'
import PropTypes from 'prop-types'

import Tip from '../../common/Tip/Tip'

import './functionsPanelSection.scss'

const FunctionsPanelSection = ({ children, tip, title, className }) => {
  return (
    <div className={`panel-section functions-panel__section ${className}`}>
      <div className="panel-section__title">
        <h5>{title} </h5>
        {tip && <Tip className="panel-section__tip" text={tip} />}
      </div>
      {children && <div className="panel-section__body">{children}</div>}
    </div>
  )
}

FunctionsPanelSection.defaultProps = {
  className: '',
  tip: ''
}

FunctionsPanelSection.propTypes = {
  className: PropTypes.string,
  tip: PropTypes.string,
  title: PropTypes.string.isRequired
}

export default FunctionsPanelSection
