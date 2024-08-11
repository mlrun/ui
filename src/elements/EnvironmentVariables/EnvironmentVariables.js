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
import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'

import EnvironmentVariablesView from './EnvironmentVariablesView'

import {
  newVariableInitialState,
  SECRET_KEY,
  SECRET_NAME,
  validationInitialState
} from './environmentVariables.util'
import { ENV_VARIABLE_TYPE_SECRET, ENV_VARIABLE_TYPE_VALUE } from '../../constants'

import { ReactComponent as Edit } from 'igz-controls/images/edit.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'

const EnvironmentVariables = ({
  className = '',
  envVariables,
  handleAddNewEnv,
  handleDeleteEnv,
  handleEditEnv,
  isPanelEditMode = false
}) => {
  const [newEnvVariable, setNewEnvVariable] = useState(newVariableInitialState)
  const [validation, setValidation] = useState(validationInitialState)
  const [showAddNewEnvVariableRow, setShowAddNewEnvVariableRow] = useState(false)
  const [selectedEnvVariable, setSelectedEnvVariable] = useState(null)

  const addEnvVariable = () => {
    let valueIsValid = false

    if (newEnvVariable.type === ENV_VARIABLE_TYPE_SECRET) {
      valueIsValid =
        newEnvVariable.name.length > 0 &&
        validation.isNameValid &&
        newEnvVariable.secretName.length > 0 &&
        validation.isSecretNameValid &&
        validation.isSecretKeyValid
    } else if (newEnvVariable.type === ENV_VARIABLE_TYPE_VALUE) {
      valueIsValid =
        newEnvVariable.name.length > 0 &&
        validation.isNameValid &&
        newEnvVariable.value.length > 0 &&
        validation.isValueValid
    }

    if (valueIsValid) {
      handleAddNewEnv(newEnvVariable)
      resetEnvData()
    } else {
      setValidation(state => ({
        ...state,
        isNameValid: newEnvVariable.name.length > 0 && state.isNameValid,
        isValueValid:
          newEnvVariable.type === ENV_VARIABLE_TYPE_SECRET ||
          (newEnvVariable.value.length > 0 && state.isValueValid),
        isSecretNameValid:
          newEnvVariable.type === ENV_VARIABLE_TYPE_VALUE ||
          (newEnvVariable.secretName.length > 0 && state.isSecretNameValid)
      }))
    }
  }

  const resetEnvData = () => {
    setNewEnvVariable(newVariableInitialState)
    setShowAddNewEnvVariableRow(false)
    setValidation(validationInitialState)
  }

  const editEnvVariable = () => {
    const generatedVariables = envVariables.map(env => {
      if (env.name === selectedEnvVariable.name) {
        env.name = selectedEnvVariable.newName || selectedEnvVariable.name
        env.type = selectedEnvVariable.type

        if (selectedEnvVariable.type === ENV_VARIABLE_TYPE_SECRET) {
          const [secretName, secretKey] = selectedEnvVariable.value.split(':')
          const isSecretKeyPropertyExist = Object.keys(selectedEnvVariable).includes(SECRET_KEY)
          const isSecretNamePropertyExist = Object.keys(selectedEnvVariable).includes(SECRET_NAME)

          if (selectedEnvVariable.secretName && !isSecretKeyPropertyExist) {
            env.value = `${selectedEnvVariable.secretName}:${secretKey}`
          } else if (selectedEnvVariable.secretName) {
            env.value = `${selectedEnvVariable.secretName}:${selectedEnvVariable.secretKey}`
          } else if (isSecretKeyPropertyExist && !isSecretNamePropertyExist) {
            env.value = `${secretName}:${selectedEnvVariable.secretKey}`
          }
        } else {
          env.value = selectedEnvVariable.value
        }
      }

      return env
    })

    handleEditEnv(generatedVariables)
    setSelectedEnvVariable(null)
  }

  const deleteEnvVariable = useCallback(
    selectedEnv => {
      handleDeleteEnv(envVariables.filter(variable => variable.name !== selectedEnv.name))
    },
    [envVariables, handleDeleteEnv]
  )

  const discardChanges = () => {
    setNewEnvVariable(newVariableInitialState)
    setShowAddNewEnvVariableRow(false)
    setValidation(validationInitialState)
  }

  const generateActionsMenu = useCallback(
    () => [
      [
        {
          label: 'Edit',
          icon: <Edit />,
          onClick: variable => {
            setSelectedEnvVariable(variable)
          }
        },
        {
          label: 'Delete',
          icon: <Delete />,
          className: 'danger',
          onClick: variable => {
            deleteEnvVariable(variable)
          }
        }
      ]
    ],
    [deleteEnvVariable]
  )

  return (
    <EnvironmentVariablesView
      addEnvVariable={addEnvVariable}
      className={className}
      discardChanges={discardChanges}
      editEnvVariable={editEnvVariable}
      envVariables={envVariables}
      isPanelEditMode={isPanelEditMode}
      generateActionsMenu={generateActionsMenu}
      newEnvVariable={newEnvVariable}
      selectedEnvVariable={selectedEnvVariable}
      setNewEnvVariable={setNewEnvVariable}
      setSelectedEnvVariable={setSelectedEnvVariable}
      setShowAddNewEnvVariableRow={setShowAddNewEnvVariableRow}
      setValidation={setValidation}
      showAddNewEnvVariableRow={showAddNewEnvVariableRow}
      validation={validation}
    />
  )
}

EnvironmentVariables.propTypes = {
  className: PropTypes.string,
  envVariables: PropTypes.array.isRequired,
  handleAddNewEnv: PropTypes.func.isRequired,
  handleDeleteEnv: PropTypes.func.isRequired,
  handleEditEnv: PropTypes.func.isRequired,
  isPanelEditMode: PropTypes.bool
}

export default EnvironmentVariables
