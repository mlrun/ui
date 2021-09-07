import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import FunctionsPanelGeneralView from './FunctionsPanelGeneralView'

import functionsActions from '../../actions/functions'
import { DEFAULT_TYPE } from './functionsPanelGeneral.util'
import { parseKeyValues } from '../../utils'

const FunctionsPanelGeneral = ({
  defaultData,
  functionsStore,
  isNameValid,
  mode,
  setNameValid,
  setNewFunctionDescription,
  setNewFunctionLabels,
  setNewFunctionName,
  setNewFunctionTag,
  setNewFunctionType
}) => {
  const [data, setData] = useState({
    name: defaultData.name ?? '',
    description: defaultData.description ?? '',
    type: defaultData.type ?? DEFAULT_TYPE,
    labels: parseKeyValues(defaultData.labels) ?? [],
    tag: defaultData.tag ?? ''
  })

  const handleNameOnBlur = event => {
    if (data.name !== functionsStore.newFunction.metadata.name) {
      setNewFunctionName(event.target.value)
    }
  }

  const handleTagOnBlur = event => {
    if (data.tag !== functionsStore.newFunction.metadata.tag) {
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
      handleNameOnBlur={handleNameOnBlur}
      handleTagOnBlur={handleTagOnBlur}
      isNameValid={isNameValid}
      mode={mode}
      setData={setData}
      setNameValid={setNameValid}
      setNewFunctionDescription={setNewFunctionDescription}
      setNewFunctionType={setNewFunctionType}
    />
  )
}

FunctionsPanelGeneral.defaultProps = {
  defaultData: {}
}

FunctionsPanelGeneral.propTypes = {
  defaultData: PropTypes.shape({}),
  isNameValid: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
  setNameValid: PropTypes.func.isRequired
}

export default connect(functionsStore => ({ ...functionsStore }), {
  ...functionsActions
})(FunctionsPanelGeneral)
