import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'

import EnvironmentVariablesView from './EnvironmentVariablesView'

import {
  newVariableInitialState,
  SECRET_KEY,
  SECRET_NAME,
  validationInitialState
} from './environmentVariables.util'
import {
  ENV_VARIABLE_TYPE_SECRET,
  ENV_VARIABLE_TYPE_VALUE
} from '../../constants'

import { ReactComponent as Edit } from '../../images/edit.svg'
import { ReactComponent as Delete } from '../../images/delete.svg'

const EnvironmentVariables = ({
  className,
  envVariables,
  handleAddNewEnv,
  handleDeleteEnv,
  handleEditEnv
}) => {
  const [newEnvVariable, setNewEnvVariable] = useState(newVariableInitialState)
  const [validation, setValidation] = useState(validationInitialState)
  const [showAddNewEnvVariableRow, setShowAddNewEnvVariableRow] = useState(
    false
  )
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
          const isSecretKeyPropertyExist = Object.keys(
            selectedEnvVariable
          ).includes(SECRET_KEY)
          const isSecretNamePropertyExist = Object.keys(
            selectedEnvVariable
          ).includes(SECRET_NAME)

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
      handleDeleteEnv(
        envVariables.filter(variable => variable.name !== selectedEnv.name)
      )
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
      {
        label: 'Edit',
        icon: <Edit />,
        onClick: variable => {
          setSelectedEnvVariable(variable)
        }
      },
      {
        label: 'Remove',
        icon: <Delete />,
        onClick: variable => {
          deleteEnvVariable(variable)
        }
      }
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

EnvironmentVariables.defaultProps = {
  className: ''
}

EnvironmentVariables.propTypes = {
  className: PropTypes.string,
  envVariables: PropTypes.array.isRequired,
  handleAddNewEnv: PropTypes.func.isRequired,
  handleDeleteEnv: PropTypes.func.isRequired,
  handleEditEnv: PropTypes.func.isRequired
}

export default EnvironmentVariables
