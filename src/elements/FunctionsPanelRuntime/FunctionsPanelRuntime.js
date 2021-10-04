import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'

import FunctionsPanelRuntimeView from './FunctionsPanelRuntimeView'

const FunctionsPanelRuntime = ({ defaultData, functionsStore, sections }) => {
  const location = useLocation()

  return (
    <FunctionsPanelRuntimeView
      defaultData={defaultData}
      functionsStore={functionsStore}
      location={location}
      sections={sections}
    />
  )
}

FunctionsPanelRuntime.defaultProps = {
  defaultData: {}
}

FunctionsPanelRuntime.propTypes = {
  defaultData: PropTypes.shape({}),
  sections: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default connect(
  functionsStore => ({ ...functionsStore }),
  {}
)(FunctionsPanelRuntime)
