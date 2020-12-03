import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import './loader.scss'

const Loader = ({ loaderClassName, wrapperClassName }) => {
  const loaderClassNames = classnames('loader', loaderClassName)
  const wrapperClassNames = classnames('wrapper', wrapperClassName)

  return (
    <div className={wrapperClassNames}>
      <svg className={loaderClassNames} viewBox="0 0 50 50">
        <circle className="path" cx="25" cy="25" r="20" fill="none" />
      </svg>
    </div>
  )
}

Loader.defaultProps = {
  loaderClassName: '',
  wrapperClassName: ''
}

Loader.propTypes = {
  loaderClassName: PropTypes.string,
  wrapperClassName: PropTypes.string
}

export default Loader
