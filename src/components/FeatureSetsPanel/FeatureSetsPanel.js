import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

import FeatureSetsPanelView from './FeatureSetsPanelView'

import artifactsAction from '../../actions/artifacts'
import { TRANSFORMATIONS_DEFAULT_VALUE } from './featureSetsPanel.util'

const FeatureSetsPanel = ({
  artifactsStore,
  closePanel,
  createNewFeatureSet,
  createFeatureSetSuccess,
  project,
  removeArtifactsError,
  startFeatureSetIngest
}) => {
  const [isNameValid, setNameValid] = useState(true)
  const [isUrlValid, setUrlValid] = useState(true)
  const [transformationsValue, setTransformationsValue] = useState(
    TRANSFORMATIONS_DEFAULT_VALUE
  )
  const history = useHistory()

  const handleSave = startIngestion => {
    if (isNameValid && isUrlValid) {
      if (artifactsStore.newFeatureSet.metadata.name.length === 0) {
        return setNameValid(false)
      }

      if (artifactsStore.newFeatureSet.spec.source.path.length === 0) {
        return setUrlValid(false)
      }

      if (artifactsStore.error) {
        removeArtifactsError()
      }

      createNewFeatureSet(project, {
        kind: 'FeatureSet',
        ...artifactsStore.newFeatureSet
      }).then(result => {
        if (startIngestion) {
          return handleStartFeatureSetIngest(result)
        }

        createFeatureSetSuccess().then(() => {
          history.push(
            `/projects/${project}/feature-store/feature-sets/${result.data.metadata.name}/${result.data.metadata.tag}/overview`
          )
        })
      })
    }
  }

  const handleStartFeatureSetIngest = result => {
    return startFeatureSetIngest(
      project,
      result.data.metadata.name,
      result.data.metadata.uid,
      result.data.spec.source,
      result.data.spec.targets
    ).then(() => {
      createFeatureSetSuccess().then(() => {
        history.push(
          `/projects/${project}/feature-store/feature-sets/${result.data.metadata.name}/${result.data.metadata.tag}/overview`
        )
      })
    })
  }

  return (
    <FeatureSetsPanelView
      closePanel={closePanel}
      error={artifactsStore.error}
      handleSave={handleSave}
      isNameValid={isNameValid}
      isUrlValid={isUrlValid}
      loading={artifactsStore.loading}
      removeArtifactsError={removeArtifactsError}
      setNameValid={setNameValid}
      setUrlValid={setUrlValid}
      setTransformationsValue={setTransformationsValue}
      transformationsValue={transformationsValue}
    />
  )
}

FeatureSetsPanel.propTypes = {
  closePanel: PropTypes.func.isRequired,
  createFeatureSetSuccess: PropTypes.func.isRequired,
  project: PropTypes.string.isRequired
}

export default connect(({ artifactsStore }) => ({ artifactsStore }), {
  ...artifactsAction
})(FeatureSetsPanel)
