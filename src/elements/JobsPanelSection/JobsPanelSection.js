import React from 'react'
import PropTypes from 'prop-types'

import './jobsPanelSection.scss'

const JobsPanelSection = ({ children, title, className }) => {
  return (
    <div className={`item-section ${className}`}>
      <div className="item-section__title">
        <h5>{title}</h5>
      </div>
      {children && <div className="item-section__body">{children}</div>}
    </div>
  )
}

JobsPanelSection.defaultProps = {
  className: ''
}

JobsPanelSection.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired
}

export default JobsPanelSection
