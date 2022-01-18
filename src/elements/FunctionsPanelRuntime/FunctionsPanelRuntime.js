import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import FunctionsPanelRuntimeView from './FunctionsPanelRuntimeView'

import { useDemoMode } from '../../hooks/demoMode.hook'

const FunctionsPanelRuntime = ({
  defaultData,
  functionsStore,
  sections,
  setValidation,
  validation
}) => {
  const isDemoMode = useDemoMode()

  return (
    <FunctionsPanelRuntimeView
      defaultData={defaultData}
      functionsStore={functionsStore}
      isDemoMode={isDemoMode}
      sections={sections}
      setValidation={setValidation}
      validation={validation}
    />
  )
}

FunctionsPanelRuntime.defaultProps = {
  defaultData: {}
}

FunctionsPanelRuntime.propTypes = {
  defaultData: PropTypes.shape({}),
  sections: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default connect(
  functionsStore => ({ ...functionsStore }),
  {}
)(FunctionsPanelRuntime)
