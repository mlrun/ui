import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import FunctionsPanelRuntimeView from './FunctionsPanelRuntimeView'

const FunctionsPanelRuntime = ({ functionsStore, sections }) => {
  return (
    <FunctionsPanelRuntimeView
      functionsStore={functionsStore}
      sections={sections}
    />
  )
}

FunctionsPanelRuntime.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default connect(
  functionsStore => ({ ...functionsStore }),
  {}
)(FunctionsPanelRuntime)
