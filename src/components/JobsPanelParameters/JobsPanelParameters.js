import React, { useState, useEffect } from 'react'
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

  useEffect(() => {
    if (parametersArray.length === 0) {
      const newArray = Object.entries(parameters).map(parameter => ({
        parameter
      }))

      setParametersArray(newArray)
    }
  }, [parameters, parametersArray.length])

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

  return (
    <JobsPanelParametersView
      addNewParameter={addNewParameter}
      edit={edit}
      handleAddNewItem={handleAddNewParameter}
      match={match}
      newParameter={newParameter}
      newParameterSimple={newParameterSimple}
      parameters={parametersArray}
      setAddNewParameter={setAddNewParameter}
      setNewParameter={setNewParameter}
      setNewParameterSimple={setNewParameterSimple}
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
