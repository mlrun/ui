import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import './loader.scss'

const Loader = ({ secondary, section, small }) => {
  const wrapperClassNames = classnames(
    'loader-wrapper',
    section && 'section-loader',
    small && 'small-loader',
    secondary && 'secondary-loader'
  )

  return (
    <div className={wrapperClassNames}>
      <div className="loader" />
    </div>
  )
}

Loader.defaultProps = {
  secondary: false,
  section: false,
  small: false
}

Loader.propTypes = {
  secondary: PropTypes.bool,
  section: PropTypes.bool,
  small: PropTypes.bool
}

export default React.memo(Loader)
