import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'

import FeatureSetsPanelView from './FeatureSetsPanelView'

import featureStoreActions from '../../actions/featureStore'

const FeatureSetsPanel = ({
  closePanel,
  createFeatureSetSuccess,
  createNewFeatureSet,
  featureStore,
  project,
  removeFeatureStoreError,
  startFeatureSetIngest
}) => {
  const [isNameValid, setNameValid] = useState(true)
  const [isUrlValid, setUrlValid] = useState(true)
  const [isOnlineTargetsPathValid, setOnlineTargetsPathValid] = useState(true)
  const [isOfflineTargetsPathValid, setOfflineTargetsPathValid] = useState(true)
  const [isOtherTargetsPathValid, setOtherTargetsPathValid] = useState(true)
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
            `/projects/${project}/feature-store/feature-sets/${result.data.metadata.name}/${result.data.metadata.tag}/overview`
          )
        })
      })
      .catch(() => {
        setConfirmDialog(null)
      })
  }

  const handleSaveOnClick = startIngestion => {
    const onlineTarget = featureStore.newFeatureSet.spec.targets.find(
      targetKind => targetKind.name === 'nosql'
    )
    const offlineTarget = featureStore.newFeatureSet.spec.targets.find(
      targetKind => targetKind.name === 'parquet'
    )
    const otherTarget = featureStore.newFeatureSet.spec.targets.find(
      targetKind => targetKind.name === 'other'
    )

    if (featureStore.newFeatureSet.metadata.name.length === 0) {
      return setNameValid(false)
    }

    if (featureStore.newFeatureSet.spec.source.path.length === 0) {
      return setUrlValid(false)
    }

    if (
      onlineTarget &&
      (!onlineTarget.path || onlineTarget.path.length === 0)
    ) {
      return setOnlineTargetsPathValid(false)
    }

    if (
      offlineTarget &&
      (!offlineTarget.path || offlineTarget.path.length === 0)
    ) {
      return setOfflineTargetsPathValid(false)
    }

    if (otherTarget && (!otherTarget.path || otherTarget.path.length === 0)) {
      return setOtherTargetsPathValid(false)
    }

    setConfirmDialog({ action: startIngestion ? 'save and ingest' : 'save' })
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
          `/projects/${project}/feature-store/feature-sets/${result.data.metadata.name}/${reference}/overview`
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
      isNameValid={isNameValid}
      isOfflineTargetsPathValid={isOfflineTargetsPathValid}
      isOnlineTargetsPathValid={isOnlineTargetsPathValid}
      isOtherTargetsPathValid={isOtherTargetsPathValid}
      isUrlValid={isUrlValid}
      loading={featureStore.loading}
      project={project}
      removeFeatureStoreError={removeFeatureStoreError}
      setConfirmDialog={setConfirmDialog}
      setNameValid={setNameValid}
      setOfflineTargetsPathValid={setOfflineTargetsPathValid}
      setOnlineTargetsPathValid={setOnlineTargetsPathValid}
      setOtherTargetsPathValid={setOtherTargetsPathValid}
      setUrlValid={setUrlValid}
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
