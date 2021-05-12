import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import FunctionsPanelGeneralView from './FunctionsPanelGeneralView'
import functionsActions from '../../actions/functions'

// import artifactsAction from '../../../actions/artifacts'

const FunctionsPanelGeneral = ({
  isNameValid,
  isTagValid,
  setNameValid,
  setNewFunctionDescription,
  setNewFunctionLabels,
  setNewFunctionName,
  setNewFunctionTag,
  setNewFunctionType,
  setTagValid
}) => {
  const [data, setData] = useState({
    name: '',
    description: '',
    type: 'local',
    labels: [],
    tag: ''
  })

  const handleNameChange = name => {
    if (!isNameValid && name.length > 0) {
      setNameValid(true)
    }

    setData(state => ({
      ...state,
      name
    }))
  }

  const handleNameOnBlur = event => {
    if (event.target.value.length === 0) {
      setNameValid(false)
    } else {
      setNewFunctionName(event.target.value)
    }
  }

  const handleTagChange = tag => {
    if (!isTagValid && tag.length > 0) {
      setTagValid(true)
    }

    setData(state => ({
      ...state,
      tag
    }))
  }

  const handleTagOnBlur = event => {
    if (event.target.value.length === 0) {
      setTagValid(false)
    } else {
      setNewFunctionTag(event.target.value)
    }
  }

  const handleAddLabel = (label, labels) => {
    const newLabels = {}
    const labelsArray = [...labels, label]

    labelsArray.forEach(
      label => (newLabels[label.split(':')[0]] = label.split(':')[1].slice(1))
    )

    setNewFunctionLabels(newLabels)
    setData(state => ({
      ...state,
      labels: [...labels, label]
    }))
  }

  const handleChangeLabels = labels => {
    const newLabels = {}

    labels.forEach(
      label => (newLabels[label.split(':')[0]] = label.split(':')[1].slice(1))
    )

    setNewFunctionLabels(newLabels)
    setData(state => ({
      ...state,
      labels
    }))
  }

  return (
    <FunctionsPanelGeneralView
      data={data}
      handleAddLabel={handleAddLabel}
      handleChangeLabels={handleChangeLabels}
      handleNameChange={handleNameChange}
      handleNameOnBlur={handleNameOnBlur}
      handleTagChange={handleTagChange}
      handleTagOnBlur={handleTagOnBlur}
      isNameValid={isNameValid}
      isTagValid={isTagValid}
      setData={setData}
      setNewFunctionDescription={setNewFunctionDescription}
      setNewFunctionType={setNewFunctionType}
    />
  )
}

FunctionsPanelGeneral.propTypes = {
  closePanel: PropTypes.func.isRequired,
  isNameValid: PropTypes.bool.isRequired,
  isVersionValid: PropTypes.bool.isRequired,
  setNameValid: PropTypes.func.isRequired,
  setVersionValid: PropTypes.func.isRequired
}

export default connect(functionsStore => ({ ...functionsStore }), {
  ...functionsActions
})(FunctionsPanelGeneral)
