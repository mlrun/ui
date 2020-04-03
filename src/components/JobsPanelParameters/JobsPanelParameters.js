import React, { useState } from 'react'
import PropTypes from 'prop-types'

import JobsPanelParametersView from './JobsPanelParametersView'

const JobsPanelParameters = ({ edit, parameters }) => {
  const [addNewParameter, setAddNewParameter] = useState(false)
  const [newParameterName, setNewParameterName] = useState('')
  const [newParameterType, setNewParameterType] = useState('')
  const [newParameterValue, setNewParameterValue] = useState('')

  const handleAddNewParameter = () => {
    if (!newParameterName || !newParameterType || !newParameterValue) {
      setNewParameterName('')
      setNewParameterType('')
      setNewParameterValue('')
      return setAddNewParameter(false)
    }

    const newItem = {
      [newParameterName]: newParameterValue
    }

    newItem

    setAddNewInput(false)
    setNewJobInputs({ ...inputs, ...newItem })
    setNewInputName('')
    setNewInputPath('')
  }

  return (
    <JobsPanelParametersView
      edit={edit}
      addNewParameter={addNewParameter}
      parameters={parameters}
      setNewParameterName={setNewParameterName}
      setNewParameterType={setNewParameterType}
      setNewParameterValue={setNewParameterValue}
      handleAddNewItem
      setAddNewParameter={setAddNewParameter}
    />
  )
}

JobsPanelParameters.propTypes = {}

export default JobsPanelParameters
