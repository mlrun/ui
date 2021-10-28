import React from 'react'
import PropTypes from 'prop-types'

import Accordion from '../../common/Accordion/Accordion'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'
import Button from '../../common/Button/Button'
import FeatureSetsPanelTitle from './FeatureSetsPanelTitle/FeatureSetsPanelTitle'
import FeatureSetsPanelDataSource from './FeatureSetsPanelDataSource/FeatureSetsPanelDataSource'
import FeatureSetsPanelSchema from './FeatureSetsPanelSchema/FeatureSetsPanelSchema'
import FeatureSetsPanelTargetStore from './FeatureSetsPanelTargetStore/FeatureSetsPanelTargetStore'
import Loader from '../../common/Loader/Loader'
import ConfirmDialog from '../../common/ConfirmDialog/ConfirmDialog'
import PanelCredentialsAccessKey from '../../elements/PanelCredentialsAccessKey/PanelCredentialsAccessKey'

import {
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  TERTIARY_BUTTON
} from '../../constants'

import { ReactComponent as Arrow } from '../../images/arrow.svg'

import './featureSetsPanel.scss'

const FeatureSetsPanelView = ({
  accessKeyRequired,
  closePanel,
  confirmDialog,
  error,
  featureStore,
  handleSave,
  handleSaveOnClick,
  loading,
  project,
  removeFeatureStoreError,
  setConfirmDialog,
  setNewFeatureSetCredentialsAccessKey,
  setValidation,
  validation
}) => {
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
            message="Note that data will be ingested to the feature set without any transformation and therefore you won't be able to add a transformation graph unless you delete the data first."
          />
        )}
        <FeatureSetsPanelTitle
          closePanel={closePanel}
          isNameValid={validation.isNameValid}
          setNameValid={setValidation}
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
            <FeatureSetsPanelSchema
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
            <FeatureSetsPanelTargetStore
              setValidation={setValidation}
              validation={validation}
            />
          </Accordion>
          <PanelCredentialsAccessKey
            credentialsAccessKey={
              featureStore.newFeatureSet.credentials.access_key
            }
            required={accessKeyRequired}
            setCredentialsAccessKey={setNewFeatureSetCredentialsAccessKey}
            setValidation={setValidation}
            validation={validation}
          />
          <div className="new-item-side-panel__buttons-container">
            {error && (
              <ErrorMessage
                closeError={() => {
                  if (error) {
                    removeFeatureStoreError()
                  }
                }}
                message={error}
              />
            )}
            <Button
              variant={TERTIARY_BUTTON}
              label="Cancel"
              className="pop-up-dialog__btn_cancel"
              onClick={closePanel}
            />
            <Button
              variant={SECONDARY_BUTTON}
              label="Save"
              onClick={() => handleSaveOnClick(false)}
            />
            <Button
              className="btn_start-ingestion"
              label="Save and ingest"
              onClick={() => handleSaveOnClick(true)}
              variant={SECONDARY_BUTTON}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

FeatureSetsPanelView.defaultProps = {
  confirmDialog: null,
  defaultData: null,
  error: false
}

FeatureSetsPanelView.propTypes = {
  accessKeyRequired: PropTypes.bool.isRequired,
  closePanel: PropTypes.func.isRequired,
  confirmDialog: PropTypes.shape({ action: PropTypes.string.isRequired }),
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  featureStore: PropTypes.shape({}).isRequired,
  handleSave: PropTypes.func.isRequired,
  handleSaveOnClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  project: PropTypes.string.isRequired,
  removeFeatureStoreError: PropTypes.func.isRequired,
  setConfirmDialog: PropTypes.func.isRequired,
  setNewFeatureSetCredentialsAccessKey: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default FeatureSetsPanelView
