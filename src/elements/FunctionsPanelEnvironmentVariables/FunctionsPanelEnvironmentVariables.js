import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import FunctionsPanelEnvironmentVariablesView from './FunctionsPanelEnvironmentVariablesView'

import functionsActions from '../../actions/functions'

const FunctionsPanelEnvironmentVariables = ({
  defaultData,
  functionsStore,
  setNewFunctionEnv
}) => {
  const handleAddNewEnv = env => {
    setNewFunctionEnv([
      ...functionsStore.newFunction.spec.env,
      { name: env.key, value: env.value }
    ])
  }

  const handleEditEnv = env => {
    setNewFunctionEnv(
      functionsStore.newFunction.spec.env.map(item => {
        if (item.name === env.key) {
          item.name = env.newKey || env.key
          item.value = env.value
        }

        return item
      })
    )
  }

  const handleDeleteEnv = envIndex => {
    setNewFunctionEnv(
      functionsStore.newFunction.spec.env.filter(
        (env, index) => index !== envIndex
      )
    )
  }

  return (
    <FunctionsPanelEnvironmentVariablesView
      env={(defaultData.env || functionsStore.newFunction.spec.env).map(
        env => ({
          key: env.name,
          value: env.value
        })
      )}
      handleAddNewEnv={handleAddNewEnv}
      handleDeleteEnv={handleDeleteEnv}
      handleEditEnv={handleEditEnv}
    />
  )
}

FunctionsPanelEnvironmentVariables.defaultProps = {
  defaultData: {}
}

FunctionsPanelEnvironmentVariables.propTypes = {
  defaultData: PropTypes.shape({})
}

export default connect(
  functionsStore => ({ ...functionsStore }),
  functionsActions
)(FunctionsPanelEnvironmentVariables)
