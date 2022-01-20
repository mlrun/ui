import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Button from '../../common/Button/Button'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'
import FeatureSetsPanelView from './FeatureSetsPanelView'
import Modal from '../../common/Modal/Modal'

import {
  FEATURE_SETS_TAB,
  TERTIARY_BUTTON,
  SECONDARY_BUTTON
} from '../../constants'
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
  setNewFeatureSetCredentialsAccessKey,
  setNotification,
  show,
  startFeatureSetIngest
}) => {
  const [validation, setValidation] = useState({
    isNameValid: true,
    isTagValid: true,
    isUrlValid: true,
    isTimeFieldValid: true,
    isStartTimeValid: true,
    isEndTimeValid: true,
    isParseDatesValid: true,
    isEntitiesValid: true,
    isOnlineTargetPathValid: true,
    isOfflineTargetPathValid: true,
    isExternalOfflineTargetPathValid: true,
    isOfflinePartitionColumnsValid: true,
    isExternalOfflinePartitionColumnsValid: true,
    isTimestampKeyValid: true,
    isAccessKeyValid: true
  })
  const [confirmDialog, setConfirmDialog] = useState(null)
  const [accessKeyRequired, setAccessKeyRequired] = useState(false)
  const history = useHistory()

  const validationIsFailed = !Object.values(validation).every(value => value)

  const handleSave = () => {
    const data = {
      kind: 'FeatureSet',
      ...featureStore.newFeatureSet
    }

    delete data.credentials

    if (featureStore.error) {
      removeFeatureStoreError()
    }

    createNewFeatureSet(project, data)
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
      checkValidation(
        featureStore.newFeatureSet,
        setValidation,
        validation,
        startIngestion,
        setAccessKeyRequired
      )
    ) {
      setConfirmDialog({
        action: startIngestion ? 'save and ingest' : 'save'
      })
    }
  }

  const handleStartFeatureSetIngest = result => {
    const reference = result.data.metadata.tag || result.data.metadata.uid
    const data = {
      source: { ...result.data.spec.source, name: 'source' },
      targets: result.data.spec.targets,
      credentials: featureStore.newFeatureSet.credentials
    }

    return startFeatureSetIngest(
      project,
      result.data.metadata.name,
      reference,
      data
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
    <Modal
      actions={[
        featureStore.error && (
          <ErrorMessage
            closeError={() => {
              if (featureStore.error) {
                removeFeatureStoreError()
              }
            }}
            message={featureStore.error}
          />
        ),
        <Button
          variant={TERTIARY_BUTTON}
          label="Cancel"
          className="pop-up-dialog__btn_cancel"
          onClick={closePanel}
        />,
        <Button
          disabled={validationIsFailed}
          variant={SECONDARY_BUTTON}
          label="Save"
          onClick={() => handleSaveOnClick(false)}
        />,
        <Button
          className="btn_start-ingestion"
          disabled={validationIsFailed}
          label="Save and ingest"
          onClick={() => handleSaveOnClick(true)}
          variant={SECONDARY_BUTTON}
        />
      ]}
      className="feature-set-panel"
      onClose={closePanel}
      size="md"
      show={show}
      title={'Create feature set'}
    >
      <FeatureSetsPanelView
        accessKeyRequired={accessKeyRequired}
        confirmDialog={confirmDialog}
        featureStore={featureStore}
        handleSave={handleSave}
        loading={featureStore.loading}
        project={project}
        setConfirmDialog={setConfirmDialog}
        setNewFeatureSetCredentialsAccessKey={
          setNewFeatureSetCredentialsAccessKey
        }
        setValidation={setValidation}
        validation={validation}
      />
    </Modal>
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
