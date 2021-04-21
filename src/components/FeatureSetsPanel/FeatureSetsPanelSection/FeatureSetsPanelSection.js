import React from 'react'
import PropTypes from 'prop-types'

import './featureSetsPanelSection.scss'

const FeatureSetsPanelSection = ({ children, title, className }) => {
  return (
    <div className={`panel-section feature-set-panel__section ${className}`}>
      <div className="panel-section__title">
        <h5>{title}</h5>
      </div>
      {children && <div className="panel-section__body">{children}</div>}
    </div>
  )
}

FeatureSetsPanelSection.defaultProps = {
  className: ''
}

FeatureSetsPanelSection.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired
}

export default FeatureSetsPanelSection
