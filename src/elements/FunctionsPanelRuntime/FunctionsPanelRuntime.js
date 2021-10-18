import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import FunctionsPanelRuntimeView from './FunctionsPanelRuntimeView'

import { useDemoMode } from '../../hooks/demoMode.hook'

const FunctionsPanelRuntime = ({ defaultData, functionsStore, sections }) => {
  const isDemoModeEnabled = useDemoMode()

  return (
    <FunctionsPanelRuntimeView
      defaultData={defaultData}
      functionsStore={functionsStore}
      isDemoModeEnabled={isDemoModeEnabled}
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
