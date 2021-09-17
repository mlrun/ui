import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

import FeatureSetsPanelView from './FeatureSetsPanelView'

import { FEATURE_SETS_TAB } from '../../constants'
import featureStoreActions from '../../actions/featureStore'
import { checkValidation } from './featureSetPanel.util'

const FeatureSetsPanel = ({
  closePanel,
  createFeatureSetSuccess,
  createNewFeatureSet,
  featureStore,
  project,
  removeFeatureStoreError,
  startFeatureSetIngest
}) => {
  const [validation, setValidation] = useState({
    isNameValid: true,
    isUrlValid: true,
    isTimeFieldValid: true,
    isStartTimeValid: true,
    isEndTimeValid: true,
    isEntitiesValid: true,
    isTargetsPathValid: true
  })
  const [confirmDialog, setConfirmDialog] = useState(null)
  const history = useHistory()

  const handleSave = () => {
    if (featureStore.error) {
      removeFeatureStoreError()
    }

    createNewFeatureSet(project, {
      kind: 'FeatureSet',
      ...featureStore.newFeatureSet
    })
      .then(result => {
        if (confirmDialog.action === 'save and ingest') {
          return handleStartFeatureSetIngest(result)
        }

        setConfirmDialog(null)
        createFeatureSetSuccess().then(() => {
          history.push(
            `/projects/${project}/feature-store/${FEATURE_SETS_TAB}/${result.data.metadata.name}/${result.data.metadata.tag}/overview`
          )
        })
      })
      .catch(() => {
        setConfirmDialog(null)
      })
  }

  const handleSaveOnClick = startIngestion => {
    if (
      checkValidation(featureStore.newFeatureSet, setValidation, validation)
    ) {
      setConfirmDialog({
        action: startIngestion ? 'save and ingest' : 'save'
      })
    }
  }

  const handleStartFeatureSetIngest = result => {
    const reference = result.data.metadata.tag || result.data.metadata.uid
    setConfirmDialog(null)

    return startFeatureSetIngest(
      project,
      result.data.metadata.name,
      reference,
      result.data.spec.source,
      result.data.spec.targets
    ).then(() => {
      createFeatureSetSuccess().then(() => {
        history.push(
          `/projects/${project}/feature-store/${FEATURE_SETS_TAB}/${result.data.metadata.name}/${reference}/overview`
        )
      })
    })
  }

  return (
    <FeatureSetsPanelView
      closePanel={closePanel}
      confirmDialog={confirmDialog}
      error={featureStore.error}
      handleSave={handleSave}
      handleSaveOnClick={handleSaveOnClick}
      loading={featureStore.loading}
      project={project}
      removeFeatureStoreError={removeFeatureStoreError}
      setConfirmDialog={setConfirmDialog}
      setValidation={setValidation}
      validation={validation}
    />
  )
}

FeatureSetsPanel.propTypes = {
  closePanel: PropTypes.func.isRequired,
  createFeatureSetSuccess: PropTypes.func.isRequired,
  project: PropTypes.string.isRequired
}

export default connect(({ featureStore }) => ({ featureStore }), {
  ...featureStoreActions
})(FeatureSetsPanel)
