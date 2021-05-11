import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import FeatureSetsPanelTitleView from './FeatureSetsPanelTitleView'

import artifactsAction from '../../../actions/artifacts'

const FeatureSetsPanelTitle = ({
  closePanel,
  isNameValid,
  isVersionValid,
  setNameValid,
  setNewFeatureSetDescription,
  setNewFeatureSetLabels,
  setNewFeatureSetName,
  setNewFeatureSetVersion,
  setVersionValid
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
  const handleVersionChange = version => {
    if (!isVersionValid && version.length > 0) {
      setVersionValid(true)
    }

    setData(state => ({
      ...state,
      version
    }))
  }

  const handleVersionOnBlur = event => {
    if (event.target.value.length === 0) {
      setVersionValid(false)
    } else {
      setNewFeatureSetVersion(event.target.value)
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
      handleVersionChange={handleVersionChange}
      handleVersionOnBlur={handleVersionOnBlur}
      isNameValid={isNameValid}
      isVersionValid={isVersionValid}
      setData={setData}
      setNewFeatureSetDescription={setNewFeatureSetDescription}
    />
  )
}

FeatureSetsPanelTitle.propTypes = {
  closePanel: PropTypes.func.isRequired,
  isNameValid: PropTypes.bool.isRequired,
  isVersionValid: PropTypes.bool.isRequired,
  setNameValid: PropTypes.func.isRequired,
  setVersionValid: PropTypes.func.isRequired
}

export default connect(artifactsStore => ({ ...artifactsStore }), {
  ...artifactsAction
})(FeatureSetsPanelTitle)
