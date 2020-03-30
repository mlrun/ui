import React from 'react'
import PropTypes from 'prop-types'

import './jobsPanelSection.scss'

const JobsPanelSection = ({ children, title }) => {
  return (
    <div className="item-section">
      <div className="item-section__title">
        <h5>{title}</h5>
      </div>
      <div className="item-section__body">{children}</div>
    </div>
  )
}

JobsPanelSection.propTypes = {
  title: PropTypes.string.isRequired
}

export default JobsPanelSection
