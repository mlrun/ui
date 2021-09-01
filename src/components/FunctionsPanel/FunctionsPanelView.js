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
import FunctionsPanelSecrets from '../../elements/FunctionsPanelSecrets/FunctionsPanelSecrets'
import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import { FUNCTION_PANEL_MODE } from '../../types'

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
  handleSave,
  loading,
  mode,
  removeFunctionsError,
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
              <FunctionsPanelGeneral
                defaultData={defaultData}
                isNameValid={validation.isNameValid}
                mode={mode}
                setNameValid={setValidation}
              />
            </Accordion>
            <Accordion
              accordionClassName="new-item-side-panel__accordion"
              icon={<Arrow />}
              iconClassName="new-item-side-panel__expand-icon"
              openByDefault
            >
              <FunctionsPanelCode
                defaultData={defaultData}
                isHandlerValid={validation.isHandlerValid}
                setHandlerValid={setValidation}
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
              <FunctionsPanelEnvironmentVariables />
            </Accordion>
            <Accordion
              accordionClassName="new-item-side-panel__accordion hidden"
              icon={<Arrow />}
              iconClassName="new-item-side-panel__expand-icon"
              openByDefault
            >
              <FunctionsPanelSecrets />
            </Accordion>
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
                disabled={!checkValidation}
                variant={TERTIARY_BUTTON}
                label="Save"
                onClick={() => handleSave()}
              />
              <Button
                variant={SECONDARY_BUTTON}
                label="Deploy"
                onClick={() => handleSave(true)}
                disabled={!checkValidation}
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
  checkValidation: PropTypes.bool.isRequired,
  closePanel: PropTypes.func.isRequired,
  confirmData: PropTypes.shape({}),
  defaultData: PropTypes.shape({}),
  error: PropTypes.string,
  handleSave: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  mode: FUNCTION_PANEL_MODE.isRequired,
  removeFunctionsError: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({})
}

export default FunctionsPanelView
