import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import FunctionsPanelEnvironmentVariablesView from './FunctionsPanelEnvironmentVariablesView'

import functionsActions from '../../actions/functions'
import { parseEnvVariables } from '../../utils/parseEnvironmentVariables'
import { generateEnvVariable } from '../../utils/generateEnvironmentVariable'
import { useMode } from '../../hooks/mode.hook'

const FunctionsPanelEnvironmentVariables = ({
  functionsStore,
  setNewFunctionEnv
}) => {
  const [envVariables, setEnvVariables] = useState([])
  const { isStagingMode } = useMode()

  useEffect(() => {
    setEnvVariables(parseEnvVariables(functionsStore.newFunction.spec.env))
  }, [functionsStore.newFunction.spec.env])

  const handleAddNewEnv = env => {
    if (isStagingMode) {
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
    if (isStagingMode) {
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
    if (isStagingMode) {
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
      isStagingMode={isStagingMode}
    />
  )
}

export default connect(
  functionsStore => ({ ...functionsStore }),
  functionsActions
)(FunctionsPanelEnvironmentVariables)
