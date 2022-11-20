/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import FeatureSetsPanelTitleView from './FeatureSetsPanelTitleView'

import featureStoreActions from '../../../actions/featureStore'

const FeatureSetsPanelTitle = ({
  featureStore,
  closePanel,
  setNewFeatureSetDescription,
  setNewFeatureSetLabels,
  setNewFeatureSetName,
  setNewFeatureSetVersion,
  setValidation,
  validation
}) => {
  const [data, setData] = useState({
    name: '',
    description: '',
    version: '',
    labels: []
  })

  const handleNameOnBlur = () => {
    if (data.name !== featureStore.newFeatureSet.metadata.name) {
      setNewFeatureSetName(data.name)
    }
  }

  const handleAddLabel = (label, labels) => {
    const newLabels = {}
    const labelsArray = [...labels, label]

    labelsArray.forEach(label => (newLabels[label.split(':')[0]] = label.split(':')[1].slice(1)))

    setNewFeatureSetLabels(newLabels)
    setData(state => ({
      ...state,
      labels: [...labels, label]
    }))
  }

  const handleChangeLabels = labels => {
    const newLabels = {}

    labels.forEach(label => (newLabels[label.split(':')[0]] = label.split(':')[1].slice(1)))

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
      featureStore={featureStore}
      handleAddLabel={handleAddLabel}
      handleChangeLabels={handleChangeLabels}
      handleNameOnBlur={handleNameOnBlur}
      setData={setData}
      setNewFeatureSetDescription={setNewFeatureSetDescription}
      setNewFeatureSetVersion={setNewFeatureSetVersion}
      setValidation={setValidation}
      validation={validation}
    />
  )
}

FeatureSetsPanelTitle.propTypes = {
  closePanel: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default connect(featureStore => ({ ...featureStore }), {
  ...featureStoreActions
})(FeatureSetsPanelTitle)
