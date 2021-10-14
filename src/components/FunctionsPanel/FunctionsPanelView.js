import React from 'react'
import PropTypes from 'prop-types'

import Loader from '../../common/Loader/Loader'
import FunctionsPanelTitle from '../../elements/FunctionsPanelTitle/FunctionsPanelTitle'
import Accordion from '../../common/Accordion/Accordion'
import FunctionsPanelGeneral from '../../elements/FunctionsPanelGeneral/FunctionsPanelGeneral'
import FunctionsPanelCode from '../../elements/FunctionsPanelCode/FunctionsPanelCode'
import FunctionsPanelResources from '../../elements/FunctionsPanelResources/FunctionsPanelResources'
import FunctionsPanelEnvironmentVariables from '../../elements/FunctionsPanelEnvironmentVariables/FunctionsPanelEnvironmentVariables'
import Button from '../../common/Button/Button'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'
import FunctionsPanelRuntime from '../../elements/FunctionsPanelRuntime/FunctionsPanelRuntime'
import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import PanelCredentialsAccessKey from '../../elements/PanelCredentialsAccessKey/PanelCredentialsAccessKey'

import { FUNCTION_PANEL_MODE } from '../../types'
import { runtimeSections } from './functionsPanel.util'

import {
  LABEL_BUTTON,
  SECONDARY_BUTTON,
  TERTIARY_BUTTON
} from '../../constants'

import { ReactComponent as Arrow } from '../../images/arrow.svg'

import './functionsPanel.scss'

const FunctionsPanelView = ({
  checkValidation,
  closePanel,
  confirmData,
  defaultData,
  error,
  functionsStore,
  handleSave,
  imageType,
  loading,
  match,
  mode,
  newFunction,
  removeFunctionsError,
  setImageType,
  setNewFunctionCredentialsAccessKey,
  setValidation,
  validation
}) => {
  return (
    <>
      {confirmData && (
        <PopUpDialog
          headerText={confirmData.title}
          closePopUp={confirmData.rejectHandler}
        >
          <div>{confirmData.description}</div>
          <div className="pop-up-dialog__footer-container">
            <Button
              label={confirmData.btnCancelLabel}
              onClick={confirmData.rejectHandler}
              variant={confirmData.btnCancelVariant}
            />
            <Button
              label={confirmData.btnConfirmLabel}
              onClick={confirmData.confirmHandler}
              variant={confirmData.btnConfirmVariant}
            />
          </div>
        </PopUpDialog>
      )}
      <div className="new-item-side-panel-container">
        <div className="functions-panel new-item-side-panel">
          {loading && <Loader />}
          <FunctionsPanelTitle closePanel={closePanel} />
          <div className="new-item-side-panel__body">
            <Accordion
              accordionClassName="new-item-side-panel__accordion"
              icon={<Arrow />}
              iconClassName="new-item-side-panel__expand-icon"
              openByDefault
            >
              <FunctionsPanelGeneral defaultData={defaultData} />
            </Accordion>
            <Accordion
              accordionClassName="new-item-side-panel__accordion"
              icon={<Arrow />}
              iconClassName="new-item-side-panel__expand-icon"
              openByDefault
            >
              <FunctionsPanelCode
                defaultData={defaultData}
                imageType={imageType}
                match={match}
                mode={mode}
                setImageType={setImageType}
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
              <FunctionsPanelResources
                defaultData={defaultData}
                mode={mode}
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
              <FunctionsPanelEnvironmentVariables
                setValidation={setValidation}
                validation={validation}
              />
            </Accordion>
            {runtimeSections[newFunction.kind] && (
              <Accordion
                accordionClassName="new-item-side-panel__accordion"
                icon={<Arrow />}
                iconClassName="new-item-side-panel__expand-icon"
                openByDefault
              >
                <FunctionsPanelRuntime
                  defaultData={defaultData}
                  sections={runtimeSections[newFunction.kind]}
                />
              </Accordion>
            )}
            <PanelCredentialsAccessKey
              className="functions-panel__item"
              credentialsAccessKey={
                functionsStore.newFunction.metadata.credentials.access_key
              }
              setCredentialsAccessKey={setNewFunctionCredentialsAccessKey}
            />
            <div className="new-item-side-panel__buttons-container">
              {error && (
                <ErrorMessage
                  closeError={() => {
                    if (error) {
                      removeFunctionsError()
                    }
                  }}
                  message={error}
                />
              )}
              <Button
                className="btn_cancel"
                variant={LABEL_BUTTON}
                label="Cancel"
                onClick={closePanel}
              />
              <Button
                className="btn_save"
                disabled={!checkValidation()}
                variant={TERTIARY_BUTTON}
                label="Save"
                onClick={() => handleSave()}
              />
              <Button
                variant={SECONDARY_BUTTON}
                label="Deploy"
                onClick={() => handleSave(true)}
                disabled={!checkValidation()}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

FunctionsPanelView.defaultProps = {
  defaultData: {},
  error: ''
}

FunctionsPanelView.propTypes = {
  checkValidation: PropTypes.func.isRequired,
  closePanel: PropTypes.func.isRequired,
  confirmData: PropTypes.shape({}),
  defaultData: PropTypes.shape({}),
  error: PropTypes.string,
  functionsStore: PropTypes.shape({}).isRequired,
  handleSave: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  mode: FUNCTION_PANEL_MODE.isRequired,
  newFunction: PropTypes.shape({}).isRequired,
  removeFunctionsError: PropTypes.func.isRequired,
  setNewFunctionCredentialsAccessKey: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({})
}

export default FunctionsPanelView
