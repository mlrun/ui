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
import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'

import { ReactComponent as Arrow } from '../../images/arrow.svg'

import './featureSetsPanel.scss'

const FeatureSetsPanelView = ({
  closePanel,
  confirmDialog,
  error,
  handleSave,
  handleSaveOnClick,
  isNameValid,
  isOfflineTargetsPathValid,
  isOnlineTargetsPathValid,
  isOtherTargetsPathValid,
  isUrlValid,
  loading,
  removeArtifactsError,
  setConfirmDialog,
  setNameValid,
  setOfflineTargetsPathValid,
  setOnlineTargetsPathValid,
  setOtherTargetsPathValid,
  setUrlValid
}) => {
  return (
    <div className="new-item-side-panel-container">
      <div className="feature-set-panel new-item-side-panel">
        {loading && <Loader />}
        {confirmDialog && (
          <PopUpDialog closePopUp={() => setConfirmDialog(null)}>
            <div>
              Note that data will be ingested to the feature set without any
              transformation and therefore you won't be able to add a
              transformation graph unless you delete the data first.
            </div>
            <div className="pop-up-dialog__footer-container">
              <Button variant="primary" label="Okay" onClick={handleSave} />
            </div>
          </PopUpDialog>
        )}
        <FeatureSetsPanelTitle
          closePanel={closePanel}
          isNameValid={isNameValid}
          setNameValid={setNameValid}
        />
        <div className="new-item-side-panel__body">
          <Accordion
            accordionClassName="new-item-side-panel__accordion"
            icon={<Arrow />}
            iconClassName="new-item-side-panel__expand-icon"
            openByDefault
          >
            <FeatureSetsPanelDataSource
              isUrlValid={isUrlValid}
              setUrlValid={setUrlValid}
            />
          </Accordion>
          <Accordion
            accordionClassName="new-item-side-panel__accordion"
            icon={<Arrow />}
            iconClassName="new-item-side-panel__expand-icon"
            openByDefault
          >
            <FeatureSetsPanelSchema />
          </Accordion>
          <Accordion
            accordionClassName="new-item-side-panel__accordion"
            icon={<Arrow />}
            iconClassName="new-item-side-panel__expand-icon"
            openByDefault
          >
            <FeatureSetsPanelTargetStore
              isOfflineTargetsPathValid={isOfflineTargetsPathValid}
              isOnlineTargetsPathValid={isOnlineTargetsPathValid}
              isOtherTargetsPathValid={isOtherTargetsPathValid}
              setOfflineTargetsPathValid={setOfflineTargetsPathValid}
              setOnlineTargetsPathValid={setOnlineTargetsPathValid}
              setOtherTargetsPathValid={setOtherTargetsPathValid}
            />
          </Accordion>
          <div className="new-item-side-panel__buttons-container">
            {error && (
              <ErrorMessage
                closeError={() => {
                  if (error) {
                    removeArtifactsError()
                  }
                }}
                message={error}
              />
            )}
            <Button
              variant="tertiary"
              label="Cancel"
              className="pop-up-dialog__btn_cancel"
              onClick={closePanel}
            />
            <Button
              variant="secondary"
              label="Save"
              onClick={() => handleSaveOnClick(false)}
            />
            <Button
              className="btn_start-ingestion"
              label="Save and ingest"
              onClick={() => handleSaveOnClick(true)}
              variant="secondary"
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
  closePanel: PropTypes.func.isRequired,
  confirmDialog: PropTypes.shape({ action: PropTypes.string.isRequired }),
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  handleSave: PropTypes.func.isRequired,
  handleSaveOnClick: PropTypes.func.isRequired,
  isNameValid: PropTypes.bool.isRequired,
  isOfflineTargetsPathValid: PropTypes.bool.isRequired,
  isOnlineTargetsPathValid: PropTypes.bool.isRequired,
  isOtherTargetsPathValid: PropTypes.bool.isRequired,
  isUrlValid: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  removeArtifactsError: PropTypes.func.isRequired,
  setConfirmDialog: PropTypes.func.isRequired,
  setNameValid: PropTypes.func.isRequired,
  setOfflineTargetsPathValid: PropTypes.func.isRequired,
  setOnlineTargetsPathValid: PropTypes.func.isRequired,
  setOtherTargetsPathValid: PropTypes.func.isRequired,
  setUrlValid: PropTypes.func.isRequired
}

export default FeatureSetsPanelView
