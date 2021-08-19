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

import { FUNCTION_PANEL_MODE } from '../../types'
import { runtimeSections } from './functionsPanel.util'

import { ReactComponent as Arrow } from '../../images/arrow.svg'

import './functionsPanel.scss'

const FunctionsPanelView = ({
  closePanel,
  defaultData,
  error,
  handleSave,
  loading,
  mode,
  newFunction,
  removeFunctionsError,
  setValidation,
  validation
}) => {
  return (
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
            <FunctionsPanelResources defaultData={defaultData} mode={mode} />
          </Accordion>
          <Accordion
            accordionClassName="new-item-side-panel__accordion"
            icon={<Arrow />}
            iconClassName="new-item-side-panel__expand-icon"
            openByDefault
          >
            <FunctionsPanelEnvironmentVariables />
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
              variant="label"
              label="Cancel"
              onClick={closePanel}
            />
            <Button
              className="btn_save"
              disabled={!validation.isNameValid || !validation.isHandlerValid}
              variant="tertiary"
              label="Save"
              onClick={() => handleSave()}
            />
            <Button
              variant="secondary"
              label="Deploy"
              onClick={() => handleSave(true)}
              disabled={!validation.isNameValid || !validation.isHandlerValid}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

FunctionsPanelView.defaultProps = {
  defaultData: {},
  error: ''
}

FunctionsPanelView.propTypes = {
  closePanel: PropTypes.func.isRequired,
  defaultData: PropTypes.shape({}),
  error: PropTypes.string,
  handleSave: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  mode: FUNCTION_PANEL_MODE.isRequired,
  newFunction: PropTypes.shape({}).isRequired,
  removeFunctionsError: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({})
}

export default FunctionsPanelView
