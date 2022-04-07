import React from 'react'
import PropTypes from 'prop-types'

import JobsPanelSection from '../../elements/JobsPanelSection/JobsPanelSection'
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
      <JobsPanelSection title="Data inputs">
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
          panelState={panelState}
          resetDataInputsData={resetDataInputsData}
          setValidation={setValidation}
          validation={validation}
        />
      </JobsPanelSection>
      <JobsPanelSection title="General">
        <Input
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
      </JobsPanelSection>
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
