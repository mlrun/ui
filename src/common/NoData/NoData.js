import React from 'react'
import PropTypes from 'prop-types'

import './noData.scss'

const NoData = ({ message }) => {
  return (
    <div data-testid="no-data" className="no-data-block">
      <h3>{message}</h3>
    </div>
  )
}

NoData.defaultProps = {
  message: 'No data to show'
}

NoData.propTypes = {
  message: PropTypes.string
}

export default NoData
