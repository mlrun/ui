import React from 'react'
import PropTypes from 'prop-types'

import Tip from '../../common/Tip/Tip'

import './panelSection.scss'

const PanelSection = ({ children, tip, title, className }) => {
  return (
    <div className={`panel-section ${className}`}>
      <div className="panel-section__title">
        <h5>{title}</h5>
        {tip && <Tip className="panel-section__tip" text={tip} />}
      </div>
      {children && <div className="panel-section__body">{children}</div>}
    </div>
  )
}

PanelSection.defaultProps = {
  className: '',
  tip: ''
}

PanelSection.propTypes = {
  className: PropTypes.string,
  tip: PropTypes.string,
  title: PropTypes.string.isRequired
}

export default PanelSection
