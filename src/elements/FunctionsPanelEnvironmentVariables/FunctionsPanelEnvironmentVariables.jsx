/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import FunctionsPanelEnvironmentVariablesView from './FunctionsPanelEnvironmentVariablesView'

import { parseEnvVariables } from '../../utils/parseEnvironmentVariables'
import { generateEnvVariable } from '../../utils/generateEnvironmentVariable'
import { useMode } from '../../hooks/mode.hook'
import { setNewFunctionEnv } from '../../reducers/functionReducer'

const FunctionsPanelEnvironmentVariables = () => {
  const [envVariables, setEnvVariables] = useState([])
  const { isStagingMode } = useMode()
  const dispatch = useDispatch()
  const functionsStore = useSelector(store => store.functionsStore)

  useEffect(() => {
    queueMicrotask(() => {
      setEnvVariables(parseEnvVariables(functionsStore.newFunction.spec.env))
    })
  }, [functionsStore.newFunction.spec.env])

  const handleAddNewEnv = env => {
    if (isStagingMode) {
      const generatedVariable = generateEnvVariable(env)

      dispatch(setNewFunctionEnv([...functionsStore.newFunction.spec.env, generatedVariable]))
    } else {
      dispatch(setNewFunctionEnv([...envVariables, { name: env.key, value: env.value }]))
    }
  }

  const handleEditEnv = env => {
    if (isStagingMode) {
      const generatedVariables = env.map(variable => generateEnvVariable(variable))

      dispatch(setNewFunctionEnv([...generatedVariables]))
    } else {
      dispatch(
        setNewFunctionEnv(
          envVariables.map(item => {
            if (item.name === env.key) {
              item.name = env.newKey || env.key
              item.value = env.value
            }

            return item
          })
        )
      )
    }
  }

  const handleDeleteEnv = env => {
    if (isStagingMode) {
      const generatedVariables = env.map(item => generateEnvVariable(item))

      dispatch(setNewFunctionEnv([...generatedVariables]))
    } else {
      const newData = envVariables.filter((_, index) => index !== env)

      dispatch(setNewFunctionEnv([...newData]))
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

export default FunctionsPanelEnvironmentVariables
