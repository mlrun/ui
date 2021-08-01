import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import FeatureSetsPanelTitleView from './FeatureSetsPanelTitleView'

import artifactsAction from '../../../actions/artifacts'

const FeatureSetsPanelTitle = ({
  artifactsStore,
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
    const pattern = /^(?=[\S\s]{1,63}$)([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]$/

    if (!isNameValid && name.length > 0 && pattern.test(name)) {
      setNameValid(true)
    } else if (!pattern.test(name)) {
      setNameValid(false)
    }

    setData(state => ({
      ...state,
      name
    }))
  }

  const handleNameOnBlur = () => {
    if (data.name.length === 0) {
      setNameValid(false)
    } else if (data.name !== artifactsStore.newFeatureSet.metadata.name) {
      setNewFeatureSetName(data.name)
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
