import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import FunctionsPanelRuntimeView from './FunctionsPanelRuntimeView'

const FunctionsPanelRuntime = ({ defaultData, functionsStore, sections }) => {
  return (
    <FunctionsPanelRuntimeView
      defaultData={defaultData}
      functionsStore={functionsStore}
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
