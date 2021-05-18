import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import FunctionsPanelGeneralView from './FunctionsPanelGeneralView'

import functionsActions from '../../actions/functions'
import { DEFAULT_TYPE } from './functionsPanelGeneral.util'

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
    type: DEFAULT_TYPE,
    labels: [],
    tag: ''
  })

  const handleNameChange = name => {
    const pattern = /^(?=[\S\s]{1,63}$)([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]$/

    if (isNameValid && !pattern.test(name)) {
      setNameValid(false)
    }

    if (!isNameValid && name.length > 0 && pattern.test(name)) {
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
  isNameValid: PropTypes.bool.isRequired,
  isTagValid: PropTypes.bool.isRequired,
  setNameValid: PropTypes.func.isRequired,
  setTagValid: PropTypes.func.isRequired
}

export default connect(functionsStore => ({ ...functionsStore }), {
  ...functionsActions
})(FunctionsPanelGeneral)
