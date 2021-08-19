import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'

import FunctionsPanelParametersView from './FunctionsPanelParametersView'

import { setFunctionParameters } from './functionsPanelParameters.util'
import functionsActions from '../../actions/functions'

import { ReactComponent as Edit } from '../../images/edit.svg'
import { ReactComponent as Delete } from '../../images/delete.svg'

const FunctionsPanelParameters = ({
  functionsStore,
  setNewFunctionParameters
}) => {
  const [showAddNewParameterRow, setShowAddNewParameterRow] = useState(false)
  const [newParameter, setNewParameter] = useState({
    name: '',
    type: 'string',
    value: ''
  })
  const [selectedParameter, setSelectedParameter] = useState(null)
  const [parameters, setParameters] = useState([])

  const handleAddNewParameter = () => {
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
    setNewParameter({
      name: '',
      type: 'string',
      value: ''
    })
  }

  const editParameter = () => {
    const generatedParameters = {
      ...functionsStore.newFunction.spec.parameters
    }
    const key = selectedParameter.newName || selectedParameter.data.name

    if (selectedParameter.newName) {
      delete generatedParameters[selectedParameter.data.name]
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
        onClick: parameter => setSelectedParameter(parameter)
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
      handleAddNewParameter={handleAddNewParameter}
      editParameter={editParameter}
      parameters={parameters}
      showAddNewParameterRow={showAddNewParameterRow}
      setSelectedParameter={setSelectedParameter}
      selectedParameter={selectedParameter}
      newParameter={newParameter}
      setNewParameter={setNewParameter}
      setShowAddNewParameterRow={setShowAddNewParameterRow}
      generateActionsMenu={generateActionsMenu}
    />
  )
}

export default connect(functionsStore => ({ ...functionsStore }), {
  ...functionsActions
})(FunctionsPanelParameters)
