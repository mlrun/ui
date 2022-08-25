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

import PanelSection from '../../elements/PanelSection/PanelSection'
import Input from '../../common/Input/Input'
import { JobsPanelDataInputsTable } from '../../elements/JobsPanelDataInputsTable/JobsPanelDataInputsTable'

import { panelActions } from '../JobsPanel/panelReducer'
import { comboboxSelectList } from './jobsPanelDataInputs.util'
import { COMBOBOX_MATCHES } from '../../types'

const JobsPanelDataInputsView = ({
  comboboxMatchesList,
  handleAddNewItem,
  handleDeleteItems,
  handleEditItems,
  handlePathChange,
  handlePathTypeChange,
  inputsDispatch,
  inputsState,
  isArtifactPathValid,
  panelDispatch,
  panelState,
  resetDataInputsData,
  setArtifactPathValid,
  setValidation,
  validation
}) => {
  return (
    <div className="job-panel__item new-item-side-panel__item">
      <PanelSection title="Data inputs">
        <JobsPanelDataInputsTable
          comboboxMatchesList={comboboxMatchesList}
          comboboxSelectList={comboboxSelectList}
          handleAddNewItem={handleAddNewItem}
          handleEditItems={handleEditItems}
          handleDeleteItems={handleDeleteItems}
          handlePathChange={handlePathChange}
          handlePathTypeChange={handlePathTypeChange}
          inputsDispatch={inputsDispatch}
          inputsState={inputsState}
          isPanelEditMode={panelState.editMode}
          panelState={panelState}
          resetDataInputsData={resetDataInputsData}
          setValidation={setValidation}
          validation={validation}
        />
      </PanelSection>
      <PanelSection title="General">
        <Input
          disabled={panelState.editMode}
          label="Default input path"
          wrapperClassName="default-input-wrapper"
          onChange={inputValue => {
            panelDispatch({
              type: panelActions.SET_INPUT_PATH,
              payload: inputValue
            })
          }}
          floatingLabel
          type="text"
        />
        <Input
          disabled={panelState.editMode}
          label="Default artifact path"
          floatingLabel
          invalid={!isArtifactPathValid}
          onChange={inputValue => {
            panelDispatch({
              type: panelActions.SET_OUTPUT_PATH,
              payload: inputValue
            })
          }}
          required
          requiredText="This field is required"
          setInvalid={value =>
            setArtifactPathValid(state => ({
              ...state,
              isArtifactPathValid: value
            }))
          }
          value={panelState.outputPath}
          type="text"
        />
      </PanelSection>
    </div>
  )
}

JobsPanelDataInputsView.propTypes = {
  comboboxMatchesList: COMBOBOX_MATCHES.isRequired,
  handleAddNewItem: PropTypes.func.isRequired,
  handleDeleteItems: PropTypes.func.isRequired,
  handleEditItems: PropTypes.func.isRequired,
  handlePathChange: PropTypes.func.isRequired,
  handlePathTypeChange: PropTypes.func.isRequired,
  inputsDispatch: PropTypes.func.isRequired,
  inputsState: PropTypes.shape({}).isRequired,
  isArtifactPathValid: PropTypes.bool.isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  resetDataInputsData: PropTypes.func.isRequired,
  setArtifactPathValid: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired
}

export default JobsPanelDataInputsView
