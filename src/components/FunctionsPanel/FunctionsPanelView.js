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

import Accordion from '../../common/Accordion/Accordion'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'
import FunctionsPanelCode from '../../elements/FunctionsPanelCode/FunctionsPanelCode'
import FunctionsPanelEnvironmentVariables from '../../elements/FunctionsPanelEnvironmentVariables/FunctionsPanelEnvironmentVariables'
import FunctionsPanelGeneral from '../../elements/FunctionsPanelGeneral/FunctionsPanelGeneral'
import FunctionsPanelResources from '../../elements/FunctionsPanelResources/FunctionsPanelResources'
import FunctionsPanelRuntime from '../../elements/FunctionsPanelRuntime/FunctionsPanelRuntime'
import FunctionsPanelTitle from '../../elements/FunctionsPanelTitle/FunctionsPanelTitle'
import Loader from '../../common/Loader/Loader'
import PanelCredentialsAccessKey from '../../elements/PanelCredentialsAccessKey/PanelCredentialsAccessKey'
import { Button, ConfirmDialog } from 'igz-controls/components'

import { FUNCTION_PANEL_MODE } from '../../types'
import { runtimeSections } from './functionsPanel.util'
import { JOB_KIND_JOB, PANEL_DEFAULT_ACCESS_KEY } from '../../constants'
import { LABEL_BUTTON, SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'

import { ReactComponent as Arrow } from 'igz-controls/images/arrow.svg'

import './functionsPanel.scss'

const FunctionsPanelView = ({
  checkValidation,
  closePanel,
  confirmData,
  defaultData,
  error,
  formState,
  frontendSpec,
  functionsStore,
  handleSave,
  imageType,
  loading,
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
        <ConfirmDialog
          cancelButton={{
            handler: confirmData.rejectHandler,
            label: confirmData.btnCancelLabel,
            variant: confirmData.btnCancelVariant
          }}
          closePopUp={confirmData.rejectHandler}
          confirmButton={{
            handler: confirmData.confirmHandler,
            label: confirmData.btnConfirmLabel,
            variant: confirmData.btnConfirmVariant
          }}
          header={confirmData.header}
          isOpen={confirmData}
          message={confirmData.message}
        />
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
              <FunctionsPanelGeneral defaultData={defaultData} formState={formState} frontendSpec={frontendSpec} />
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
                  setValidation={setValidation}
                  validation={validation}
                />
              </Accordion>
            )}
            <PanelCredentialsAccessKey
              className="functions-panel__item"
              credentialsAccessKey={functionsStore.newFunction.metadata.credentials.access_key}
              required={
                functionsStore.newFunction.metadata.credentials.access_key !==
                PANEL_DEFAULT_ACCESS_KEY
              }
              setCredentialsAccessKey={setNewFunctionCredentialsAccessKey}
              setValidation={setValidation}
              validation={validation}
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
              <div className="functions-panel__buttons-wrapper">
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
                  label={functionsStore.newFunction.kind === JOB_KIND_JOB ? 'Create' : 'Deploy'}
                  onClick={() => handleSave(true)}
                  disabled={!checkValidation()}
                />
              </div>
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
