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
import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import Accordion from '../../common/Accordion/Accordion'
import FeatureSetsPanelDataSource from './FeatureSetsPanelDataSource/FeatureSetsPanelDataSource'
import FeatureSetsPanelSchema from './FeatureSetsPanelSchema/FeatureSetsPanelSchema'
import FeatureSetsPanelTargetStore from './FeatureSetsPanelTargetStore/FeatureSetsPanelTargetStore'
import FeatureSetsPanelTitle from './FeatureSetsPanelTitle/FeatureSetsPanelTitle'
import PanelCredentialsAccessKey from '../../elements/PanelCredentialsAccessKey/PanelCredentialsAccessKey'
import { Button, ConfirmDialog, Loader } from 'igz-controls/components'

import { PRIMARY_BUTTON, TERTIARY_BUTTON, LABEL_BUTTON } from 'igz-controls/constants'
import { setNewFeatureSetCredentialsAccessKey } from '../../reducers/featureStoreReducer'

import Arrow from 'igz-controls/images/arrow.svg?react'

import './featureSetsPanel.scss'

const FeatureSetsPanelView = ({
  accessKeyRequired,
  closePanel,
  confirmDialog = null,
  disableButtons,
  featureStore,
  frontendSpec,
  formState,
  handleSave,
  handleSaveOnClick,
  loading,
  project,
  setConfirmDialog,
  setDisableButtons,
  setValidation,
  validation
}) => {
  const validationIsFailed = !Object.values(validation).every(value => value)
  const buttonsIsDisabled = !Object.values(disableButtons).every(value => value)
  const dispatch = useDispatch()

  return (
    <div className="new-item-side-panel-container">
      <div className="feature-set-panel new-item-side-panel">
        {loading && <Loader />}
        {confirmDialog && (
          <ConfirmDialog
            closePopUp={() => setConfirmDialog(null)}
            confirmButton={{
              handler: handleSave,
              label: 'Okay',
              variant: PRIMARY_BUTTON
            }}
            isOpen={Boolean(confirmDialog)}
            message="Note that data will be ingested to the feature set without any transformation and therefore you won't be able to add a transformation graph unless you delete the data first."
          />
        )}
        <FeatureSetsPanelTitle
          closePanel={closePanel}
          formState={formState}
          frontendSpec={frontendSpec}
          setValidation={setValidation}
          validation={validation}
        />
        <div className="new-item-side-panel__body">
          <Accordion
            accordionClassName="new-item-side-panel__accordion"
            icon={<Arrow />}
            iconClassName="new-item-side-panel__expand-icon"
            openByDefault
          >
            <FeatureSetsPanelDataSource
              project={project}
              setDisableButtons={setDisableButtons}
              setValidation={setValidation}
              validation={validation}
            />
          </Accordion>
          <Accordion
            accordionClassName="new-item-side-panel__accordion"
            icon={<Arrow />}
            iconClassName="new-item-side-panel__expand-icon"
            openByDefault
          >
            <FeatureSetsPanelSchema setValidation={setValidation} validation={validation} />
          </Accordion>
          <Accordion
            accordionClassName="new-item-side-panel__accordion"
            icon={<Arrow />}
            iconClassName="new-item-side-panel__expand-icon"
            openByDefault
          >
            <FeatureSetsPanelTargetStore
              disableButtons={disableButtons}
              project={project}
              setDisableButtons={setDisableButtons}
              setValidation={setValidation}
              validation={validation}
            />
          </Accordion>
          <PanelCredentialsAccessKey
            credentialsAccessKey={featureStore.newFeatureSet.credentials.access_key}
            required={accessKeyRequired}
            setCredentialsAccessKey={value => dispatch(setNewFeatureSetCredentialsAccessKey(value))}
            setValidation={setValidation}
            validation={validation}
          />
          <div className="new-item-side-panel__buttons-container">
            <Button
              variant={LABEL_BUTTON}
              label="Cancel"
              className="pop-up-dialog__btn_cancel"
              onClick={closePanel}
            />
            <Button
              disabled={validationIsFailed || buttonsIsDisabled}
              variant={TERTIARY_BUTTON}
              label="Save"
              onClick={() => handleSaveOnClick(false)}
            />
            <Button
              className="btn_start-ingestion"
              disabled={
                validationIsFailed ||
                buttonsIsDisabled ||
                featureStore.newFeatureSet.spec.source.schedule.length > 0
              }
              label="Save and ingest"
              onClick={() => handleSaveOnClick(true)}
              variant={PRIMARY_BUTTON}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

FeatureSetsPanelView.propTypes = {
  accessKeyRequired: PropTypes.bool.isRequired,
  closePanel: PropTypes.func.isRequired,
  confirmDialog: PropTypes.shape({ action: PropTypes.string.isRequired }),
  disableButtons: PropTypes.object.isRequired,
  featureStore: PropTypes.object.isRequired,
  formState: PropTypes.object.isRequired,
  frontendSpec: PropTypes.object.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleSaveOnClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  project: PropTypes.string.isRequired,
  setConfirmDialog: PropTypes.func.isRequired,
  setDisableButtons: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired
}

export default FeatureSetsPanelView
