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
import { useDispatch, connect, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { Form, FormSpy } from 'react-final-form'
import { createForm } from 'final-form'
import arrayMutators from 'final-form-arrays'

import FeatureSetsPanelView from './FeatureSetsPanelView'

import { FEATURE_SETS_TAB, TAG_FILTER_LATEST } from '../../constants'
import featureStoreActions from '../../actions/featureStore'
import { setNotification } from '../../reducers/notificationReducer'
import { checkValidation } from './featureSetPanel.util'
import { setFieldState } from 'igz-controls/utils/form.util'
import {
  EXTERNAL_OFFLINE,
  PARQUET
} from './FeatureSetsPanelTargetStore/featureSetsPanelTargetStore.util'
import { convertChipsData } from '../../utils/convertChipsData'

const FeatureSetsPanel = ({
  closePanel,
  createFeatureSetSuccess,
  createNewFeatureSet,
  featureStore,
  project,
  setNewFeatureSetCredentialsAccessKey,
  startFeatureSetIngest
}) => {
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const [validation, setValidation] = useState({
    areLabelsValid: true,
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
    isOfflinePartitionBucketsValid: true,
    isOfflinePartitionColumnsValid: true,
    isExternalOfflinePartitionBucketsValid: true,
    isExternalOfflinePartitionColumnsValid: true,
    isTargetStoreValid: true,
    isTimestampKeyValid: true,
    isAccessKeyValid: true
  })
  const [disableButtons, setDisableButtons] = useState({
    isExternalOfflineTargetPathEditModeClosed: true,
    isOnlineTargetPathEditModeClosed: true,
    isOfflineTargetPathEditModeClosed: true,
    isUrlEditModeClosed: true
  })
  const [confirmDialog, setConfirmDialog] = useState(null)
  const [accessKeyRequired, setAccessKeyRequired] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const formRef = React.useRef(
    createForm({
      initialValues: { labels: [] },
      mutators: { ...arrayMutators, setFieldState },
      onSubmit: () => {}
    })
  )

  const handleSave = () => {
    let data = {
      kind: 'FeatureSet',
      ...featureStore.newFeatureSet,
      metadata: {
        ...featureStore.newFeatureSet.metadata,
        labels: convertChipsData(formRef.current.getFieldState('labels')?.value),
        tag: featureStore.newFeatureSet.metadata.tag || TAG_FILTER_LATEST
      }
    }

    if (featureStore.newFeatureSet.spec.passthrough) {
      data = {
        ...data,
        spec: {
          ...data.spec,
          targets: data.spec.targets.filter(
            target => ![EXTERNAL_OFFLINE, PARQUET].includes(target.name)
          )
        }
      }
    }

    delete data.credentials

    createNewFeatureSet(project, data)
      .then(result => {
        setConfirmDialog(null)

        if (confirmDialog.action === 'save and ingest') {
          return handleStartFeatureSetIngest(result)
        }

        handleCreateFeatureSetSuccess(result.data.metadata.name, result.data.metadata.tag)
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

    return startFeatureSetIngest(project, result.data.metadata.name, reference, data).then(() => {
      handleCreateFeatureSetSuccess(result.data.metadata.name, reference)
    })
  }

  const handleCreateFeatureSetSuccess = (name, tag) => {
    createFeatureSetSuccess(tag).then(() => {
      navigate(`/projects/${project}/feature-store/${FEATURE_SETS_TAB}/${name}/${tag}/overview`)
      dispatch(
        setNotification({
          status: 200,
          id: Math.random(),
          message: 'Feature set successfully created'
        })
      )
    })
  }

  return createPortal(
    <Form form={formRef.current} onSubmit={() => {}}>
      {formState => {
        return (
          <>
            <FeatureSetsPanelView
              accessKeyRequired={accessKeyRequired}
              closePanel={closePanel}
              confirmDialog={confirmDialog}
              disableButtons={disableButtons}
              formState={formState}
              frontendSpec={frontendSpec}
              featureStore={featureStore}
              handleSave={handleSave}
              handleSaveOnClick={handleSaveOnClick}
              loading={featureStore.loading}
              project={project}
              setConfirmDialog={setConfirmDialog}
              setDisableButtons={setDisableButtons}
              setNewFeatureSetCredentialsAccessKey={setNewFeatureSetCredentialsAccessKey}
              setValidation={setValidation}
              validation={validation}
            />
            <FormSpy
              subscription={{ valid: true }}
              onChange={() => {
                setValidation(prevState => ({
                  ...prevState,
                  areLabelsValid: formRef.current?.getFieldState?.('labels')?.valid
                }))
              }}
            />
          </>
        )
      }}
    </Form>
    ,
    document.getElementById('overlay_container')
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
