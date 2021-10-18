import React, { useState } from 'react'
import { connect } from 'react-redux'

import FunctionsPanelEnvironmentVariablesView from './FunctionsPanelEnvironmentVariablesView'

import functionsActions from '../../actions/functions'
import { parseEnvVariables } from '../../utils/parseEnvironmentVariables'
import { generateEnvVariable } from '../../utils/generateEnvironmentVariable'
import { useDemoMode } from '../../hooks/demoMode.hook'

const FunctionsPanelEnvironmentVariables = ({
  functionsStore,
  setNewFunctionEnv
}) => {
  const [envVariables, setEnvVariables] = useState(
    parseEnvVariables(functionsStore.newFunction.spec.env)
  )
  const isDemoModeEnabled = useDemoMode()

  const handleAddNewEnv = env => {
    if (isDemoModeEnabled) {
      const generatedVariable = generateEnvVariable(env)

      setEnvVariables(state => [
        ...state,
        ...parseEnvVariables([generatedVariable])
      ])
      setNewFunctionEnv([
        ...functionsStore.newFunction.spec.env,
        generatedVariable
      ])
    } else {
      setNewFunctionEnv([...envVariables, { name: env.key, value: env.value }])
      setEnvVariables([...envVariables, { name: env.key, value: env.value }])
    }
  }

  const handleEditEnv = env => {
    if (isDemoModeEnabled) {
      const generatedVariables = env.map(variable =>
        generateEnvVariable(variable)
      )

      setNewFunctionEnv([...generatedVariables])
    } else {
      setNewFunctionEnv(
        envVariables.map(item => {
          if (item.name === env.key) {
            item.name = env.newKey || env.key
            item.value = env.value
          }

          return item
        })
      )
    }
  }

  const handleDeleteEnv = env => {
    if (isDemoModeEnabled) {
      const generatedVariables = env.map(item => generateEnvVariable(item))

      setNewFunctionEnv([...generatedVariables])
      setEnvVariables([...parseEnvVariables(generatedVariables)])
    } else {
      const newData = envVariables.filter((_, index) => index !== env)

      setNewFunctionEnv([...newData])
      setEnvVariables([...newData])
    }
  }

  return (
    <FunctionsPanelEnvironmentVariablesView
      envVariables={envVariables}
      handleAddNewEnv={handleAddNewEnv}
      handleDeleteEnv={handleDeleteEnv}
      handleEditEnv={handleEditEnv}
      isDemoModeEnabled={isDemoModeEnabled}
    />
  )
}

export default connect(
  functionsStore => ({ ...functionsStore }),
  functionsActions
)(FunctionsPanelEnvironmentVariables)
