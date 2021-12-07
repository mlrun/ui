import React, { useEffect, useState } from 'react'
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
  const [envVariables, setEnvVariables] = useState([])
  const isDemoMode = useDemoMode()

  useEffect(() => {
    setEnvVariables(parseEnvVariables(functionsStore.newFunction.spec.env))
  }, [functionsStore.newFunction.spec.env])

  const handleAddNewEnv = env => {
    if (isDemoMode) {
      const generatedVariable = generateEnvVariable(env)

      setNewFunctionEnv([
        ...functionsStore.newFunction.spec.env,
        generatedVariable
      ])
    } else {
      setNewFunctionEnv([...envVariables, { name: env.key, value: env.value }])
    }
  }

  const handleEditEnv = env => {
    if (isDemoMode) {
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
    if (isDemoMode) {
      const generatedVariables = env.map(item => generateEnvVariable(item))

      setNewFunctionEnv([...generatedVariables])
    } else {
      const newData = envVariables.filter((_, index) => index !== env)

      setNewFunctionEnv([...newData])
    }
  }

  return (
    <FunctionsPanelEnvironmentVariablesView
      envVariables={envVariables}
      handleAddNewEnv={handleAddNewEnv}
      handleDeleteEnv={handleDeleteEnv}
      handleEditEnv={handleEditEnv}
      isDemoMode={isDemoMode}
    />
  )
}

export default connect(
  functionsStore => ({ ...functionsStore }),
  functionsActions
)(FunctionsPanelEnvironmentVariables)
