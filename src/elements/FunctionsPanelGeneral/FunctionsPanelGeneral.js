import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import FunctionsPanelGeneralView from './FunctionsPanelGeneralView'

import functionsActions from '../../actions/functions'
import { parseKeyValues } from '../../utils'

const FunctionsPanelGeneral = ({
  defaultData,
  functionsStore,
  setNewFunctionDescription,
  setNewFunctionLabels
}) => {
  const [data, setData] = useState({
    description: defaultData.description ?? '',
    kind: defaultData.type ?? functionsStore.newFunction.kind,
    labels: parseKeyValues(defaultData.labels) ?? [],
    name: defaultData.name ?? functionsStore.newFunction.metadata.name,
    tag: defaultData.tag ?? functionsStore.newFunction.metadata.tag
  })

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

  const handleDescriptionOnBlur = () => {
    if (functionsStore.newFunction.spec.description !== data.description) {
      setNewFunctionDescription(data.description)
    }
  }

  return (
    <FunctionsPanelGeneralView
      data={data}
      handleAddLabel={handleAddLabel}
      handleChangeLabels={handleChangeLabels}
      handleDescriptionOnBlur={handleDescriptionOnBlur}
      setData={setData}
      setNewFunctionDescription={setNewFunctionDescription}
    />
  )
}

FunctionsPanelGeneral.defaultProps = {
  defaultData: {}
}

FunctionsPanelGeneral.propTypes = {
  defaultData: PropTypes.shape({})
}

export default connect(functionsStore => ({ ...functionsStore }), {
  ...functionsActions
})(FunctionsPanelGeneral)
