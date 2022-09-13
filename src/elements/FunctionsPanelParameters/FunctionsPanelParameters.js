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
import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import FunctionsPanelParametersView from './FunctionsPanelParametersView'

import {
  getParameterType,
  isParameterValid,
  JSON_TYPE,
  newParameterInitialState,
  setFunctionParameters,
  validationInitialState
} from './functionsPanelParameters.util'
import functionsActions from '../../actions/functions'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

import { ReactComponent as Edit } from 'igz-controls/images/edit.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'

const FunctionsPanelParameters = ({
  defaultData,
  functionsStore,
  setNewFunctionParameters
}) => {
  const [showAddNewParameterRow, setShowAddNewParameterRow] = useState(false)
  const [newParameter, setNewParameter] = useState(newParameterInitialState)
  const [selectedParameter, setSelectedParameter] = useState(null)
  const [parameters, setParameters] = useState([])
  const [validation, setValidation] = useState(validationInitialState)

  useEffect(() => {
    if (!isEveryObjectValueEmpty(defaultData.parameters ?? {})) {
      setParameters(
        Object.entries(defaultData.parameters).map(([key, value]) => ({
          data: {
            name: key,
            type: getParameterType(value),
            value:
              getParameterType(value) === JSON_TYPE
                ? JSON.stringify(value)
                : String(value)
          },
          isDefault: true
        }))
      )
    }
  }, [defaultData.parameters])

  const discardChanges = () => {
    setNewParameter(newParameterInitialState)
    setShowAddNewParameterRow(false)
    setValidation(validationInitialState)
  }

  const handleAddNewParameter = () => {
    if (
      !isParameterValid(newParameter) ||
      !validation.isNameValid ||
      !validation.isValueValid
    ) {
      return setValidation(state => ({
        ...state,
        isNameValid: newParameter.name.length > 0,
        isValueValid: String(newParameter.value).length > 0
      }))
    }

    setFunctionParameters(
      newParameter,
      newParameter.name,
      setNewFunctionParameters,
      functionsStore.newFunction.spec.parameters
    )
    setParameters(state => [
      ...state,
      {
        data: {
          name: newParameter.name,
          type: newParameter.type,
          value: newParameter.value
        },
        isDefault: false
      }
    ])
    setShowAddNewParameterRow(false)
    setNewParameter(newParameterInitialState)
  }

  const editParameter = () => {
    const generatedParameters = {
      ...functionsStore.newFunction.spec.parameters
    }
    const key = selectedParameter.newName || selectedParameter.data.name

    if (selectedParameter.newName) {
      delete generatedParameters[selectedParameter.data.name]
    }

    if (
      !isParameterValid(selectedParameter.data) ||
      !validation.isEditNameValid ||
      !validation.isEditValueValid
    ) {
      return setValidation(state => ({
        ...state,
        isEditNameValid: selectedParameter.data.name.length > 0,
        isEditValueValid: selectedParameter.data.value.length > 0
      }))
    }
    setFunctionParameters(
      selectedParameter.data,
      key,
      setNewFunctionParameters,
      generatedParameters
    )
    setParameters(state =>
      state.map(parameter => {
        if (parameter.data.name === selectedParameter.data.name) {
          parameter.data = {
            name: key,
            type: selectedParameter.data.type,
            value: selectedParameter.data.value
          }
        }

        return parameter
      })
    )
    setSelectedParameter(null)
  }

  const handleDeleteParameter = useCallback(
    parameter => {
      const generatedParameters = {
        ...functionsStore.newFunction.spec.parameters
      }

      delete generatedParameters[parameter.data.name]

      setParameters(state =>
        state.filter(
          stateParameter => stateParameter.data.name !== parameter.data.name
        )
      )
      setNewFunctionParameters(generatedParameters)
    },
    [functionsStore.newFunction.spec.parameters, setNewFunctionParameters]
  )

  const generateActionsMenu = useCallback(
    rowItem => [
      {
        label: 'Edit',
        icon: <Edit />,
        onClick: parameter => {
          setSelectedParameter(parameter)
          setValidation(validationInitialState)
        }
      },
      {
        label: 'Remove',
        icon: <Delete />,
        onClick: parameter => {
          handleDeleteParameter(parameter)
        }
      }
    ],
    [handleDeleteParameter]
  )

  return (
    <FunctionsPanelParametersView
      discardChanges={discardChanges}
      editParameter={editParameter}
      generateActionsMenu={generateActionsMenu}
      handleAddNewParameter={handleAddNewParameter}
      newParameter={newParameter}
      parameters={parameters}
      selectedParameter={selectedParameter}
      setNewParameter={setNewParameter}
      setSelectedParameter={setSelectedParameter}
      setShowAddNewParameterRow={setShowAddNewParameterRow}
      setValidation={setValidation}
      showAddNewParameterRow={showAddNewParameterRow}
      validation={validation}
    />
  )
}

FunctionsPanelParameters.propTypes = {
  defaultData: PropTypes.shape({}).isRequired
}

export default connect(functionsStore => ({ ...functionsStore }), {
  ...functionsActions
})(FunctionsPanelParameters)
