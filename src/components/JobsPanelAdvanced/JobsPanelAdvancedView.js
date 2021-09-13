import React from 'react'
import PropTypes from 'prop-types'

import JobsPanelSection from '../../elements/JobsPanelSection/JobsPanelSection'
import { JobsPanelAdvancedTable } from '../../elements/JobsPanelAdvancedTable/JobsPanelAdvancedTable'

import panelData from '../JobsPanel/panelData'
import { advancedActions } from './jobsPanelAdvancedReducer'

const JobsPanelAdvancedView = ({
  advancedDispatch,
  advancedState,
  handleAddNewItem,
  handleDeleteItems,
  handleEditItems,
  handleResetForm,
  match,
  panelState,
  setValidation,
  validation
}) => {
  return (
    <div className="job-panel__item advanced new-item-side-panel__item">
      <JobsPanelSection title="Advanced" />
      <JobsPanelSection title="Environment Variables">
        <JobsPanelAdvancedTable
          addNewItem={advancedState.addNewEnvironmentVariable}
          className="advanced"
          content={panelState.tableData.environmentVariables}
          handleAddNewItem={handleAddNewItem}
          handleEditItems={handleEditItems}
          handleDeleteItems={handleDeleteItems}
          handleResetForm={handleResetForm}
          headers={panelData['env']['table-headers']}
          match={match}
          newName={advancedState.newEnvironmentVariable.name}
          panelState={panelState}
          section="advanced env"
          selectedItem={advancedState.selectedEnvironmentVariable}
          setAddNewItem={value =>
            advancedDispatch({
              type: advancedActions.SET_ADD_NEW_ENVIRONMENT_VARIABLE,
              payload: value
            })
          }
          setNewItemName={name =>
            advancedDispatch({
              type: advancedActions.SET_NEW_ENVIRONMENT_VARIABLE_NAME,
              payload: name
            })
          }
          setNewItemValue={value =>
            advancedDispatch({
              type: advancedActions.SET_NEW_ENVIRONMENT_VARIABLE_VALUE,
              payload: value
            })
          }
          setSelectedItem={selectedItem =>
            advancedDispatch({
              type: advancedActions.SET_SELECTED_ENVIRONMENT_VARIABLE,
              payload: selectedItem
            })
          }
          setValidation={setValidation}
          validation={validation}
        />
      </JobsPanelSection>
      <JobsPanelSection title="Secrets">
        <JobsPanelAdvancedTable
          addNewItem={advancedState.addNewSecret}
          className="advanced secrets"
          content={panelState.tableData.secretSources}
          handleAddNewItem={handleAddNewItem}
          handleEditItems={handleEditItems}
          handleDeleteItems={handleDeleteItems}
          handleResetForm={handleResetForm}
          headers={panelData['secrets']['table-headers']}
          match={match}
          panelState={panelState}
          section="advanced secrets"
          selectedId={advancedState.newSecret.kind}
          selectedItem={advancedState.selectedSecret}
          setAddNewItem={value =>
            advancedDispatch({
              type: advancedActions.SET_ADD_NEW_SECRET,
              payload: value
            })
          }
          setNewItemName={kind =>
            advancedDispatch({
              type: advancedActions.SET_NEW_SECRET_KIND,
              payload: kind
            })
          }
          setNewItemValue={source =>
            advancedDispatch({
              type: advancedActions.SET_NEW_SECRET_SOURCE,
              payload: source
            })
          }
          setSelectedItem={selectedItem =>
            advancedDispatch({
              type: advancedActions.SET_SELECTED_SECRET,
              payload: selectedItem
            })
          }
          setValidation={setValidation}
          validation={validation}
        />
      </JobsPanelSection>
    </div>
  )
}

JobsPanelAdvancedView.propTypes = {
  advancedDispatch: PropTypes.func.isRequired,
  advancedState: PropTypes.shape({}).isRequired,
  handleAddNewItem: PropTypes.func.isRequired,
  handleDeleteItems: PropTypes.func.isRequired,
  handleEditItems: PropTypes.func.isRequired,
  handleResetForm: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  panelState: PropTypes.shape({}).isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired
}

export default JobsPanelAdvancedView
