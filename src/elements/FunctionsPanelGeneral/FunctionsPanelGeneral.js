import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import FunctionsPanelGeneralView from './FunctionsPanelGeneralView'

import functionsActions from '../../actions/functions'
import { parseKeyValues } from '../../utils'

const FunctionsPanelGeneral = ({
  defaultData,
  functionsStore,
  isNameValid,
  setNameValid,
  setNewFunctionDescription,
  setNewFunctionLabels,
  setNewFunctionName,
  setNewFunctionTag
}) => {
  const [data, setData] = useState({
    name: defaultData.name ?? '',
    description: defaultData.description ?? '',
    labels: parseKeyValues(defaultData.labels) ?? [],
    tag: defaultData.tag ?? ''
  })

  const handleNameChange = name => {
    const pattern = /^(?=[\S\s]{1,63}$)[a-z0-9]([-a-z0-9]*[a-z0-9])?$/

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
    setData(state => ({
      ...state,
      tag
    }))
  }

  const handleTagOnBlur = event => {
    if (event.target.value.length > 0) {
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
      functionsStore={functionsStore}
      handleAddLabel={handleAddLabel}
      handleChangeLabels={handleChangeLabels}
      handleNameChange={handleNameChange}
      handleNameOnBlur={handleNameOnBlur}
      handleTagChange={handleTagChange}
      handleTagOnBlur={handleTagOnBlur}
      isNameValid={isNameValid}
      setData={setData}
      setNewFunctionDescription={setNewFunctionDescription}
    />
  )
}

FunctionsPanelGeneral.defaultProps = {
  defaultData: {}
}

FunctionsPanelGeneral.propTypes = {
  defaultData: PropTypes.shape({}),
  isNameValid: PropTypes.bool.isRequired,
  setNameValid: PropTypes.func.isRequired
}

export default connect(functionsStore => ({ ...functionsStore }), {
  ...functionsActions
})(FunctionsPanelGeneral)
