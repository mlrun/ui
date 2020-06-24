import React from 'react'
import PropTypes from 'prop-types'

import JobsPanelSection from '../../elements/JobsPanelSection/JobsPanelSection'
import Input from '../../common/Input/Input'
import { JobsPanelDataInputsTable } from '../../elements/JobsPanelDataInputsTable/JobsPanelDataInputsTable'
import { JobsPanelVolumesTable } from '../../elements/JobsPanelVolumesTable/JobsPanelVolumesTable'

import { panelActions } from '../JobsPanel/panelReducer'

const JobsPanelDataInputsView = ({
  handleAddNewItem,
  handleDeleteItems,
  handleEditItems,
  inputsDispatch,
  inputsState,
  match,
  panelDispatch,
  panelState,
  setEditSelectedProperty
}) => {
  return (
    <div className="job-panel__item">
      <JobsPanelSection title="Data inputs">
        <JobsPanelDataInputsTable
          handleAddNewItem={handleAddNewItem}
          handleEditItems={handleEditItems}
          handleDeleteItems={handleDeleteItems}
          inputsDispatch={inputsDispatch}
          inputsState={inputsState}
          match={match}
          panelState={panelState}
          setEditSelectedProperty={setEditSelectedProperty}
        />
      </JobsPanelSection>
      <JobsPanelSection title="Volumes">
        <JobsPanelVolumesTable
          handleAddNewItem={handleAddNewItem}
          handleEditItems={handleEditItems}
          handleDeleteItems={handleDeleteItems}
          inputsDispatch={inputsDispatch}
          inputsState={inputsState}
          match={match}
          panelState={panelState}
        />
      </JobsPanelSection>
      <JobsPanelSection title="General">
        <Input
          label="Default input path"
          className="default-input"
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
          className="default-input"
          onChange={inputValue => {
            panelDispatch({
              type: panelActions.SET_OUTPUT_PATH,
              payload: inputValue
            })
          }}
          floatingLabel
          type="text"
        />
      </JobsPanelSection>
    </div>
  )
}

JobsPanelDataInputsView.propTypes = {
  handleAddNewItem: PropTypes.func.isRequired,
  handleDeleteItems: PropTypes.func.isRequired,
  handleEditItems: PropTypes.func.isRequired,
  inputsDispatch: PropTypes.func.isRequired,
  inputsState: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired
}

export default JobsPanelDataInputsView
