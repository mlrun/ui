import React, { useState } from 'react'
import PropTypes from 'prop-types'

import JobsPanelParametersView from './JobsPanelParametersView'
import { parseDefaultContent } from '../../utils/parseDefaultContent'

import panelData from '../JobsPanel/panelData'

const JobsPanelParameters = ({
  functionDefaultValues,
  hyperparams,
  match,
  parameters,
  setNewJobHyperParameters,
  setNewJobParameters
}) => {
  const [addNewParameter, setAddNewParameter] = useState(false)
  const [newParameter, setNewParameter] = useState({
    name: '',
    type: 'string',
    value: ''
  })
  const [newParameterType, setNewParameterType] = useState(
    panelData.newParameterType[0].id
  )
  const [parametersArray, setParametersArray] = useState(
    functionDefaultValues.parameters
  )
  const [selectedParameter, setSelectedParameter] = useState({})
  const selectOptions = {
    parameterType: [
      { label: 'Simple', id: 'Simple' },
      { label: 'Hyper', id: 'Hyper' }
    ],
    parametersValueType: [
      {
        label: 'string',
        id: 'string'
      },
      {
        label: 'number',
        id: 'number'
      },
      {
        label: 'list',
        id: 'list'
      },
      {
        label: 'map',
        id: 'map'
      }
    ]
  }

  const handleAddNewParameter = () => {
    const isEmptyParameter =
      !newParameter.name.length || !newParameter.value.length

    if (isEmptyParameter) {
      setNewParameter({
        name: '',
        type: selectOptions.parametersValueType[0].id,
        value: ''
      })
      return setAddNewParameter(false)
    }

    const defaultParameters = parseDefaultContent(parametersArray)

    setNewJobParameters({
      ...defaultParameters,
      ...parameters,
      [newParameter.name]: newParameter.value
    })

    if (newParameterType !== panelData.newParameterType[0].id) {
      setNewJobHyperParameters({
        ...hyperparams,
        [newParameter.name]: newParameter.value.split(',')
      })
    }

    setParametersArray([
      ...parametersArray,
      {
        data: {
          ...newParameter,
          simple: newParameterType
        },
        isValueEmpty: true,
        isDefault: false
      }
    ])

    setAddNewParameter(false)
    setNewParameter({
      name: '',
      type: selectOptions.parametersValueType[0].id,
      value: ''
    })
    setNewParameterType(panelData.newParameterType[0].id)
  }

  const handleEditParameter = () => {
    const params = { ...parameters }
    const hyperParams = { ...hyperparams }

    params[selectedParameter.data.name] = selectedParameter.data.value

    if (selectedParameter.simple !== panelData.newParameterType[0].id) {
      if (hyperParams[selectedParameter.data.name]) {
        hyperParams[
          selectedParameter.data.name
        ] = selectedParameter.data.value.split(',')
        setNewJobHyperParameters({ ...hyperParams })
      } else {
        setNewJobHyperParameters({
          ...hyperparams,
          [selectedParameter.data.name]: selectedParameter.data.value.split(',')
        })
      }
    }

    if (
      selectedParameter.data.simple === panelData.newParameterType[0].id &&
      hyperParams[selectedParameter.data.name]
    ) {
      delete hyperParams[selectedParameter.data.name]

      setNewJobHyperParameters({ ...hyperParams })
    }

    const newParametersArray = parametersArray.map(param => {
      if (param.data.name === selectedParameter.data.name) {
        param.data.value = selectedParameter.data.value
        param.data.simple = selectedParameter.data.simple
      }

      return param
    })

    setNewJobParameters({ ...params })
    setSelectedParameter({})
    setParametersArray(newParametersArray)
  }

  const handleDeleteParameter = (isInput, item) => {
    const newParameters = { ...parameters }

    delete newParameters[item.name]

    if (item.simple !== panelData.newParameterType[0].id) {
      const newHyperParameters = { ...hyperparams }

      delete newHyperParameters[item.name]

      setNewJobHyperParameters({ ...newHyperParameters })
    }

    setNewJobParameters({ ...newParameters })
    setParametersArray(
      parametersArray.filter(
        parameter => parameter.data.name !== item.data.name
      )
    )
  }

  return (
    <JobsPanelParametersView
      addNewParameter={addNewParameter}
      handleAddNewItem={handleAddNewParameter}
      handleDeleteParameter={handleDeleteParameter}
      handleEditParameter={handleEditParameter}
      match={match}
      newParameter={newParameter}
      newParameterType={newParameterType}
      parameters={parametersArray}
      selectOptions={selectOptions}
      selectedParameter={selectedParameter}
      setAddNewParameter={setAddNewParameter}
      setNewParameter={setNewParameter}
      setNewParameterType={setNewParameterType}
      setSelectedParameter={setSelectedParameter}
    />
  )
}

JobsPanelParameters.propTypes = {
  functionDefaultValues: PropTypes.shape({}).isRequired,
  hyperparams: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  parameters: PropTypes.shape({}).isRequired,
  setNewJobHyperParameters: PropTypes.func.isRequired,
  setNewJobParameters: PropTypes.func.isRequired
}

export default JobsPanelParameters
