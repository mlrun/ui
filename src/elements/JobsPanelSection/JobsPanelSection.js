import React from 'react'
import PropTypes from 'prop-types'

import './jobsPanelSection.scss'
import Tip from '../../common/Tip/Tip'

const JobsPanelSection = ({ children, tip, title, className }) => {
  return (
    <div className={`panel-section job-panel__section ${className}`}>
      <div className="panel-section__title">
        <h5>{title}</h5>
        {tip && <Tip className="panel-section__tip" text={tip} />}
      </div>
      {children && <div className="panel-section__body">{children}</div>}
    </div>
  )
}

JobsPanelSection.defaultProps = {
  className: '',
  tip: ''
}

JobsPanelSection.propTypes = {
  className: PropTypes.string,
  tip: PropTypes.string,
  title: PropTypes.string.isRequired
}

export default JobsPanelSection
