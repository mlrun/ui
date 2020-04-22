import React, { useState } from 'react'
import PropTypes from 'prop-types'

import JobsPanelParametersView from './JobsPanelParametersView'

const JobsPanelParameters = ({
  edit,
  hyperparams,
  match,
  parameters,
  setNewJobParameters,
  setNewJobHyperParameters
}) => {
  const [addNewParameter, setAddNewParameter] = useState(false)
  const [newParameter, setNewParameter] = useState({
    name: '',
    type: '',
    value: ''
  })
  const [newParameterSimple, setNewParameterSimple] = useState('Simple')
  const [parametersArray, setParametersArray] = useState([])
  const [selectedParameter, setSelectedParameter] = useState({})

  const handleAddNewParameter = () => {
    const emptyParameter = Object.values(newParameter).filter(
      value => value.length > 0
    )

    if (emptyParameter.length === 0) {
      setNewParameter({
        name: '',
        type: '',
        value: ''
      })
      return setAddNewParameter(false)
    }

    setNewJobParameters({
      ...parameters,
      [newParameter.name]: newParameter.value
    })

    if (newParameterSimple === 'Hyper') {
      setNewJobHyperParameters({
        ...hyperparams,
        [newParameter.name]: newParameter.value.split(',')
      })
    }

    setParametersArray([
      ...parametersArray,
      {
        ...newParameter,
        simple: newParameterSimple
      }
    ])

    setAddNewParameter(false)
    setNewParameter({
      name: '',
      type: '',
      value: ''
    })
    setNewParameterSimple('Simple')
  }

  const handleEditParameter = () => {
    const params = { ...parameters }
    const hyperParams = { ...hyperparams }

    params[selectedParameter.name] = selectedParameter.value

    if (selectedParameter.simple === 'Hyper') {
      if (hyperParams[selectedParameter.name]) {
        hyperParams[selectedParameter.name] = selectedParameter.value.split(',')
        setNewJobHyperParameters({ ...hyperParams })
      } else {
        setNewJobHyperParameters({
          ...hyperparams,
          [selectedParameter.name]: selectedParameter.value.split(',')
        })
      }
    }

    if (
      selectedParameter.simple === 'Simple' &&
      hyperParams[selectedParameter.name]
    ) {
      delete hyperParams[selectedParameter.name]

      setNewJobHyperParameters({ ...hyperParams })
    }

    const newParametersArray = parametersArray.map(param => {
      if (param.name === selectedParameter.name) {
        param.value = selectedParameter.value
        param.simple = selectedParameter.simple
      }

      return param
    })

    setNewJobParameters({ ...params })
    setSelectedParameter({})
    setParametersArray(newParametersArray)
  }

  return (
    <JobsPanelParametersView
      addNewParameter={addNewParameter}
      edit={edit}
      handleAddNewItem={handleAddNewParameter}
      handleEditParameter={handleEditParameter}
      match={match}
      newParameter={newParameter}
      newParameterSimple={newParameterSimple}
      parameters={parametersArray}
      selectedParameter={selectedParameter}
      setAddNewParameter={setAddNewParameter}
      setNewParameter={setNewParameter}
      setNewParameterSimple={setNewParameterSimple}
      setSelectedParameter={setSelectedParameter}
    />
  )
}

JobsPanelParameters.propTypes = {
  edit: PropTypes.bool.isRequired,
  hyperparams: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  parameters: PropTypes.shape({}).isRequired,
  setNewJobParameters: PropTypes.func.isRequired,
  setNewJobHyperParameters: PropTypes.func.isRequired
}

export default JobsPanelParameters
