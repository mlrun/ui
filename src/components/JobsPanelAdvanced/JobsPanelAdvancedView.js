import React from 'react'
import PropTypes from 'prop-types'

import JobsPanelSection from '../../elements/JobsPanelSection/JobsPanelSection'
import { JobsPanelAdvancedTable } from '../../elements/JobsPanelAdvancedTable/JobsPanelAdvancedTable'
import JobsPanelEnvironmentVariables from '../../elements/JobsPanelEnvironmentVariables/JobsPanelEnvironmentVariables'

import panelData from '../JobsPanel/panelData'
import { advancedActions } from './jobsPanelAdvancedReducer'
import { isDemoMode } from '../../utils/helper'

const JobsPanelAdvancedView = ({
  advancedDispatch,
  advancedState,
  handleAddNewItem,
  handleDeleteItems,
  handleEditItems,
  handleResetForm,
  location,
  match,
  panelDispatch,
  panelState,
  setValidation,
  validation
}) => {
  return (
    <div className="job-panel__item advanced new-item-side-panel__item">
      <JobsPanelSection title="Advanced" />
      {isDemoMode(location.search) ? (
        <JobsPanelEnvironmentVariables
          panelDispatch={panelDispatch}
          panelEnvData={panelState.tableData.environmentVariables}
          previousPanelEnvData={
            panelState.previousPanelData.tableData.environmentVariables
          }
        />
      ) : (
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
      )}
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
  location: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired
}

export default JobsPanelAdvancedView
