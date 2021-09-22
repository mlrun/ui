import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

import FeatureSetsPanelView from './FeatureSetsPanelView'

import { FEATURE_SETS_TAB } from '../../constants'
import featureStoreActions from '../../actions/featureStore'
import notificationActions from '../../actions/notification'
import { checkValidation } from './featureSetPanel.util'

const FeatureSetsPanel = ({
  closePanel,
  createFeatureSetSuccess,
  createNewFeatureSet,
  featureStore,
  project,
  removeFeatureStoreError,
  setNotification,
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
        setConfirmDialog(null)

        if (confirmDialog.action === 'save and ingest') {
          return handleStartFeatureSetIngest(result)
        }

        handleCreateFeatureSetSuccess(
          result.data.metadata.name,
          result.data.metadata.tag
        )
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

    return startFeatureSetIngest(
      project,
      result.data.metadata.name,
      reference,
      result.data.spec.source,
      result.data.spec.targets
    ).then(() => {
      handleCreateFeatureSetSuccess(result.data.metadata.name, reference)
    })
  }

  const handleCreateFeatureSetSuccess = (name, tag) => {
    createFeatureSetSuccess().then(() => {
      history.push(
        `/projects/${project}/feature-store/${FEATURE_SETS_TAB}/${name}/${tag}/overview`
      )
      setNotification({
        status: 200,
        id: Math.random(),
        message: 'Feature set successfully created'
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
  ...featureStoreActions,
  ...notificationActions
})(FeatureSetsPanel)
