import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import FeatureSetsPanelTitleView from './FeatureSetsPanelTitleView'

import artifactsAction from '../../../actions/artifacts'

const FeatureSetsPanelTitle = ({
  closePanel,
  isNameValid,
  setNameValid,
  setNewFeatureSetDescription,
  setNewFeatureSetLabels,
  setNewFeatureSetName,
  setNewFeatureSetVersion
}) => {
  const [data, setData] = useState({
    name: '',
    description: '',
    version: '',
    labels: []
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
      setNewFeatureSetName(event.target.value)
    }
  }

  const handleAddLabel = (label, labels) => {
    const newLabels = {}
    const labelsArray = [...labels, label]

    labelsArray.forEach(
      label => (newLabels[label.split(':')[0]] = label.split(':')[1].slice(1))
    )

    setNewFeatureSetLabels(newLabels)
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

    setNewFeatureSetLabels(newLabels)
    setData(state => ({
      ...state,
      labels
    }))
  }

  return (
    <FeatureSetsPanelTitleView
      closePanel={closePanel}
      data={data}
      handleAddLabel={handleAddLabel}
      handleChangeLabels={handleChangeLabels}
      handleNameChange={handleNameChange}
      handleNameOnBlur={handleNameOnBlur}
      isNameValid={isNameValid}
      setData={setData}
      setNewFeatureSetDescription={setNewFeatureSetDescription}
      setNewFeatureSetVersion={setNewFeatureSetVersion}
    />
  )
}

FeatureSetsPanelTitle.propTypes = {
  closePanel: PropTypes.func.isRequired,
  isNameValid: PropTypes.bool.isRequired,
  setNameValid: PropTypes.func.isRequired
}

export default connect(artifactsStore => ({ ...artifactsStore }), {
  ...artifactsAction
})(FeatureSetsPanelTitle)
